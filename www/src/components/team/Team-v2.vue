<template>
  <v-card>
    <v-container>
      <!-- <v-toolbar color="none">
        <v-toolbar-title>Team</v-toolbar-title>
      </v-toolbar> -->
      <v-row
        no-gutters
        class="h-100 pa-md-5"
      >
        <v-col
          cols="12"
          sm="12"
          md="6"
        >
          <v-card-text class="d-flex flex-column justify-center h-100">
            <h3 class="text-lg-h3 text-h4 font-weight-light mb-4">
              Derek Colley
            </h3>

            <span class="text-grey-darken-1"><b>Founder & Fullstack techie</b></span><br>

            <p class="text-grey-darken-1 mb-4">
              <!-- A strong leader and a visionary, Jake is the driving force behind our company culture and our product's design. -->
            </p>

            <div>
              <!-- <v-btn
                color="primary"
                icon="mdi-pound"
              /> -->

              <a
                href="http://twitter.com/derekcolley_"
                target="_blank"
                rel="noopener noreferrer"
              >
                <v-btn
                  class="ma-4"
                  color="grey"
                  icon="mdi-twitter"
                />
              </a>

              <a
                href="http://linkedin.com/in/derekcolley/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <v-btn
                  color="grey"
                  icon="mdi-linkedin"
                />
              </a>
            </div>
          </v-card-text>
        </v-col>

        <v-col
          cols="12"
          sm="12"
          md="5"
          offset-md="1"
          class="d-flex flex-column justify-center align-center pa-5"
        >
          <v-avatar
            :size="mdAndUp ? 300 : 88"
            elevation="12"
          >
            <v-img src="/derekcolley.jpeg" />
          </v-avatar>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts" setup>
// Utilities
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()
</script>
