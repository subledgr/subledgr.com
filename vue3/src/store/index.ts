// import { defineStore, StateTree } from "pinia"
import { createStore } from 'vuex'
import { currency } from './modules/currency'
import { profile } from './modules/profile'
import { transaction } from './modules/transaction'
import { plausible } from './modules/plausible'

const key = 'subledgr'

interface IState {
  initial: boolean
  drawer: boolean
  id: string | null
  email: string | null
  token: string | null
  currencies: any[]
}

const saveStore = function(key: string, data: IState) {
  localStorage.setItem(key, JSON.stringify(data))
}

const getStoreState = function (key: string): IState {
  const store = localStorage.getItem(key)
  if (store) {
    return JSON.parse(store)
  } else {
    return {
      initial: true,
      drawer: false,
      id: null,
      email: null,
      token: null,
      currencies: []
    } as IState
  }
}

export const store = createStore({
  state: getStoreState(key),
  getters: {
    loggedIn (state: IState) {
      return state.token !== null
    },
    user ( state: IState) {
      const { id, email } = state
      return { email, id }
    }
  },
  mutations: {
    INIT (state) {
      state.initial = false
    },
    SET_DRAWER (state, value) {
      state.drawer = value
    },
    SET_CURRENCIES (state, value) {
      state.currencies = value
    },
    LOGIN(state, {email, id, token}) {
      console.debug('store.js: LOGIN', email, id, token)
      state.email = email
      state.id = id
      state.token = token
      saveStore(key, state)
    },
    LOGOUT (state) {
      state.email = null
      state.id = null
      state.token = null
      state.currencies = []
      saveStore(key, state)
    }
  },
  actions: {
    init: ({ state, dispatch }) => {
      // dispatch('profile/init', null, { root: true })
      // dispatch('INIT')
    },
    setDrawer ({ commit }, value) {
      console.debug('setDrawer()', value)
      commit('SET_DRAWER', value)
    },
    setCurrencies ({ commit }, currencies) {
      commit('SET_CURRENCIES', currencies)
    },
    login ({ commit }, {email, id, token}: any) {
      commit('LOGIN', { email, id, token })
    },
    logout ({ commit, dispatch }) {
      commit('LOGOUT')
      dispatch('profile/logout')
    },
  },
  modules: {
    currency: currency,
    profile,
    transaction,
    plausible
  }
})
