<template>
  <v-card>
    <v-card-title>Wallets</v-card-title>
    <!-- {{ result?.Portfolio.Currency }} -->
    <v-card-text>
      <WalletList :list="result?.Portfolio?.Wallets" :prices="result?.Prices" :loading="loading" @clickWallet="gotoWallet"></WalletList>
    </v-card-text>
  </v-card>

</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useQuery, useMutation, useApolloClient } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import WalletList from './WalletList.vue';

import { QUERY_PORTFOLIO_WALLETS } from '../graphql'

export default defineComponent({
  components: {
    WalletList
  },
  props: {
    portfolioId: {
      type: String,
      required: true
    }
  },
  setup(props) {

    const store = useStore()
    const router = useRouter()
    const profile = computed(() => store.state.profile )
    const { result, loading, error, onResult, refetch } = useQuery(QUERY_PORTFOLIO_WALLETS, {
      portfolioId: props.portfolioId,
      ids: ['KSM', 'DOT', 'DOCK'], // FIXME: get from store
      tCurr: profile.value.defaultCurrency // 'GBP'
    }, {
      fetchPolicy: 'cache-and-network',
      // fetchPolicy: 'no-cache',
      // pollInterval: 1000,
    });
    onResult((queryResult) => {
      // console.debug('onResult', queryResult)
      if (queryResult.partial) return
      // portfolio.value = queryResult.data.Portfolio
    })

    const gotoWallet = (item: any) => {
      // console.debug('gotoWallet', item)
      router.push(`/wallet/${item.id}`)
    }

    return {
      result,
      loading,
      refetch,
      gotoWallet
    }
  },
})
</script>
