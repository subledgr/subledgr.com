<template>
  <v-container fluid class="py-0 px-0">

    <v-toolbar density="compact">
      <v-toolbar-title>Wallets</v-toolbar-title>
      <v-toolbar-items>
        <v-btn flat class="text-none">{{ profile.defaultCurrency }} {{ totalValue.toLocaleString('en-GB', { currency: profile.defaultCurrency, maximumFractionDigits: 2 }) }}</v-btn>
        <v-btn :loading="loading" icon @click="refresh()">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <!-- <v-btn icon>
          <v-icon>mdi-plus</v-icon>
        </v-btn> -->
        <WalletAddDialog icon="mdi-wallet-plus-outline" @walletAdded="onWalletAdded"></WalletAddDialog>
      </v-toolbar-items>
    </v-toolbar>

    <v-row class="ma-1">
      <v-col cols="1"></v-col>
      <v-col cols="3">Asset</v-col>
      <v-col cols="4" class="text-right">Holdings</v-col>
      <v-col cols="4" class="text-right">
        <v-btn flat @click="order = order * -1">
          Price
          <v-icon :icon="order > 0 ? 'mdi-sort-descending' : 'mdi-sort-ascending'"></v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-list>
      <v-list-item v-show="!loggedIn">
        <v-row>
          <v-col>
            <v-btn to="/login">Login</v-btn> to see your wallets
          </v-col>
        </v-row>
      </v-list-item>

      <v-list-item v-for="item in sortedResult || []" v-bind:key="item.id" @click="gotoWallet(item)">
        <v-divider></v-divider>
        <template v-slot:prepend>
          <CurrencyLogo :size="24" :currencyCode="item.Currency.code"></CurrencyLogo>
        </template>

        <v-list-item-title>
          {{ item.name }} <!--({{ item.Currency?.code }}) -->
          <span class="d-none d-sm-inline" style="color: grey; font-size: 12px; font-weight: 300"><em>({{ shortStash(item.address) }})</em></span>
        </v-list-item-title>

        <!-- <v-list-item-subtitle class="d-none d-sm-block">
          {{ shortStash(item.address) }})
        </v-list-item-subtitle> -->

        <v-row dense>
          <v-col cols="2">
            <!-- {{ item.name }} <br> {{ item.Currency?.code }} -->
          </v-col>
          <v-col cols="5" class="text-right">
            {{ toCoin(item.Currency?.code, sumBalance(item.balance)).toLocaleString('en-GB', { maximumFractionDigits: 2 }) }} 
            <span class="currency-code">{{ item.Currency?.code }}</span><br>
            <!-- {{ toCoin(item.Currency?.code, sumBalance(item.balance)).toLocaleString('en-GB', { maximumFractionDigits: 2 }) }} -->
            <!-- {{ item.balance }} -->
          </v-col>
          <v-col cols="5" class="text-right">
            £ {{ toValue(item.Currency?.code, sumBalance(item.balance)).toLocaleString('en-GB', { maximumFractionDigits: 2 }) }} <br>
            <!-- {{ walletValue(item) }} -->
            <!-- £ {{ toValue(item.Currency?.code, item.balance?.pooled, 3).toLocaleString('en-GB') }} <br> -->
          </v-col>
        </v-row>

      </v-list-item>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, watch, computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { useQuery, useMutation, useApolloClient } from '@vue/apollo-composable'
import gql from 'graphql-tag'

// import { ICurrency } from './types';
import WalletAddDialog from './WalletAddDialog.vue';
import CurrencyLogo from './CurrencyLogo.vue';
import { shortStash } from './utils';
// import { QUERY_WALLETS } from '@/graphql/wallets.gql';

export const QUERY_WALLETS = gql`
  query WalletsQuery($ids: [String], $tCurr: String, $page: Int, $offset: Int, $search: String) {
    Wallets(page: $page, offset: $offset, search: $search) {
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
    Prices(ids: $ids, t_curr: $tCurr) {
      datetime
      f_curr
      t_curr
      value
    }
  }
`
import { IWallet, IWalletData, ICurrency } from './types'
// interface IWalletData {
//   feeFrozen: bigint
//   free: bigint
//   miscFrozen: bigint
//   pooled: bigint
//   reserved: bigint
// }

// interface ICurrency {
//   code: string
// }
// interface IWallet {
//   Currency: ICurrency
//   address: string
//   balance: IWalletData
//   id: string
//   name: string
// }

