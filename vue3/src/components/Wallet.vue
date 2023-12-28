<template>
  <v-container class="py-1 px-1">

    <v-toolbar density="compact" style="background: none;">
      <v-btn icon to="/wallet">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn> Wallets
      <v-btn elevation="0" :to="`/asset/${result?.Wallet?.wallet?.Asset?.id}`">
        <AssetLogo :asset-id="result?.Wallet?.wallet?.Asset?.id || ''" :size="24"></AssetLogo>
        <span class="d-none d-sm-inline">&nbsp;{{ result?.Wallet?.wallet?.Asset?.id }}</span>
      </v-btn>
      
      <v-toolbar-title>
        {{ result?.Wallet?.wallet.name || walletId }}
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn elevation="0">
          <v-icon>mdi-dots-vertical</v-icon>
          <v-menu activator="parent">
            <v-list>
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
        <WalletDetails :walletId="walletId" title="Balance"></WalletDetails>
      </v-col>
      <v-col>
        <WalletPortfolios :walletId="walletId" title="Portfolios"></WalletPortfolios>
      </v-col>
    </v-row>

    <WalletHistory :walletId="walletId"></WalletHistory>

    <WalletTransactions :walletId="walletId" title="Transactions"></WalletTransactions>

  <ConfirmDialog v-model="showConfirmDialog"
      :confirm="confirmDeleteWallet"
      :title="`Delete wallet ${walletId}`"
      :message="`Do you want to delete this wallet`"
      :close="onCloseDeleteWallet"></ConfirmDialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { useQuery, useMutation, useApolloClient } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import TransactionList from './TransactionList.vue';
// import TransactionTable from './TransactionTable.vue';
import TransactionTable2 from './TransactionTable2.vue';
import AssetLogo from './AssetLogo.vue';
import ClickToCopy from './ClickToCopy.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import WalletDetails from './WalletDetails.vue';
import WalletPortfolios from './WalletPortfolios.vue';
import WalletTransactions from './WalletTransactions.vue';
import WalletHistory from './WalletHistory.vue';

import { IAsset, IBalanceLock } from './types';
import { useGlobalUtils } from './utils';

import { QUERY_WALLET } from '@/graphql';

export default defineComponent({
  components: {
    TransactionList,
    TransactionTable2,
    WalletDetails,
    WalletPortfolios,
    WalletTransactions,
    WalletHistory,
    AssetLogo,
    ClickToCopy,
    ConfirmDialog,
  },
  setup() {
    // const transactionList = markRaw(TransactionList)
    // const transactionTable = markRaw(TransactionTable)
    const route = useRoute()
    const walletId = ref(route.params.walletId as string)
    const router = useRouter()
    const store = useStore()
    const profile = computed(() => store.state.profile)
    const { shortStash } = useGlobalUtils()
    // const profile = store.state.profile
    const loggedIn = ref(store.getters.loggedIn)
    if( !loggedIn.value ) router.push({ name: 'Login', params: {message: 'You must be logged in to see wallets' } })

    watch(() => route.params.walletId, async (newId) => { console.debug('walletId', newId) })
    watch(() => loggedIn.value, (newVal) => { if(!newVal) router.push('/wallet')})

    const assets = computed<IAsset[]>(() => JSON.parse(JSON.stringify(store.state.asset.list)))
      const { result, loading, error, onResult, refetch } = useQuery(QUERY_WALLET, {
      walletId: walletId.value
    }, {
      fetchPolicy: 'cache-and-network',
      // fetchPolicy: 'no-cache',
      // pollInterval: 1000,
    });

    onResult((data) => {
      console.debug('onResult', data)
    })

    // const toCoin =  (assetId: string | undefined, val: BigInt) => {
    //   // const currs = {...chains.value}
    //   // console.debug('currs', currs)
    //   const spec = assets.value.find((f: IAsset) => f.id === assetId) || { decimals: 2 }
    //   // console.debug('toCoin', assetId, spec)
    //   const denom = Math.pow(10, spec.decimals)
    //   // console.debug('denom', denom)
    //   return Number(val) / denom
    // }

    const { mutate: mutDeleteWallet, error: deleteError, loading: deleting } = useMutation(gql`
      mutation DeleteWallet($id: String!) {
        deleteWallet(id: $id) {
          success
          message
        }
      }
    `)

    const confirmDeleteWallet = async () => {
      showConfirmDialog.value = false
      const result = await mutDeleteWallet({ id: route.params.walletId })
      console.debug('deleteWallet', result)
      if (result?.data.deleteWallet.success) {
        const apollo = useApolloClient()
        const cacheId = `Wallet:{"id": "${route.params.walletId}"}`
        console.debug('cacheId', cacheId)
        const evicted = apollo.client.cache.evict({ id: `Wallet:{"id":"${route.params.walletId}"}` })
        console.debug('evicted', evicted)
        router.push('/wallet')
      }
    }
    const onCloseDeleteWallet = () => {
      showConfirmDialog.value = false
    }
    const showConfirmDialog = ref(false)

    return {
      profile,
      shortStash,
      result,
      // result2,
      // loading,
      // loading2,
      // reload,
      // error,
      // maxLocked,
      walletId,
      // toCoin,
      // transactionList
      confirmDeleteWallet,
      showConfirmDialog,
      onCloseDeleteWallet
    }
  },
})
</script>
