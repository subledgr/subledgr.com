<template>
  <v-card>
    <v-container>
      <v-carousel
        hide-delimiters
        height="auto"
      >
        <template #next="{ props: btnProps }">
          <v-btn
            color="primary"
            v-bind="btnProps"
          />
        </template>

        <v-carousel-item
          v-for="n in 3"
          :key="n"
        >
          <v-row>
            <v-col
              cols="12"
              lg="6"
              md="12"
              sm="12"
            >
              <v-card
                class="ms-auto d-flex justify-center flex-column align-center"
                flat
                max-width="350"
              >
                <v-img
                  class="elevation-5 rounded"
                  height="300"
                  width="100%"
                  gradient="#262626, #262626"
                />

                <v-card-text class="text-center">
                  <h2 class="mb-5">
                    $38.95
                  </h2>

                  <h2 class="font-weight-regular mb-4">
                    The Truth Behind Open Source Software
                  </h2>

                  <h5 class="text-grey-darken-2 font-weight-light">
                    December 4, 2023
                  </h5>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col
              cols="12"
              lg="6"
              md="12"
              sm="12"
            >
              <v-card
                class="me-auto d-flex justify-center flex-column align-center"
                flat
                width="350"
              >
                <v-img
                  class="elevation-5 rounded"
                  height="300"
                  width="100%"
                  gradient="#262626, #262626"
                />

                <v-card-text class="text-center">
                  <h2 class="mb-5">
                    $38.95
                  </h2>

                  <h2 class="font-weight-regular mb-4">
                    The Truth Behind Open Source Software
                  </h2>

                  <h5 class="text-grey-darken-2 font-weight-light">
                    December 4, 2023
                  </h5>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
    </v-container>
  </v-card>
</template>

<script lang="ts" setup>
//
</script>
