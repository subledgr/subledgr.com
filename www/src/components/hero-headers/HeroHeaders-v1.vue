<template>
  <v-card
    theme="dark"
    image="@/assets/heroheaders/heroheaders1.webp"
    min-height="680"
    height="680"
  >
    <v-layout class="h-100">
      <v-app-bar
        class="px-4"
        color="transparent"
        flat
        height="96"
      >
        <template #prepend>
          <div
            :style="{
              width: mdAndUp ? '150px' : undefined
            }"
          >
            <!-- <v-btn
              icon="mdi-menu"
              variant="tonal"
            /> -->
          </div>
        </template>

        <logo />

        <template
          v-if="mdAndUp"
          #append
        >
          <div
            style="width: 150px;"
          />
        </template>
      </v-app-bar>

      <v-main class="h-100">
        <v-container class="text-center w-75 d-flex h-100 d-flex align-content-center">
          <v-row align="center">
            <div>
              <h1 class="text-h3 mx-auto mb-4">
                A platform for fund managers to
                <strong>manage cross-chain portfolios</strong>
              </h1>

              <v-card-text class="text-medium-emphasis px-4 px-md-12 w-75 mx-auto mb-12">
                Funded by the community, for the community.
              </v-card-text>

              <!-- <div class="d-flex align-center justify-center ga-4">
                <v-btn
                  color="secondary"
                  elevation="6"
                  rounded
                  size="large"
                  text="Signup"
                  width="128"
                />

                <v-btn
                  color="white"
                  elevation="6"
                  rounded
                  size="large"
                  text="Login"
                  width="128"
                />
              </div> -->
            </div>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()
</script>
