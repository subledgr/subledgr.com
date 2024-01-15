
const plausible = {
  namespaced: true,
  state: {
    options: {
      // see configuration section
      domain: process.env.SUBLEDGR_DOMAIN || 'app.subledgr.com',
      hashMode: true,
      trackLocalhost: true,
      apiHost: 'https://click.metaspan.io',
    }
  },
  getters: {
    options (state: any) {
      console.debug('plausible.ts: getters.options', state)
      return state.options
    }
  },
  mutations: {},
  actions: {}
}

export { plausible }
