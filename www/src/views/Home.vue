<template>
  <v-container
    fluid
    class="pa-0 ma-0"
  >
    <!-- <h1>Home</h1> -->
    <HeroHeaderV1 />
    <div class="py-1" />

    <ContentV1 />
    <div class="py-1" />

    <ContentV2 />
    <div class="py-1" />

    <ContentV3 />
    <div class="py-1" />

    <ContentV4 />
    <div class="py-1" />

    <!-- <FeaturesV1 />
    <div class="py-1" /> -->

    <!-- <CalltoActionV1 />
    <div class="py-1" /> -->

    <!-- <GalleryV1 />
    <div class="py-1" /> -->

    <!-- <TestimonialV2 />
    <div class="py-1" /> -->

    <PricingTableV2 />
    <div class="py-1" />

    <!-- <Team2 />
    <div class="py-1" /> -->

    <FooterV1 />
  </v-container>
</template>

<script lang="ts" setup>
import CalltoActionV1 from '@/components/call-to-action/CalltoAction-v1.vue'
import ContentV1 from '@/components/content/Content-v1.vue'
import ContentV2 from '@/components/content/Content-v2.vue'
import ContentV3 from '@/components/content/Content-v3.vue'
import ContentV4 from '@/components/content/Content-v4.vue'
import FeaturesV1 from '@/components/features/Features-v1.vue'
import FooterV1 from '@/components/footer/Footer-v1.vue'
import GalleryV1 from '@/components/gallery/Gallery-v1.vue'
import HeroHeaderV1 from '@/components/hero-headers/HeroHeaders-v1.vue'
import PricingTableV1 from '@/components/pricing/PricingTable-v1.vue'
import PricingTableV2 from '@/components/pricing/PricingTable-v2.vue'
import Team2 from '@/components/team/Team-v2.vue'
import TestimonialV2 from '@/components/testimonial/Testimonial-v2.vue'
</script>
