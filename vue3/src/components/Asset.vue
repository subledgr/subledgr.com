<template>
  <v-container fluid class="py-0 px-0">

    <v-toolbar density="compact">
      <v-btn icon to="/asset"><v-icon>mdi-chevron-left</v-icon></v-btn>
      <v-toolbar-title>
        {{ currencyCode }}
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn flat class="text-none">GBP {{ totalValue.toLocaleString('en-GB', { currency: 'GBP', maximumFractionDigits: 2 }) }}</v-btn>
        <v-btn :loading="loading" icon @click="refresh()">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn @click="showCurrencyPicker=true">+</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-list>
      <v-list-item v-show="!loggedIn">
        <v-row>
          <v-col>
            <v-btn to="/login">Login</v-btn> to see your wallets
          </v-col>
        </v-row>
      </v-list-item>

      <v-list-item v-for="item in list || []" v-bind:key="item.id" @click="gotoWallet(item.id)">
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
    <!-- <CurrencyPickerDialog icon="mdi-wallet-plus-outline" :visible="showCurrencyPicker" @selectCurrency="onSelectCurrency"></CurrencyPickerDialog> -->
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, TrackOpTypes } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable';
import { useStore } from 'vuex';
import Currencies from './Currencies.vue';
import CurrencyPickerDialog from './CurrencyPickerDialog.vue'
import CurrencyLogo from './CurrencyLogo.vue'
import gql from 'graphql-tag';
import { ICurrency } from './types';
import { QUERY_WALLETS } from '@/graphql/wallets.gql';
import { IWallet, IWalletData } from './types';
import { useRouter } from 'vue-router';
import { shortStash } from './utils';

// const MUT_ADD_ASSET = gql`
// mutation MutAddAsset ($currencyCode: String) {
//   addAsset(currencyCode: $currencyCode) {
//     success
//     message
//     currency {
//       code
//     }
//   }
// }
// `

interface IAsset {
  // id: string
  currencyCode: string
  balance: IWalletData
}

export default defineComponent({
  components: {
    CurrencyLogo,
    Currencies,
    CurrencyPickerDialog
  },
  props: {
    currencyCode: {
      type: String,
    }
  },
  setup (props) {
    const store = useStore()
    const loggedIn = computed(() => store.getters.loggedIn)
    const router = useRouter()
    // console.debug('props', props)
    const { currencyCode } = props
    // const loading = ref(false)
    const showCurrencyPicker = ref(false)
    const list = ref<IWallet[]>([])
    const currencies = computed<ICurrency[]>(() => JSON.parse(JSON.stringify(store.state.currency.list)))
    const totalValue = ref(0.0)
    // const { mutate, error } = useMutation(MUT_ADD_ASSET)
    const variables = {
      ids: ['KSM', 'DOT', 'DOCK'],
      tCurr: 'GBP'
    }
    const { loading, result, refetch, onResult } = useQuery(QUERY_WALLETS, variables, {
      fetchPolicy: 'cache-first'
    })

    onResult((data) => {
      console.debug('onResult', data)
      // if(data.data) list.value = data.data.me?.assets || []
      // summarise()
      list.value = data.data.Wallets.filter((wallet: IWallet, idx: number) => wallet.Currency.code === currencyCode)
      calcTotalValue()
    })

    const summarise = () => {
      list.value = result.value.Wallets.filter((wallet: IWallet, idx: number) => wallet.Currency.code === currencyCode)
    //   // const wallets = result.value.Wallets.map((wallet, idx) => { return { currencyCode: model.wallets[idx].currencyCode, balance } })
    //   // console.debug('wallets items', wallets.length)
    //   var assetBals = result.value?.Wallets.reduce((acc: any, wallet: IWallet) => {
    //     // console.debug('reduce...', wallet.id)
    //     // if (Array.isArray(acc)) {
    //     const idx = acc.findIndex((x: IWallet) => x.currencyCode === wallet.Currency.code)
    //     if (idx === -1) {
    //       // console.debug('new...')
    //       const twal = { 
    //         currencyCode: wallet.Currency.code, 
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
      // console.debug('sumBalance()', bal)
      return bal
    }
  
    // const onSelectCurrency = async (curr: ICurrency) => {
    //   console.debug('onSelectCurrency', curr)
    //   showCurrencyPicker.value = false
    //   currencyCode = curr.code
    //   try {
    //     loading.value = true
    //     const result = await mutate({ currencyCode })
    //     console.debug(result)
    //   } catch (err) {
    //     console.error(err)
    //   } finally {
    //     loading.value = false
    //   }
    //   refetch()
    // }

    const toCoin =  (currencyCode: string, val: BigInt) => {
      // const currs = {...currencies.value}
      // console.debug('currs', currs)
      const spec = currencies.value.find((f: ICurrency) => f.code === currencyCode) || { code: currencyCode, decimals: 2 }
      // console.debug('toCoin', currencyCode, spec)
      const denom = Math.pow(10, spec.decimals)
      // console.debug('denom', denom)
      return Number(val) / denom
    }

    const calcTotalValue = () => {
      // console.debug('getWalletsValue', result.value?.Wallets)
      console.debug('getWalletsValue', list.value)
      totalValue.value = 0
      var ret = 0
      // todo :: reduce()
      for(let i = 0; i < list.value.length; i++) {
        const wallet = {...list.value[i]}
        // console.debug('wallet', wallet)
        // console.debug('calcTotalValue', wallet.Currency.code)
        const val = toValue(wallet.Currency.code, BigInt(wallet.balance?.free || 0))
        ret += toValue(wallet.Currency.code, BigInt(wallet.balance?.free || 0))
        ret += toValue(wallet.Currency.code, BigInt(wallet.balance?.reserved || 0))
        ret += toValue(wallet.Currency.code, BigInt(wallet.balance?.pooled || 0))
        // console.debug('val', val, typeof val)
        // ret += val
      }
      // console.debug('totalVal', ret)
      totalValue.value = ret
    }

    const toValue = (currencyCode: string, value: BigInt): number => {
      // console.debug('toValue()', currencyCode, value)
      if (!value) return 0
      const spec = currencies.value.find((f: ICurrency) => f.code === currencyCode) || { code: currencyCode, decimals: 2 }
      // console.debug('spec', spec)
      const denom: BigInt = BigInt(Math.pow(10, spec.decimals || 2))
      const price = result.value.Prices?.find((f: any) => f.f_curr === currencyCode) || { value: 0 }
      // console.debug('toValue', price)
      // return parseFloat((value/denom * price.value).toFixed(decimals))
      return Number(value) / Number(denom) * price.value
    }

    const refresh = async () => {
      console.debug('refresh firing...')
      loading.value = true
      setTimeout(async () => {
        await refetch()
        calcTotalValue()
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
      loading,
      loggedIn,
      currencyCode,
      list,
      // mutate,
      gotoWallet,
      showCurrencyPicker,
      // onSelectCurrency,
      toCoin,
      toValue,
      totalValue,
      sumBalance,
      refresh,
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
