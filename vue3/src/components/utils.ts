import { useStore } from "vuex"
import { computed } from "vue"
import moment from "moment"

import { IAsset } from "./types"

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
  const assets = computed<IAsset[]>(() => JSON.parse(JSON.stringify(store.state.asset.list)))

  /**
   * 
   * @param assetId polkadot | kusama | etc
   * @param val BigInt
   * @returns value converted to coin
   */
  const toCoin = (assetId: string | undefined, val: bigint): number => {
    // console.debug('utils.toCoin()', assetId, val)
    if(!val) return 0
    const asset = assets.value.find((f: IAsset) => f.id === assetId) || { decimals: 2 }
    // console.debug(asset)
    const denom = Math.pow(10, asset.decimals)
    const result = Number(val) / denom
    // console.debug('utils.ts: toCoin()', assetId, val, denom, result)
    return result
  }

  const toProfileDate = (timestamp: number): string => {
    return moment.unix(timestamp/1000).local().format(profile.dateTimeFormat)
  }

  return {
    shortStash,
    toCoin,
    toProfileDate,
  }
}
