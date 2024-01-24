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
            {{ toCoin(result?.Wallet?.wallet?.Asset?.id, getWalletBalance?.balance).toLocaleString('en-gb', { minimumFractionDigits: profile.defaultDecimals, maximumFractionDigits: profile.defaultDecimals }) }}
            {{ result?.Wallet?.wallet?.Asset?.code }}
          </small>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <!-- <v-progress-linear indeterminate v-show="loading"></v-progress-linear> -->
    <v-table>
      <tr>
        <th class="text-left">Address</th>
        <td class="text-right">
          <ClickToCopy :display="shortStash(result?.Wallet.wallet.address)" :text="result?.Wallet.wallet.address"></ClickToCopy>
        </td>
      </tr>
      <tr>
        <th class="text-left">Total</th>
        <td class="text-right">
          {{ toCoin(result?.Wallet?.wallet?.Asset?.id, getWalletBalance?.balance) }}
        </td>
      </tr>
      <tr>
        <th class="text-left">Index:</th>
        <td class="text-right">
          <small><i>( {{ toProfileDate(result?.Wallet?.wallet?.balanceHistory[0]?.timestamp || 0) }})</i></small>
        </td>
      </tr>
      <tr>
        <th class="text-left">Breakdown</th>
        <td>
          <v-table density="comfortable">
            <tbody>
              <tr>
                <th class="text-left">Free</th>
                <td align="right">
                  {{ toCoin(result?.Wallet?.wallet?.Asset?.id, getWalletBalance?.free||0 - getWalletBalance?.locked||0).toLocaleString('en-gb', { minimumFractionDigits: profile.defaultDecimals, maximumFractionDigits: profile.defaultDecimals }) }}
                </td>
              </tr>
              <tr v-if="Number(getWalletBalance?.locked || 0) > 0">
                <th class="text-left">Locked</th>
                <td align="right">
                  {{ toCoin(result?.Wallet?.wallet?.Asset?.id, getWalletBalance.locked || 0n).toLocaleString('en-gb', { minimumFractionDigits: profile.defaultDecimals, maximumFractionDigits: profile.defaultDecimals }) }}
                </td>
              </tr>
              <tr v-if="BigInt(getWalletBalance?.reserved || 0) > 0n">
                <th class="text-left">Reserved</th>
                <td align="right">
                  {{ toCoin(result?.Wallet?.wallet?.Asset?.id, getWalletBalance?.reserved).toLocaleString('en-gb', { minimumFractionDigits: profile.defaultDecimals, maximumFractionDigits: profile.defaultDecimals }) }}
                </td>
              </tr>
              <tr v-if="BigInt(getWalletBalance?.pooled || 0) > 0n">
                <th class="text-left">Pooled</th>
                <td align="right">
                  {{ toCoin(result?.Wallet?.wallet?.Asset?.id, getWalletBalance?.pooled).toLocaleString('en-gb', { minimumFractionDigits: profile.defaultDecimals, maximumFractionDigits: profile.defaultDecimals }) }}
                </td>
              </tr>
              <tr v-if="BigInt(getWalletBalance?.claimable || 0) > 0n">
                <th class="text-left">Claimable</th>
                <td align="right">
                  {{ toCoin(result?.Wallet?.wallet?.Asset?.id, getWalletBalance?.claimable).toLocaleString('en-gb', { minimumFractionDigits: profile.defaultDecimals, maximumFractionDigits: profile.defaultDecimals }) }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </td>
      </tr>
    </v-table>
    </v-card-text>
  </v-card>

</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import moment from 'moment';
import { IAsset, IBalanceLock, IProfile } from './types';
import { useGlobalUtils } from './utils';
import { useStore } from 'vuex';
import ClickToCopy from './ClickToCopy.vue';

import { QUERY_WALLET_DETAILS, QUERY_WALLET_BALANCE } from '@/graphql';

export default defineComponent({
  name: 'WalletDetails',
  components: {
    ClickToCopy
  },
  props: {
    walletId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: 'Wallet Details'
    }
  },
  setup(props) {
    const store = useStore()
    const profile = computed<IProfile>(() => store.state.profile)
    const walletId = ref(props.walletId)
    const { shortStash, toProfileDate } = useGlobalUtils()

    const { result, loading, error, onResult, refetch } = useQuery(QUERY_WALLET_BALANCE, {
      walletId: walletId.value
    }, {
      fetchPolicy: 'cache-and-network',
    });

    // onResult((data) => {
    //   console.debug('onResult', data)
    // })
    
    const maxLocked: any = computed(() => {
      if (!result.value?.Wallet?.wallet?.balance?.locks) return 0
      return result.value?.Wallet?.wallet?.balance?.locks.reduce( (acc: bigint, lock: IBalanceLock) => {
        return (BigInt(lock.amount) > acc) ? BigInt(lock.amount) : acc
        }, 0n
      )
      // return result.value?.Wallet?.wallet?.balance?.locks.reduce((acc: BigInt, lock: any) => acc + BigInt(lock.amount), 0n)
    })

    const getWalletBalance = computed(() => {
      const balance = result.value?.Wallet?.wallet?.balanceHistory[0]
      return balance
    })

    const assets = computed<IAsset[]>(() => JSON.parse(JSON.stringify(store.state.asset.list)))
    const toCoin = (assetId: string | undefined, val: BigInt) => {
      // const currs = {...chains.value}
      // console.debug('currs', currs)
      const spec = assets.value.find((f: IAsset) => f.id === assetId) || { decimals: 2 }
      // console.debug('toCoin', assetId, spec)
      const denom = Math.pow(10, spec.decimals)
      // console.debug('denom', denom)
      return Number(val) / denom
    }

    const getIndexDate = () => {
      console.debug('getIndexDate', result.value?.Wallet?.wallet?.balanceHistory[0]?.timestamp)
      if (!result.value?.Wallet?.wallet?.balanceHistory[0]?.timestamp) return '-'
      return moment(result.value?.Wallet?.wallet?.balanceHistory[0]?.timestamp).format(profile.value.dateTimeFormat)
    }

    return {
      shortStash,
      toCoin,
      profile,
      maxLocked,
      //walletId,
      result,
      loading,
      refetch,
      getWalletBalance,
      toProfileDate,
    }

  },
})
</script>
