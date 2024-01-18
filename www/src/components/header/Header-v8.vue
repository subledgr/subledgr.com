<template>
  <v-layout>
    <v-app-bar height="96">
      <template #prepend>
        <logo />
      </template>

      <v-toolbar-items v-if="mdAndUp">
        <v-btn text="Home" />

        <v-btn text="Portfolio" />

        <v-btn text="Contact" />
      </v-toolbar-items>

      <template #append>
        <template v-if="mdAndUp">
          <v-icon
            icon="mdi-twitter"
            color="disabled"
            class="me-2"
          />

          <v-icon
            icon="mdi-facebook"
            color="disabled"
            class="me-2"
          />

          <v-icon
            icon="mdi-linkedin"
            color="disabled"
            class="me-2"
          />
        </template>

        <v-btn
          class="ms-6 me-2"
          color="primary"
          size="large"
          text="Signup"
          variant="elevated"
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
