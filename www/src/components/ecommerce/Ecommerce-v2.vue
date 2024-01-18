<template>
  <v-card>
    <v-container>
      <v-row>
        <v-col cols="auto">
          <v-img
            class="elevation-5 rounded"
            height="100%"
            min-height="150"
            width="500"
            gradient="#262626, #262626"
          />
        </v-col>

        <v-col
          cols="12"
          md="5"
          class="py-md-6"
        >
          <div class="d-flex align-center text-body-2 font-weight-bold mb-4">
            <v-icon
              icon="mdi-star"
              color="disabled"
              class="me-5"
            />

            <div class="text-disabled">
              9.4 (234 Reviews)
            </div>
          </div>

          <h1 class="font-weight-light text-h4 text-md-h3 mb-4">
            Mastering Vuetify: A Journey to Front-End Excellence
          </h1>

          <div class="text-medium-emphasis mb-6">
            Dive into 'Mastering Vuetify' and embark on a journey to front-end mastery. This comprehensive guide unveils the secrets of creating stunning, responsive user interfaces using Vuetify. From beginners to seasoned developers, this book connects you with a community of innovators and equips you with the skills to transform your web development projects.
          </div>

          <h2>$12.95</h2>

          <h4 class="text-grey-darken-2 font-weight-medium mb-4">
            Approximately US $13.70
          </h4>

          <div class="d-flex align-center">
            <v-btn
              color="primary"
              class="me-5 px-5"
              text="Buy Now"
            />

            <v-icon
              icon="mdi-heart"
              class="me-5"
              color="grey-lighten-1"
            />

            <h4 class="text-grey-darken-2 font-weight-medium">
              Add to Favorites
            </h4>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts" setup>
//
</script>
