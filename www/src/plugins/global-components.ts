/**
 * plugins/global-components.ts
 *
 * This file is used to register all global components
 */

// Components
import Logo from '@/components/Logo.vue'

// Types
import type { App } from 'vue'

export default function (app: App) {
  app
    .component('Logo', Logo)
}
