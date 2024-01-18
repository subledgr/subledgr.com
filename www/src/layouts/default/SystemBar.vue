<template>
  <v-system-bar
    color="#262626"
    height="56"
  >
    <div class="d-flex align-center">
      <!-- <v-app-bar-nav-icon
        class="d-inline-block d-md-none"
        @click="emit('click:toggle')"
      /> -->

      <!-- <v-img
        src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-dark.svg"
        class="ms-2"
        width="128"
      /> -->
      <v-icon>mdi-alpha-s-circle-outline</v-icon>
      <div class="text-body-2 font-weight-black ms-2 d-none d-md-block">
        s u b l e d g r
      </div>
    </div>

    <v-spacer />

    <v-btn
      append-icon="mdi-open-in-new"
      color="primary"
      href="https://app.subledgr.com/"
      rel="noopener"
      text="Login"
      variant="flat"
    />
  </v-system-bar>
</template>

<script lang="ts" setup>
const emit = defineEmits(['click:toggle'])
</script>
