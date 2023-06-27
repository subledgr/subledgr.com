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
          {{ shortStash(tx.senderId) }}<br>{{ shortStash(tx.recipientid) }}
        </td>
        <td class="text-right">{{ toCoin(wallet?.Currency?.code, tx.recipientid === wallet?.address ? tx.amount : -tx.amount) }}</td>
        <td class="text-right">{{ toCoin(wallet?.Currency?.code, tx.totalFee) }}</td>
        <td>{{ tx.success }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, watch } from 'vue'
import { useStore } from 'vuex'
import { IWallet, IWalletData, ICurrency, ITransaction } from './types'
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
    const currencies = computed<ICurrency[]>(() => JSON.parse(JSON.stringify(store.state.currency.list)))
    const toCoin =  (currencyCode: string | undefined, val: BigInt) => {
      // const currs = {...currencies.value}
      // console.debug('currs', currs)
      const spec = currencies.value.find((f: ICurrency) => f.code === currencyCode) || { decimals: 2 }
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
