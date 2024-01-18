<template>
  <v-container>
    <h1>Footer</h1>

    <p>
      The footer is a section of the website that appears at the bottom of every page. It is a great place to put
      additional information like contact information, social media links, and other important information.
    </p>

    <br>

    <h2>Version 1</h2>

    <FooterV1 />

    <br>

    <h2>Version 2</h2>

    <FooterV2 />
  </v-container>
</template>

<script lang="ts" setup>
import FooterV1 from '@/components/footer/Footer-v1.vue'
import FooterV2 from '@/components/footer/Footer-v2.vue'
</script>
