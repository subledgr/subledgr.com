<template>
  <v-container>
    <h1>Features</h1>

    <p>
      Features are lists that are used to display a list of features or services that are offered by a company or organization.
    </p>

    <br>

    <h2>Version 1</h2>

    <FeaturesV1 />

    <br>

    <h2>Version 2</h2>

    <FeaturesV2 />
  </v-container>
</template>

<script lang="ts" setup>
import FeaturesV1 from '@/components/features/Features-v1.vue'
import FeaturesV2 from '@/components/features/Features-v2.vue'
</script>
