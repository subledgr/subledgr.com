<template>
  <v-container fluid class="">
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      :itemsPerPage="itemsPerPage"
      @update:itemsPerPage="onUpdateItemsPerPage"
      @click:row="onShowTransaction"
      no-data-text="No data">
      <template v-slot:[`item.amount`]="{ item }">
        <span :class="item.raw.recipientId === wallet?.address ? 'text-green' : 'text-red'">
          {{ item.raw.amount }}
        </span>
      </template>

      <template v-slot:[`item.senderId`]="{ item }">
        <ClickToCopy :display="shortStash(item.raw.senderId, 7)" :text="item.raw.senderId"></ClickToCopy>
      </template>

      <template v-slot:[`item.recipientId`]="{ item }">
        <ClickToCopy :display="shortStash(item.raw.recipientId, 7)" :text="item.raw.recipientId"></ClickToCopy>
      </template>

    </v-data-table>
    <transaction-dialog :transaction="transaction" :wallet="wallet" :showDialog="showDialog" @dialogClose="onDialogClosed"></transaction-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { IWallet, IWalletData, ICurrency, ITransaction } from './types'
// import { shortStash } from './utils'
import moment from 'moment'
import { useGlobalUtils } from './utils'
import TransactionDialog from './TransactionDialog.vue'
import ClickToCopy from './ClickToCopy.vue'

export default defineComponent({
  components: {
    TransactionDialog,
    ClickToCopy
  },
  props: {
    list: {
      type: Object as PropType<ITransaction[]>
    },
    wallet: {
      type: Object as PropType<IWallet>,
    },
    loading: {
      type: Boolean
    }
  },
  setup(props) {
    const store = useStore()
    const profile = store.state.profile
    const transactionState = store.state.transaction
    const wallet = computed<IWallet>(() => props.wallet || { address: '', Currency: {} } as IWallet)
    const list = computed<ITransaction[]>(() => props.list || [])
    watch(() => wallet, newVal => { console.debug('new wallet', newVal) })
    const currencies = computed<ICurrency[]>(() => JSON.parse(JSON.stringify(store.state.currency.list)))
    const itemsPerPage = ref(10)
    const { toCoin, shortStash } = useGlobalUtils()
    // const toCoin =  (currencyCode: string | undefined, val: BigInt) => {
    //   // console.debug('toCoin()', currencyCode, val)
    //   // const currs = {...currencies.value}
    //   // console.debug('currs', currs)
    //   const spec = currencies.value.find((f: ICurrency) => f.code === currencyCode) || { decimals: 2 }
    //   // console.debug('toCoin', currencyCode, spec)
    //   const denom = Math.pow(10, spec.decimals)
    //   // console.debug('denom', denom)
    //   return Number(val) / denom
    // }

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

    const headers = [
      { key: 'timestamp', title: 'Date', align: 'start', sortable: true },
      { key: 'height', title: 'Block', align: 'middle', sortable: true },
      { key: 'type', title: 'Type', align: 'start', sortable: true },
      { key: 'senderId', title: 'Sender', align: 'start', sortable: true },
      { key: 'recipientId', title: 'Receiver', align: 'start', sortable: true },
      { key: 'amount', title: 'Amount', align: 'end', sortable: true },
      { key: 'totalFee', title: 'Fees', align: 'end', sortable: true }
    ]
    const items = computed(() => list.value.map( (m: ITransaction) => {
      return {
        timestamp: moment.unix(m.timestamp/1000).format('YYYY.MM.DD hh:mm'),
        height: m.height,
        id: m.id,
        type: typeName(m.type),
        senderId: m.senderId,
        recipientId: m.recipientId,
        amount: toCoin(wallet.value.Currency?.code || wallet.value.currencyCode, m.amount).toLocaleString('en-GB', { minimumFractionDigits: profile.defaultDecimals, maximumFractionDigits: profile.defaultDecimals }),
        totalFee: toCoin(wallet.value.Currency.code || wallet.value.currencyCode, m.totalFee).toLocaleString('en-GB', { minimumFractionDigits: profile.defaultDecimals, maximumFractionDigits: profile.defaultDecimals })
      }
    }))

    const onUpdateItemsPerPage = (value: any) => {
      console.debug('onUpdateItemsPerPage', value)
      itemsPerPage.value = value
    }

    const showDialog = ref(false)
    const transaction = ref<ITransaction>()
    const onShowTransaction = (evt: any, tx: any) => {
      const item = {...tx.item}
      console.debug('evt', item)
      console.debug('onShowTransaction', showDialog.value)
      transaction.value = list.value.find((f: ITransaction) => f.id === item.value)
      showDialog.value = true
    }
    const onDialogClosed = () => {
      showDialog.value = false
    }

    return {
      // profile,
      headers,
      items,
      itemsPerPage,
      toCoin,
      shortStash,
      moment,
      onUpdateItemsPerPage,
      showDialog,
      onShowTransaction,
      transaction,
      onDialogClosed
    }
  },
})
</script>
