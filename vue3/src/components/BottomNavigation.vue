<template>
  <v-bottom-navigation>
    <v-toolbar color="deep-purple accent-4">
      <v-spacer></v-spacer>

      <v-btn :class="$route.fullPath==='/dashboard' ? 'active' : ''" text tile @click="navTo('/dashboard')">
        <v-icon size="small" class="d-none d-sm-inline">mdi-view-dashboard-outline</v-icon>
        <v-icon size="large" class="d-inline d-sm-none">mdi-view-dashboard-outline</v-icon>
        <!-- <span class="d-none d-sm-inline">&nbsp;Dashboard</span> -->
      </v-btn>

      <v-btn text tile @click="navTo('/portfolio')">
        <v-icon size="small" class="d-none d-sm-inline">mdi-folder-pound-outline</v-icon>
        <v-icon size="large" class="d-inline d-sm-none">mdi-folder-pound-outline</v-icon>
        <!-- <span class="d-none d-sm-inline">&nbsp;Portfolio</span> -->
      </v-btn>

      <v-btn text tile @click="navTo('/asset')">
        <v-icon size="small" class="d-none d-sm-inline">mdi-cash</v-icon>
        <v-icon size="large" class="d-inline d-sm-none">mdi-cash</v-icon>
        <!-- <span class="d-none d-sm-inline">&nbsp;Asset</span> -->
      </v-btn>

      <v-btn @click="navTo('/wallet')">
        <v-icon size="small" class="d-none d-sm-inline">mdi-wallet-outline</v-icon>
        <v-icon size="large" class="d-inline d-sm-none">mdi-wallet-outline</v-icon>
        <!-- <span class="d-none d-sm-inline">&nbsp;Wallet</span> -->
      </v-btn>

      <v-spacer></v-spacer>
    </v-toolbar>
  </v-bottom-navigation>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    
  },
  methods: {
    // toggleDrawer () {
    //   this.store.dispatch('setDrawer', !this.drawer)
    // },
    navTo (route: string): void {
      this.$router.push(route)
    }
  }
})
</script>
