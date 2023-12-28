<template>
  <v-container class="py-1 px-1">

    <v-toolbar density="compact" :class="toolbarClass" style="background: none;">
      <v-toolbar-title>
        <v-icon>mdi-wallet-outline</v-icon>
        Wallets
      </v-toolbar-title>
      <!-- <v-toolbar-items> -->
        <v-text-field prepend-icon="mdi-magnify" hide-details v-model="search"></v-text-field>
        <v-spacer></v-spacer>
        <v-btn flat class="text-none">{{ currency?.symbol }} {{ totalValue.toLocaleString(profile.locale, { currency: profile.defaultCurrency, maximumFractionDigits: 2 }) }}</v-btn>
        <v-btn :loading="loading" icon @click="refresh()">
          <v-icon size="small">mdi-refresh</v-icon>
        </v-btn>
        <!-- <v-btn icon>
          <v-icon>mdi-plus</v-icon>
        </v-btn> -->
        <WalletAddDialog icon="mdi-wallet-plus-outline" @walletAdded="onWalletAdded"></WalletAddDialog>
      <!-- </v-toolbar-items> -->
    </v-toolbar>

    <v-row class="ma-1">
      <v-col cols="1">&nbsp;</v-col>
      <v-col cols="3">Wallet</v-col>
      <v-col cols="4" class="text-center">Holdings</v-col>
      <v-col cols="4" class="text-right">
        <v-btn flat @click="order = order * -1">
          Value
          <v-icon :icon="order > 0 ? 'mdi-sort-descending' : 'mdi-sort-ascending'"></v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <WalletList :list="filteredList" :prices="prices" @clickWallet="gotoWallet"></WalletList>

  </v-container>
</template>

<script lang="ts">
import { defineComponent, watch, computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useDisplay } from 'vuetify'

import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import WalletList from './WalletList.vue';
import WalletAddDialog from './WalletAddDialog.vue';
import { shortStash } from './utils';

import { QUERY_WALLETS } from '@/graphql/wallets.gql';
import { IWallet, IAsset, ICurrency, IPrice } from './types'

