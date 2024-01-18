<template>
  <v-container>
    <h1>Hero Headers</h1>

    <p>
      Hero headers are the topmost part of a website. They usually contain the logo, navigation, and other important elements.
    </p>

    <br>

    <h2>Version 1</h2>

    <HeroHeadersV1 />

    <br>

    <h2>Version 2</h2>

    <HeroHeadersV2 />
  </v-container>
</template>

<script lang="ts" setup>
import HeroHeadersV1 from '@/components/hero-headers/HeroHeaders-v1.vue'
import HeroHeadersV2 from '@/components/hero-headers/HeroHeaders-v2.vue'
</script>
