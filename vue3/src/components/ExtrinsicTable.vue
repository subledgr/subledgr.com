<template>
  <v-container fluid class="pa-0 ma-0">
    <!-- {{ wallet }} -->
    {{ items }}
    <!-- {{ list }} -->
    <!-- <v-data-table
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="desserts"
      item-value="name"
      class="elevation-1"
    ></v-data-table> -->

    <v-data-table
      :headers="headers"
      :items="list"
      :loading="loading"
      item-value="id"
      v-model:items-per-page="itemsPerPage"
      >

      <!-- <template v-slot:[`item.amount`]="{ item }">
        <span :class="item.raw.recipientid === wallet?.address ? 'text-green' : 'text-red'">
          {{ item.raw.amount }}
        </span>
      </template> -->

      <!-- <template v-slot:[`item.senderId`]="{ item }">
        <ClickToCopy :display="shortStash(item.raw.senderId, 7)" :text="item.raw.senderId"></ClickToCopy>
      </template>

      <template v-slot:[`item.recipientid`]="{ item }">
        <ClickToCopy :display="shortStash(item.raw.recipientid, 7)" :text="item.raw.recipientid"></ClickToCopy>
      </template> -->

    </v-data-table>
    <!-- <transaction-dialog :transaction="transaction" :wallet="wallet" :showDialog="showDialog" @dialogClose="onDialogClosed"></transaction-dialog> -->
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { IWallet, ICurrency, IExtrinsic } from './types'
// import { shortStash } from './utils'
import moment from 'moment'
import { useGlobalUtils } from './utils'
// import TransactionDialog from './TransactionDialog.vue'
// import ClickToCopy from './ClickToCopy.vue'

export default defineComponent({
  components: {
    // TransactionDialog,
    // ClickToCopy
  },
  props: {
    list: {
      type: Object as PropType<IExtrinsic[]>
    },
    wallet: {
      type: Object as PropType<IWallet>,
      required: true
    },
    loading: {
      type: Boolean
    }
  },
  setup(props) {
    const store = useStore()
    const profile = store.state.profile
    const transactionState = store.state.transaction
    const wallet = computed<IWallet>(() => props.wallet) // || { address: '', Currency: {} } as IWallet)
    // const list = computed<IExtrinsic[]>(() => props.list || [])
    watch(() => wallet, newVal => { console.debug('new wallet', newVal) })
    const chains = computed<ICurrency[]>(() => JSON.parse(JSON.stringify(store.state.currency.chains)))
    const itemsPerPage = ref(10)
    const { toCoin, shortStash } = useGlobalUtils()

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
      { key: 'timestamp', title: 'Date'}, // , align: 'start', sortable: true },
      { key: 'height', title: 'Block'}, // , align: 'middle', sortable: true },
      // { key: 'type', title: 'Type'}, // , align: 'start', sortable: true },
      // // { key: 'senderId', title: 'Sender', align: 'start', sortable: true },
      // // { key: 'recipientid', title: 'Receiver', align: 'start', sortable: true },
      // // { key: 'amount', title: 'Amount', align: 'end', sortable: true },
      // { key: 'totalFee', title: 'Fees'}, // , align: 'end', sortable: true }
    ]

    const items = computed(() => props.list?.map( (m: IExtrinsic) => {
      // console.debug('items firing...')
      return {
        timestamp: moment.unix( Number(Number(m.block_timestamp) / 1000) ).format('YYYY.MM.DD hh:mm'),
        height: m.block_num,
        // id: m.extrinsic_index,
        // type: typeName(m.call_module + '.' + m.call_module_function),
        // senderId: '', // m.senderId,
        // recipientid: '', // m.recipientid,
        // amount: 0, // toCoin(wallet.value.Currency?.code || wallet.value.currencyCode, m.amount).toLocaleString('en-GB', { minimumFractionDigits: profile.defaultDecimals, maximumFractionDigits: profile.defaultDecimals }),
        // totalFee: toCoin(wallet.value.Currency.code || wallet.value.currencyCode, m.fee).toLocaleString('en-GB', { minimumFractionDigits: profile.defaultDecimals, maximumFractionDigits: profile.defaultDecimals })
      }
    })) || []

    const onUpdateItemsPerPage = (value: any) => {
      console.debug('onUpdateItemsPerPage', value)
      itemsPerPage.value = value
    }

    const showDialog = ref(false)
    const transaction = ref<IExtrinsic>()
    const onShowTransaction = (evt: any, tx: any) => {
      const item = {...tx.item}
      console.debug('evt', item)
      console.debug('onShowTransaction', showDialog.value)
      transaction.value = props.list?.find((f: IExtrinsic) => f.extrinsic_index === item.value)
      showDialog.value = true
    }
    const onDialogClosed = () => {
      showDialog.value = false
    }

    watch(() => props.list, newVal => {
      console.debug('new list', newVal)
    })

    return {
      headers,
      // desserts,
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
