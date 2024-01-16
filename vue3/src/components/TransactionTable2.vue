<template>
  <v-container fluid class="pa-0 ma-0">
    <!-- {{ items }} -->
    <v-data-table
      :headers="headers"
      :items="items"
      v-model:sort-by="sortBy"
      :loading="loading"
      :itemsPerPage="profile.itemsPerPage"
      @update:itemsPerPage="onUpdateItemsPerPage"
      @click:row="onShowTransaction"
      no-data-text="No data">
      
      <template v-slot:[`item.amount`]="{ item }">
        <span :class="getClass(item.toId)">
          {{ item.amount }}
        </span>
      </template>

      <template v-slot:[`item.fromId`]="{ item }">
        <ClickToCopy :display="shortStash(item.fromId, 7)" :text="item.raw?.fromId"></ClickToCopy>
      </template>

      <template v-slot:[`item.toId`]="{ item }">
        <ClickToCopy :display="shortStash(item.toId, 7)" :text="item.raw?.toId"></ClickToCopy>
      </template>

      <template v-slot:[`item.timestamp`]="{ item }">
        {{ toProfileDate(item.timestamp) }}
      </template>

    </v-data-table>
    <transaction-dialog :transaction="transaction" :wallet="wallet" :showDialog="showDialog" @dialogClose="onDialogClosed"></transaction-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { IWallet, IWalletData, IAsset, ITransaction, IProfile } from './types'
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
    const profile = computed<IProfile>(() => store.state.profile)
    const transactionState = store.state.transaction
    const wallet = computed<IWallet>(() => props.wallet || { address: '', Asset: {} } as IWallet)
    const list = computed<ITransaction[]>(() => props.list || [])
    watch(() => wallet, newVal => { console.debug('new wallet', newVal) })
    const assets = computed<IAsset[]>(() => JSON.parse(JSON.stringify(store.state.asset.list)))
    const itemsPerPage = ref(profile.value.itemsPerPage)
    const { toCoin, shortStash, toProfileDate } = useGlobalUtils()

    const typeName = (_type: string) => {
      var [module, method] = _type.split('.')
      module = module.charAt(0).toLowerCase()+module.slice(1)
      method = method.charAt(0).toLowerCase()+method.slice(1)
      var name = transactionState.types[`${module}.${method}`]
      if (!name || name === '') {
        const parts = _type.split('.')
        // console.debug('typeName', module, method, _type, name)
        // console.debug('parts', parts)
        name = parts[1].charAt(0).toUpperCase()+parts[1].slice(1)
          .split(/(?=[A-Z])/)
          .join(' ');
      }
      return name
    }

    const headers: any[] = [
      { key: 'timestamp', title: 'Date', align: 'start', sortable: true },
      { key: 'height', title: 'Block', align: 'middle'}, // , sortable: true },
      { key: 'type', title: 'Type', align: 'start'}, // , sortable: true },
      { key: 'fromId', title: 'Sender', align: 'start'}, // , sortable: true },
      { key: 'toId', title: 'Receiver', align: 'start'}, // , sortable: true },
      { key: 'amount', title: 'Amount', align: 'end'}, // , sortable: true },
      { key: 'fee', title: 'Fees', align: 'end'}, // , sortable: true }
    ]

    const items = computed(() => list.value.map( (m: ITransaction) => {
      // console.debug(m.Asset.id, BigInt(m.amount))
      return {
        timestamp: m.timestamp, // moment.unix(m.timestamp/1000), // .format(profile.value.dateTimeFormat),
        // timestamp: moment.unix(m.timestamp/1000), // .format(profile.value.dateTimeFormat),
        extrinsicHash: m.extrinsicHash,
        height: m.blockNumber,
        id: m.id,
        type: typeName(m.section + '.' + m.method),
        fromId: m.fromId,
        toId: m.toId,
        // amount: toCoin(wallet.value.Asset?.id || wallet.value.assetId, BigInt(m.amount)).toLocaleString('en-GB', { minimumFractionDigits: profile.value.defaultDecimals, maximumFractionDigits: profile.value.defaultDecimals }),
        amount: toCoin(m.Asset?.id || '', BigInt(m.amount)).toLocaleString('en-GB', { minimumFractionDigits: profile.value.defaultDecimals, maximumFractionDigits: profile.value.defaultDecimals }),
        fee: toCoin(m.Asset?.id || '', BigInt(m.fee)).toLocaleString('en-GB', { minimumFractionDigits: profile.value.defaultDecimals, maximumFractionDigits: profile.value.defaultDecimals })
      }
    }))

    const onUpdateItemsPerPage = (value: any) => {
      // console.debug('onUpdateItemsPerPage', value)
      itemsPerPage.value = value
    }

    const showDialog = ref(false)
    const transaction = ref<ITransaction>()
    const onShowTransaction = (evt: any, tx: any) => {
      const item = {...tx.item}
      // console.debug('evt', item)
      // console.debug('onShowTransaction', showDialog.value)
      transaction.value = list.value.find((f: ITransaction) => f.id === item.id)
      showDialog.value = true
    }
    const onDialogClosed = () => {
      showDialog.value = false
    }

    const getClass = (toId: string) => {
      // console.debug('getClass', toId, props.wallet?.address)
      return props.wallet 
        ? toId === props.wallet.address ? 'text-green' : 'text-red'
        : ''
    }

    const sortBy = ref([{ key: 'timestamp', order: 'desc' }])

    return {
      profile,
      headers,
      items,
      itemsPerPage,
      sortBy,
      toCoin,
      shortStash,
      toProfileDate,
      moment,
      onUpdateItemsPerPage,
      showDialog,
      onShowTransaction,
      transaction,
      onDialogClosed,
      getClass
    }
  },
})
</script>