export default defineComponent({
  components: {
    WalletList,
    WalletAddDialog
  },
  setup () {
    // const apolloClient = useApolloClient()
    // console.log(apolloClient.resolveClient().cache)
    const display = useDisplay()
    const store = useStore()
    const router = useRouter()
    const profile = computed(() => store.state.profile)
    const assets = computed<IAsset[]>(() => store.state.asset.list)
    const currencies = computed<ICurrency[]>(() => store.state.currency.list)
    const currency = currencies.value.find(c => c.code === profile.value.defaultCurrency)
    // console.debug('chains', chains.value)
    const loggedIn = computed(() => store.getters.loggedIn)
    const totalValue = ref(0.0)
    const order = ref(-1)

    const list = ref<IWallet[]>()
    const search = ref('')
    const filteredList = computed<IWallet[]>(() => {
      return search.value === ''
        ? list.value
        : list.value?.filter((f: IWallet) => {
          return f.name.toLowerCase().includes(search.value.toLowerCase())
            || f.address.toLowerCase().includes(search.value.toLowerCase())
        }) || []
    })
    const prices = ref<IPrice[]>()

    const variables = {
      ids: ['KSM', 'DOT', 'DOCK'],
      tCurr: profile.value.defaultCurrency // 'GBP'
    }

    // console.debug('QUERY_WALLETS', QUERY_WALLETS)
    var { result, loading, refetch, onResult } = useQuery(QUERY_WALLETS, variables, {
      // fetchPolicy: 'cache-only'
      fetchPolicy: 'cache-first'
    })

    onResult(queryResult => {
      // console.log('got data', queryResult.data)
      list.value = queryResult.data.Wallets
      prices.value = queryResult.data.Prices
      calcTotalValue()
    })

    // const sumBalance = (balance: IWalletData): BigInt => {
    //   const bal = BigInt(balance.free || 0)
    //     + BigInt(balance.reserved || 0)
    //     // + balance.miscFrozen || 0
    //     // + balance.feeFrozen || 0
    //     + BigInt(balance.pooled || 0)
    //   // console.debug('sumBalance()', bal)
    //   return bal
    // }
  
    // const sortedResult = computed((): IWallet[] => {
    //   // console.debug('sortedResult', result.value?.Wallets?.list)
    //   if (!result.value?.Wallets) return []
    //   const list = [...result.value?.Wallets] || []
    //   // console.debug('list', list)
    //   var sortedList = list.sort((a: IWallet, b: IWallet) => {
    //     // console.debug(a, b)
    //     const valA = walletValue(a)
    //     const valB = walletValue(b)
    //     // console.debug('sortedList', valA, valB)
    //     if (valA > valB) return 1 * order.value
    //     if (valB > valA) return -1 * order.value        
    //     return 0
    //   })
    //   // console.debug('sortedList', sortedList)
    //   return sortedList ? [...sortedList] : []
    // })

    // const toCoin =  (assetId: string, val: BigInt) => {
    //   // const currs = {...chains.value}
    //   // console.debug('currs', currs)
    //   const spec = assets.value.find((f: IAsset) => f.id === assetId) || { id: assetId, decimals: 2 }
    //   // console.debug('toCoin', currencyCode, spec)
    //   const denom = Math.pow(10, spec.decimals)
    //   // console.debug('denom', denom)
    //   return Number(val) / denom
    // }

    const calcTotalValue = () => {
      // console.debug('getWalletsValue', result.value?.Wallets)
      totalValue.value = 0
      var ret = 0
      // todo :: reduce()
      for(let i = 0; i < result.value?.Wallets?.length; i++) {
        const wallet = result.value.Wallets[i]
        // console.debug('calcTotalValue', wallet.Asset?.id)
        // const val = toValue(wallet.Asset?.id, wallet.balance?.free || 0)
        ret += toValue(wallet.Asset?.id, wallet.balance?.free || 0)
        ret += toValue(wallet.Asset?.id, wallet.balance?.reserved || 0)
        ret += toValue(wallet.Asset?.id, wallet.balance?.pooled || 0)
        ret += toValue(wallet.Asset?.id, wallet.balance?.pooledClaimable || 0)
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

    // const walletValue = (wallet: IWallet): number => {
    //   // console.debug('walletValue', wallet)
    //   const totalTokens = sumBalance(wallet.balance)
    //   const value = toValue(wallet.Asset?.id, totalTokens)
    //   return value
    // }

    const toValue = (assetId: string, value: BigInt): number => {
      // console.debug('toValue', assetId, value)
      if (!value) return 0
      const spec = assets.value.find((f: IAsset) => f.id === assetId) || { id: assetId, code: assetId, decimals: 2 }
      // console.debug('spec', spec)
      const denom: BigInt = BigInt(Math.pow(10, spec.decimals))
      // console.debug('denom', denom)
      const price = result.value.Prices?.find((f: any) => f.f_curr === spec.code) || { value: 0 }
      // console.debug('toValue', price)
      // return parseFloat((value/denom * price.value).toFixed(decimals))
      // console.debug('num tokens:', currencyCode, value.toString(), Number(denom))
      return Number(value) / Number(denom) * price.value
    }

    const toolbarClass = computed(() => {
      const { mdAndUp } = display
      console.debug('toolbarClass', mdAndUp.value)
      return mdAndUp.value ? 'rounded-pill' : ''
    })

    // calcTotalValue()

    return {
      toolbarClass,
      profile,
      // list: result || [],
      loggedIn,
      loading,
      result,
      // sortedResult,
      currency,
      list,
      filteredList,
      search,
      prices,
      refresh,
      gotoWallet,
      onWalletAdded,
      // toCoin,
      // toValue,
      // walletValue,
      // sumBalance,
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
