<template>
  <v-container class="pa-0">
    <v-row>
      <v-col
        v-for="n in 3"
        :key="n"
        cols="12"
        lg="4"
      >
        <v-card
          class="d-flex justify-center flex-column align-center"
          :elevation="n !== 2 ? 0 : 12"
        >
          <v-avatar
            class="mt-6"
            color="grey-lighten-2"
            size="65"
          />

          <v-card-text class="text-center">
            <h4 class="font-weight-medium">
              Jasmin Böhm
            </h4>

            <h5 class="text-grey-lighten-1 font-weight-light">
              CEO, Fuubely
            </h5>
          </v-card-text>

          <v-card-text class="text-center">
            <h4 class="font-weight-medium">
              "Web design was the exact comnination of left and right brain I'd
              been
              searching for."
            </h4>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
//
</script>
