<template>
  <v-container class="mt-1 pa-0">
    <v-toolbar density="compact" style="background: none;">
      <v-btn icon to="/portfolio">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title>
        <v-icon size="small">mdi-folder-pound-outline</v-icon>
        {{ result?.Portfolio?.name || portfolioId }}
      </v-toolbar-title>
      <v-toolbar-items>
        <!-- <v-btn flat class="text-none">{{ result?.Portfolio?.Currency?.code }} {{ portfolioValue?.toLocaleString('en-GB', { currency: result?.portfolio?.Currency.code, maximumFractionDigits: profile.defaultDecimals }) }}</v-btn> -->
        <v-btn flat class="text-none">{{ currency?.symbol }} {{ portfolioValue?.toLocaleString('en-GB', { currency: currency?.code, maximumFractionDigits: profile.defaultDecimals }) }}</v-btn>

        <v-btn :loading="loading" @click="reload()">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>

        <v-btn icon @click="showPortfolioWalletsDialog = !showPortfolioWalletsDialog">
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
      <v-tab value="wallets">Wallets</v-tab>
    </v-tabs>

    <!-- <PortfolioAssets :portfolioId="portfolioId" v-show="tab=='assets'"></PortfolioAssets> -->
    <AssetValueList :wallets="portfolio?.Wallets || []" :prices="prices" @select-asset="onSelectAsset" v-show="tab=='assets'"></AssetValueList>
    <PortfolioWallets :portfolioId="portfolioId" v-show="tab=='wallets'"></PortfolioWallets>

    <PortfolioWalletsDialog
      icon=""
      :visible="showPortfolioWalletsDialog"
      :portfolio="portfolio"
      @closeDialog="onClosePortfolioWalletsDialog"></PortfolioWalletsDialog>
    
  </v-container>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { useQuery, useMutation, useApolloClient } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { IAsset, IPortfolio, IWallet, ICurrency, IPrice } from './types';
import { useGlobalUtils } from './utils';

import ConfirmDialog from './ConfirmDialog.vue';
import PortfolioHistory from './PortfolioHistory.vue';
import PortfolioWalletsDialog from './PortfolioWalletsDialog.vue';
import PortfolioAssets from './PortfolioAssets.vue';
import PortfolioWallets from './PortfolioWallets.vue';
import AssetValueList from './AssetValueList.vue';

import { QUERY_PORTFOLIO_VIEW } from '@/graphql';

export default defineComponent({
  components: {
    // WalletList,
    // ClickToCopy,
    PortfolioHistory,
    PortfolioAssets,
    PortfolioWallets,
    AssetValueList,
    PortfolioWalletsDialog,
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
    const wallets = ref<IWallet[]>()
    const walletIds = ref<string[]>(['waiting for ...'])
    const prices = ref<IPrice[]>([])
    const showPortfolioWalletsDialog = ref(false)
    // console.debug('params', route.params)

    const { result, loading, error, onResult, refetch } = useQuery(QUERY_PORTFOLIO_VIEW, {
      portfolioId: Number(route.params.portfolioId),
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
      walletIds.value = queryResult.data?.Portfolio?.Wallets.map((w: IWallet) => w.id) || []
      // console.debug('wids', walletIds.value)
      // refetchPrices({ ids: walletIds.value, tCurr: portfolio.value?.Currency?.code || '' })
      prices.value = queryResult.data.Prices
    })

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
      return result?.value?.Portfolio?.Wallets.reduce((acc: number, w: IWallet) => {
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
      mutation DeletePortfolio($id: String!) {
        deletePortfolio(id: $id) {
          success
          message
        }
      }
    `)

    const confirmDeletePortfolio = async () => {
      showConfirmDialog.value = false
      const result = await mutDeletePortfolio({ id: portfolioId.value })
      console.debug('deletePortfolio', result)
      if (result?.data.deletePortfolio.success) {
        const apollo = useApolloClient()
        const cacheId = `Portfolio:{"id": "${portfolioId.value}"}`
        console.debug('cacheId', cacheId)
        const evicted = apollo.client.cache.evict({ id: `Portfolio:{"id":"${portfolioId.value}"}` })
        console.debug('evicted', evicted)
        router.push('/portfolio')
      }
    }
    const onCloseDeletePortfolio = () => {
      showConfirmDialog.value = false
    }
    const showConfirmDialog = ref(false)

    // const onShowPortfolioWalletsDialog = () => {
    //   showPortfolioWalletsDialog.value = false
    // }
    const onClosePortfolioWalletsDialog = () => {
      // console.debug('onClosePortfolioWalletsDialog')
      showPortfolioWalletsDialog.value = false
    }

    const onSelectAsset = (assetId: string) => {
      // console.debug('onSelectAsset', assetId)
      router.push(`/asset/${assetId}`)
    }

    const gotoWallet = (item: any) => {
      // console.debug('gotoWallet', item)
      router.push(`/wallet/${item.id}`)
    }
    watch(() => tab.value, (newVal) => {
      // console.debug('route.query.tab', newVal)
      // tab.value = newVal?.toString() || 'assets'
      router.push({ 
        path: route.path, 
        query: { ...route.query, tab: newVal }
      });
    })

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
      wallets,
      prices,
      error,
      showPortfolioWalletsDialog,
      // onShowPortfolioWalletsDialog,
      onClosePortfolioWalletsDialog,
      toCoin,
      // transactionList
      confirmDeletePortfolio,
      showConfirmDialog,
      onCloseDeletePortfolio,
      onSelectAsset,
      gotoWallet,
    }
  },
})
</script>
