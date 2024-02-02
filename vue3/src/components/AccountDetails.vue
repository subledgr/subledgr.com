<template>
  
  <v-card elevation="0" style="background: none;">
    <v-toolbar density="compact" style="background: none;">
      <div variant="text" class="text-none font-weight-bold">{{ title }}</div>
      <v-spacer></v-spacer>
      <div class="text-normal">
        {{ toCoin(result?.Account?.Asset?.id, getAccountBalance?.balance).toLocaleString('en-gb', { minimumFractionDigits: profile.defaultDecimals, maximumFractionDigits: profile.defaultDecimals }) }}
        {{ result?.Account?.Asset?.code }}
      </div>
      <v-btn icon size="small" @click="refetch" :loading="loading">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- <v-card-title>
      <v-row density="compact">
        <v-col>{{ title }}</v-col>
        <v-col class="text-right">
          <small>
            {{ toCoin(result?.Account?.Asset?.id, getAccountBalance?.balance).toLocaleString('en-gb', { minimumFractionDigits: profile.defaultDecimals, maximumFractionDigits: profile.defaultDecimals }) }}
            {{ result?.Account?.Asset?.code }}
          </small>
          <v-btn size="small" variant="plain" icon @click="refetch" :loading="loading">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title> -->

    <v-card-text>
      <!-- <v-progress-linear indeterminate v-show="loading"></v-progress-linear> -->
    <v-table style="background: none;">
      <tr>
        <th class="text-left">Address</th>
        <td class="text-right">
          <ClickToCopy :display="shortStash(result?.Account.address)" :text="result?.Account.address"></ClickToCopy>
        </td>
      </tr>
      <tr>
        <th class="text-left">Total</th>
        <td class="text-right">
          {{ toCoin(result?.Account?.Asset?.id, getAccountBalance?.balance) }}
        </td>
      </tr>
      <tr>
        <th class="text-left">Index:</th>
        <td class="text-right">
          <small><i>( {{ toProfileDate(result?.Account?.balanceHistory[0]?.timestamp || 0) }})</i></small>
        </td>
      </tr>
      <tr>
        <th class="text-left">Breakdown</th>
        <td>
          <v-table density="compact" style="background: none;">
            <tbody>
              <tr>
                <th class="text-left">Free</th>
                <td align="right">
                  {{ toCoin(result?.Account?.Asset?.id, getAccountBalance?.free||0 - getAccountBalance?.locked||0).toLocaleString('en-gb', { minimumFractionDigits: profile.defaultDecimals, maximumFractionDigits: profile.defaultDecimals }) }}
                </td>
              </tr>
              <tr v-if="Number(getAccountBalance?.locked || 0) > 0">
                <th class="text-left">Locked</th>
                <td align="right">
                  {{ toCoin(result?.Account?.Asset?.id, getAccountBalance.locked || 0n).toLocaleString('en-gb', { minimumFractionDigits: profile.defaultDecimals, maximumFractionDigits: profile.defaultDecimals }) }}
                </td>
              </tr>
              <tr v-if="BigInt(getAccountBalance?.reserved || 0) > 0n">
                <th class="text-left">Reserved</th>
                <td align="right">
                  {{ toCoin(result?.Account?.Asset?.id, getAccountBalance?.reserved).toLocaleString('en-gb', { minimumFractionDigits: profile.defaultDecimals, maximumFractionDigits: profile.defaultDecimals }) }}
                </td>
              </tr>
              <tr v-if="BigInt(getAccountBalance?.pooled || 0) > 0n">
                <th class="text-left">Pooled</th>
                <td align="right">
                  {{ toCoin(result?.Account?.Asset?.id, getAccountBalance?.pooled).toLocaleString('en-gb', { minimumFractionDigits: profile.defaultDecimals, maximumFractionDigits: profile.defaultDecimals }) }}
                </td>
              </tr>
              <tr v-if="BigInt(getAccountBalance?.claimable || 0) > 0n">
                <th class="text-left">Claimable</th>
                <td align="right">
                  {{ toCoin(result?.Account?.Asset?.id, getAccountBalance?.claimable).toLocaleString('en-gb', { minimumFractionDigits: profile.defaultDecimals, maximumFractionDigits: profile.defaultDecimals }) }}
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

import { QUERY_ACCOUNT_DETAILS, QUERY_ACCOUNT_BALANCE } from '@/graphql';

export default defineComponent({
  name: 'AccountDetails',
  components: {
    ClickToCopy
  },
  props: {
    accountId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: 'Account Details'
    }
  },
  setup(props) {
    const store = useStore()
    const profile = computed<IProfile>(() => store.state.profile)
    const accountId = ref(props.accountId)
    const { shortStash, toProfileDate } = useGlobalUtils()

    const { result, loading, error, onResult, refetch } = useQuery(QUERY_ACCOUNT_BALANCE, {
      accountId: accountId.value
    }, {
      fetchPolicy: 'cache-and-network',
    });

    // onResult((data) => {
    //   console.debug('onResult', data)
    // })
    
    const maxLocked: any = computed(() => {
      if (!result.value?.Account?.balance?.locks) return 0
      return result.value?.Account?.balance?.locks.reduce( (acc: bigint, lock: IBalanceLock) => {
        return (BigInt(lock.amount) > acc) ? BigInt(lock.amount) : acc
        }, 0n
      )
      // return result.value?.Account?.balance?.locks.reduce((acc: BigInt, lock: any) => acc + BigInt(lock.amount), 0n)
    })

    const getAccountBalance = computed(() => {
      const balance = result.value?.Account?.balanceHistory[0]
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
      console.debug('getIndexDate', result.value?.Account?.balanceHistory[0]?.timestamp)
      if (!result.value?.Account?.balanceHistory[0]?.timestamp) return '-'
      return moment(result.value?.Account?.balanceHistory[0]?.timestamp).format(profile.value.dateTimeFormat)
    }

    return {
      shortStash,
      toCoin,
      profile,
      maxLocked,
      //accountId,
      result,
      loading,
      refetch,
      getAccountBalance,
      toProfileDate,
    }

  },
})
</script>
