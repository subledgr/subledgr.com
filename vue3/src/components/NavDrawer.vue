<template>
  <v-navigation-drawer
    app
    temporary
    right
    disable-resize-watcher
    v-model="xdrawer">
    <NavList></NavList>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
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
    const drawer = store.state.drawer
    const xdrawer = ref(false)

    watch(() => drawer, (newVal) => {
      console.debug('NavDrawer2', newVal)
      xdrawer.value = newVal
    })

    watch(() => xdrawer, (newVal) => {
      console.debug('NavDrawer2', newVal)
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
