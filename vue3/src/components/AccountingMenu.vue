<template>

  <v-btn elevation="0">
    <v-icon small>mdi-scale-unbalanced</v-icon>
    <span class="text-none d-none d-sm-block">&nbsp;Accounting</span>

    <v-menu
      right
      bottom
      offset-y
      activator="parent"
      >

      <v-list dense>
        <v-list-item to="/bank">
          <v-icon small>mdi-bank</v-icon>&nbsp;Bank
        </v-list-item>
        <v-list-item to="/account">
          <v-icon small>mdi-wallet</v-icon>&nbsp;Accounts
        </v-list-item>
        <v-list-item to="/asset">
          <v-icon small>mdi-cash-multiple</v-icon>&nbsp;Assets
        </v-list-item>

        <v-divider></v-divider>
        <v-list-item to="/general-ledger/chart-of-accounts">
          <v-icon small>mdi-book</v-icon>&nbsp;Chart of Accounts
        </v-list-item>

      </v-list>
    </v-menu>

  </v-btn>

</template>

<script lang="ts">
import { defineComponent }from 'vue'
export default defineComponent({
  name: 'MainMenu',
  components: {}
})
</script>
