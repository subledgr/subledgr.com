<template>
  <v-card
    class="pa-4"
    flat
    title="Form Card"
  >
    <v-container>
      <v-row>
        <v-col
          cols="12"
          sm="12"
          md="6"
        >
          <v-text-field
            model-value="John Doe"
            bg-color="primary"
            variant="solo"
          />
        </v-col>

        <v-col
          cols="12"
          sm="12"
          md="6"
        >
          <v-text-field
            placeholder="Your Email"
            variant="solo"
          />
        </v-col>

        <v-col cols="12">
          <v-textarea
            placeholder="Your Message"
            variant="solo"
            no-resize
            rows="8"
          />
        </v-col>

        <v-col
          cols="auto"
          class="mx-auto"
        >
          <v-btn
            color="primary"
            text="Send"
            width="100"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts" setup>
//
</script>
