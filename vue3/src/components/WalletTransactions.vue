<template>
  <v-card elevation="0">
    <v-card-title>
      {{ title }}
      <v-btn flat icon @click="refetch()"><v-icon size="v-small">mdi-refresh</v-icon></v-btn>
    </v-card-title>
    <v-card-text>
      <component :is="'TransactionTable2'" class="d-none d-sm-block"
        v-bind="{ list: wallet.transactions, wallet: wallet, loading: loading }"></component>
      <component :is="'TransactionList'" class="d-block d-sm-none"
        v-bind="{ list: wallet.transactions, wallet: wallet, loading: loading }"></component>
    </v-card-text>
    <Loading :loading="loading" :contained="true"></Loading>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onBeforeMount } from 'vue'
import { useStore } from 'vuex';
import { useQuery, useMutation, useApolloClient } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import TransactionTable2 from './TransactionTable2.vue';
import TransactionList from './TransactionList.vue';
import Loading from './Loading.vue';
import { IProfile, ITransaction, IWallet } from './types';

import { QUERY_WALLET_TRANSACTIONS } from '@/graphql';

export default defineComponent({
  components: {
    TransactionTable2,
    TransactionList,
    Loading
  },
  props: {
    walletId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: 'Wallet Transactions',
    }
  },
  setup(props) {
    const store = useStore()
    const profile = computed<IProfile>(() => store.state.profile)
    const list = ref<ITransaction[]>([])
    const wallet = ref<IWallet>({} as IWallet)

    const { result, loading, error, onResult, refetch } = useQuery(QUERY_WALLET_TRANSACTIONS, {
      walletId: props.walletId,
      limit: 50,
    }, {
      fetchPolicy: 'cache-and-network',
      // fetchPolicy: 'no-cache',
      // pollInterval: 1000,
    });

    onResult((data) => {
      console.debug('onTransactions', data)
      wallet.value = data?.data?.Wallet?.wallet || {}
      list.value = data?.data?.Wallet?.wallet?.transactions || []
    })

    onBeforeMount(() => {
      refetch({
        walletId: props.walletId,
        limit: 100
      })
    })

    return {
      profile,
      refetch,
      loading,
      // result,
      wallet,
      list
    }    
  },
})
</script>
