<template>
  <v-list :loading="loading">
    <v-list-item v-for="(tx, idx) in list" v-bind:key="idx" @click="onShowTransaction(tx)">
      <!-- <template v-slot:prepend>
        <v-avatar size="small" color="grey-lighten-2">
          <v-icon :color="tx.amount ? 'green' : 'red'" :icon="tx.amount ? 'mdi-plus' : 'mdi-minus'"></v-icon>
        </v-avatar>
      </template> -->
      <v-divider></v-divider>
      <v-list-item-title>
        <v-row>
          <v-col align="left">
            {{ typeName(`${ tx.section }.${ tx.method }`) }}
            <!-- {{ tx.section }}.{{ tx.method }} -->
            <!-- <span v-if="tx.type==='utility.batch'"> ({{ tx.event }})</span> -->
          </v-col>
          <v-col align="right" :class="tx.toId === wallet?.address ? 'text-green' : tx.fromId === wallet?.address ? 'text-red' : 'text-grey'">
            {{ toCoin(tx?.Asset?.id, tx.amount).toLocaleString('en-GB') }}
            {{ tx?.Asset?.code }}
          </v-col>
        </v-row>
      </v-list-item-title>
      <!-- {{ tx }} -->
      <v-list-item-subtitle>
        <v-row>
          <v-col align="left">
            <!-- {{ moment.unix(tx.timestamp/1000).format(profile.dateTimeFormat) }} -->
            <!-- {{ moment.unix(tx.timestamp/1000).fromNow() }} -->
            {{ toProfileDate(tx.timestamp) }}
          </v-col>
          <v-col>#{{ tx.blockNumber }}</v-col>
          <v-col cols="5" align="right">Fee: {{ toCoin(tx?.Asset.id || currency.code, tx.fee) }}</v-col>
        </v-row>
      </v-list-item-subtitle>

    </v-list-item>
    <transaction-dialog :transaction="transaction" :wallet="wallet" :showDialog="showDialog" @dialogClose="onDialogClosed"></transaction-dialog>
  </v-list>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { IWallet, IWalletData, ICurrency, ITransaction } from './types'
import TransactionDialog from './TransactionDialog.vue'
import { useGlobalUtils } from './utils'
import moment from 'moment'

export default defineComponent({
  components: {
    TransactionDialog
  },
  props: {
    list: {
      type: Object as PropType<ITransaction[]>
    },
    loading: {
      type: Boolean,
      default: false
    },
    wallet: {
      type: Object as PropType<IWallet>,
      required: false
    },
    // get this from transaction.Asset.id
    // assetId: {
    //   type: String,
    //   required: false
    // }
  },
  setup(props) {
    const store = useStore()
    const profile = store.state.profile
    const currency = computed(() => store.state.currency.list.find((c: ICurrency) => c.code === profile.defaultCurrency))
    const transactionState = store.state.transaction
    // const assetId = ref('')

    const { toCoin, toProfileDate } = useGlobalUtils()
    // const wallet2 = computed<IWallet>(() => props.wallet || { address: '', Currency: {} } as IWallet)
    // const list2 = computed<ITransaction[]>(() => props.list || [])

    const typeName = (_type: string) => {
      var [module, method] = _type.split('.')
      module = module.charAt(0).toLowerCase()+module.slice(1)
      method = method.charAt(0).toLowerCase()+method.slice(1)
      var name = transactionState.types[`${module}.${method}`]
      if (!name || name === '') {
        const parts = _type.split('.')
        console.debug('typeName', module, method, _type, name)
        console.debug('parts', parts)
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

    return {
      moment,
      profile,
      currency,
      toCoin,
      toProfileDate,
      typeName,
      // wallet2,
      // list2,
      transaction,
      onShowTransaction,
      showDialog,
      onDialogClosed
    }
  },
})
</script>
