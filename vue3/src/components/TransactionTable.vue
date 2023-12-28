<template>
  <v-table>
    <!-- {{ wallet }} -->
    <thead>
      <th>Date</th>
      <th>Block</th>
      <th>Type</th>
      <!-- <th>SubType</th> -->
      <!-- <th>Event</th> -->
      <th>Sender/Recipient</th>
      <th>Amount</th>
      <th>Fee</th>
      <th>Success</th>
    </thead>
    <tbody>
      <tr v-for="(tx, idx) in list" v-bind:key="idx">
        <!-- {{ tx }} -->
        <td>
          {{ moment.unix(tx.timestamp / 1000).format('DD.MM.YYYY HH:mm') }} 
          <!-- <br>{{ tx.timestamp }} -->
        </td>
        <td>{{ tx.height }}</td>
        <td>{{ tx.type }}</td>
        <!-- <td>{{ tx.subType }}</td> -->
        <!-- <td>{{ tx.event }}</td> -->
        <td>
          {{ shortStash(tx.senderId) }}<br>{{ shortStash(tx.recipientId) }}
        </td>
        <td class="text-right">{{ toCoin(wallet?.Asset?.id, tx.recipientId === wallet?.address ? tx.amount : -tx.amount) }}</td>
        <td class="text-right">{{ toCoin(wallet?.Asset?.id, tx.totalFee) }}</td>
        <td>{{ tx.success }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, watch } from 'vue'
import { useStore } from 'vuex'
import { IWallet, IWalletData, IAsset, ITransaction } from './types'
import { shortStash } from './utils'
import moment from 'moment'

export default defineComponent({
  props: {
    list: {
      type: Object as PropType<ITransaction[]>
    },
    wallet: {
      type: Object as PropType<IWallet>,
    },
  },
  setup() {
    const store = useStore()
    // const wallet = computed(() => props.wallet)
    // watch(() => wallet, newVal => { console.debug('new wallet', newVal) })
    const assets = computed<IAsset[]>(() => JSON.parse(JSON.stringify(store.state.asset.list)))
    const toCoin =  (currencyCode: string | undefined, val: BigInt) => {
      // const currs = {...chains.value}
      // console.debug('currs', currs)
      const spec = assets.value.find((f: IAsset) => f.code === currencyCode) || { decimals: 2 }
      // console.debug('toCoin', currencyCode, spec)
      const denom = Math.pow(10, spec.decimals)
      // console.debug('denom', denom)
      return Number(val) / denom
    }

    return {
      toCoin,
      shortStash,
      moment
    }
  },
})
</script>
