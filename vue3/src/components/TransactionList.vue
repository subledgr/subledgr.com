<template>
  <v-list>
    <v-list-item v-for="(tx, idx) in list" v-bind:key="idx">
      {{ tx }}
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    list: {
      type: []
    }
  },
  setup() {
    return {}
  },
})
</script>
