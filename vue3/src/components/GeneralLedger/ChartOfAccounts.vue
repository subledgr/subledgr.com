<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
Chart of accounts
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ChartOfAccounts',
  data () {
    return {
      breadcrumbs: [
        { text: 'General Ledger', disabled: false, link: true, exact: true, to: '/general-ledger' },
        { text: 'Chart of accounts', disabled: true, href: '' }
      ]
    }
  }
})
</script>
