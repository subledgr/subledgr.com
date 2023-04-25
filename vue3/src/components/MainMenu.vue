<template>
  <v-btn elevation="0">
    Company Ltd<v-icon>mdi-chevron-down</v-icon>
    <v-menu
      activator="parent"
      right
      bottom
      offset-y
      >
      <NavList></NavList>
    </v-menu>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavList from './NavList.vue'

export default defineComponent({
  name: 'MainMenu',
  components: {
    NavList
  }
})
</script>
