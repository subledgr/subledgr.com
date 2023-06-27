<template>
  <v-list>
    <v-list-item>Company Limited & Logo</v-list-item>
    <v-list-item @click="navTo('/dashboard')"><v-icon small>mdi-view-dashboard-outline</v-icon>&nbsp;Dashboard</v-list-item>
    <v-list-item @click="navTo('/portfolio')"><v-icon small>mdi-folder-pound-outline</v-icon>&nbsp;Portfolios</v-list-item>
    <v-list-item @click="navTo('/asset')"><v-icon small>mdi-cash</v-icon>&nbsp;Assets</v-list-item>
    <v-list-item @click="navTo('/wallet')"><v-icon small>mdi-wallet-outline</v-icon>&nbsp;Wallets</v-list-item>
    <v-divider></v-divider>
    <v-list-item @click="navTo('/settings')"><v-icon small>mdi-cogs</v-icon>&nbsp;Settings</v-list-item>
    <!-- <v-list-item>Subscription</v-list-item> -->
    <!-- <v-list-item>Subscription</v-list-item> -->
    <v-list-item
      v-for="n in 5"
      :key="n"
      @click="() => {}"
    >
      <v-list-item-title>Option {{ n }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const store = useStore()
    const router = useRouter()
    const navTo = (path: string) => {
      console.log('navTo', path)
      store.dispatch('setDrawer', false)
      router.push(path)
    }
    return {
      navTo
    }
  }
})
</script>
