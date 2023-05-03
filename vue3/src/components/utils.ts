import { useStore } from "vuex"
import { computed } from "vue"
// const currencies = store

import { ICurrency } from "./types"

export function shortStash (stash: string | undefined, chars=6) {
  if (!stash) return ''
  return stash.length < chars*2
    ? stash
    : stash.substring(0, chars) + '...' + stash.slice(-chars)
}

export function useGlobalUtils () {
  const store = useStore()
  const profile = store.state.profile
  const transactionState = store.state.transaction
  const currencies = computed<ICurrency[]>(() => JSON.parse(JSON.stringify(store.state.currency.list)))

  const toCoin = (currencyCode: string | undefined, val: bigint): number => {
    // console.debug('utils.toCoin()', currencyCode, val)
    if(!val) return 0
    const spec = currencies.value.find((f: ICurrency) => f.code === currencyCode) || { decimals: 2 }
    const denom = Math.pow(10, spec.decimals)
    return Number(val) / denom
  }

  return {
    shortStash,
    toCoin
  }
}
