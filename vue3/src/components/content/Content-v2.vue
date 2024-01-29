<template>
  <v-card
    class="pa-4 pa-md-16"
    color="primary"
    flat
    theme="dark"
  >
    <v-container>
      <v-row
        align="center"
        justify="space-between"
      >
        <v-col
          cols="12"
          md="5"
        >
          <h1 class="text-h3 mx-auto mb-4">
            <strong>asset</strong> view
          </h1>

          <div class="text-medium-emphasis text-body-2">
            <!-- Embrace the future of frontend development with Vuetify 3. Our latest version offers an enhanced suite of tools designed to elevate user interfaces. With improved performance, more intuitive code structures, and a comprehensive range of customizable components, Vuetify 3 is here to transform your Vue.js projects into seamless, visually stunning experiences. -->
            An overview of your accounts, aggregated by asset.
          </div>
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <v-img
            class="elevation-0 rounded"
            height="300"
            :src="'content/assets-view.png'"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
export default defineComponent({
  setup() {
  }
})

</script>
