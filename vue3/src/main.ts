/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// import router from './router'
// Plugins
import { registerPlugins } from '@/plugins'

import VueApolloComponents from '@vue/apollo-components'

const ssr = typeof window === 'undefined'
if (ssr) {
  console.log('hello from ssr')
} else {
  console.log('hello from the browser')
}

const app = createApp(App) // .use(router)

registerPlugins(app)
app.use(VueApolloComponents)
app.mount('#app')
