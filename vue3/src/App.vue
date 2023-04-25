<template>
  <v-theme-provider :theme="isDark ? 'dark' : 'light'">
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
    </v-app>
  </v-theme-provider>
</template>

<script lang="ts">
import { defineComponent, provide, watch } from 'vue'
import { useStore } from 'vuex'
import AppBar from './components/AppBar.vue'
import NavDrawer from './components/NavDrawer.vue'

export default defineComponent({
  name: 'App',
  components: {
    AppBar,
    NavDrawer
  },
  setup () {
    const store = useStore()
    // const { result, loading, error } = useQuery(QUERY_CURRENCIES);
    // watch(result, value => {
    //   console.log(value)
    //   store.dispatch('setCurrencies', result.Currencies)
    // })
  },
  computed: {
    showAppBar (): boolean {
      return !['/login', '/register'].includes(this.$route.path)
    }
  },
  data: (): any => {
    return {
      isDark: false,
      darkListener: {} as MediaQueryList
    }
  },
  methods: {
    onDarkChange (ev: MediaQueryListEvent | MediaQueryList) {
      console.debug(ev)
      // this.$vuetify.theme.dark = ev.matches
      this.isDark = ev.matches
    }
  },
  mounted () {
    this.darkListener = window.matchMedia('(prefers-color-scheme: dark)')
    this.onDarkChange(this.darkListener)
    this.darkListener.addEventListener('change', this.onDarkChange)
  }
})
</script>
