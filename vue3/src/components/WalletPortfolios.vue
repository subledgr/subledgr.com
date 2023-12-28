<template>
  <v-card elevation="0">
    <v-card-title>
      Portfolios
      <v-btn flat icon @click="refetch"><v-icon size="v-small">mdi-refresh</v-icon></v-btn>
    </v-card-title>
    <!-- <v-card-subtitle v-show="list.length == 0">
      This wallet is not used in any portfolio ({{ list.length }})
    </v-card-subtitle> -->
    <v-list max-height="200" :loading="loading">
      <v-list-item v-for="item in list" v-bind:key="item.id" :to="`/portfolio/${item.id}`">
        <template v-slot:prepend>
          <v-icon>mdi-folder-pound-outline</v-icon>
        </template>
        <v-list-item-title>{{ item.name }}</v-list-item-title>
        <template v-slot:append>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-list-item>
      <v-list-item v-show="(list?.length || 0) < 1 && !loading">
        <i>This wallet is not used in any portfolios</i>
      </v-list-item>
    </v-list>
    <Loading :loading="loading" :contained="true"></Loading>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref } from 'vue'
import { useQuery, useMutation, useApolloClient } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import Loading from './Loading.vue'

interface IPortfolio {
  id: string
  name: string
}

const QUERY_WALLET_PORTFOLIOS = gql`
  query WalletView($walletId: String!) {
    Wallet(id: $walletId) {
      wallet {
        id
        # name
        # address
        # Asset {
        #   id
        # }
        portfolios {
          id
          name
        }
        # balance {
        #   id
        #   free
        #   reserved
        #   miscFrozen
        #   feeFrozen
        #   pooled
        #   locks {
        #     id
        #     amount
        #     reasons
        #   }
        # }
      }
      error
      message
    }
  }
`

export default defineComponent({
  name: '',
  components: {
    Loading
  },
  props: {
    loading: {
      type: Boolean
    },
    walletId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: 'Wallet Portfolios'
    },
  },
  setup(props) {
    const isLoading = computed(() => props.loading)
    const list = ref<IPortfolio[]>([])
    const { result, loading, error, onResult, refetch } = useQuery(QUERY_WALLET_PORTFOLIOS, {
      walletId: props.walletId
    }, {
      fetchPolicy: 'cache-and-network',
      // fetchPolicy: 'no-cache',
      // pollInterval: 1000,
    });

    onResult((result) => {
      console.debug('onResult', result)
      list.value = result.data.Wallet.wallet.portfolios
    })

    return {
      loading,
      list,
      refetch
    }
  }

})
</script>
