<template>
  <v-container class="mt-1 pa-0">
    <v-toolbar density="compact" style="background: none;">
      <v-btn icon to="/portfolio">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title>
        <v-icon size="small">mdi-folder-pound-outline</v-icon>
        {{ result?.Portfolio?.name || portfolioId }}
        <v-btn icon size="small" @click="doShowPortfolioEditDialog()">
          <v-icon size="small">mdi-pencil-outline</v-icon>
        </v-btn>
      </v-toolbar-title>
      <v-toolbar-items>
        <!-- <v-btn flat class="text-none">{{ result?.Portfolio?.Currency?.code }} {{ portfolioValue?.toLocaleString('en-GB', { currency: result?.portfolio?.Currency.code, maximumFractionDigits: profile.defaultDecimals }) }}</v-btn> -->
        <v-btn flat class="text-none">{{ currency?.symbol }} {{ portfolioValue?.toLocaleString('en-GB', { currency: currency?.code, maximumFractionDigits: profile.defaultDecimals }) }}</v-btn>

        <v-btn :loading="loading" @click="reload()">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>

        <v-btn icon @click="showPortfolioAccountsDialog = !showPortfolioAccountsDialog">
          <v-icon>mdi-playlist-edit</v-icon>
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

    <!-- Show the Portfolio Name on mobile -->
    <v-card elevation="0" class="d-sm-none d-block">
      <v-card-title>
        <v-icon size="small">mdi-folder-pound-outline</v-icon>
        {{ result?.Portfolio?.name }}</v-card-title>
    </v-card>

    <PortfolioHistory :portfolioId="portfolioId"></PortfolioHistory>

    <v-tabs v-model="tab">
      <v-tab value="assets">Assets</v-tab>
      <v-tab value="accounts">Accounts</v-tab>
    </v-tabs>

    <!-- <PortfolioAssets :portfolioId="portfolioId" v-show="tab=='assets'"></PortfolioAssets> -->
    <AssetValueList :accounts="portfolio?.Accounts || []" :prices="prices" @select-asset="onSelectAsset" v-show="tab=='assets'"></AssetValueList>
    <PortfolioAccounts :portfolioId="portfolioId" v-show="tab=='accounts'"></PortfolioAccounts>

    <PortfolioEditDialog
      :visible="showPortfolioEditDialog"
      :portfolio="portfolio"
      @closeDialog="onClosePortfolioEditDialog"
      @portfolioSaved="onPortfolioSaved"></PortfolioEditDialog>

    <PortfolioAccountsDialog
      icon=""
      :visible="showPortfolioAccountsDialog"
      :portfolio="portfolio"
      @closeDialog="onClosePortfolioAccountsDialog"></PortfolioAccountsDialog>
    
    <ConfirmDialog v-model="showConfirmDialog"
      :confirm="confirmDeletePortfolio"
      :title="`Delete portfolio ${portfolioId}`"
      :message="`Do you want to delete this portfolio`"
      :close="onCloseDeletePortfolio"></ConfirmDialog>

  </v-container>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { useQuery, useMutation, useApolloClient } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { IAsset, IPortfolio, IAccount, ICurrency, IPrice } from './types';
import { useGlobalUtils } from './utils';

import ConfirmDialog from './ConfirmDialog.vue';
import PortfolioEditDialog from './PortfolioEditDialog.vue';
import PortfolioHistory from './PortfolioHistory.vue';
import PortfolioAccountsDialog from './PortfolioAccountsDialog.vue';
// import PortfolioAssets from './PortfolioAssets.vue';
import PortfolioAccounts from './PortfolioAccounts.vue';
import AssetValueList from './AssetValueList.vue';

import { QUERY_PORTFOLIO_VIEW, MUT_PORTFOLIO_DELETE } from '@/graphql';

