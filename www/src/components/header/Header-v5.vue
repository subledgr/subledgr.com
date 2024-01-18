<template>
  <v-layout>
    <v-app-bar height="96">
      <template #prepend>
        <logo />
      </template>

      <template #append>
        <v-toolbar-items v-if="mdAndUp">
          <v-btn text="Home" />

          <v-btn text="Portfolio" />

          <v-btn text="Contact" />
        </v-toolbar-items>

        <v-btn
          class="ms-6 me-2"
          color="primary"
          icon="mdi-menu"
          variant="elevated"
          text="Signup"
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
