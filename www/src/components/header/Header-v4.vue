<template>
  <v-layout>
    <v-app-bar height="96">
      <template #prepend>
        <logo />
      </template>

      <template #append>
        <v-toolbar-items v-if="mdAndUp">
          <v-btn text="Home" />

          <v-btn text="About us" />

          <v-btn text="Portfolio" />

          <v-btn text="Services" />

          <v-btn text="Contact" />
        </v-toolbar-items>

        <v-btn
          class="ms-6 me-2"
          color="primary"
          size="large"
          variant="elevated"
          width="128"
          text="Signup"
        />

        <v-btn
          v-if="mdAndUp"
          class="mx-2"
          size="large"
          variant="outlined"
          width="128"
          text="Login"
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
