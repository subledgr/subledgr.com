import { ApiPromise, WsProvider } from '@polkadot/api'

export class ApiConnectionPool {

  constructor(rpcUrlBase='wss://rpc.metaspan.io', rpcOverride={
    // 'dock': 'wss://mainnet-node.dock.io',
    'acala': 'wss://acala-rpc.dwellir.com'
  }) {
    this.rpcUrlBase = rpcUrlBase
    this.rpcOverride = rpcOverride
    this.pool = {}

    // every 30 seconds, log the pool
    setTimeout(() => {
      console.log('api pool', Object.keys(this.pool))
    }, 30_000)
  }

  async get(chainId) {
    var api
    if (!this.pool.hasOwnProperty(chainId)) {
      var rpcUrl = `${this.rpcUrlBase}/${chainId}`
      if (this.rpcOverride[chainId]) rpcUrl = this.rpcOverride[chainId]
      console.debug('rpcUrl', rpcUrl)
      const provider = new WsProvider(rpcUrl, 10_000, null, 10_000)
      provider.on('error', (error) => {
        console.error('ws provider error', error)
      })
      api = await ApiPromise.create({ provider, throwOnConnect: true })
      api.on('error', (error) => {
        console.error('api error', error)
      })
      this.pool[chainId] = api
    } else {
      console.debug(`reusing api for ${chainId}`)
    }
    api = this.pool[chainId]
    await api.isReady
    return api
  }

  // set(chainId, api) {
  //   this.pool[chainId] = api
  // }

}
