<template>
  <v-container fluid class="py-0 px-0">

    <v-toolbar density="compact">
      <v-toolbar-title>
        Portfolios
      </v-toolbar-title>
    </v-toolbar>
    
    <v-list>
      <!-- <v-list-item v-for="item in list" v-bind:key="item.id">
        {{ item.name }} ({{ item.currency }})
      </v-list-item> -->
    </v-list>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  data () {
    return {
      list: [
        // { id: 1, name: 'Wallet 1', currency: 'DOT' },
        // { id: 2, name: 'Wallet 2', currency: 'KSM' }
      ]
    }
  }
})
</script>
