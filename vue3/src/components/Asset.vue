<template>
  <v-container class="px-0 py-0">

    <v-toolbar density="compact" style="background: none;">
      <v-btn icon to="/asset"><v-icon>mdi-chevron-left</v-icon></v-btn>
      <v-toolbar-title>
        <AssetLogo :size="16" :assetId="assetId"></AssetLogo>
        {{ assetId.toLocaleUpperCase() }}
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn flat class="text-none">{{ currency.symbol }} {{ totalValue?.toLocaleString('en-GB', { currency: currency.code, maximumFractionDigits: 2 }) }}</v-btn>
        <v-btn :loading="loading" icon @click="refresh()">
          <v-icon>mdi-reload</v-icon>
        </v-btn>
        <!-- <v-btn @click="showCurrencyPicker=true">+</v-btn> -->
      </v-toolbar-items>
    </v-toolbar>

    <v-row>
      <v-col :cols="12">
        <AssetPriceHistory :asset-id="asset?.code || ''" :periods="100"></AssetPriceHistory>
      </v-col>
      <v-col cols="6">
        <AssetPortfolios :list="list"></AssetPortfolios>
      </v-col>
      <v-col cols="6">
        <AssetAccounts :list="list"></AssetAccounts>
      </v-col>
    </v-row>

    <v-card-title>Accounts</v-card-title>
    <v-list style="background: none;" :loading="loading">
      <v-list-item v-show="loading">
        <v-list-item-title>
          Loading accounts...
        </v-list-item-title>
        <v-list-item-subtitle>
          <v-progress-linear indeterminate v-show="loading"></v-progress-linear>
        </v-list-item-subtitle>
      </v-list-item>
      <v-list-item v-show="!loggedIn">
        <v-row>
          <v-col>
            <v-btn to="/login">Login</v-btn> to see your accounts {{ loggedIn }}
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-item v-show="loggedIn && list?.length === 0">
        <v-row>
          <v-col>
            You have no accounts for this asset
          </v-col>
        </v-row>
      </v-list-item>

      <v-list-item v-for="item in list || []" v-bind:key="item.id" @click="gotoAccount(item.id)">
        <v-divider></v-divider>
        <template v-slot:prepend>
          <AssetLogo :size="24" :assetId="item.Asset.id"></AssetLogo>
        </template>

        <v-list-item-title>
          {{ item.name }} <!--({{ item.Currency?.code }}) -->
          <span class="d-none d-sm-inline" style="color: grey; font-size: 12px; font-weight: 300"><em>({{ shortStash(item.address) }})</em></span>
        </v-list-item-title>

        <v-row dense>
          <v-col cols="2">
            <!-- {{ item.name }} <br> {{ item.Currency?.code }} -->
          </v-col>
          <v-col cols="5" class="text-right">
            {{ toCoin(item.Asset?.id, item.balance?.balance).toLocaleString('en-GB', { maximumFractionDigits: profile.defaultDecimals }) }} 
            <span class="currency-code">{{ item.Asset?.code }}</span><br>
          </v-col>
          <v-col cols="5" class="text-right">
            {{ currency.symbol }}
            {{ toValue(item.Asset?.id, item.balance?.balance).toLocaleString('en-GB', { maximumFractionDigits: profile.defaultDecimals }) }} <br>
          </v-col>
        </v-row>

      </v-list-item>
    </v-list>

    <!-- <p>
      Transactions
      <v-btn icon :loading="loading2" @click="refetch2"><v-icon>mdi-refresh</v-icon></v-btn>
    </p>
    <component :is="'TransactionTable2'" class="d-none d-sm-block"
        v-bind="{ list: transactions, loading: loading }"></component>
    <component :is="'TransactionList'" class="d-block d-sm-none"
      v-bind="{ list: transactions, loading: loading }"></component> -->

  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useQuery } from '@vue/apollo-composable';
