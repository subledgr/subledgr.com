<template>
  <v-card
    class="pa-4"
    flat
    title="Contact Card"
  >
    <v-container>
      <v-row>
        <v-col
          cols="12"
          sm="12"
          md="6"
        >
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
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col
          cols="12"
          sm="12"
          md="6"
        >
          <v-card
            class="d-flex align-center justify-center"
            height="255"
          >
            <v-btn
              color="primary"
              icon="mdi-map-marker"
            />
          </v-card>
        </v-col>

        <v-col cols="12">
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
