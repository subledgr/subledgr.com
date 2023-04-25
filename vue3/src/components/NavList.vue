<template>
  <v-list>
    <v-list-item>Company Limited & Logo</v-list-item>
    <v-list-item to="/settings"><v-icon small>mdi-cogs</v-icon>&nbsp;Settings</v-list-item>
    <v-list-item>Subscription</v-list-item>
    <v-list-item>Subscription</v-list-item>
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
export default defineComponent({
  name: 'NavList'
})
</script>
