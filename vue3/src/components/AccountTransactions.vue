<template>
  <v-card elevation="0" style="background: none;">
    <v-card-title>
      {{ title }}
      <v-btn flat icon @click="refetch()"><v-icon size="v-small">mdi-refresh</v-icon></v-btn>
      <v-tooltip text="Click download to get more...">
        <template v-slot:activator="{ props }">
          <small  v-bind="props"><i>(Last 100 transactions...)</i></small>
        </template>
      </v-tooltip>
      <v-btn flat icon @click="showDownloadDialog = true"><v-icon size="v-small">mdi-file-download-outline</v-icon></v-btn>
    </v-card-title>
    <v-card-text>
      <component :is="'TransactionTable2'" class="d-none d-sm-block"
        v-bind="{ list: account.transactions, account: account, loading: loading }"></component>
      <component :is="'TransactionList'" class="d-block d-sm-none"
        v-bind="{ list: account.transactions, account: account, loading: loading }"></component>
    </v-card-text>
    <Loading :loading="loading" :contained="true"></Loading>
    <TransactionDownload
      :show-dialog="showDownloadDialog"
      @dialog-close="onDownloadDialogClose"
      :account="account"></TransactionDownload>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onBeforeMount } from 'vue'
import { useStore } from 'vuex';
import { useQuery } from '@vue/apollo-composable'
import TransactionTable2 from './TransactionTable2.vue';
import TransactionList from './TransactionList.vue';
import Loading from './Loading.vue';
import TransactionDownload from './TransactionDownload.vue';
import { IProfile, ITransaction, IAccount } from './types';

import { QUERY_ACCOUNT_TRANSACTIONS } from '@/graphql';

export default defineComponent({
  components: {
    TransactionTable2,
    TransactionList,
    Loading,
    TransactionDownload
  },
  props: {
    accountId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: 'Account Transactions',
    }
  },
  setup(props) {
    const store = useStore()
    const profile = computed<IProfile>(() => store.state.profile)
    const list = ref<ITransaction[]>([])
    const account = ref<IAccount>({} as IAccount)
    const showDownloadDialog = ref(false)

    const { result, loading, error, onResult, refetch } = useQuery(QUERY_ACCOUNT_TRANSACTIONS, {
      accountId: props.accountId,
      limit: 50,
    }, {
      fetchPolicy: 'cache-and-network',
      // fetchPolicy: 'no-cache',
      // pollInterval: 1000,
    });

    onResult((data) => {
      // console.debug('onTransactions', data)
      account.value = data?.data?.Account || {}
      list.value = data?.data?.Account?.transactions || []
    })

    onBeforeMount(() => {
      refetch({
        accountId: props.accountId,
        limit: 100
      })
    })

    const onDownloadDialogClose = () => {
      showDownloadDialog.value = false
    }

    return {
      profile,
      refetch,
      loading,
      account,
      list,
      showDownloadDialog,
      onDownloadDialogClose
    }    
  },
})
</script>
