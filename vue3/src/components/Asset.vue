<template>
  <v-container class="px-0 py-0">

    <v-toolbar density="compact" style="background: none;">
      <v-btn icon to="/asset"><v-icon>mdi-chevron-left</v-icon></v-btn>
      <v-toolbar-title>
        <AssetLogo :size="16" :assetId="assetId"></AssetLogo>
        {{ assetId.toLocaleUpperCase() }}
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn flat class="text-none">{{ currency.symbol }} {{ totalValue.toLocaleString('en-GB', { currency: currency.code, maximumFractionDigits: 2 }) }}</v-btn>
        <v-btn :loading="loading" icon @click="refresh()">
          <v-icon>mdi-reload</v-icon>
        </v-btn>
        <!-- <v-btn @click="showCurrencyPicker=true">+</v-btn> -->
      </v-toolbar-items>
    </v-toolbar>

    <!-- <div> -->
      <!-- <MarketData :fromCurrency="asset?.code || ''"></MarketData> -->
      <AssetPriceHistory :asset-id="asset?.code || ''" :periods="100"></AssetPriceHistory>
    <!-- </div> -->

    <v-list :loading="loading">
      <v-list-item v-show="loading">
        <v-list-item-title>
          Loading wallets...
        </v-list-item-title>
        <v-list-item-subtitle>
          <v-progress-linear indeterminate v-show="loading"></v-progress-linear>

        </v-list-item-subtitle>

      </v-list-item>
      <v-list-item v-show="!loggedIn">
        <v-row>
          <v-col>
            <v-btn to="/login">Login</v-btn> to see your wallets {{ loggedIn }}
          </v-col>
        </v-row>
      </v-list-item>

      <v-list-item v-for="item in list || []" v-bind:key="item.id" @click="gotoWallet(item.id)">
        <v-divider></v-divider>
        <template v-slot:prepend>
          <AssetLogo :size="24" :assetId="item.Asset.id"></AssetLogo>
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
            {{ toCoin(item.Asset?.id, sumBalance(item.balance)).toLocaleString('en-GB', { maximumFractionDigits: profile.defaultDecimals }) }} 
            <span class="currency-code">{{ item.Asset?.code }}</span><br>
            <!-- {{ toCoin(item.Currency?.code, sumBalance(item.balance)).toLocaleString('en-GB', { maximumFractionDigits: 2 }) }} -->
            <!-- {{ item.balance }} -->
          </v-col>
          <v-col cols="5" class="text-right">
            {{ currency.symbol }} {{ toValue(item.Asset?.id, sumBalance(item.balance)).toLocaleString('en-GB', { maximumFractionDigits: profile.defaultDecimals }) }} <br>
            <!-- {{ walletValue(item) }} -->
            <!-- £ {{ toValue(item.Currency?.code, item.balance?.pooled, 3).toLocaleString('en-GB') }} <br> -->
          </v-col>
        </v-row>

      </v-list-item>
    </v-list>

    <p>
      Transactions
      <v-btn icon :loading="loading2" @click="refetch2"><v-icon>mdi-refresh</v-icon></v-btn>
    </p>
    <TransactionList :list="transactions" :loading="loading2" :assetId="assetId"></TransactionList>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, TrackOpTypes } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable';
import { useStore } from 'vuex';
import AssetLogo from './AssetLogo.vue'
import MarketData from './MarketData.vue'
import TransactionList from './TransactionList.vue'
import AssetPriceHistory from './AssetPriceHistory.vue';
import { IAsset, IWallet, IWalletData } from './types';
import { useRouter } from 'vue-router';
import { shortStash } from './utils';
// import { currency } from '@/store/modules/currency';
import { QUERY_WALLETS } from '@/graphql/wallets.gql';
import { QUERY_TRANSACTIONS } from '@/graphql';

