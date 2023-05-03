<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
    <!-- <v-card>
      <v-card-title>Basic Information</v-card-title>
      <v-card-text>
        <v-text-field label="Display name"></v-text-field>
        <v-text-field label="Legal/Trading name"></v-text-field>
        <v-text-field label="Display name"></v-text-field>
        <v-text-field label="Line of business"></v-text-field>
        <v-text-field label="Organisation type"></v-text-field>
        <v-text-field label="Registration number"></v-text-field>
        <v-textarea label="Organisation description"></v-textarea>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-title>Contact Details</v-card-title>
      <v-card-text>
        <v-text-field label="Postal address"></v-text-field>
        <v-text-field label="Phuysical address"></v-text-field>
        <v-text-field label="Telephone"></v-text-field>
        <v-text-field label="Email"></v-text-field>
        <v-text-field label="Website"></v-text-field>
      </v-card-text>
    </v-card>
    <br>
    <v-row>
      <v-col align="end">
        <v-btn>Cancel</v-btn>&nbsp;
        <v-btn color="primary">Save</v-btn>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'OrgDetails',
  data () {
    return {
      breadcrumbs: [
        { title: '⚙️ Settings', disabled: false, link: true, exact: true, to: '/settings' },
        { title: 'Subscription', disabled: true, href: '' }
      ]
    }
  }
})
</script>
