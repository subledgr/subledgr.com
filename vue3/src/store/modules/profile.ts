
const initialState = {
  // list: chains
  initial: true,
  dateTimeFormat: 'YYYY.MM.DD hh:mm:sss',
  itemsPerPage: 10,
  defaultCurrency: 'USD', // 'GBP', // 'EUR',
  defaultDecimals: 3
}

const profile = {
  namespaced: true,
  state: { ...initialState },
  mutations: {
    SET_PROFILE (state: any, profile: any) {
      console.debug('SET_PROFILE', profile)
      state.dateTimeFormat = profile.dateTimeFormat || state.dateTimeFormat
      state.itemsPerPage = profile.itemsPerPage || state.itemsPerPage
      state.defaultCurrency = profile.defaultCurrency || state.defaultCurrency
      state.defaultDecimals = profile.defaultDecimals || state.defaultDecimals
    }
  },
  actions: {
    async logout ({ commit }: any) {
      await commit('SET_PROFILE', { ...initialState })
    },
    async setProfile ({ commit }: any, { profile }: any) {
      console.debug('setProfile', profile)
      // commit the profile as a mutation
      await commit("SET_PROFILE", profile)
    }
  }
}

export { profile } 