export default defineComponent({
  components: {
    AssetLogo,
    // Currencies,
    MarketData,
    TransactionList,
    AssetPriceHistory
  },
  props: {
    assetId: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const store = useStore()
    const profile = computed(() => store.state.profile)
    const currency = computed(() => store.state.currency.list.find((c: any) => c.code === profile.value.defaultCurrency))
    const loggedIn = computed<boolean>(() => store.getters.loggedIn)
    const router = useRouter()
    // console.debug('props', props)
    // const assetId2 = computed(() => props.assetId)
    // const loading = ref(false)
    const showAssetPicker = ref(false)
    const list = ref<IWallet[]>([])
    const transactions = ref<any[]>([])
    const assets = computed<IAsset[]>(() => store.state.asset.list)
    const asset = computed<IAsset | undefined>(() => assets.value.find((asset: IAsset) => asset.id === props.assetId))

    const totalValue = ref(0.0)
    // const { mutate, error } = useMutation(MUT_ADD_ASSET)
    const variables = {
      // ids: ['KSM', 'DOT', 'DOCK'],
      ids: [asset.value?.code || ''],
      tCurr: 'GBP'
    }
    const { loading, result, refetch, onResult } = useQuery(QUERY_WALLETS, variables, {
      fetchPolicy: 'cache-first'
    })

    const variables2 = computed(() => { return {
      chainId: asset.value?.id || '',
      ids: list.value?.map((wallet: IWallet) => wallet.id),
      offset: 0,
      limit: 50
    }})
    const {loading: loading2, result: result2, refetch: refetch2, onResult: onResult2 } = useQuery(QUERY_TRANSACTIONS, variables2, {
      fetchPolicy: 'cache-first'
    })

    onResult2((data) => {
      // console.debug('onResult2', data)
      transactions.value = data.data?.Transactions
    })

    onResult((queryResult) => {
      // console.debug('onResult', queryResult)
      // if(data.data) list.value = data.data.me?.assets || []
      // summarise()
      list.value = queryResult.data?.Wallets?.filter((wallet: IWallet, idx: number) => wallet.Asset.id === asset.value?.id)
      calcTotalValue()
    })

    const summarise = () => {
      list.value = result.value?.Wallets.filter((wallet: IWallet, idx: number) => wallet.Asset.id === asset.value?.id)
    //   // const wallets = result.value.Wallets.map((wallet, idx) => { return { assetId: model.wallets[idx].assetId, balance } })
    //   // console.debug('wallets items', wallets.length)
    //   var assetBals = result.value?.Wallets.reduce((acc: any, wallet: IWallet) => {
    //     // console.debug('reduce...', wallet.id)
    //     // if (Array.isArray(acc)) {
    //     const idx = acc.findIndex((x: IWallet) => x.assetId === wallet.Currency.code)
    //     if (idx === -1) {
    //       // console.debug('new...')
    //       const twal = { 
    //         assetId: wallet.Currency.code, 
    //         balance: {
    //           free       : BigInt(wallet.balance?.free || 0) || 0n,
    //           reserved   : BigInt(wallet.balance?.reserved || 0) || 0n,
    //           miscFrozen : BigInt(wallet.balance?.miscFrozen || 0) || 0n,
    //           feeFrozen  : BigInt(wallet.balance?.feeFrozen || 0) || 0n,
    //           pooled     : BigInt(wallet.balance?.pooled || 0) || 0n
    //         }
    //       }
    //       acc.push(twal)
    //     } else {
    //       // console.debug('existing...')
    //       acc[idx].balance.free       += BigInt(wallet.balance?.free || 0) || 0n
    //       acc[idx].balance.reserved   += BigInt(wallet.balance?.reserved || 0) || 0n
    //       acc[idx].balance.miscFrozen += BigInt(wallet.balance?.miscFrozen || 0) || 0n
    //       acc[idx].balance.feeFrozen  += BigInt(wallet.balance?.feeFrozen || 0) || 0n
    //       acc[idx].balance.pooled     += BigInt(wallet.balance?.pooled || 0) || 0n
    //     }
    //     // } else {
    //     //   console.debug('acc is not an array', acc)
    //     // }
    //     return acc
    //   }, [])
    //   list.value = assetBals
    }

    const sumBalance = (balance: IWalletData): BigInt => {
      const bal = BigInt(balance.free || 0)
        + BigInt(balance.reserved || 0)
        // + balance.miscFrozen || 0
        // + balance.feeFrozen || 0
        + BigInt(balance.pooled || 0)
        + BigInt(balance.pooledClaimable || 0)
      // console.debug('sumBalance()', bal)
      return bal
    }

    /**
     * Convert a chain value (BigInt) to a coin value
     * @param assetId 
     * @param val 
     * @returns number
     */
    const toCoin = (assetId: string, val: BigInt): Number => {
      // const currs = {...chains.value}
      // console.debug('currs', currs)
      // console.debug('toCoin()', assetId, val)
      const spec = assets.value.find((f: IAsset) => f.id === assetId) || { id: assetId, decimals: 2 }
      // console.debug('toCoin', assetId, spec)
      const denom = Math.pow(10, spec.decimals)
      // console.debug('denom', denom)
      const result = Number(val) / denom
      // console.debug('toCoin', result)
      return result
    }

    const calcTotalValue = () => {
      // console.debug('getWalletsValue', result.value?.Wallets)
      console.debug('getWalletsValue', list.value) // this is new
      totalValue.value = 0
      var ret = 0
      // todo :: reduce()
      for(let i = 0; i < list.value?.length; i++) {
        const wallet = {...list.value[i]}
        // console.debug('wallet', wallet)
        // console.debug('calcTotalValue', wallet.Currency.code)
        // const val = toValue(wallet.Asset.id, BigInt(wallet.balance?.free || 0))
        ret += toValue(wallet.Asset.id, BigInt(wallet.balance?.free || 0))
        ret += toValue(wallet.Asset.id, BigInt(wallet.balance?.reserved || 0))
        ret += toValue(wallet.Asset.id, BigInt(wallet.balance?.pooled || 0))
        ret += toValue(wallet.Asset.id, BigInt(wallet.balance?.pooledClaimable || 0))
        // console.debug('val', val, typeof val)
        // ret += val
      }
      // console.debug('totalVal', ret)
      totalValue.value = ret
    }

    /**
     * Calculate the value of a chain value (BigInt) in the specified currency
     * @param assetId 
     * @param value 
     * @returns number
     */
    const toValue = (assetId: string, value: BigInt): number => {
      // console.debug('toValue()', assetId, value)
      if (!value) return 0
      const spec = assets.value.find((f: IAsset) => f.id === assetId) || { id: assetId, decimals: 2, code: null }
      // console.debug('spec', spec)
      const denom: BigInt = BigInt(Math.pow(10, spec.decimals || 2))
      const price = result.value.Prices?.find((f: any) => f.f_curr === spec.code) || { value: 0 }
      // console.debug('toValue', price)
      // return parseFloat((value/denom * price.value).toFixed(decimals))
      return Number(value) / Number(denom) * price.value
    }

    const refresh = async () => {
      console.debug('refresh firing...')
      console.debug('refresh', variables2)
      loading.value = true
      setTimeout(async () => {
        await refetch()
        calcTotalValue()
        await refetch2()
        loading.value = false
      }, 200)
    }

    const gotoWallet = (id: string) => {
      console.debug('gotoWallet()', id)
      router.push(`/wallet/${id}`)
    }

    // refresh() 
    // refetch()
    summarise()
    calcTotalValue()

    return {
      profile,
      currency,
      loading,
      loading2,
      loggedIn,
      // assetId2,
      asset,
      list,
      // priceHistoryResult,
      transactions,
      // mutate,
      gotoWallet,
      showAssetPicker,
      // onSelectCurrency,
      toCoin,
      toValue,
      totalValue,
      sumBalance,
      refresh,
      refetch2,
      shortStash
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
