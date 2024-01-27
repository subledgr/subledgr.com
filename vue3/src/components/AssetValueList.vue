<template>
  <v-container class="py-1 px-1">

    <v-toolbar density="compact" style="background: none;" :class="toolbarClass">
      <v-toolbar-title>
        <v-icon>mdi-cash</v-icon>
        Assets
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn flat class="text-none">{{ currency?.symbol }} {{ totalValue.toLocaleString(profile.locale, { currency: profile.defaultCurrency, maximumFractionDigits: 2 }) }}</v-btn>
        <!-- <v-btn :loading="loading" icon @click="refresh()">
          <v-icon size="small">mdi-refresh</v-icon>
        </v-btn> -->
        <!-- <v-btn @click="showAssetPicker=true">
          <v-icon>mdi-wallet-plus-outline</v-icon>
        </v-btn> -->
      </v-toolbar-items>
    </v-toolbar>

    <!-- {{ list }} -->

    <v-list>
      <!-- <v-list-item v-if="!loggedIn">
        <v-row>
          <v-col>
            <v-btn to="/login">Login</v-btn> to see your assets
          </v-col>
        </v-row>
      </v-list-item> -->

      <v-list-item v-for="item in list" v-bind:key="item.assetId" @click="onSelectAsset(item.assetId)">
        <v-divider></v-divider>
        <template v-slot:prepend>
          <AssetLogo :size="24" :asset-id="item.assetId"></AssetLogo><br>
        </template>

        <v-list-item-title style="font-weight: 600;">
          <v-row>
            <v-col>
              {{ item.assetId.toLocaleUpperCase() }}
            </v-col>
            <v-col class="text-right">
              {{ toCoin(item.assetId, item.balance?.balance).toLocaleString('en-GB', { maximumFractionDigits: profile.defaultDecimals }) }}
              <span class="currency-code">{{ item.assetCode }}</span>
            </v-col>
            <v-col class="text-right">
              {{ currency?.symbol }} {{ toValue(item.assetId, item.balance?.balance).toLocaleString('en-GB', { maximumFractionDigits: profile.defaultDecimals }) }}
            </v-col>
          </v-row>
        </v-list-item-title>
        <v-row style="font-style: italic; font-size: smaller;">
          <v-col>
            Free<br>
            Reserved<br>
            Locked<br>
            Pooled<br>
            Claimable
          </v-col>
          <v-col class="text-right">
            {{ toCoin(item.assetId, item.balance?.free).toLocaleString('en-GB', { maximumFractionDigits: profile.defaultDecimals }) }}
            <span class="currency-code">{{ item.assetCode }}</span><br>
            {{ toCoin(item.assetId, item.balance?.reserved).toLocaleString('en-GB', { maximumFractionDigits: profile.defaultDecimals }) }}
            <span class="currency-code">{{ item.assetCode }}</span><br>
            {{ toCoin(item.assetId, item.balance?.locked).toLocaleString('en-GB', { maximumFractionDigits: profile.defaultDecimals }) }}
            <span class="currency-code">{{ item.assetCode }}</span><br>
            {{ toCoin(item.assetId, item.balance?.pooled).toLocaleString('en-GB', { maximumFractionDigits: profile.defaultDecimals }) }}
            <span class="currency-code">{{ item.assetCode }}</span><br>
            {{ toCoin(item.assetId, item.balance?.claimable).toLocaleString('en-GB', { maximumFractionDigits: profile.defaultDecimals }) }}
            <span class="currency-code">{{ item.assetCode }}</span>
          </v-col>
          <v-col class="text-right">
            {{ currency?.symbol }} {{ toValue(item.assetId, item.balance?.free).toLocaleString('en-GB', { maximumFractionDigits: profile.defaultDecimals }) }}<br>
            {{ currency?.symbol }} {{ toValue(item.assetId, item.balance?.reserved).toLocaleString('en-GB', { maximumFractionDigits: profile.defaultDecimals }) }}<br>
            {{ currency?.symbol }} {{ toValue(item.assetId, item.balance?.locked).toLocaleString('en-GB', { maximumFractionDigits: profile.defaultDecimals }) }}<br>
            {{ currency?.symbol }} {{ toValue(item.assetId, item.balance?.pooled).toLocaleString('en-GB', { maximumFractionDigits: profile.defaultDecimals }) }}<br>
            {{ currency?.symbol }} {{ toValue(item.assetId, item.balance?.claimable).toLocaleString('en-GB', { maximumFractionDigits: profile.defaultDecimals }) }}
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
    <!-- <AssetPickerDialog icon="mdi-wallet-plus-outline" :visible="showAssetPicker" @selectAsset="onSelectAsset"></AssetPickerDialog> -->
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import { useDisplay } from 'vuetify';
// import { useQuery, useMutation } from '@vue/apollo-composable';
import { useStore } from 'vuex';
// import AssetPickerDialog from './AssetPickerDialog.vue'
import AssetLogo from './AssetLogo.vue'
import { IAsset, ICurrency, IPrice, IAccountBalance, IProfile, IAccount } from './types';

interface IAssetView {
  // id: string
  assetId: string
  assetName: string
  assetCode: string
  balance: IAccountBalance
}

