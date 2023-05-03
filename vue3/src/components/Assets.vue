<template>
  <v-container fluid class="py-0 px-0">

    <v-toolbar density="compact">
      <v-toolbar-title>
        Assets
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn flat class="text-none">{{profile.defaultCurrency}} {{ totalValue.toLocaleString('en-GB', { currency: profile.defaultCurrency, maximumFractionDigits: 2 }) }}</v-btn>
        <v-btn :loading="loading" icon @click="refresh()">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn @click="showCurrencyPicker=true">+</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-list>
      <v-list-item>
        <v-row>
          <v-col>
            <v-btn to="/login">Login</v-btn> to see your assets
          </v-col>
        </v-row>

      </v-list-item>
      <v-list-item v-for="item in list" v-bind:key="item.currencyCode" @click="gotoAsset(item.currencyCode)">
        <v-divider></v-divider>
        <template v-slot:prepend>
          <CurrencyLogo :size="24" :currencyCode="item.currencyCode"></CurrencyLogo><br>
        </template>

        <v-list-item-title style="font-weight: 600;">
          <v-row>
            <v-col>
              {{ item.currencyCode }}
            </v-col>
            <v-col class="text-right">
              {{ toCoin(item.currencyCode, sumBalance(item.balance)).toLocaleString('en-GB', { maximumFractionDigits: 2 }) }}
              <span class="currency-code">{{ item.currencyCode }}</span>
            </v-col>
            <v-col class="text-right">
              £ {{ toValue(item.currencyCode, sumBalance(item.balance)).toLocaleString('en-GB', { maximumFractionDigits: 2 }) }}
            </v-col>
          </v-row>
        </v-list-item-title>
        <v-row style="font-style: italic; font-size: smaller;">
          <v-col>Free<br>Reserved<br>feeFrozen<br>miscFrozen<br>Pooled</v-col>
          <v-col class="text-right">
            {{ toCoin(item.currencyCode, item.balance?.free).toLocaleString('en-GB', { maximumFractionDigits: 2 }) }}
            <span class="currency-code">{{ item.currencyCode }}</span><br>
            {{ toCoin(item.currencyCode, item.balance?.reserved).toLocaleString('en-GB', { maximumFractionDigits: 2 }) }}
            <span class="currency-code">{{ item.currencyCode }}</span><br>
            {{ toCoin(item.currencyCode, item.balance?.feeFrozen).toLocaleString('en-GB', { maximumFractionDigits: 2 }) }}
            <span class="currency-code">{{ item.currencyCode }}</span><br>
            {{ toCoin(item.currencyCode, item.balance?.miscFrozen).toLocaleString('en-GB', { maximumFractionDigits: 2 }) }}
            <span class="currency-code">{{ item.currencyCode }}</span><br>
            {{ toCoin(item.currencyCode, item.balance?.pooled).toLocaleString('en-GB', { maximumFractionDigits: 2 }) }}
            <span class="currency-code">{{ item.currencyCode }}</span>
          </v-col>
          <v-col class="text-right">
            £ {{ toValue(item.currencyCode, item.balance?.free).toLocaleString('en-GB', { maximumFractionDigits: 2 }) }}<br>
            £ {{ toValue(item.currencyCode, item.balance?.reserved).toLocaleString('en-GB', { maximumFractionDigits: 2 }) }}<br>
            £ {{ toValue(item.currencyCode, item.balance?.feeFrozen).toLocaleString('en-GB', { maximumFractionDigits: 2 }) }}<br>
            £ {{ toValue(item.currencyCode, item.balance?.miscFrozen).toLocaleString('en-GB', { maximumFractionDigits: 2 }) }}<br>
            £ {{ toValue(item.currencyCode, item.balance?.pooled).toLocaleString('en-GB', { maximumFractionDigits: 2 }) }}
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
    <CurrencyPickerDialog icon="mdi-wallet-plus-outline" :visible="showCurrencyPicker" @selectCurrency="onSelectCurrency"></CurrencyPickerDialog>
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
import router from '@/router';

