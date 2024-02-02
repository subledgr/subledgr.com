<template>
  <v-theme-provider :theme="isDarkMode ? 'dark' : 'light'" with-background>
    <v-app>
      <AppBar v-if="showAppBar"></AppBar>
      <NavDrawer></NavDrawer>
      <v-main id="scroll-target">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-main>
      <BottomNavigation class="d-block d-sm-none"></BottomNavigation>
    </v-app>
  </v-theme-provider>
</template>

<script lang="ts">
import { defineComponent, provide, watch, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { useTheme } from 'vuetify'
import AppBar from './components/AppBar.vue'
import NavDrawer from './components/NavDrawer.vue'
import BottomNavigation from './components/BottomNavigation.vue'
import { useGlobalUtils } from '@/components/utils'

import { QUERY_PROFILE } from './graphql/profile.gql'

export default defineComponent({
  name: 'App',
  components: {
    AppBar,
    NavDrawer,
    BottomNavigation
  },
  setup () {
    const theme = useTheme()
    const store = useStore()
    const profile = store.state.profile
    const isDarkMode = computed(() => store.state.isDarkMode)
    const loggedIn = computed(() => store.getters.loggedIn)
    const route = useRoute()
    const { handleError } = useGlobalUtils()
    const showAppBar = computed(() => !['/login', '/register', '/reset', '/reset/:resetToken'].includes(route.matched[0]?.path))

    const { loading, error, onResult, refetch, onError } = useQuery(QUERY_PROFILE)

    onError((error: any) => {
      // console.error(error)
      // handleError(error)
    })

    if (profile.initial && loggedIn.value) {
      refetch()
    }
    onResult((result) => {
      // console.debug('QUERY_PROFILE', result)
      if (result.data?.Profile) {
        store.dispatch('profile/setProfile', { profile: result.data.Profile })
      }
      store.dispatch('init')
    })

    var darkListener = window.matchMedia('(prefers-color-scheme: dark)')
    const onDarkChange = (ev: MediaQueryListEvent | MediaQueryList) => {
      // console.debug('onDarkChange', ev)
      console.debug('onDarkChange', ev.matches)
      theme.global.name.value = ev.matches ? 'dark' : 'light'
      store.dispatch('setDarkMode', ev.matches)
    }

    onBeforeMount(() => {
      onDarkChange(darkListener)
      darkListener.addEventListener('change', onDarkChange)
      // matcher for dark mode
      darkListener = window.matchMedia('(prefers-color-scheme: dark)')
      // set initial value
      onDarkChange(darkListener)
      // listen for changes
      darkListener.addEventListener('change', onDarkChange)
    })

    return {
      isDarkMode,
      loggedIn,
      showAppBar
    }
  }
})
</script>
