<template>
  <v-container class="pa-0">
    <v-card>
      <v-carousel
        color="medium-emphasis"
        height="400"
        hide-delimiter-background
        show-arrows
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
          <div class="d-flex justify-center flex-column align-center h-100">
            <v-avatar
              color="grey-lighten-2"
              size="100"
              elevation="24"
              class="my-6"
            />

            <h5 class="font-weight-medium">
              John Doe
            </h5>

            <h5 class="text-medium-emphasis font-weight-regular mb-6">
              CEO, Fuubely
            </h5>

            <h4 class="font-weight-medium w-75 w-md-33 text-center">
              "Web design was the exact comnination of left and right brain I'd
              been searching for."
            </h4>
          </div>
        </v-carousel-item>
      </v-carousel>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
//
</script>