const MUT_ADD_ASSET = gql`
mutation MutAddAsset ($currencyCode: String) {
  addAsset(currencyCode: $currencyCode) {
    success
    message
    currency {
      code
    }
  }
}
`

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
  setup () {
    const store = useStore()
    const profile = computed(() => store.state.profile)
    const loading = ref(false)
    const showCurrencyPicker = ref(false)
    var currencyCode = ''
    const list = ref<IAsset[]>([])
    const currencies = computed<ICurrency[]>(() => JSON.parse(JSON.stringify(store.state.currency.list)))
    const totalValue = ref(0.0)
    const { mutate, error } = useMutation(MUT_ADD_ASSET)
    const variables = {
      ids: ['KSM', 'DOT', 'DOCK'],
      tCurr: profile.value.defaultCurrency, // 'GBP'
    }
    const { result, refetch, onResult } = useQuery(QUERY_WALLETS, variables, {
      fetchPolicy: 'cache-first'
    })

    onResult((data) => {
      console.debug('onResult', data)
      // if(data.data) list.value = data.data.me?.assets || []
      summarise()
      calcTotalValue()
    })

    const summarise = () => {
      // const wallets = result.value.Wallets.map((wallet, idx) => { return { currencyCode: model.wallets[idx].currencyCode, balance } })
      // console.debug('wallets items', wallets.length)
      var assetBals = result.value?.Wallets.reduce((acc: any, wallet: IWallet) => {
        // console.debug('reduce...', wallet.id)
        // if (Array.isArray(acc)) {
        const idx = acc.findIndex((x: IWallet) => x.currencyCode === wallet.Currency.code)
        if (idx === -1) {
          // console.debug('new...')
          const twal = { 
            currencyCode: wallet.Currency.code, 
            balance: {
              free       : BigInt(wallet.balance?.free || 0) || 0n,
              reserved   : BigInt(wallet.balance?.reserved || 0) || 0n,
              miscFrozen : BigInt(wallet.balance?.miscFrozen || 0) || 0n,
              feeFrozen  : BigInt(wallet.balance?.feeFrozen || 0) || 0n,
              pooled     : BigInt(wallet.balance?.pooled || 0) || 0n
            }
          }
          acc.push(twal)
        } else {
          // console.debug('existing...')
          acc[idx].balance.free       += BigInt(wallet.balance?.free || 0) || 0n
          acc[idx].balance.reserved   += BigInt(wallet.balance?.reserved || 0) || 0n
          acc[idx].balance.miscFrozen += BigInt(wallet.balance?.miscFrozen || 0) || 0n
          acc[idx].balance.feeFrozen  += BigInt(wallet.balance?.feeFrozen || 0) || 0n
          acc[idx].balance.pooled     += BigInt(wallet.balance?.pooled || 0) || 0n
        }
        // } else {
        //   console.debug('acc is not an array', acc)
        // }
        return acc
      }, [])
      list.value = assetBals
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
  
    const onSelectCurrency = async (curr: ICurrency) => {
      console.debug('onSelectCurrency', curr)
      showCurrencyPicker.value = false
      currencyCode = curr.code
      try {
        loading.value = true
        const result = await mutate({ currencyCode })
        console.debug(result)
      } catch (err) {
        console.error(err)
      } finally {
        loading.value = false
      }
      refetch()
    }

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
      console.debug('getWalletsValue', result.value?.Wallets)
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
      console.debug('totalVal', ret)
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
    const refresh = () => {
      console.debug('refresh firing...')
      loading.value = true
      setTimeout(() => {
        refetch()
        calcTotalValue()
        loading.value = false
      }, 200)
    }

    const gotoAsset = (currencyCode: string) => {
      router.push(`/asset/${currencyCode}`)
    }

    // refetch()
    calcTotalValue()
    summarise()

    return {
      profile,
      loading,
      list,
      mutate,
      showCurrencyPicker,
      onSelectCurrency,
      toCoin,
      toValue,
      totalValue,
      sumBalance,
      gotoAsset,
      refresh
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
