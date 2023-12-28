
interface ICurrency {
  code: string
  name: string
  symbol: string
  decimals: number
  logo: string
}

interface IState {
  list: ICurrency[]
}

const currencies: ICurrency[] = [
  { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2, logo: ''},
  { code: 'GBP', name: 'British Pound', symbol: '£', decimals: 2, logo: '' },
  { code: 'USD', name: 'US Dollar', symbol: '$', decimals: 2, logo: '' },
]

const currency = {
  namespaced: true,
  state: {
    list: currencies
  },
  mutations: {
    SET_LIST (state: IState, value: ICurrency[]) {
      state.list = value
    },
  },
  actions: {
    setCurrencies ({ commit }: any, list: ICurrency[]) {
      commit('SET_LIST', list)
    },
  }
}

export { currency } 
