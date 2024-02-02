<template>
  <v-card elevation="0" style="background: none;">

    <v-toolbar density="compact" style="background: none;">
      <div variant="text" class="text-none font-weight-bold">Portfolios</div>
      <v-spacer></v-spacer>
      <v-btn icon size="small" @click="refetch" :loading="loading">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- <v-card-title>
      Portfolios
      <v-btn flat icon @click="refetch"><v-icon size="v-small">mdi-refresh</v-icon></v-btn>
    </v-card-title> -->

    <v-list max-height="200" :loading="loading" style="background: none;">
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
        <i>This account is not used in any portfolios</i>
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

import { QUERY_ACCOUNT_PORTFOLIOS } from '@/graphql'

export default defineComponent({
  name: '',
  components: {
    Loading
  },
  props: {
    loading: {
      type: Boolean
    },
    accountId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: 'Account Portfolios'
    },
  },
  setup(props) {
    //const isLoading = computed(() => props.loading)
    const list = ref<IPortfolio[]>([])
    const { result, loading, error, onResult, refetch } = useQuery(QUERY_ACCOUNT_PORTFOLIOS, {
      accountId: props.accountId
    }, {
      fetchPolicy: 'cache-and-network',
      // fetchPolicy: 'no-cache',
      // pollInterval: 1000,
    });

    onResult((result) => {
      // console.debug('onResult', result)
      list.value = result.data?.Account?.portfolios || []
    })

    return {
      //loading,
      list,
      refetch
    }
  }

})
</script>
