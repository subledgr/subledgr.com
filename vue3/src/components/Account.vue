<template>
  <v-container class="py-1 px-1">

    <v-toolbar density="compact" style="background: none;">
      <v-btn icon to="/account">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn> Accounts
      <v-btn elevation="0" :to="`/asset/${result?.Account?.account?.Asset?.id}`">
        <AssetLogo :asset-id="result?.Account?.account?.Asset?.id || ''" :size="24"></AssetLogo>
        <span class="d-none d-sm-inline">&nbsp;{{ result?.Account?.account?.Asset?.id }}</span>
      </v-btn>
      
      <v-toolbar-title>
        {{ result?.Account?.account.name || accountId }}
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn elevation="0">
          <v-icon>mdi-dots-vertical</v-icon>
          <v-menu activator="parent">
            <v-list>
              <v-list-item>
                <a :href="`https://${result?.Account?.account?.Asset?.id || ''}.subscan.io/account/${result?.Account?.account?.address}`" target="_blank">
                  <v-icon>mdi-magnify</v-icon>&nbsp;View
                </a>
              </v-list-item>
              <v-list-item @click="showConfirmDialog = true">
                <v-icon color="red">mdi-delete-alert-outline</v-icon>&nbsp;Delete
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      
      </v-toolbar-items>
    </v-toolbar>

    <v-row class="ma-1">
      <v-col>
        <AccountValue :accountId="accountId" title="Value"></AccountValue>
        <AccountDetails :accountId="accountId" title="Balance"></AccountDetails>
      </v-col>
      <v-col>
        <AccountPortfolios :accountId="accountId" title="Portfolios"></AccountPortfolios>
      </v-col>
    </v-row>

    <AccountHistory :accountId="accountId"></AccountHistory>

    <AccountTransactions :accountId="accountId" title="Transactions"></AccountTransactions>

  <ConfirmDialog v-model="showConfirmDialog"
    :confirm="confirmDeleteAccount"
    :title="`Delete account ${accountId}`"
    :message="`Do you want to delete this account`"
    :close="onCloseDeleteAccount"></ConfirmDialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { useQuery, useMutation } from '@vue/apollo-composable'
import { apolloProvider } from '@/plugins/apollo/index';

import gql from 'graphql-tag'
import TransactionList from './TransactionList.vue';
// import TransactionTable from './TransactionTable.vue';
import TransactionTable2 from './TransactionTable2.vue';
import AssetLogo from './AssetLogo.vue';
import ClickToCopy from './ClickToCopy.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import AccountDetails from './AccountDetails.vue';
import AccountPortfolios from './AccountPortfolios.vue';
import AccountTransactions from './AccountTransactions.vue';
import AccountHistory from './AccountHistory.vue';
import AccountValue from './AccountValue.vue';

import { IAsset, IBalanceLock } from './types';
import { useGlobalUtils } from './utils';

import { QUERY_ACCOUNT } from '@/graphql';

export default defineComponent({
  components: {
    TransactionList,
    TransactionTable2,
    AccountDetails,
    AccountPortfolios,
    AccountTransactions,
    AccountHistory,
    AccountValue,
    AssetLogo,
    ClickToCopy,
    ConfirmDialog,
  },
  setup() {
    const route = useRoute()
    const accountId = ref(route.params.accountId as string)
    const router = useRouter()
    const store = useStore()
    const profile = computed(() => store.state.profile)
    const { shortStash } = useGlobalUtils()
    const loggedIn = ref(store.getters.loggedIn)
    if( !loggedIn.value ) router.push({ name: 'Login', params: {message: 'You must be logged in to see accounts' } })

    // watch(() => route.params.accountId, async (newId) => { console.debug('accountId', newId) })
    watch(() => loggedIn.value, (newVal) => { if(!newVal) router.push('/account')})

    const assets = computed<IAsset[]>(() => JSON.parse(JSON.stringify(store.state.asset.list)))
      const { result, loading, error, onResult, refetch } = useQuery(QUERY_ACCOUNT, {
      accountId: accountId.value
    }, {
      fetchPolicy: 'cache-and-network',
      // fetchPolicy: 'no-cache',
      // pollInterval: 1000,
    });

    // onResult((data) => {
    //   console.debug('onResult', data)
    // })

    const { mutate: mutDeleteAccount, error: deleteError, loading: deleting, onDone, onError } = useMutation(gql`
      mutation DeleteAccount($id: String!) {
        deleteAccount(id: $id) {
          success
          message
        }
      }
    `)

    onDone((data) => {
      console.debug('onDone', data)
    })

    onError((data) => {
      console.debug('onError', data)
    })

    const confirmDeleteAccount = async () => {
      showConfirmDialog.value = false
      const result = await mutDeleteAccount({ id: route.params.accountId })
      console.debug('deleteAccount', result)
      if (result?.data.deleteAccount.success) {
        // const apolloClient = useApolloClient()
        const apolloClient = apolloProvider.defaultClient
        // console.debug('apollo', apolloClient)
        const cacheId = `Account:{"id": "${route.params.accountId}"}`
        // console.debug('cacheId', cacheId)
        const evicted = apolloClient.cache.evict({ id: `Account:{"id":"${route.params.accountId}"}` })
        // console.debug('evicted', evicted)
        router.push('/account')
      }
    }
    const onCloseDeleteAccount = () => {
      showConfirmDialog.value = false
    }
    const showConfirmDialog = ref(false)

    return {
      profile,
      shortStash,
      result,
      accountId,
      confirmDeleteAccount,
      showConfirmDialog,
      onCloseDeleteAccount
    }
  },
})
</script>
