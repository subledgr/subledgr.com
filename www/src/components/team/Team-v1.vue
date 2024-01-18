<template>
  <v-card>
    <v-container>
      <v-row
        no-gutters
        class="h-100 pa-md-5"
      >
        <v-col
          cols="12"
          sm="12"
          md="5"
          class="d-flex flex-column justify-center align-center pa-5"
        >
          <v-img
            class="rounded elevation-5"
            height="300"
            width="100%"
            gradient="#262626, #262626"
          />
        </v-col>

        <v-col
          cols="12"
          sm="12"
          md="6"
          offset-md="1"
        >
          <v-card-text class="d-flex flex-column justify-center h-100">
            <h3 class="text-lg-h3 text-h4 font-weight-light mb-4">
              Jake Renninger
            </h3>

            <span class="text-grey-darken-1"><b>CEO & User interface Designer</b></span><br>

            <p class="text-grey-darken-1 mb-4">
              A strong leader and a visionary, Jake is the driving force behind our company culture and our product's design.
            </p>

            <div>
              <v-btn
                color="primary"
                icon="mdi-pound"
              />
              <v-btn
                class="ma-4"
                color="grey"
                icon="mdi-twitter"
              />
              <v-btn
                color="grey"
                icon="mdi-facebook"
              />
            </div>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts" setup>
//
</script>
