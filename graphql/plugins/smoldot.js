import axios from 'axios'
import * as smoldot from '@substrate/smoldot-light'

const chainSpec = {
  polkadot: 'https://github.com/paritytech/polkadot/raw/master/node/service/chain-specs/polkadot.json',
  kusama: 'https://github.com/paritytech/polkadot/raw/master/node/service/chain-specs/kusama.json',
  westend: 'https://github.com/paritytech/polkadot/raw/master/node/service/chain-specs/westend.json'
}

export default {

  async serverWillStart () {
    // using smoldot
    const client = smoldot.start()
    var ret, chainSpec

    ret = await axios.get(chainSpec.polkadot)
    console.log(ret)
    chainSpec = ret.data
    const polkadot = client.addChain({ chainSpec })
  
    ret = await axios.get(chainSpec.kusama)
    console.log(ret)
    chainSpec = ret.data
    const kusama = client.addChain({ chainSpec })


    return {
      polkadot,
      kusama,
    }
  }

}
