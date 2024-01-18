<template>
  <v-layout>
    <v-app-bar height="96">
      <template #prepend>
        <logo />
      </template>

      <template #append>
        <v-text-field
          append-inner-icon="mdi-magnify"
          rounded
          density="comfortable"
          placeholder="Type to search..."
          variant="outlined"
          hide-details
          style="width: 256px;"
        />

        <template v-if="mdAndUp">
          <v-btn
            class="ms-6 me-2"
            color="primary"
            size="large"
            text="Signup"
            variant="elevated"
            rounded
            width="128"
          />

          <v-btn
            class="mx-2"
            color="primary"
            icon="mdi-menu"
            variant="elevated"
          />
        </template>
      </template>
    </v-app-bar>

    <v-main />
  </v-layout>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()
</script>
