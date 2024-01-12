<template>
    <v-list>
      <!-- {{ list }} -->
      <v-progress-linear
        indeterminate
        v-show="loading"
      ></v-progress-linear>

      <v-list-item v-show="!loggedIn">
        <v-row>
          <v-col>
            <v-btn to="/login">Login</v-btn> to see your wallets
          </v-col>
        </v-row>
      </v-list-item>

      <v-list-item v-for="item in sortedResult || []" v-bind:key="item.id" @click="clickItem(item)">
        <v-divider></v-divider>
        <template v-slot:prepend>
          <AssetLogo :size="24" :asset-id="item.Asset?.id"></AssetLogo>
        </template>

        <v-list-item-title>
          {{ item.name }} <!--({{ item.Asset?.id }}) -->
          <span class="d-none d-sm-inline" style="color: grey; font-size: 12px; font-weight: 300"><em>({{ shortStash(item.address) }})</em></span>
        </v-list-item-title>

        <!-- <v-list-item-subtitle class="d-none d-sm-block">
          {{ shortStash(item.address) }})
        </v-list-item-subtitle> -->

        <v-row dense>
          <v-col cols="2">
            <!-- {{ item.name }} <br> {{ item.Asset?.id }} -->
          </v-col>
          <v-col cols="5" class="text-right">
            {{ toCoin(item.Asset?.id, sumBalance(item.balance)).toLocaleString('en-GB', { maximumFractionDigits: profile.defaultDecimals }) }} 
            <span class="currency-code">{{ item.Asset?.code }}</span><br>
            <!-- {{ toCoin(item.Asset?.id, sumBalance(item.balance)).toLocaleString('en-GB', { maximumFractionDigits: 2 }) }} -->
            <!-- {{ item.balance }} -->
          </v-col>
          <v-col cols="5" class="text-right">
            {{ currency?.symbol }} {{ toValue(item.Asset?.id, sumBalance(item.balance)).toLocaleString('en-GB', { maximumFractionDigits: profile.defaultDecimals }) }} <br>
            <!-- {{ walletValue(item) }} -->
            <!-- £ {{ toValue(item.Asset?.id, item.balance?.pooled, 3).toLocaleString('en-GB') }} <br> -->
          </v-col>
        </v-row>

      </v-list-item>
    </v-list>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { IWallet, IWalletData, ICurrency, ITransaction, IAsset, IPrice } from './types'
// import TransactionDialog from './TransactionDialog.vue'
import { useGlobalUtils } from './utils'
import moment from 'moment'
import { shortStash } from './utils';
import AssetLogo from './AssetLogo.vue';

export default defineComponent({
  props: {
    list: {
      type: Object as PropType<IWallet[]>
    },
    loading: {
      type: Boolean,
      default: false
    },
    prices: {
      type: Object as PropType<IPrice[]>
    },
    // should we allow portfolio to have different currencies?
    currencyCode: {
      type: String,
      // default: 'GBP'
    }
  },
  components: {
    // TransactionDialog
    AssetLogo
  },
  setup(props, { emit }) {
    const store = useStore()
    const loggedIn = computed(() => store.getters.loggedIn)
    const profile = store.state.profile
    const assets = computed<IAsset[]>(() => store.state.asset.list)
    const currency = computed(() => store.state.currency.list.find((c: ICurrency) => c.code === profile.defaultCurrency))
    const transactionState = store.state.transaction
    const order = ref(-1)

    const { toCoin } = useGlobalUtils()
    // const wallet2 = computed<IWallet>(() => props.wallet || { address: '', Currency: {} } as IWallet)
    // const list2 = computed<ITransaction[]>(() => props.list || [])

    const typeName = (_type: string) => {
      // const [module, method] = _type.split('.')
      var name = transactionState.types[_type]
      // console.debug('typeName', _type, name)
      if (!name || name === '') {
        const parts = _type.split('.')
        // console.debug('parts', parts)
        name = parts[1].charAt(0).toUpperCase()+parts[1].slice(1)
          .split(/(?=[A-Z])/)
          .join(' ');
      }
      return name
    }

    const showDialog = ref(false)
    const transaction = ref<ITransaction>()
    const onShowTransaction = (tx: ITransaction) => {
      console.debug('onShowTransaction', showDialog.value)
      transaction.value = tx
      showDialog.value = true
    }
    const onDialogClosed = () => {
      showDialog.value = false
    }

    const clickItem = (item: IWallet) => {
      // console.debug('clickItem()', item)
      emit('clickWallet', item)
    }

    const sumBalance = (balance: IWalletData): bigint => {
      const bal = BigInt(balance?.free || 0)
        + BigInt(balance?.reserved || 0)
        // + balance.miscFrozen || 0
        // + balance.feeFrozen || 0
        + BigInt(balance?.locked || 0)
        + BigInt(balance?.pooled || 0)
        + BigInt(balance?.pooledClaimable || 0)
      // console.debug('sumBalance()', bal)
      return bal
    }

    /**
     * @deprecated = move this to utils.ts / central valuation function
     * Convert asset token to value, assumes Prices are provided
     */
    const toValue = (assetId: string, value: BigInt): number => {
      // console.debug('toValue', assetId, value)
      if (!value) return 0
      const spec = assets.value.find((f: IAsset) => f.id === assetId) || { id: assetId, code: assetId, decimals: 2 }
      // console.debug('spec', spec)
      // console.log(props.prices, spec.code, currency.value.code)
      const denom: BigInt = BigInt(Math.pow(10, spec.decimals))
      // console.debug('denom', denom)
      const price = props.prices?.find((f: any) => f.f_curr === spec.code && f.t_curr === currency.value.code) || { value: 0 }
      // console.debug('toValue', price)
      // return parseFloat((value/denom * price.value).toFixed(decimals))
      // console.debug('num tokens:', currencyCode, value.toString(), Number(denom))
      return Number(value) / Number(denom) * price.value
    }

    const walletValue = (wallet: IWallet): number => {
      // console.debug('walletValue', wallet)
      const totalTokens = sumBalance(wallet.balance)
      const value = toValue(wallet.Asset?.id, totalTokens)
      return value
    }

    const sortedResult = computed((): IWallet[] => {
      // // console.debug('sortedResult', result.value?.Wallets?.list)
      // if (!result.value?.Wallets) return []
      // const list = [...result.value?.Wallets] || []
      // // console.debug('list', list)
      var sortedList = props.list?.map((m: IWallet) => m).sort((a: IWallet, b: IWallet) => {
        // console.debug(a, b)
        const valA = walletValue(a)
        const valB = walletValue(b)
        // console.debug('sortedList', valA, valB)
        if (valA > valB) return 1 * order.value
        if (valB > valA) return -1 * order.value        
        return 0
      })
      // console.debug('sortedList', sortedList)
      return sortedList ? [...sortedList] : []
    })

    return {
      moment,
      loggedIn,
      profile,
      currency,
      sortedResult,
      order,
      shortStash,
      toCoin,
      typeName,
      // wallet2,
      // list2,
      transaction,
      onShowTransaction,
      showDialog,
      onDialogClosed,
      clickItem,
      sumBalance,
      toValue
    }
  },
})
</script>
