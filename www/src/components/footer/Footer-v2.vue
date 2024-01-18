<template>
  <v-card>
    <v-container class="text-center py-12">
      <div class="d-inline-block">
        <logo />
      </div>

      <div class="my-16">
        <v-btn
          v-for="link in links"
          :key="link"
          :text="link"
          variant="text"
          class="mx-2 text-grey-darken-1"
          rounded
        />
      </div>

      <div
        class="text-center mt-10 text-grey-darken-1"
        cols="12"
      >
        All rights are reserved &copy;
        {{ new Date().getFullYear() }}, Vuetify, LLC
      </div>
    </v-container>
  </v-card>
</template>

<script lang="ts" setup>
const links = [
  'Home',
  'About Us',
  'Portfolio',
  'Services',
  'Contact'
]
</script>
