import { IBlockchain } from '@/components/types'

interface IState {
  list: IBlockchain[]
}

const chains: IBlockchain[] = [
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', decimals: 10, logo: 'images/logos/chains/polkadot.svg' },
  { id: 'asset-hub-polkadot', name: 'Asset Hub Polkadot', symbol: 'DOT', decimals: 10, logo: 'images/logos/chains/asset-hub-polkadot.png' },

  { id: 'kusama', name: 'Kusama', symbol: 'KSM', decimals: 12, logo: 'images/logos/chains/kusama.svg' },
  { id: 'asset-hub-kusama', name: 'Asset Hub Kusama', symbol: 'KSM', decimals: 12, logo: 'images/logos/chains/asset-hub-kusama.svg' },

  { id: 'westend', name: 'Westend', symbol: 'WND', decimals: 12, logo: 'images/logos/chains/westend.svg' },
]

const blockchain = {
  namespaced: true,
  state: {
    list: chains
  },
  mutations: {
    SET_LIST (state: IState, value: IBlockchain[]) {
      state.list = value
    },
  },
  actions: {
    setChains ({ commit }: any, list: IBlockchain[]) {
      commit('SET_LIST', list)
    },
  }
}

export { blockchain } 
