<template>
  <v-container class="py-1 px-1">

    <v-toolbar density="compact" :class="toolbarClass" style="background: none;">
      <v-toolbar-title>
        <v-icon>mdi-wallet-outline</v-icon>
        Accounts
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
        <AccountAddDialog icon="mdi-wallet-plus-outline" @accountAdded="onAccountAdded"></AccountAddDialog>
      <!-- </v-toolbar-items> -->
    </v-toolbar>

    <v-row class="ma-1">
      <v-col cols="1">&nbsp;</v-col>
      <v-col cols="3">Account</v-col>
      <v-col cols="4" class="text-center">Holdings</v-col>
      <v-col cols="4" class="text-right">
        <v-btn flat @click="order = order * -1">
          Value
          <v-icon :icon="order > 0 ? 'mdi-sort-descending' : 'mdi-sort-ascending'"></v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <AccountList :list="filteredList" :order="order" :prices="prices" @clickAccount="gotoAccount"></AccountList>

  </v-container>
</template>

<script lang="ts">
import { defineComponent, watch, computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useDisplay } from 'vuetify'
import { useGlobalUtils } from './utils';

import { useQuery } from '@vue/apollo-composable'

import AccountList from './AccountList.vue';
import AccountAddDialog from './AccountAddDialog.vue';
import { shortStash } from './utils';

import { QUERY_ACCOUNTS } from '@/graphql/accounts.gql';
import { IAccount, IAsset, ICurrency, IPrice } from './types'

export default defineComponent({
  components: {
    AccountList,
    AccountAddDialog
  },
  setup () {
    // const apolloClient = useApolloClient()
    // console.log(apolloClient.resolveClient().cache)
    const display = useDisplay()
    const store = useStore()
    const router = useRouter()
    const { handleError } = useGlobalUtils()
    const profile = computed(() => store.state.profile)
    const assets = computed<IAsset[]>(() => store.state.asset.list)
    const currencies = computed<ICurrency[]>(() => store.state.currency.list)
    const currency = currencies.value.find(c => c.code === profile.value.defaultCurrency)
    // console.debug('chains', chains.value)
    const loggedIn = computed(() => store.getters.loggedIn)
    const totalValue = ref(0.0)
    const order = ref(-1)

    const list = ref<IAccount[]>()
    const search = ref('')
    const filteredList = computed(() => {
      return search.value === ''
        ? list.value
        : list.value?.filter((f: IAccount) => {
          return f.name.toLowerCase().includes(search.value.toLowerCase())
            || f.address.toLowerCase().includes(search.value.toLowerCase())
        }) || []
    })
    const prices = ref<IPrice[]>()

    const variables = {
      priceIds: ['KSM', 'DOT', 'DOCK'],
      tCurr: profile.value.defaultCurrency // 'GBP'
    }

    var { result, loading, refetch, onResult, onError } = useQuery(QUERY_ACCOUNTS, variables, {
      // fetchPolicy: 'cache-only'
      fetchPolicy: 'cache-first'
    })

    onError((error: any) => {
      console.debug(error)
      handleError(error)
    })

    onResult(queryResult => {
      // console.log('got data', queryResult.data)
      list.value = queryResult?.data?.Accounts || []
      prices.value = queryResult?.data?.Prices || []
      calcTotalValue()
    })

    const calcTotalValue = () => {
      // console.debug('getAccountsValue', result.value?.Accounts)
      totalValue.value = 0
      var ret = 0
      // todo :: reduce()
      for(let i = 0; i < result.value?.Accounts?.length; i++) {
        const account = result.value.Accounts[i]
        // console.debug('calcTotalValue', account.Asset?.id)
        // // const val = toValue(account.Asset?.id, account.balance?.free || 0)
        // ret += toValue(account.Asset?.id, account.balance?.free || 0)
        // ret += toValue(account.Asset?.id, account.balance?.reserved || 0)
        // ret += toValue(account.Asset?.id, account.balance?.pooled || 0)
        // ret += toValue(account.Asset?.id, account.balance?.pooledClaimable || 0)
        ret += toValue(account.Asset?.id, account.balance?.balance || 0)
        // console.debug('val', val, typeof val)
        // ret += val
      }
      // console.debug('totalVal', ret)
      totalValue.value = ret
    }

    const gotoAccount = (item: any) => {
      // console.debug('gotoAccount', item)
      router.push(`/account/${item.id}`)
    }

    const refresh = () => {
      console.debug('refresh firing...')
      loading.value = true
      setTimeout(() => {
        refetch()
      }, 200)
    }

    const onAccountAdded = (account: any) => {
      console.debug('Accounts.vue: onAccountAdded()', account)
      refetch()
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
      // console.debug('toolbarClass', mdAndUp.value)
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
      gotoAccount,
      onAccountAdded,
      // toCoin,
      // toValue,
      // accountValue,
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
