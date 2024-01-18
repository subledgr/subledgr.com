<template>
  <v-container>
    <h1>Testimonials</h1>

    <p>
      Testimonials are a great way to show off your product or service.
    </p>

    <br>

    <h2>Version 1</h2>

    <TestimonialV1 />

    <br>

    <h2>Version 2</h2>

    <TestimonialV2 />
  </v-container>
</template>

<script lang="ts" setup>
import TestimonialV1 from '@/components/testimonial/Testimonial-v1.vue'
import TestimonialV2 from '@/components/testimonial/Testimonial-v2.vue'
</script>
