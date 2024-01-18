<template>
  <v-container>
    <h1>Pricing Table</h1>

    <p>
      Pricing tables are useful for displaying different pricing plans.
    </p>

    <br>

    <h2>Version 1</h2>

    <PricingTable1 />

    <br>

    <h2>Version 2</h2>

    <PricingTable2 />
  </v-container>
</template>

<script lang="ts" setup>
import PricingTable1 from '@/components/pricing/PricingTable-v1.vue'
import PricingTable2 from '@/components/pricing/PricingTable-v2.vue'
</script>
