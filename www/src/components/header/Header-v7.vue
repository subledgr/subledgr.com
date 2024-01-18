<template>
  <v-layout>
    <v-app-bar height="96">
      <template #prepend>
        <v-toolbar-items v-if="mdAndUp">
          <v-btn text="Home" />

          <v-btn text="Portfolio" />

          <v-btn text="Contact" />
        </v-toolbar-items>
      </template>

      <v-icon icon="mdi-lightning-bolt-circle" />

      <template #append>
        <v-btn
          class="ms-6 me-2"
          color="primary"
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
