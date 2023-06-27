<template>
  <v-list>
    <v-list-item v-for="(tx, idx) in list2" v-bind:key="idx" @click="onShowTransaction(tx)">
      <!-- <template v-slot:prepend>
        <v-avatar size="small" color="grey-lighten-2">
          <v-icon :color="tx.amount ? 'green' : 'red'" :icon="tx.amount ? 'mdi-plus' : 'mdi-minus'"></v-icon>
        </v-avatar>
      </template> -->
      <v-divider></v-divider>
      <v-list-item-title>
        <v-row>
          <v-col align="left">
            {{ typeName(tx.type) }}<span v-if="tx.type==='utility.batch'"> ({{ tx.event }})</span>
          </v-col>
          <v-col align="right" :class="tx.recipientid === wallet2.address ? 'text-green' : 'text-red'">
            {{ toCoin(wallet2?.Currency.code || currencyCode, tx.amount).toLocaleString('en-GB') }} 
            {{ wallet?.Currency.code || currencyCode }}
          </v-col>
        </v-row>
      </v-list-item-title>
      <!-- {{ tx }} -->
      <v-list-item-subtitle>
        <v-row>
          <v-col align="left">
            <!-- {{ moment.unix(tx.timestamp/1000).format(profile.dateTimeFormat) }} -->
            {{ moment.unix(tx.timestamp/1000).fromNow() }}
          </v-col>
          <v-col>#{{ tx.height }}</v-col>
          <v-col cols="5" align="right">Fee: {{ toCoin(wallet2?.Currency.code || currencyCode, tx.totalFee) }}</v-col>
        </v-row>
      </v-list-item-subtitle>
      <!-- <template v-slot:append>
        <v-btn icon size="small" elevation="0">
          <v-icon>mdi-dots-vertical</v-icon>
          <v-menu activator="parent">         
            <v-list>
              <v-list-item>
                <a :href="`https://kusama.subscan.io/block/${tx.height}`" target="_blank" rel="noopener noreferrer">
                  <v-img height="22" src="/images/logos/external/subscan.png"></v-img>
                </a>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </template> -->

    </v-list-item>
    <transaction-dialog :transaction="transaction" :wallet="wallet" :currencyCode="currencyCode" :showDialog="showDialog" @dialogClose="onDialogClosed"></transaction-dialog>
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
    currencyCode: {
      type: String,
      default: 'USD'
    },
    wallet: {
      type: Object as PropType<IWallet>,
    },
  },
  setup(props) {
    const store = useStore()
    const profile = store.state.profile
    const transactionState = store.state.transaction

    const { toCoin } = useGlobalUtils()
    const wallet2 = computed<IWallet>(() => props.wallet || { address: '', Currency: {} } as IWallet)
    const list2 = computed<ITransaction[]>(() => props.list || [])

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

    return {
      moment,
      profile,
      toCoin,
      typeName,
      wallet2,
      list2,
      transaction,
      onShowTransaction,
      showDialog,
      onDialogClosed
    }
  },
})
</script>
