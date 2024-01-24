<template>
  <v-card elevation="0">
    <v-card-title>
      <v-row>
        <v-col>{{ title }}</v-col>
        <v-col>
          <v-btn flat icon @click="refetch" :loading="loading"><v-icon size="v-small">mdi-refresh</v-icon></v-btn>
        </v-col>
        <v-col>
          <small>
            {{ calcValue.toLocaleString('en-gb', { minimumFractionDigits: profile.defaultDecimals, maximumFractionDigits: profile.defaultDecimals }) }}
            {{ profile.defaultCurrency }}
          </small>
        </v-col>
      </v-row>      
    </v-card-title>
  </v-card>
</template>

<script lang="ts">

import { defineComponent, ref, computed, PropType } from 'vue'
import { useStore } from 'vuex'
import { useGlobalUtils } from './utils'
import { useQuery } from '@vue/apollo-composable'
import { IAsset, IWallet, IPrice, IProfile } from './types'
import moment from 'moment'
import { QUERY_WALLET_BALANCE1, QUERY_PRICE } from '@/graphql'
import { watch } from 'vue'
import WalletTransactions from './WalletTransactions.vue'

export default defineComponent({
  name: 'WalletValue',
  props: {
    walletId: {
      type: String,
      required: true,
    },
    // wallet: {
    //   type: Object as PropType<IWallet>,
    //   required: true,
    // },
    title: {
      type: String,
      required: false,
      default: 'Value',
    },
  },
  setup(props) {
    const store = useStore()
    const { toCoin } = useGlobalUtils()
    const profile = computed<IProfile>(() => store.state.profile)

    const wallet = ref<IWallet>()
    const price = ref<IPrice>()

    const walletVariables = ref({
      walletId: props.walletId
    })
    const { loading: walletLoading, result: walletResult, onResult: onWalletResult, refetch: walletRefetch } = useQuery(
      QUERY_WALLET_BALANCE1,
      walletVariables.value, {
      fetchPolicy: 'cache-and-network',
    })
    onWalletResult((result) => {
      // console.log('onWalletResult', result)
      wallet.value = result.data?.Wallet?.wallet
    })
    
    const priceVariables = computed(() => {
      return {
        fCurr: wallet.value?.Asset?.code,
        tCurr: profile.value?.defaultCurrency
      }
    })
    watch(() => priceVariables.value, (newVal) => {
      // console.log('priceVariables', newVal)
      priceRefetch(priceVariables.value)
    })
    const { loading: priceLoading, result: priceResult, onResult: onPriceResult, refetch: priceRefetch } = useQuery(
      QUERY_PRICE,
      priceVariables.value, {
      fetchPolicy: 'cache-and-network',
    })

    onPriceResult((result) => {
      // console.log('onPriceResult', result)
      price.value = result.data?.Price
    })

    const loading = computed(() => walletLoading.value || priceLoading.value)

    const refetch = async () => {
      // console.log('refetch wallet', walletVariables.value)
      await walletRefetch(walletVariables.value)
      // console.log('refetch price', priceVariables.value)
      await priceRefetch(priceVariables.value)
    }

    const calcValue = computed(() => {
      // console.debug('calcValue', wallet.value, price.value)
      if (!wallet.value || !price.value) return 0
      const coin = toCoin(wallet.value.Asset.id, BigInt(wallet.value.balance?.balance))
      return coin * Number(price.value.value)
    })

    return {
      loading,
      calcValue,
      price,
      toCoin,
      profile,
      refetch,
    }
  },
})

</script>
