<template>
  <!-- <v-container fluid class="pa-0 ma-0"> -->
    <!-- {{ items }} -->
    <!-- {{ list }} -->
    <v-list
    lines="three">
      <v-list-item v-for="item in list" v-bind:key="item.extrinsic_hash">
        <!-- {{ item }} -->
        <v-list-item-title>{{ item.call_module }}.{{ item.call_module_function }} / {{ moment(Number(item.block_timestamp)*1000).format('YYYY.MM.DD HH:mm') }} 
          :: {{ item.fee }} => {{ item.fee_used }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.extrinsic_index }}</v-list-item-subtitle>
        {{ item.params }}
      </v-list-item>
    </v-list>
    <!-- <transaction-dialog :transaction="transaction" :account="account" :showDialog="showDialog" @dialogClose="onDialogClosed"></transaction-dialog> -->
  <!-- </v-container> -->
</template>

<script lang="ts">
import { defineComponent, computed, PropType, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { IAccount, IAccountData, ICurrency, IExtrinsic } from './types'
// import { shortStash } from './utils'
import moment from 'moment'
import { useGlobalUtils } from './utils'
import TransactionDialog from './TransactionDialog.vue'
import ClickToCopy from './ClickToCopy.vue'

export default defineComponent({
  components: {
    // TransactionDialog,
    // ClickToCopy
  },
  props: {
    list: {
      type: Object as PropType<IExtrinsic[]>
    },
    account: {
      type: Object as PropType<IAccount>,
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
    const account = computed<IAccount>(() => props.account) // || { address: '', Currency: {} } as IAccount)
    const list = computed<IExtrinsic[]>(() => props.list || [])
    watch(() => account, newVal => { console.debug('new account', newVal) })
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
      { key: 'block_timestamp', title: 'Date'}, // , align: 'start', sortable: true },
      { key: 'block_num', title: 'Block'}, // , align: 'middle', sortable: true },
      { key: 'type', title: 'Type'}, // , align: 'start', sortable: true },
      // { key: 'senderId', title: 'Sender', align: 'start', sortable: true },
      // { key: 'recipientid', title: 'Receiver', align: 'start', sortable: true },
      // { key: 'amount', title: 'Amount', align: 'end', sortable: true },
      { key: 'totalFee', title: 'Fees'}, // , align: 'end', sortable: true }
    ]
    const items = computed(() => props.list )
    // list.value.map( (m: IExtrinsic) => {
    //   return {
    //     timestamp: moment.unix( Number(BigInt(m.block_timestamp) / BigInt(1000)) ).format('YYYY.MM.DD hh:mm'),
    //     height: m.block_num,
    //     id: m.extrinsic_index,
    //     type: typeName(m.call_module + '.' + m.call_module_function),
    //     senderId: '', // m.senderId,
    //     recipientid: '', // m.recipientid,
    //     amount: 0, // toCoin(account.value.Currency?.code || account.value.currencyCode, m.amount).toLocaleString('en-GB', { minimumFractionDigits: profile.defaultDecimals, maximumFractionDigits: profile.defaultDecimals }),
    //     totalFee: toCoin(account.value.Currency.code || account.value.currencyCode, m.fee).toLocaleString('en-GB', { minimumFractionDigits: profile.defaultDecimals, maximumFractionDigits: profile.defaultDecimals })
    //   }
    // }))

    const onUpdateItemsPerPage = (value: any) => {
      console.debug('onUpdateItemsPerPage', value)
      itemsPerPage.value = value
    }

    const showDialog = ref(false)
    const transaction = ref<IExtrinsic>()
    // const onShowTransaction = (evt: any, tx: any) => {
    //   const item = {...tx.item}
    //   console.debug('evt', item)
    //   console.debug('onShowTransaction', showDialog.value)
    //   transaction.value = list.value.find((f: IExtrinsic) => f.id === item.value)
    //   showDialog.value = true
    // }
    const onDialogClosed = () => {
      showDialog.value = false
    }

    watch(() => props.list, newVal => {
      console.debug('new list', newVal)
    })

    return {
      headers,
      items,
      itemsPerPage,
      toCoin,
      shortStash,
      moment,
      onUpdateItemsPerPage,
      showDialog,
      // onShowTransaction,
      transaction,
      onDialogClosed
    }
  },
})
</script>
