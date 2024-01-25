<template>
  <v-card>
    <v-card-title>Accounts</v-card-title>
    <!-- {{ result?.Portfolio.Currency }} -->
    <v-card-text>
      <AccountList :list="result?.Portfolio?.Accounts" :prices="result?.Prices" :loading="loading" @clickAccount="gotoAccount"></AccountList>
    </v-card-text>
  </v-card>

</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useQuery, useMutation, useApolloClient } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import AccountList from './AccountList.vue';

import { QUERY_PORTFOLIO_ACCOUNTS } from '../graphql'

export default defineComponent({
  components: {
    AccountList
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
    const { result, loading, error, onResult, refetch } = useQuery(QUERY_PORTFOLIO_ACCOUNTS, {
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

    const gotoAccount = (item: any) => {
      // console.debug('gotoAccount', item)
      router.push(`/account/${item.id}`)
    }

    return {
      result,
      loading,
      refetch,
      gotoAccount
    }
  },
})
</script>
