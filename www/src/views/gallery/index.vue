<template>
  <v-container>
    <h1>Gallery</h1>

    <p>
      Gallery is a component that is used to display a gallery of images.
    </p>

    <br>

    <h2>Version 1</h2>

    <GalleryV1 />

    <br>

    <h2>Version 2</h2>

    <GalleryV2 />
  </v-container>
</template>

<script lang="ts" setup>
// Components
import GalleryV1 from '@/components/gallery/Gallery-v1.vue'
import GalleryV2 from '@/components/gallery/Gallery-v2.vue'
</script>
