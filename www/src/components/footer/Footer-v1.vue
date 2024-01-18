<template>
  <v-card>
    <v-container class="pa-8">
      <v-row>
        <v-col
          cols="12"
          class="d-flex justify-space-between mb-12"
        >
          <logo />

          <div class="d-flex flex-wrap ga-4 justify-end">
            <a href="https://app.subledgr.com/register">
              <v-btn
                color="primary"
                text="Signup"
                variant="flat"
              />
            </a>

            <a href="https://app.subledgr.com/login">
              <v-btn
                color="primary"
                text="Login"
                variant="outlined"
              />
            </a>
          </div>
        </v-col>

        <v-col
          cols="12"
          md="5"
          class="text-grey-darken-1 d-flex justify-md-start justify-end"
        >
          <div class="px-4">
            &copy; {{ new Date().getFullYear() }}, Vuetify, LLC
          </div>
        </v-col>

        <v-col
          cols="12"
          md="7"
          class="text-end"
        >
          <v-btn
            v-for="link in links"
            :key="link"
            variant="text"
            class="ms-4 text-grey-darken-1"
            rounded
          >
            {{ link }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts" setup>
const links = [
  'Home',
  'About Us',
  'Portfolio',
  'Services',
  'Contact'
]
</script>