export default defineComponent({
  components: {
    AssetLogo,
    // AssetPickerDialog
  },
  props: {
    prices: {
      type: Object as () => IPrice[],
      required: true
    },
    accounts: {
      type: Object as () => IAccount[],
      required: true
    },
  },
  emits: ['selectAsset'],
  setup (props, context) {
    const display = useDisplay()
    const store = useStore()
    const profile = computed<IProfile>(() => store.state.profile)
    // const loggedIn = computed(() => store.getters.loggedIn)

    const loading = ref(false)
    // const showAssetPicker = ref(false)
    const list = ref<IAssetView[]>([])
    const assets = computed<IAsset[]>(() => store.state.asset.list)
    const currencies = computed<ICurrency[]>(() => store.state.currency.list)
    const currency = currencies.value.find(c => c.code === profile.value.defaultCurrency)
    const totalValue = ref(0.0)

    const toolbarClass = computed(() => {
      const { mdAndUp } = display
      return mdAndUp.value ? 'rounded-pill' : ''
    })

    // summarise all accounts into asset balances
    const summarise = () => {
      // console.debug('summarise...', props.accounts.length, 'accounts')
      var assetBals = props.accounts.reduce((acc: any, account: IAccount) => {
        // console.debug('reduce...', account.id)
        // if (Array.isArray(acc)) {
        const idx = acc.findIndex((x: IAssetView) => x.assetId === account.Asset.id)
        if (idx === -1) {
          // console.debug('new...')
          const twal = { 
            assetId: account.Asset.id,
            assetName: account.Asset.name,
            assetCode: account.Asset.code,
            balance: {
              free       : BigInt(account.balance?.free || 0) || 0n,
              reserved   : BigInt(account.balance?.reserved || 0) || 0n,
              locked     : BigInt(account.balance?.locked || 0) || 0n,
              pooled     : BigInt(account.balance?.pooled || 0) || 0n,
              claimable  : BigInt(account.balance?.claimable || 0) || 0n,
              balance    : BigInt(account.balance?.balance || 0) || 0n,
            }
          }
          acc.push(twal)
        } else {
          // console.debug('existing...')
          acc[idx].balance.free       += BigInt(account.balance?.free || 0) || 0n
          acc[idx].balance.reserved   += BigInt(account.balance?.reserved || 0) || 0n
          // acc[idx].balance.miscFrozen += BigInt(account.balance?.miscFrozen || 0) || 0n
          acc[idx].balance.locked     += BigInt(account.balance?.locked || 0) || 0n
          acc[idx].balance.pooled     += BigInt(account.balance?.pooled || 0) || 0n
          acc[idx].balance.claimable  += BigInt(account.balance?.claimable || 0) || 0n
          acc[idx].balance.balance    += BigInt(account.balance?.balance || 0) || 0n
        }
        // } else {
        //   console.debug('acc is not an array', acc)
        // }
        return acc
      }, [])
      list.value = assetBals
    }

    const onSelectAsset = async (assetId: string) => {
      // console.debug('onSelectAsset', assetId)
      context.emit('selectAsset', assetId)
    }

    // FIXME - move this to utils
    const toCoin =  (assetId: string, val: BigInt) => {
      // const currs = {...chains.value}
      // console.debug('currs', currs)
      const spec = assets.value.find((f: IAsset) => f.id === assetId) || { id: assetId, decimals: 2 }
      // console.debug('toCoin', currencyCode, spec)
      const denom = Math.pow(10, spec.decimals)
      // console.debug('denom', denom)
      return Number(val) / denom
    }

    const calcTotalValue = () => {
      // console.debug('calcTotalValue', props.accounts)
      totalValue.value = 0
      var ret = 0
      // todo :: reduce()
      for(let i = 0; i < props.accounts?.length; i++) {
        const account = props.accounts[i]
        // console.debug('calcTotalValue', account.Asset.id)
        // const val = toValue(account.Asset.id, account.balance?.free || 0n)
        ret += toValue(account.Asset.id, account.balance?.balance || 0n)
        // ret += toValue(account.Asset.id, account.balance?.reserved || 0n)
        // ret += toValue(account.Asset.id, account.balance?.pooled || 0n)
        // ret += toValue(account.Asset.id, account.balance?.claimable || 0n)
        // console.debug('val', val, typeof val)
        // ret += val
      }
      // console.debug('totalVal', ret)
      totalValue.value = ret
    }

    const toValue = (assetId: string, value: BigInt): number => {
      // console.debug('toValue()', assetId, value)
      if (!value) return 0
      const spec = assets.value.find((f: IAsset) => f.id === assetId) || { id: assetId, code: assetId, decimals: 2 }
      // console.debug('spec', spec)
      const denom: BigInt = BigInt(Math.pow(10, spec.decimals || 2))
      const price = props.prices.find((f: any) => f.f_curr === spec.code) || { value: 0 }
      // console.debug('toValue', price)
      // return parseFloat((value/denom * price.value).toFixed(decimals))
      return Number(value) / Number(denom) * price.value
    }

    watch(() => props.accounts, (newVal, oldVal) => {
      // console.debug('accounts changed', newVal, oldVal)
      summarise()
      calcTotalValue()
    })

    // refetch()
    calcTotalValue()
    summarise()

    return {
      toolbarClass,
      // loggedIn,
      profile,
      loading,
      list,
      currency,
      // mutate,
      // showAssetPicker,
      onSelectAsset,
      toCoin,
      toValue,
      totalValue,
      // sumBalance,
      // gotoAsset,
      // refresh
    }
  }
})
</script>

<style scoped>
.currency-code {
  color: rgb(103,58,183);
  font-size: smaller;
  font-weight: 600;
  font-style: italic;
}
</style>
