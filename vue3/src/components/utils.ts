
export function shortStash (stash: string, chars=6) {
  if (!stash) return ''
  return stash.length < chars*2
    ? stash
    : stash.substring(0, chars) + '...' + stash.slice(-chars)
}