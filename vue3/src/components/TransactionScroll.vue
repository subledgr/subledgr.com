<template>
  <v-infinite-scroll :height="300" :items="items" :onLoad="load">
    <template v-for="(tx, idx) in items" v-bind:key="idx">
      <v-list-item >
        <v-list-item-title>{{ tx.section }} / {{ tx.method }}</v-list-item-title>
        <!-- {{ tx }} -->
        <v-row>
          <v-col>Amount: {{ toCoin(wallet2?.Asset.id, tx.amount) }}</v-col>
          <v-col>Fee: {{ toCoin(wallet2?.Asset.id, tx.fee) }}</v-col>
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
      required: true
    },
  },
  setup(props) {
    const { toCoin } = useGlobalUtils()
    const wallet2 = computed<IWallet>(() => props.wallet) // || { address: '', Currency: {} } as IWallet)
    const list = computed<ITransaction[]>(() => props.list)
    const items = ref<ITransaction[]>([])
    var marker = 0
    var pageSize = 25

    const load = (evt: any) => {
      console.debug('load()', marker, pageSize, evt)
      const { done } = evt
      // eslint-disable-next-line no-unsafe-optional-chaining
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
