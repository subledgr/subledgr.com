<template>
  <v-container class="pt-1 mt-0">

    <v-toolbar density="compact" style="background: none;">
      <v-toolbar-title>
        <v-icon size="small">mdi-folder-pound-outline</v-icon>
        Portfolios
      </v-toolbar-title>
      <v-toolbar-items>
        <!-- <v-btn flat class="text-none">{{profile.defaultCurrency}} {{ totalValue.toLocaleString('en-GB', { currency: profile.defaultCurrency, maximumFractionDigits: 2 }) }}</v-btn> -->
        <v-btn :loading="loading" icon @click="refresh()">
          <v-icon size="small">mdi-refresh</v-icon>
        </v-btn>
        <!-- <v-btn @click="showPicker=true">+</v-btn> -->
        <PortfolioAddDialog icon="mdi-wallet-plus-outline" @portfolioAdded="onPortfolioAdded"></PortfolioAddDialog>
      </v-toolbar-items>
    </v-toolbar>
    
    <portfolio-list :list="list" @selectPortfolio="gotoPortfolio"></portfolio-list>
    <!-- <v-card>
      <v-card-title>Portfolios</v-card-title>
      <v-card-text>
        <p>
          Portfolios will allow the user to group accounts from any currency into a named portfolio. 
          A portfolio can represent a business function, set of investments, or a project.
        </p>
        <p>
          A portfolio will have a reporting currency, which will be used to convert all transactions into the reporting currency.
        </p>
        <p>
          The same features for <router-link to="/asset">assets</router-link> & <router-link to="/account">accounts</router-link> (accounts) should be available at portfolio level, eg. 
          transactions, balances, reports, etc.
        </p>
      </v-card-text>
    </v-card> -->
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useDisplay } from 'vuetify'
import { useQuery, useMutation, useApolloClient } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core';

import { shortStash } from './utils';
import { IAsset, ICurrency, IPortfolio, IAccount, IAccountBalance } from './types';

import PortfolioList from './PortfolioList.vue';
import PortfolioAddDialog from './PortfolioAddDialog.vue';

export const QUERY_PORTFOLIOS = gql`
  query PortfoliosQuery($ids: [String], $tCurr: String, $page: Int, $offset: Int, $search: String) {
    Portfolios(page: $page, offset: $offset, search: $search) {
      id
      name
      # status
      Accounts {
        id
        Asset {
          id
          code
        }
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

export default defineComponent({
  components: {
    PortfolioList,
    PortfolioAddDialog
  },
  setup () {
    // const apolloClient = useApolloClient()
    // console.log(apolloClient.resolveClient().cache)
    const display = useDisplay()
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const profile = computed(() => store.state.profile)
    const assets = computed<IAsset[]>(() => store.state.asset.list)
    const currencies = computed<ICurrency[]>(() => store.state.currency.list)
    const currency = currencies.value.find(c => c.code === profile.value.defaultCurrency)
    // console.debug('chains', chains.value)
    const loggedIn = computed(() => store.getters.loggedIn)
    const list = ref<IPortfolio[]>([])
    const totalValue = ref(0.0)
    const order = ref(-1)

    const variables = {
      ids: ['KSM', 'DOT', 'DOCK'],
      tCurr: profile.value.defaultCurrency // 'GBP'
    }

    var { result, loading, refetch, onResult } = useQuery(QUERY_PORTFOLIOS, variables, {
      // fetchPolicy: 'cache-only'
      fetchPolicy: 'cache-first'
    })

    onResult(queryResult => {
      // console.log('got data', queryResult.data)
      list.value = queryResult.data.Portfolios
      // calcTotalValue()
    })

    const sumBalance = (balance: IAccountBalance): BigInt => {
      const bal = BigInt(balance.free || 0)
        + BigInt(balance.reserved || 0)
        // + balance.miscFrozen || 0
        // + balance.feeFrozen || 0
        + BigInt(balance.pooled || 0)
        + BigInt(balance.claimable || 0)
      // console.debug('sumBalance()', bal)
      return bal
    }
  
    const sortedResult = computed((): IAccount[] => {
      // console.debug('sortedResult', result.value?.Accounts?.list)
      if (!result.value?.Accounts) return []
      const list = [...result.value?.Portfolios] || []
      // console.debug('list', list)
      var sortedList = list.sort((a: IAccount, b: IAccount) => {
        // console.debug(a, b)
        const valA = accountValue(a)
        const valB = accountValue(b)
        // console.debug('sortedList', valA, valB)
        if (valA > valB) return 1 * order.value
        if (valB > valA) return -1 * order.value        
        return 0
      })
      // console.debug('sortedList', sortedList)
      return sortedList ? [...sortedList] : []
    })

    const toCoin =  (assetId: string, val: BigInt) => {
      // const currs = {...chains.value}
      // console.debug('currs', currs)
      const spec = assets.value.find((f: IAsset) => f.id === assetId) || { id: assetId, decimals: 2 }
      // console.debug('toCoin', currencyCode, spec)
      const denom = Math.pow(10, spec.decimals)
      // console.debug('denom', denom)
      return Number(val) / denom
    }

    const calcTotalValue = () => {
      // console.debug('getAccountsValue', result.value?.Accounts)
      totalValue.value = 0
      var ret = 0
      // todo :: reduce()
      for(let i = 0; i < result.value?.Accounts?.length; i++) {
        const account = result.value.Accounts[i]
        // console.debug('calcTotalValue', account.Asset?.id)
        // const val = toValue(account.Asset?.id, account.balance?.free || 0)
        ret += toValue(account.Asset?.id, account.balance?.free || 0)
        ret += toValue(account.Asset?.id, account.balance?.reserved || 0)
        ret += toValue(account.Asset?.id, account.balance?.pooled || 0)
        ret += toValue(account.Asset?.id, account.balance?.pooledClaimable || 0)
        // console.debug('val', val, typeof val)
        // ret += val
      }
      // console.debug('totalVal', ret)
      totalValue.value = ret
    }

    const gotoPortfolio = (item: any) => {
      // console.debug('gotoPortfolio', item)
      router.push(`/portfolio/${item.id}`)
    }

    const refresh = () => {
      // console.debug('refresh firing...')
      loading.value = true
      setTimeout(() => {
        refetch()
      }, 200)
    }

    const onPortfolioAdded = (account: any) => {
      // console.debug('Accounts.vue: onAccountAdded()', account)
      refetch()
    }

    const accountValue = (account: IAccount): number => {
      // console.debug('accountValue', account)
      const totalTokens = sumBalance(account.balance)
      const value = toValue(account.Asset?.id, totalTokens)
      return value
    }

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

    calcTotalValue()

    onBeforeMount(() => {
      console.debug('onBeforeMount', route.params, route.query)
      if (route.query.refresh) {
        refresh()
      }
      // if (result.value?.Accounts?.list) {
      //   list.value = result.value?.Accounts?.list
      // }
    })

    return {
      toolbarClass,
      profile,
      list,
      loggedIn,
      loading,
      result,
      sortedResult,
      currency,
      refresh,
      gotoPortfolio,
      onPortfolioAdded,
      toCoin,
      toValue,
      accountValue,
      sumBalance,
      totalValue,
      shortStash,
      order
    }
  }
})
</script>
