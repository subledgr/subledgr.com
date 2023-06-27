<template>
  <v-container fluid class="ma-1 pa-0">
    <v-toolbar density="compact">
      <v-btn icon to="/wallet">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn elevation="0" :to="`/asset/${result?.Wallet?.wallet?.Currency?.code}`">
          <CurrencyLogo :currency-code="result?.Wallet?.wallet?.Currency?.code || ''" :size="24"></CurrencyLogo>
          <span class="d-none d-sm-inline">&nbsp;{{ result?.Wallet?.wallet?.Currency?.code }}</span>
        </v-btn>
      
      <v-toolbar-title>
        {{ result?.Wallet?.wallet.name || walletId }}
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn :loading="loading">
          <!-- <v-icon>mdi-refresh</v-icon> -->
        </v-btn>

        <v-btn elevation="0">
          <v-icon>mdi-dots-vertical</v-icon>
          <v-menu activator="parent">
            <v-list>
              <v-list-item @click="showConfirmDialog = true">
                <v-icon color="red">mdi-delete-alert-outline</v-icon>&nbsp;Delete
              </v-list-item>
            </v-list>
          
          </v-menu>
        </v-btn>
      
      </v-toolbar-items>
    </v-toolbar>
    <div v-if="loading">Loading...</div>
    <v-table>
      <tr>
        <th class="text-left">Address</th>
        <td>
          <ClickToCopy :display="shortStash(result?.Wallet.wallet.address)" :text="result?.Wallet.wallet.address"></ClickToCopy>
          <!-- {{ result?.Wallet.wallet.address }} -->
        </td>
      </tr>
      <tr>
        <th class="text-left">Total</th>
        <td>{{ toCoin(result?.Wallet?.wallet?.Currency?.code, (
            BigInt(result?.Wallet?.wallet?.balance?.free || 0) 
          + BigInt(result?.Wallet?.wallet?.balance?.reserved || 0)
          + BigInt(result?.Wallet?.wallet?.balance?.pooled || 0)
        )) }}</td>
      </tr>
      <tr>
        <th class="text-left">Breakdown</th>
        <td>
          <v-table density="comfortable">
            <tbody>
              <tr>
                <th class="text-left">Free</th>
                <td>{{ toCoin(result?.Wallet?.wallet?.Currency?.code, BigInt(result?.Wallet?.wallet?.balance?.free || 0)) }}</td>
              </tr>
              <tr>
                <th class="text-left">Reserved</th>
                <td>{{ toCoin(result?.Wallet?.wallet?.Currency?.code, BigInt(result?.Wallet?.wallet?.balance?.reserved || 0)) }}</td>
              </tr>
              <tr>
                <th class="text-left">Pooled</th>
                <td>{{ toCoin(result?.Wallet?.wallet?.Currency?.code, BigInt(result?.Wallet?.wallet?.balance?.pooled || 0)) }}</td>
              </tr>
            </tbody>
          </v-table>
        </td>
      </tr>
      <!-- <tr>
        <th>Asset</th>
        <td>
          <v-btn>{{ result?.Wallet?.wallet?.Currency?.code }}</v-btn>
        </td>
      </tr> -->
    </v-table>

    <v-toolbar density="compact">
      <v-toolbar-title>
        Transactions
      </v-toolbar-title>
    </v-toolbar>
    <component :is="'TransactionTable2'" class="d-none d-sm-block" v-bind="{ list: result?.Wallet.wallet.transactions, wallet: result?.Wallet?.wallet, loading: loading }"></component>
    <component :is="'TransactionList'" class="d-block d-sm-none" v-bind="{ list: result?.Wallet.wallet.transactions, wallet: result?.Wallet?.wallet, loading: loading }"></component>

<pre v-show="error">
    <!-- Result: {{ result?.Wallet?.wallet }}<br> -->
    <!-- Loading: {{ loading }}<br> -->
{{ error }}
</pre>
    <ConfirmDialog v-model="showConfirmDialog"
      :confirm="confirmDeleteWallet"
      :title="`Delete wallet ${walletId}`"
      :message="`Do you want to delete this wallet`"
      :close="onCloseDeleteWallet"></ConfirmDialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { useQuery, useMutation, useApolloClient } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import TransactionList from './TransactionList.vue';
// import TransactionTable from './TransactionTable.vue';
import TransactionTable2 from './TransactionTable2.vue';
// import TransactionScroll from './TransactionScroll.vue';
import CurrencyLogo from './CurrencyLogo.vue';
import ClickToCopy from './ClickToCopy.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import { ICurrency } from './types';
import { useGlobalUtils } from './utils';

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
        transactions {
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
          recipientid
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
      error
      message
    }
    #Transactions(walletId: $walletId) {
    #  chain
    #  id
    #  height
    #  blockHash
    #  type
    #  subType
    #  event
    #  addData
    #  timestamp
    #  specVersion
    #  transactionVersion
    #  authorId
    #  senderId
    #  recipientId
    #  amount
    #  totalFee
    #  feeBalances
    #  feeTreasury
    #  tip
    #  success
    #  updatedAt
    #  createdAt
    #}
  }
`

export default defineComponent({
  components: {
    TransactionList,
    // TransactionTable,
    TransactionTable2,
    // TransactionScroll,
    CurrencyLogo,
    ClickToCopy,
    ConfirmDialog,
  },
  setup() {
    // const transactionList = markRaw(TransactionList)
    // const transactionTable = markRaw(TransactionTable)
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const { shortStash } = useGlobalUtils()
    // const profile = store.state.profile
    const loggedIn = ref(store.getters.loggedIn)
    if( !loggedIn.value ) router.push({ name: 'Login', params: {message: 'You must be logged in to see wallets' } })

    console.debug('params', route.params)
    const { result, loading, error, onResult } = useQuery(QUERY_WALLET, {
      walletId: route.params.walletId
    }, {
      // fetchPolicy: 'cache-and-network',
      fetchPolicy: 'no-cache',
      // pollInterval: 1000,
    });

    onResult((data) => {
      console.debug('onResult', data)
    })
    // const filteredList = computed(() => return result.value.transactions.filter(t => t.senderId === wallet.address))

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

    const { mutate: mutDeleteWallet, error: deleteError, loading: deleting } = useMutation(gql`
      mutation DeleteWallet($id: String!) {
        deleteWallet(id: $id) {
          success
          message
        }
      }
    `)

    const confirmDeleteWallet = async () => {
      showConfirmDialog.value = false
      const result = await mutDeleteWallet({ id: route.params.walletId })
      console.debug('deleteWallet', result)
      if (result?.data.deleteWallet.success) {
        const apollo = useApolloClient()
        const cacheId = `Wallet:{"id": "${route.params.walletId}"}`
        console.debug('cacheId', cacheId)
        const evicted = apollo.client.cache.evict({ id: `Wallet:{"id":"${route.params.walletId}"}` })
        console.debug('evicted', evicted)
        router.push('/wallet')
      }
    }
    const onCloseDeleteWallet = () => {
      showConfirmDialog.value = false
    }
    const showConfirmDialog = ref(false)

    return {
      shortStash,
      result,
      loading,
      error,
      walletId: route.params.walletId,
      toCoin,
      // transactionList
      confirmDeleteWallet,
      showConfirmDialog,
      onCloseDeleteWallet
    }
  },
})
</script>
