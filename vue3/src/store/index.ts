// import { defineStore, StateTree } from "pinia"
import { createStore } from 'vuex'
import { currency } from './modules/currency'
import { profile } from './modules/profile'
import { transaction } from './modules/transaction'

const key = 'subledgr'

interface IState {
  drawer: boolean
  id: string | null
  email: string | null
  token: string | null
  currencies: any[]
}

const saveStore = function(key: string, data: IState) {
  localStorage.setItem(key, JSON.stringify(data))
}

const getStore = function (key: string): IState {
  var store = localStorage.getItem(key)
  if (store) {
    return JSON.parse(store)
  } else {
    return {
      drawer: false,
      id: null,
      email: null,
      token: null,
      currencies: []
    } as IState
  }
}

export const store = createStore({
  state: getStore(key),
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
    logout ({ commit }) {
      commit('LOGOUT')
    },
  },
  modules: {
    currency,
    profile,
    transaction
  }
})
