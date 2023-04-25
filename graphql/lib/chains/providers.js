import { WsProvider, ApiPromise } from '@polkadot/api'
import { DockAPI } from '@docknetwork/sdk'
import axios from 'axios'
import * as smoldot from '@substrate/smoldot-light'

const chainSpec = {
  polkadot: 'https://github.com/paritytech/polkadot/raw/master/node/service/chain-specs/polkadot.json',
  kusama: 'https://github.com/paritytech/polkadot/raw/master/node/service/chain-specs/kusama.json',
  dock: 'https://raw.githubusercontent.com/docknetwork/dock-substrate/master/cspec/knox_raw.json',
  westend: 'https://github.com/paritytech/polkadot/raw/master/node/service/chain-specs/westend.json'
}

export async function createChainProviders () {
  // const dockmain = new DockAPI()
  // const dock = dockmain.api
  // dock.connect()
  // const polkadotProvider = new WsProvider('wss://rpc.ibp.network/polkadot')
  // const polkadot = await ApiPromise.create({ provider: polkadotProvider })
  // const kusamaProvider = new WsProvider('wss://rpc.ibp.network/kusama')
  // const kusama = await ApiPromise.create({ provider: kusamaProvider })

  // using smoldot
  const client = smoldot.start()
  var ret, chainSpec
  // for ([key, url] in Object.entries(chainSpec)) {
    ret = await axios.get(chainSpec.polkadot)
    console.log(ret)
    chainSpec = ret.data
    const polkadot = client.addChain({ chainSpec })
  
    ret = await axios.get(chainSpec.kusama)
    console.log(ret)
    chainSpec = ret.data
    const kusama = client.addChain({ chainSpec })
  
    ret = await axios.get(chainSpec.dock)
    console.log(ret)
    chainSpec = ret.data
    const dock = client.addChain({ chainSpec })

  return {
    polkadot,
    kusama,
    dock
  }
  
} 

