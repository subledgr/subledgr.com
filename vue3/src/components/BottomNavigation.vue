<template>
  <v-bottom-navigation
    elevation="1"
    :active="showMe"
    :style="`background: ${theme.current.value.colors.background}`"
    grow>
    <v-toolbar elevation=2 :style="`background: ${theme.current.value.colors.background}`">
      <v-spacer></v-spacer>

      <v-btn :class="$route.fullPath==='/dashboard' ? 'active' : ''" tile @click="navTo('/dashboard')">
        <v-icon size="small" class="d-none d-sm-inline">mdi-view-dashboard-outline</v-icon>
        <v-icon size="large" class="d-inline d-sm-none">mdi-view-dashboard-outline</v-icon>
        <!-- <span class="d-none d-sm-inline">&nbsp;Dashboard</span> -->
      </v-btn>
      <v-spacer></v-spacer>

      <v-btn tile @click="navTo('/portfolio')">
        <v-icon size="small" class="d-none d-sm-inline">mdi-folder-pound-outline</v-icon>
        <v-icon size="large" class="d-inline d-sm-none">mdi-folder-pound-outline</v-icon>
        <!-- <span class="d-none d-sm-inline">&nbsp;Portfolio</span> -->
      </v-btn>

      <v-spacer></v-spacer>
      <v-btn tile @click="navTo('/asset')">
        <v-icon size="small" class="d-none d-sm-inline">mdi-cash</v-icon>
        <v-icon size="large" class="d-inline d-sm-none">mdi-cash</v-icon>
        <!-- <span class="d-none d-sm-inline">&nbsp;Asset</span> -->
      </v-btn>

      <v-spacer></v-spacer>
      <v-btn @click="navTo('/account')">
        <v-icon size="small" class="d-none d-sm-inline">mdi-wallet-outline</v-icon>
        <v-icon size="large" class="d-inline d-sm-none">mdi-wallet-outline</v-icon>
        <!-- <span class="d-none d-sm-inline">&nbsp;Account</span> -->
      </v-btn>

      <v-spacer></v-spacer>
    </v-toolbar>
  </v-bottom-navigation>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const theme = useTheme()
    const store = useStore()
    const router = useRouter()
    // const isDarkMode = computed(() => store.state.isDarkMode)
    const showMe = ref(true)

    // const debounce = (func: Function, wait: number) => {
    //   let timeout: number | undefined;
    //   return function executedFunction(...args: any[]) {
    //     const later = () => {
    //       clearTimeout(timeout);
    //       func(...args);
    //     };
    //     clearTimeout(timeout);
    //     timeout = window.setTimeout(later, wait);
    //   };
    // }

    // var scrollMarker = 0
    // const onScroll = debounce((e: Event) => {
    //   // check if the scroll is down or up
    //   var st = window.pageYOffset || document.documentElement.scrollTop; 
    //   if (st >= scrollMarker) {
    //     // downscroll code
    //     // console.debug('downscroll', st)
    //     showMe.value = true
    //     // setVisibility(false)
    //   } else if (st < scrollMarker) {
    //     // upscroll code
    //     showMe.value = false
    //     // setVisibility(true)
    //   } // else was horizontal scroll
    //   scrollMarker = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    //   // console.debug('catchScroll', e)
    //   // handleScroll(e)
    // }, 25)

    // const setVisibility = debounce((show: boolean) => {
    //   showMe.value = show
    // }, 100)

    // var timeout: NodeJS.Timeout = setTimeout(() => {}, 0)
    // const onScroll = debounce((e: Event) => {
    //   console.debug('onScroll', e)
    //   showMe.value = true
    //   if (timeout) clearTimeout(timeout)
    //   timeout = setTimeout(() => {
    //     showMe.value = false
    //   }, 5000)
    // }, 50)

    // onBeforeMount(() => {
    //   window.addEventListener('scroll', onScroll)
    // })

    // onBeforeUnmount(() => {
    //   window.removeEventListener('scroll', onScroll)
    // })

    const navTo = (route: string) => {
      router.push(route)
    }
    return {
      theme,
      showMe,
      // isDarkMode,
      navTo
    }
  }
})
</script>