export default defineComponent({
  components: {
    // AccountList,
    // ClickToCopy,
    PortfolioHistory,
    // PortfolioAssets,
    PortfolioAccounts,
    AssetValueList,
    PortfolioAccountsDialog,
    PortfolioEditDialog,
    ConfirmDialog,
  },
  setup() {
    // const transactionList = markRaw(TransactionList)
    // const transactionTable = markRaw(TransactionTable)
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const profile = computed(() => store.state.profile )
    const tab = ref('assets')
    const currencies = computed<ICurrency[]>(() => store.state.currency.list)
    const currency = currencies.value.find(c => c.code === profile.value.defaultCurrency)
    const { shortStash } = useGlobalUtils()
    // const profile = store.state.profile
    const loggedIn = ref(store.getters.loggedIn)
    if( !loggedIn.value ) router.push({ name: 'Login', params: {message: 'You must be logged in to see portfolios' } })

    const portfolioId = ref(route.params.portfolioId.toString())

    // const assets = computed<IAsset[]>(() => JSON.parse(JSON.stringify(store.state.asset.list)))
    const assets = computed<IAsset[]>(() => store.state.asset.list)
    const totalValue = ref(0)
    const portfolio = ref<IPortfolio>()
    const accounts = ref<IAccount[]>()
    const accountIds = ref<string[]>(['waiting for ...'])
    const prices = ref<IPrice[]>([])
    const showPortfolioAccountsDialog = ref(false)
    // console.debug('params', route.params)
    const showPortfolioEditDialog = ref(false)

    const { result, loading, error, onResult, refetch } = useQuery(QUERY_PORTFOLIO_VIEW, {
      portfolioId: route.params.portfolioId,
      ids: ['KSM', 'DOT', 'DOCK'], // FIXME: get from elsewhere
      tCurr: profile.value.defaultCurrency // 'GBP'
    }, {
      fetchPolicy: 'cache-and-network',
      // fetchPolicy: 'no-cache',
      // pollInterval: 1000,
    });
    onResult((queryResult) => {
      // console.debug('onResult', queryResult)
      if (queryResult.partial) return
      portfolio.value = queryResult.data.Portfolio
      accountIds.value = queryResult.data?.Portfolio?.Accounts.map((w: IAccount) => w.id) || []
      // console.debug('wids', accountIds.value)
      // refetchPrices({ ids: accountIds.value, tCurr: portfolio.value?.Currency?.code || '' })
      prices.value = queryResult.data.Prices
    })

    const { mutate, loading: loading2, error: error2 } = useMutation(MUT_PORTFOLIO_DELETE, () => ({
      variables: {
        id: portfolioId.value,
      }
    }));

    const toValue = (assetId: string, value: BigInt): number => {
      // console.debug('toValue', assetId, value)
      if (!value) return 0
      const spec = assets.value.find((f: IAsset) => f.id === assetId) || { id: assetId, code: assetId, decimals: 2 }
      // console.debug('spec', spec)
      const denom: BigInt = BigInt(Math.pow(10, spec.decimals))
      // console.debug('denom', denom)
      const price = result.value.Prices?.find((f: any) => f.f_curr === spec.code) || { value: 0 }
      // console.debug('toValue', price.value, spec.decimals)
      // return parseFloat((value/denom * price.value).toFixed(decimals))
      // console.debug('num tokens:', currencyCode, value.toString(), Number(denom))
      return Number(value) / Number(denom) * price.value
    }

    const portfolioValue = computed<Number>(() => {
      return result?.value?.Portfolio?.Accounts.reduce((acc: number, w: IAccount) => {
        // console.debug('w', w.balance?.balance)
        // // console.debug('portfolioValue.reduce', acc, w.balance)
        // // const price = result.value.Prices.find((p: any) => p.f_curr === w.Asset.code)
        // // console.debug('price', price.value)
        // const val = Number(w.balance.free)
        //   + Number(w.balance.reserved)
        //   //+ Number(w.balance.miscFrozen)
        //   //+ Number(w.balance.feeFrozen)
        //   + Number(w.balance.pooled)
        //   + Number(w.balance.claimable)
        // // console.debug('val', val)
        const val = BigInt(w.balance?.balance || 0)
        const val2 = toValue(w.Asset.id, BigInt(val))
        // console.debug('val2', val2)
        return acc + val2
        // return BigInt(acc) + BigInt(w.balance?.balance || 0)
      }, 0)
      // return Number(1)
    })

    // watch(() => route.params.portfolioId, async (newId) => { console.debug('portfolioId', newId) })
    watch(() => loggedIn.value, (newVal) => { if(!newVal) router.push('/portfolio')})

    const reload = async () => {
      await refetch()
      // await refetch2()
    }

    const toCoin =  (assetId: string | undefined, val: BigInt) => {
      // const currs = {...chains.value}
      // console.debug('currs', currs)
      const spec = assets.value.find((f: IAsset) => f.id === assetId) || { decimals: 2 }
      // console.debug('toCoin', assetId, spec)
      const denom = Math.pow(10, spec.decimals)
      // console.debug('denom', denom)
      return Number(val) / denom
    }

    const { mutate: mutDeletePortfolio, error: deleteError, loading: deleting } = useMutation(gql`
      mutation DeletePortfolio($id: Int!) {
        deletePortfolio(id: $id) {
          success
          message
        }
      }
    `)

    const showConfirmDialog = ref(false)
    /**
     * The user has confirmed the deletion of the portfolio
     */
    const confirmDeletePortfolio = async () => {
      const result = await mutDeletePortfolio({ id: Number(portfolioId.value) })
      console.debug('deletePortfolio', result)
      showConfirmDialog.value = false
      if (result?.data.deletePortfolio.success) {
        // deleting the cache causes a problem with the Portfolio
        // const apollo = useApolloClient()
        // const cacheId = `Portfolio:{"id": "${portfolioId.value}"}`
        // console.debug('cacheId', cacheId)
        // const evicted = apollo.client.cache.evict({ id: `Portfolio:{"id":"${portfolioId.value}"}` })
        // console.debug('evicted', evicted)
        router.push('/portfolio?refresh=true')
      }
    }
    const onCloseDeletePortfolio = () => {
      showConfirmDialog.value = false
    }

    // const onShowPortfolioAccountsDialog = () => {
    //   showPortfolioAccountsDialog.value = false
    // }
    const onClosePortfolioAccountsDialog = () => {
      // console.debug('onClosePortfolioAccountsDialog')
      showPortfolioAccountsDialog.value = false
    }

    const onClosePortfolioEditDialog = () => {
      // console.debug('onClosePortfolioEditDialog')
      showPortfolioEditDialog.value = false
    }

    const onPortfolioSaved = () => {
      // console.debug('onPortfolioSaved')
      showPortfolioEditDialog.value = false
      //refetch()
    }

    const onSelectAsset = (assetId: string) => {
      // console.debug('onSelectAsset', assetId)
      router.push(`/asset/${assetId}`)
    }

    const gotoAccount = (item: any) => {
      // console.debug('gotoAccount', item)
      router.push(`/account/${item.id}`)
    }
    watch(() => tab.value, (newVal) => {
      // console.debug('route.query.tab', newVal)
      // tab.value = newVal?.toString() || 'assets'
      router.push({ 
        path: route.path, 
        query: { ...route.query, tab: newVal }
      });
    })

    const doShowPortfolioEditDialog = () => {
      console.debug('doShowPortfolioEditDialog')
      showPortfolioEditDialog.value = !showPortfolioEditDialog.value
    }

    /**
     * handle route.query.tab for direct links to portfolio
     */
    onBeforeMount(async () => {
      tab.value = route.query.tab?.toString() || 'assets'
    })

    return {
      tab,
      shortStash,
      profile,
      currency,
      totalValue,
      result,
      // result2,
      loading,
      portfolioId,
      portfolio,
      portfolioValue,
      // loading2,
      reload,
      accounts,
      prices,
      error,
      doShowPortfolioEditDialog,
      showPortfolioAccountsDialog,
      showPortfolioEditDialog,
      // onShowPortfolioAccountsDialog,
      onClosePortfolioAccountsDialog,
      onClosePortfolioEditDialog,
      onPortfolioSaved,
      toCoin,
      // transactionList
      confirmDeletePortfolio,
      showConfirmDialog,
      onCloseDeletePortfolio,
      onSelectAsset,
      gotoAccount,
    }
  },
})
</script>
