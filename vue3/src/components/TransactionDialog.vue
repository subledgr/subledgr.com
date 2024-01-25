<template>
  <v-dialog v-model="showMe">
    <v-card>
      <v-card-title>
        <AssetLogo :asset-id="transaction?.Asset.id || ''"></AssetLogo> {{ transaction?.Asset.name || '' }} Transaction
         <!-- on {{ transaction?.chainId }} -->
      </v-card-title>
      <v-container>
        <v-table class="full-width">
          <tr><td>Block</td><td>{{ transaction?.blockNumber }}</td></tr>
          <!-- <tr><td>ExtrinsicH</td><td>{{ transaction?.extrinsicHash}}</td><td></td></tr> -->
          <tr><td>Extrinsic</td><td>
            <a :href="`https://${transaction?.Asset.id}.subscan.io/extrinsic/${transaction?.extrinsicHash}`" target="_blank">{{ getExtrinsic() }}</a>
          </td><td></td></tr>
          <!-- <tr><td>Event</td><td>{{ transaction?.extrinsicId }}</td></tr> -->
          <tr><td>Event</td><td>
            {{ getEvent() }}
            <!-- <a :href="`https://${transaction?.Asset.id}.subscan.io/event/${ getEvent() }`" target="_blank">{{ getEvent() }}</a> -->
          </td><td></td></tr>
          <tr><td>Timestamp</td><td>{{ toProfileDate(transaction?.timestamp||0) }} ({{ moment.unix((transaction?.timestamp||0)/1000).fromNow() }})</td></tr>
          <tr><td>Module</td><td>{{ transaction?.section }}</td></tr>
          <tr><td>Method</td><td>{{ transaction?.method }}</td></tr>
          <!-- <tr v-show="transaction?.subType"><td>SubType</td><td>{{ transaction?.subType }}</td></tr> -->
          <tr><td>Sender</td><td>
            <ClickToCopy :display="shortStash(transaction?.fromId, 7)" :text="transaction?.fromId"></ClickToCopy>
            <!-- {{ shortStash(transaction?.senderId) }} -->
            </td>
            <td></td></tr>
          <tr v-show="transaction?.toId"><td>Receiver</td><td>
            <ClickToCopy :display="shortStash(transaction?.toId, 7)" :text="transaction?.toId"></ClickToCopy>
            <!-- {{ shortStash(transaction?.recipientId) }} -->
            </td>
            <td><a :href="`http://`" target="_blank" rel="noopener noreferrer"></a></td></tr>
          <!-- <tr><td>Fee Balances</td><td>{{ toCoin(account?.Asset.id || assetId, transaction?.feeBalances || 0n) }}</td></tr>
          <tr><td>Fee Treasury</td><td>{{ toCoin(account?.Asset.id || assetId, transaction?.feeTreasury || 0n) }}</td></tr> -->
          <tr><td>Total Fee</td><td>{{ toCoin(account?.Asset.id, transaction?.fee || 0n) }}</td></tr>
          <tr><td>Amount</td><td :class="account?.address === transaction?.fromId ? 'text-red' : 'text-green'">
            {{ toCoin(transaction?.Asset.id || '', transaction?.amount || 0n) }}
          </td></tr>
          <!-- <tr><td>Success</td><td>{{ transaction?.success }}</td></tr> -->
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
import { IAccount, ITransaction } from './types';
import { useGlobalUtils } from './utils';
import AssetLogo from './AssetLogo.vue';
import ClickToCopy from './ClickToCopy.vue'

export default defineComponent({
  components: {
    AssetLogo,
    ClickToCopy
  },
  props: {
    account: {
      type: Object as PropType<IAccount>,
      required: false
    },
    // assetId: {
    //   type: String,
    //   required: false,
    // },
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
    const { shortStash, toCoin, toProfileDate } = useGlobalUtils()
    const showMe = ref(false)

    watch(() => props.showDialog, newVal => {
      // console.debug('watch.showDialog()', newVal)
      // console.debug('watch.showDialog()', props.transaction)
      showMe.value = newVal
    })

    watch(() => showMe.value, newVal => {
      if(!newVal) context.emit('dialogClose', newVal)
    })

    const closeDialog = () => {
      // console.debug('closeDialog()')
      showMe.value = false
      context.emit('dialogClose', false)
    }

    const getEvent = () => {
      const parts = props.transaction?.id.split('-') || []
      // console.debug('getEvent',  `${ parts[0] }-${ parts[2] }`)
      return `${ BigInt(parts[0]) }-${ BigInt(parts[2]) }`
    }

    const getExtrinsic = () => {
      // return props.transaction?.id.split('_')[0]
      const parts = props.transaction?.extrinsicId.split('-') || []
      // console.debug('getExtrinsic',  `${ parts[0] }-${ parts[2] }`)
      return `${ BigInt(parts[0]) }-${ BigInt(parts[2]) }`
    } 
  
    return {
      shortStash,
      toCoin,
      toProfileDate,
      moment,
      profile,
      showMe,
      closeDialog,
      getExtrinsic,
      getEvent
    }
  },
})
</script>
