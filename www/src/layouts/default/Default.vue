<template>
  <v-app>
    <default-system-bar @click:toggle="drawer = !drawer" />
    <!-- <default-drawer v-model="drawer" /> -->
    <default-view />
  </v-app>
</template>

<script lang="ts" setup>
// Components
// import DefaultDrawer from './Drawer.vue'
import DefaultSystemBar from './SystemBar.vue'
import DefaultView from './View.vue'

// Utilities
import { shallowRef } from 'vue'

const drawer = shallowRef<boolean | null>(null)
</script>
