<template>
  <v-navigation-drawer
    app
    temporary
    location="right"
    disable-resize-watcher
    v-model="xdrawer">
    <NavList></NavList>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
// import { store } from '../store'
import NavList from './NavList.vue'

export default defineComponent({
  name: 'NavDrawer',
  components: {
    NavList
  },
  setup() {
    const store = useStore()
    const drawer = computed(() => store.state.drawer)
    const xdrawer = ref(false)

    watch(() => drawer.value, (newVal) => {
      // console.debug('drawer.value', newVal)
      xdrawer.value = newVal
    })

    watch(() => xdrawer.value, (newVal) => {
      // console.debug('xdrawer', newVal)
      store.dispatch('setDrawer', newVal)
    })

    return {
      store,
      drawer,
      xdrawer
    }
  },
  mounted () {
    this.xdrawer = this.drawer
  }
})
</script>
