<template>
  <v-layout>
    <v-system-bar height="42">
      <v-container>
        <div class="d-flex justify-space-between">
          <div class="d-none d-md-flex">
            <div class="me-4">
              Multi-purpose User Interface Kit
            </div>

            <div>contact@mail.com</div>
          </div>

          <div class="d-flex">
            <div>
              Follow us
            </div>

            <v-icon
              icon="mdi-twitter"
              class="ms-2"
            />

            <v-icon
              icon="mdi-facebook"
              class="ms-2"
            />

            <v-icon
              icon="mdi-linkedin"
              class="ms-2"
            />
          </div>
        </div>
      </v-container>
    </v-system-bar>

    <v-app-bar height="96">
      <template #prepend>
        <logo />
      </template>

      <template #append>
        <v-btn
          class="ms-6 me-2"
          icon="mdi-magnify"
          text="Signup"
          variant="elevated"
        />

        <v-btn
          class="mx-2"
          color="primary"
          icon="mdi-menu"
          variant="elevated"
          text="Signup"
        />
      </template>
    </v-app-bar>

    <v-main />
  </v-layout>
</template>

<script lang="ts" setup>
//
</script>
