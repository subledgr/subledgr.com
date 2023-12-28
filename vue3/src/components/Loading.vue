<template>
  <v-overlay
    :contained="contained"
    :model-value="isLoading"
    class="align-center justify-center">
    <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
  </v-overlay>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity';
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    contained: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const isLoading = computed(() => props.loading)
    return {
      isLoading
    }
  }
})
</script>
