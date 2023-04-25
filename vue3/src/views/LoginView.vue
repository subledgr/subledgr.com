<template>
  <login />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Login from '../components/Login.vue'

export default defineComponent({
  name: 'HomeC',

  components: {
    Login
  }
})
</script>
