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
      console.debug('NavDrawer2', newVal)
      xdrawer.value = newVal
    })

    watch(() => xdrawer, (newVal) => {
      console.debug('NavDrawer2', newVal.value)
      store.dispatch('setDrawer', newVal.value)
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
