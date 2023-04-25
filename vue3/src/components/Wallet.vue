<template>
  <v-container fluid class="py-0 px-0">
    <v-toolbar density="compact">
      <v-btn icon to="/wallet">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title>
        {{ result?.Wallet?.wallet.name || walletId }}
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn :loading="loading">
          <!-- <v-icon>mdi-refresh</v-icon> -->
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <div v-if="loading">Loading...</div>
    <v-table>
      <tr>
        <th class="text-left">Asset</th>
        <td>
          <v-btn :to="`/asset/${result?.Wallet?.wallet?.Currency?.code}`">{{ result?.Wallet?.wallet?.Currency?.code }}</v-btn>
        </td>
      </tr>
      <tr>
        <th class="text-left">Address</th>
        <td>{{ result?.Wallet.wallet.address }}</td>
      </tr>
      <tr>
        <th class="text-left">Balance</th>
        <td>{{ toCoin(result?.Wallet?.wallet?.Currency?.code, (BigInt(result?.Wallet?.wallet?.balance?.free || 0) + BigInt(result?.Wallet?.wallet?.balance?.reserved || 0))) }}</td>
      </tr>
      <!-- <tr>
        <th>Asset</th>
        <td>
          <v-btn>{{ result?.Wallet?.wallet?.Currency?.code }}</v-btn>
        </td>
      </tr> -->
    </v-table>
    <v-toolbar>
      <v-toolbar-title>
        Transactions
      </v-toolbar-title>
    </v-toolbar>
    <component :is="'TransactionTable'" v-bind="{ list: result?.Transactions, wallet: result?.Wallet?.wallet}"></component>

<pre>
    Result: {{ result?.Wallet?.wallet }}<br>
    Loading: {{ loading }}<br>
    Error: {{ error }}
</pre>

  </v-container>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { useQuery, useMutation, useApolloClient } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import TransactionList from './TransactionList.vue';
import TransactionTable from './TransactionTable.vue';

import { ICurrency } from './types';

const QUERY_WALLET = gql`
  query WalletView($walletId: String!) {
    Wallet(id: $walletId) {
      wallet {
        id
        name
        address
        Currency {
          code
        }
        balance {
          id
          free
          reserved
          miscFrozen
          feeFrozen
          pooled
        }
      }
      error
      message
    }
    Transactions(walletId: $walletId) {
      chain
      id
      height
      blockHash
      type
      subType
      event
      addData
      timestamp
      specVersion
      transactionVersion
      authorId
      senderId
      recipientId
      amount
      totalFee
      feeBalances
      feeTreasury
      tip
      success
      updatedAt
      createdAt
    }
  }
`

export default defineComponent({
  components: {
    TransactionList,
    TransactionTable
  },
  setup() {
    // const transactionList = markRaw(TransactionList)
    // const transactionTable = markRaw(TransactionTable)
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const loggedIn = ref(store.getters.loggedIn)
    if( !loggedIn.value ) router.push({ name: 'Login', params: {message: 'You must be logged in to see wallets' } })

    console.debug('params', route.params)
    const { result, loading, error } = useQuery(QUERY_WALLET, {
      walletId: route.params.walletId
    }, {
      fetchPolicy: 'cache-and-network',
      // pollInterval: 1000,
    });

    watch(() => route.params.walletId, async (newId) => { console.debug('walletId', newId) })
    watch(() => loggedIn.value, (newVal) => { if(!newVal) router.push('/wallet')})

    const currencies = computed<ICurrency[]>(() => JSON.parse(JSON.stringify(store.state.currency.list)))
    const toCoin =  (currencyCode: string | undefined, val: BigInt) => {
      // const currs = {...currencies.value}
      // console.debug('currs', currs)
      const spec = currencies.value.find((f: ICurrency) => f.code === currencyCode) || { decimals: 2 }
      // console.debug('toCoin', currencyCode, spec)
      const denom = Math.pow(10, spec.decimals)
      // console.debug('denom', denom)
      return Number(val) / denom
    }


    return {
      result,
      loading,
      error,
      walletId: route.params.walletId,
      toCoin
      // transactionList
    }
  },
})
</script>
