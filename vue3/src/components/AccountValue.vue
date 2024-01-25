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
import { IAsset, IAccount, IPrice, IProfile } from './types'
import moment from 'moment'
import { QUERY_ACCOUNT_BALANCE1, QUERY_PRICE } from '@/graphql'
import { watch } from 'vue'
import AccountTransactions from './AccountTransactions.vue'

export default defineComponent({
  name: 'AccountValue',
  props: {
    accountId: {
      type: String,
      required: true,
    },
    // account: {
    //   type: Object as PropType<IAccount>,
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

    const account = ref<IAccount>()
    const price = ref<IPrice>()

    const accountVariables = ref({
      accountId: props.accountId
    })
    const { loading: accountLoading, result: accountResult, onResult: onAccountResult, refetch: accountRefetch } = useQuery(
      QUERY_ACCOUNT_BALANCE1,
      accountVariables.value, {
      fetchPolicy: 'cache-and-network',
    })
    onAccountResult((result) => {
      // console.log('onAccountResult', result)
      account.value = result.data?.Account?.account
    })
    
    const priceVariables = computed(() => {
      return {
        fCurr: account.value?.Asset?.code,
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

    const loading = computed(() => accountLoading.value || priceLoading.value)

    const refetch = async () => {
      // console.log('refetch account', accountVariables.value)
      await accountRefetch(accountVariables.value)
      // console.log('refetch price', priceVariables.value)
      await priceRefetch(priceVariables.value)
    }

    const calcValue = computed(() => {
      // console.debug('calcValue', account.value, price.value)
      if (!account.value || !price.value) return 0
      const coin = toCoin(account.value.Asset.id, BigInt(account.value.balance?.balance))
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
