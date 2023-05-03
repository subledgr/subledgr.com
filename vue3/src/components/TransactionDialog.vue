<template>
  <v-dialog v-model="showMe">
    <v-card>
      <v-card-title>
        <CurrencyLogo :currency-code="wallet?.Currency.code || ''"></CurrencyLogo> {{ wallet?.Currency.code }} Transaction on {{ transaction?.chain }}
      </v-card-title>
      <v-container>
        <v-table class="full-width">
          <tr><td>ID</td><td>{{ transaction?.id }}</td><td></td></tr>
          <tr><td>Timestamp</td><td>{{ moment.unix((transaction?.timestamp||0)/1000).format(profile.dateTimeFormat) }}</td></tr>
          <tr><td>Block</td><td>{{ transaction?.height }}</td></tr>
          <tr><td>Module</td><td>{{ transaction?.type.split('.')[0] }}</td></tr>
          <tr><td>Method</td><td>{{ transaction?.type.split('.')[1] }}</td></tr>
          <tr v-show="transaction?.subType"><td>SubType</td><td>{{ transaction?.subType }}</td></tr>
          <tr><td>Sender</td><td>
            <ClickToCopy :display="shortStash(transaction?.senderId, 7)" :text="transaction?.senderId"></ClickToCopy>
            <!-- {{ shortStash(transaction?.senderId) }} -->
            </td>
            <td></td></tr>
          <tr v-show="transaction?.recipientId"><td>Receiver</td><td>
            <ClickToCopy :display="shortStash(transaction?.recipientId, 7)" :text="transaction?.recipientId"></ClickToCopy>
            <!-- {{ shortStash(transaction?.recipientId) }} -->
            </td>
            <td><a :href="`http://`" target="_blank" rel="noopener noreferrer"></a></td></tr>
          <tr><td>Fee Balances</td><td>{{ toCoin(wallet?.Currency.code, transaction?.feeBalances || 0n) }}</td></tr>
          <tr><td>Fee Treasury</td><td>{{ toCoin(wallet?.Currency.code, transaction?.feeTreasury || 0n) }}</td></tr>
          <tr><td>Total Fee</td><td>{{ toCoin(wallet?.Currency.code, transaction?.totalFee || 0n) }}</td></tr>
          <tr><td>Amount</td><td :class="wallet?.address === transaction?.senderId ? 'text-red' : 'text-green'">
            {{ toCoin(wallet?.Currency.code, transaction?.amount || 0n) }}
          </td></tr>
          <tr><td>Success</td><td>{{ transaction?.success }}</td></tr>
        </v-table>
      </v-container>
      <!-- {{ transaction }} -->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, watch } from 'vue'
import { useStore } from 'vuex';
import moment from 'moment';
import { IWallet, ITransaction } from './types';
import { useGlobalUtils } from './utils';
import CurrencyLogo from './CurrencyLogo.vue';
import ClickToCopy from './ClickToCopy.vue'

export default defineComponent({
  components: {
    CurrencyLogo,
    ClickToCopy
  },
  props: {
    wallet: {
      type: Object as PropType<IWallet>,
    },
    transaction: {
      type: Object as PropType<ITransaction>
    },
    showDialog: {
      type: Boolean
    }
  },
  setup(props, context) {
    const store = useStore()
    const profile = store.state.profile
    const { shortStash, toCoin } = useGlobalUtils()
    const showMe = ref(false)

    watch(() => props.showDialog, newVal => {
      console.debug('watch.showDialog()', newVal)
      showMe.value = newVal
    })

    watch(() => showMe.value, newVal => {
      if(!newVal) context.emit('dialogClose', newVal)
    })

    const closeDialog = () => {
      console.debug('closeDialog()')
      showMe.value = false
      context.emit('dialogClose', false)
    }
  
    return {
      shortStash,
      toCoin,
      moment,
      profile,
      showMe,
      closeDialog
    }
  },
})
</script>
