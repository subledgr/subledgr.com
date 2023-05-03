<template>
  <v-infinite-scroll :height="300" :items="items" :onLoad="load">
    <template v-for="(tx, idx) in items" v-bind:key="idx">
      <v-list-item >
        <v-list-item-title>{{ tx.type }} / {{ tx.subType }}</v-list-item-title>
        <!-- {{ tx }} -->
        <v-row>
          <v-col>Amount: {{ toCoin(wallet2?.Currency.code, tx.amount) }}</v-col>
          <v-col>Fee: {{ toCoin(wallet2?.Currency.code, tx.totalFee) }}</v-col>
        </v-row>
      </v-list-item>

    </template>
  </v-infinite-scroll>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref } from 'vue'
import { IWallet, IWalletData, ICurrency, ITransaction } from './types'
import { useGlobalUtils } from './utils'

export default defineComponent({
  props: {
    list: {
      type: Object as PropType<ITransaction[]>,
      required: true
    },
    wallet: {
      type: Object as PropType<IWallet>,
    },
  },
  setup(props) {
    const { toCoin } = useGlobalUtils()
    const wallet2 = computed<IWallet>(() => props.wallet || { address: '', Currency: {} } as IWallet)
    const list = computed<ITransaction[]>(() => props.list)
    const items = ref<ITransaction[]>([])
    var marker = 0
    var pageSize = 25

    const load = (evt: any) => {
      console.debug('load()', marker, pageSize, evt)
      const { done } = evt
      items.value.push(...list.value?.slice(marker, pageSize))
      marker += pageSize
      done('ok')
    }

    // load()

    return {
      toCoin,
      load,
      wallet2,
      items
    }
  },
})
</script>
