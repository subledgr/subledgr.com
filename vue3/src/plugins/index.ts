/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import router from '../router'
import { store } from '../store'
import { apolloProvider } from './apollo'
import { DefaultApolloClient } from '@vue/apollo-composable'
// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  loadFonts()
  app
    .use(vuetify)
    .use(router)
    .use(store)
    // .use(apolloProvider)
    .provide(DefaultApolloClient, apolloProvider.defaultClient)
}
