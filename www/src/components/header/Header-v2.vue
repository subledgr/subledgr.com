<template>
  <v-layout>
    <v-app-bar height="96">
      <template #prepend>
        <logo />
      </template>

      <template #append>
        <v-toolbar-items>
          <v-btn text="Home" />

          <template v-if="mdAndUp">
            <v-btn text="About us" />

            <v-btn text="Portfolio" />

            <v-btn text="Services" />

            <v-btn text="Contact" />
          </template>
        </v-toolbar-items>
      </template>
    </v-app-bar>

    <v-main />
  </v-layout>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()
</script>
