<template>
  <v-theme-provider :theme="isDarkMode ? 'dark' : 'light'">
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
import AppBar from './components/AppBar.vue'
import NavDrawer from './components/NavDrawer.vue'
import BottomNavigation from './components/BottomNavigation.vue'

import { QUERY_PROFILE } from './graphql/profile.gql'

export default defineComponent({
  name: 'App',
  components: {
    AppBar,
    NavDrawer,
    BottomNavigation
  },
  setup () {
    const store = useStore()
    const profile = store.state.profile
    const isDarkMode = computed(() => store.state.isDarkMode)
    const loggedIn = computed(() => store.getters.loggedIn)
    const route = useRoute()
    const showAppBar = computed(() => !['/login', '/register', '/reset', '/reset/:resetToken'].includes(route.matched[0]?.path))

    const { loading, error, onResult, refetch } = useQuery(QUERY_PROFILE)

    if (profile.initial) {
      refetch()
    }
    onResult((value) => {
      // console.debug('QUERY_PROFILE', value)
      if (value.data?.Profile !== null) {
        store.dispatch('profile/setProfile', { profile: value.data.Profile })
      }
      store.dispatch('init')
    })

    return {
      isDarkMode,
      loggedIn,
      showAppBar
    }
  },
  // computed: {
  //   showAppBar (): boolean {
  //     return !['/login', '/register', '/reset', '/reset/:resetToken'].includes(this.$route.matched[0]?.path)
  //   }
  // },
  data: (): any => {
    return {
      // isDark: false,
      darkListener: {} as MediaQueryList
    }
  },
  methods: {
    onDarkChange (ev: MediaQueryListEvent | MediaQueryList) {
      // console.debug('onDarkChange', ev)
      this.$store.dispatch('setDarkMode', ev.matches)
    }
  },
  mounted () {
    // matcher for dark mode
    this.darkListener = window.matchMedia('(prefers-color-scheme: dark)')
    // set initial value
    this.onDarkChange(this.darkListener)
    // listen for changes
    this.darkListener.addEventListener('change', this.onDarkChange)
  }
})
</script>
