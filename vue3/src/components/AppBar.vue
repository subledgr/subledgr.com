<template>
  <v-app-bar
    app
    dense
    fixed
    elevate-on-scroll
    color="deep-purple accent-4"
    dark
    scroll-target="#scroll-target"
    >
    <template v-slot:prepend>
    </template>

    <v-app-bar-title style="cursor: pointer;" @click="navTo('/')">
      <v-avatar class="rounded-circle" >
        <!-- <v-img color="white" src="/logo.png" width="24px" height="24px"></v-img> -->
        <v-icon color="white">mdi-alpha-s-circle-outline</v-icon>
      </v-avatar>

      Subledgr
    </v-app-bar-title>

    <v-spacer class="d-none d-md-inline"></v-spacer>

    <v-toolbar-items class="d-none d-sm-flex">
      <!-- <v-tabs>
        <v-tab
          v-for="(item, index) in items"
          :key="index"
          :to="item.to"
          :exact="item.exact"
        >
          <v-icon :icon="item.icon"></v-icon>
          <span class="d-none d-sm-inline">&nbsp;{{ item.text }}</span>
        </v-tab>
      </v-tabs> -->
      <v-btn :class="$route.fullPath==='/dashboard' ? 'active' : ''" text tile @click="navTo('/dashboard')">
        <v-icon size="small" class="d-none d-sm-inline">mdi-view-dashboard-outline</v-icon>
        <v-icon size="x-large" class="d-inline d-sm-none">mdi-view-dashboard-outline</v-icon>
        <span class="d-none d-sm-inline">&nbsp;Dashboard</span>
      </v-btn>

      <v-btn text tile @click="navTo('/portfolio')">
        <v-icon size="small" class="d-none d-sm-inline">mdi-folder-pound-outline</v-icon>
        <v-icon size="x-large" class="d-inline d-sm-none">mdi-folder-pound-outline</v-icon>
        <span class="d-none d-sm-inline">&nbsp;Portfolio</span>
      </v-btn>

      <v-btn text tile @click="navTo('/asset')">
        <v-icon size="small" class="d-none d-sm-inline">mdi-cash</v-icon>
        <v-icon size="x-large" class="d-inline d-sm-none">mdi-cash</v-icon>
        <span class="d-none d-sm-inline">&nbsp;Asset</span>
      </v-btn>

      <v-btn @click="navTo('/wallet')">
        <v-icon size="small" class="d-none d-sm-inline">mdi-wallet-outline</v-icon>
        <v-icon size="x-large" class="d-inline d-sm-none">mdi-wallet-outline</v-icon>
        <span class="d-none d-sm-inline">&nbsp;Wallet</span>
      </v-btn>

      <!-- <MainMenu></MainMenu> -->
      <!-- <AccountingMenu></AccountingMenu> -->
    </v-toolbar-items>

    <v-spacer class="d-none d-md-inline"></v-spacer>

    <template v-slot:append>
      <v-app-bar-nav-icon @click="toggleDrawer()"></v-app-bar-nav-icon>
      <!-- <v-btn icon>
        <v-icon small>mdi-plus</v-icon>
      </v-btn> -->
      <!-- <v-btn icon>
        <v-icon small>mdi-bell-outline</v-icon>
      </v-btn> -->
      <v-btn icon v-show="!loggedIn" to="/login">
        <v-icon small>mdi-login</v-icon>
      </v-btn>
      <!-- <v-btn icon v-show="loggedIn">
        <v-icon small>mdi-magnify</v-icon>
      </v-btn> -->
      <UserMenu></UserMenu>
    </template>

  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
// import { store } from '../store'
import { useStore } from 'vuex'
import MainMenu from './MainMenu.vue'
import AccountingMenu from './AccountingMenu.vue'
import UserMenu from './UserMenu.vue'

export default defineComponent({
  name: 'AppBar',
  components: {
    MainMenu,
    AccountingMenu,
    UserMenu
  },
  setup () {
    const store = useStore()
    const drawer = computed(() => store.state.drawer);
    const loggedIn = computed(() => store.getters.loggedIn);

    const activeTab = null
    const items = [
      { text: "Dashboard", icon: 'mdi-view-dashboard-outline', to: '/dashboard', exact: false },
      { text: "Portfolio", icon: 'mdi-folder-pound-outline', to: "/portfolio", exact: false },
      { text: "Asset", icon: 'mdi-cash', to: "/asset", exact: false },
      { text: "Wallet", icon: 'mdi-wallet-outline', to: "/wallet", exact: false },
    ]

    return {
      store,
      loggedIn,
      drawer,
      activeTab,
      items
    }
  },
  watch: {
    tab (val) { console.debug('tab:', val) }
  },
  data () {
    return {
      tab: ''
    }
  },
  methods: {
    toggleDrawer () {
      this.store.dispatch('setDrawer', !this.drawer)
    },
    navTo (route: string): void {
      this.$router.push(route)
    }
  }
})
</script>
