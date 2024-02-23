import { ApiPromise, WsProvider } from '@polkadot/api'

export class ApiConnectionPool {

  constructor(rpcUrlBase='wss://rpc.metaspan.io', rpcOverride={
    // 'dock': 'wss://mainnet-node.dock.io',
    'acala': 'wss://acala-rpc.dwellir.com'
  }) {
    this.rpcUrlBase = rpcUrlBase
    this.rpcOverride = rpcOverride
    this.pool = {}
    this.timestamps = {}

    // every 20 seconds, log the pool
    setInterval(() => {
      console.log('api pool', Object.keys(this.pool))
    }, 20_000)

    // every 20 seconds, close unused connections
    setInterval(() => {
      for (var chainId in this.pool) {
        if (this.timestamps.hasOwnProperty(chainId) && this.timestamps[chainId] < Date.now() - 60_000) {
          console.log(`api: closing connection for ${chainId}`)
          this.pool[chainId].disconnect()
          delete this.pool[chainId]
          delete this.timestamps[chainId]
        } else {
          console.log(`api: keeping connection for ${chainId}`)
        }
      }
    }, 20_000)
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
    this.timestamps[chainId] = Date.now()
    await api.isReady
    return api
  }

  // set(chainId, api) {
  //   this.pool[chainId] = api
  // }

}