export default defineComponent({
  components: {
    CurrencyLogo,
    WalletAddDialog
  },
  setup () {
    const apolloClient = useApolloClient()
    // console.log(apolloClient.resolveClient().cache)

    const store = useStore()
    const router = useRouter()
    const profile = computed(() => store.state.profile)
    const currencies = computed<ICurrency[]>(() => JSON.parse(JSON.stringify(store.state.currency.list)))
    // console.debug('currencies', currencies.value)
    const loggedIn = computed(() => store.getters.loggedIn)
    const totalValue = ref(0.0)
    const order = ref(-1)

    const variables = {
      ids: ['KSM', 'DOT', 'DOCK'],
      tCurr: profile.value.defaultCurrency // 'GBP'
    }

    // const queryResult = apolloClient.client.cache.readQuery({
    //   query: QUERY_WALLETS,
    //   variables
    // })
    // if (queryResult) {
    //   console.debug('from cache!', queryResult)
    //   // Query result is in cache
    //   // Do something with the cached data
    // } else {
    //   // Query result is not in cache
    //   // Fetch the data from the server
    //   console.debug('NOT IN CACHE')
    // }

    // console.debug('QUERY_WALLETS', QUERY_WALLETS)
    var { result, loading, refetch, onResult } = useQuery(QUERY_WALLETS, variables, {
      // fetchPolicy: 'cache-only'
      fetchPolicy: 'cache-first'
    })

    onResult(queryResult => {
      // console.log('got data', queryResult.data)
      calcTotalValue()
    })

    // onMounted(() => {
    //   refetch()
    // })

    const sumBalance = (balance: IWalletData): BigInt => {
      const bal = BigInt(balance.free || 0)
        + BigInt(balance.reserved || 0)
        // + balance.miscFrozen || 0
        // + balance.feeFrozen || 0
        + BigInt(balance.pooled || 0)
      // console.debug('sumBalance()', bal)
      return bal
    }
  
    const sortedResult = computed((): IWallet[] => {
      // console.debug('sortedResult', result.value?.Wallets?.list)
      if (!result.value?.Wallets) return []
      const list = [...result.value?.Wallets] || []
      // console.debug('list', list)
      var sortedList = list.sort((a: IWallet, b: IWallet) => {
        // console.debug(a, b)
        const valA = walletValue(a)
        const valB = walletValue(b)
        // console.debug('sortedList', valA, valB)
        if (valA > valB) return 1 * order.value
        if (valB > valA) return -1 * order.value        
        return 0
      })
      // console.debug('sortedList', sortedList)
      return sortedList ? [...sortedList] : []
    })

    const toCoin =  (currencyCode: string, val: BigInt) => {
      // const currs = {...currencies.value}
      // console.debug('currs', currs)
      const spec = currencies.value.find((f: ICurrency) => f.code === currencyCode) || { decimals: 2 }
      // console.debug('toCoin', currencyCode, spec)
      const denom = Math.pow(10, spec.decimals)
      // console.debug('denom', denom)
      return Number(val) / denom
    }

    const calcTotalValue = () => {
      // console.debug('getWalletsValue', result.value?.Wallets)
      totalValue.value = 0
      var ret = 0
      // todo :: reduce()
      for(let i = 0; i < result.value?.Wallets?.length; i++) {
        const wallet = result.value.Wallets[i]
        // console.debug('calcTotalValue', wallet.Currency.code)
        const val = toValue(wallet.Currency.code, wallet.balance?.free || 0)
        ret += toValue(wallet.Currency.code, wallet.balance?.free || 0)
        ret += toValue(wallet.Currency.code, wallet.balance?.reserved || 0)
        ret += toValue(wallet.Currency.code, wallet.balance?.pooled || 0)
        // console.debug('val', val, typeof val)
        // ret += val
      }
      // console.debug('totalVal', ret)
      totalValue.value = ret
    }

    const gotoWallet = (item: any) => {
      console.debug('gotoWallet', item)
      router.push(`/wallet/${item.id}`)
    }

    const refresh = () => {
      console.debug('refresh firing...')
      loading.value = true
      setTimeout(() => {
        refetch()
      }, 200)
    }

    const onWalletAdded = (wallet: any) => {
      console.debug('Wallets.vue: onWalletAdded()', wallet)
      refetch()
    }

    const walletValue = (wallet: IWallet): number => {
      const totalTokens = sumBalance(wallet.balance)
      const value = toValue(wallet.Currency.code, totalTokens)
      return value
    }

    const toValue = (currencyCode: string, value: BigInt): number => {
      if (!value) return 0
      const spec = currencies.value.find((f: ICurrency) => f.code === currencyCode) || { decimals: 2 }
      // console.debug('spec', spec)
      const denom: BigInt = BigInt(Math.pow(10, spec.decimals))
      // console.debug('denom', denom)
      const price = result.value.Prices?.find((f: any) => f.f_curr === currencyCode) || { value: 0 }
      // console.debug('toValue', price)
      // return parseFloat((value/denom * price.value).toFixed(decimals))
      // console.debug('num tokens:', currencyCode, value.toString(), Number(denom))
      return Number(value) / Number(denom) * price.value
    }

    calcTotalValue()

    return {
      profile,
      // list: result || [],
      loggedIn,
      loading,
      result,
      sortedResult,
      refresh,
      gotoWallet,
      onWalletAdded,
      toCoin,
      toValue,
      walletValue,
      sumBalance,
      totalValue,
      shortStash,
      order
    }
  }
})
</script>

<style scoped>
.currency-code {
  color: rgb(103,58,183);
  font-size: smaller;
  font-weight: 600;
  font-style: italic;
}
</style>
