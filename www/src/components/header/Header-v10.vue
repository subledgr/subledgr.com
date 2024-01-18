<template>
  <v-layout>
    <v-app-bar height="96">
      <template #prepend>
        <v-btn
          class="mx-2"
          icon="mdi-menu"
          variant="elevated"
        />
      </template>

      <logo />

      <template
        v-if="mdAndUp"
        #append
      >
        <v-btn
          class="ms-6 me-2"
          color="surface-variant"
          size="large"
          text="Signup"
          variant="elevated"
          rounded
          width="128"
        />
      </template>
    </v-app-bar>

    <v-main />
  </v-layout>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()
</script>