import { useStore } from 'vuex';
import { useTheme } from 'vuetify';
import AssetLogo from './AssetLogo.vue'
// import TransactionList from './TransactionList.vue'
// import TransactionTable2 from './TransactionTable2.vue';
import AssetPriceHistory from './AssetPriceHistory.vue';
import AssetPortfolios from './AssetPortfolios.vue';
import AssetAccounts from './AssetAccounts.vue';
import { IAsset, IAccount, IAccountBalance } from './types';
import { useRouter } from 'vue-router';
import { useGlobalUtils } from './utils';
import { QUERY_ACCOUNTS } from '@/graphql/accounts.gql';
// import { QUERY_TRANSACTIONS } from '@/graphql';

export default defineComponent({
  components: {
    AssetLogo,
    // TransactionList,
    // TransactionTable2,
    AssetPriceHistory,
    AssetPortfolios,
    AssetAccounts
  },
  props: {
    assetId: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const theme = useTheme()
    const store = useStore()
    const { shortStash, toCoin, handleError } = useGlobalUtils()
    const profile = computed(() => store.state.profile)
    const currency = computed(() => store.state.currency.list.find((c: any) => c.code === profile.value.defaultCurrency))
    const loggedIn = computed<boolean>(() => store.getters.loggedIn)
    const router = useRouter()
    const showAssetPicker = ref(false)
    const list = ref<IAccount[]>([])
    const transactions = ref<any[]>([])
    const assets = computed<IAsset[]>(() => store.state.asset.list)
    const asset = computed<IAsset | undefined>(() => assets.value.find((asset: IAsset) => asset.id === props.assetId))

    const totalValue = ref(0.0)
    const variables = {
      priceIds: [asset.value?.code || ''],
      assetId: props.assetId,
      tCurr: profile.value.defaultCurrency
    }
    const { loading, result, refetch, onResult, onError } = useQuery(QUERY_ACCOUNTS, variables, {
      fetchPolicy: 'cache-first'
    })
    onResult((queryResult) => {
      // console.debug('onResult', queryResult)
      // if(data.data) list.value = data.data.me?.assets || []
      // summarise()
      list.value = queryResult.data?.Accounts?.filter((account: IAccount) => account.Asset.id === asset.value?.id)
      calcTotalValue()
    })

    onError((error) => {
      console.error(error)
      handleError(error)
    })

    // const variables2 = computed(() => { return {
    //   chainId: asset.value?.id || '',
    //   ids: list.value?.map((account: IAccount) => account.id),
    //   offset: 0,
    //   limit: 50
    // }})
    // const {loading: loading2, result: result2, refetch: refetch2, onResult: onResult2 } = useQuery(QUERY_TRANSACTIONS, variables2, {
    //   //fetchPolicy: 'cache-first',
    //   fetchPolicy: 'cache-and-network'
    // })

    // onResult2((data) => {
    //   // console.debug('onResult2', data)
    //   transactions.value = data.data?.Transactions
    // })

    const summarise = () => {
      list.value = result.value?.Accounts.filter((account: IAccount) => account.Asset.id === asset.value?.id)
    }

    const calcTotalValue = () => {
      // console.debug('getAccountsValue', result.value?.Accounts)
      // console.debug('getAccountsValue', list.value) // this is new
      totalValue.value = 0
      var ret = list.value?.reduce((acc: number, account: IAccount) => {
        return acc + toValue(account.Asset.id, BigInt(account.balance?.balance || 0))
      }, 0)
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
      // console.debug('refresh firing...')
      // console.debug('refresh', variables2)
      loading.value = true
      setTimeout(async () => {
        await refetch()
        calcTotalValue()
        // await refetch2()
        loading.value = false
      }, 200)
    }

    const gotoAccount = (id: string) => {
      // console.debug('gotoAccount()', id)
      router.push(`/account/${id}`)
    }

    // refresh() 
    // refetch()
    summarise()
    calcTotalValue()
    return {
      theme,
      profile,
      currency,
      loading,
      // loading2,
      loggedIn,
      // assetId2,
      asset,
      list,
      // priceHistoryResult,
      transactions,
      // mutate,
      gotoAccount,
      showAssetPicker,
      // onSelectCurrency,
      toCoin,
      toValue,
      totalValue,
      // sumBalance,
      refresh,
      // refetch2,
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
