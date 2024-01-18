<template>
  <v-container>
    <h1>Ecommerce</h1>

    <p>
      Ecommerce components are useful for displaying products and services.
    </p>

    <br>

    <h2>Version 1</h2>

    <EcommerceV1 />

    <br>

    <h2>Version 2</h2>

    <EcommerceV2 />
  </v-container>
</template>

<script lang="ts" setup>
import EcommerceV1 from '@/components/ecommerce/Ecommerce-v1.vue'
import EcommerceV2 from '@/components/ecommerce/Ecommerce-v2.vue'
</script>
