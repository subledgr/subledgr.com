<template>
  <v-container>
    <h1>Sink</h1>

    <template
      v-for="(component, index) in components"
      :key="index"
    >
      <h2>{{ component.__name }}.vue</h2>

      <component :is="component" />

      <div class="py-1" />
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import BlogV1 from '@/components/blog/Blog-v1.vue'
import BlogV2 from '@/components/blog/Blog-v2.vue'
import CalltoActionV1 from '@/components/call-to-action/CalltoAction-v1.vue'
import CalltoActionV2 from '@/components/call-to-action/CalltoAction-v2.vue'
import ContactV1 from '@/components/contact/Contact-v1.vue'
import ContactV2 from '@/components/contact/Contact-v2.vue'
import ContentV1 from '@/components/content/Content-v1.vue'
import ContentV2 from '@/components/content/Content-v2.vue'
import ContentV3 from '@/components/content/Content-v3.vue'
import ContentV4 from '@/components/content/Content-v4.vue'
import EcommerceV1 from '@/components/ecommerce/Ecommerce-v1.vue'
import EcommerceV2 from '@/components/ecommerce/Ecommerce-v2.vue'
import FeaturesV1 from '@/components/features/Features-v1.vue'
import FeaturesV2 from '@/components/features/Features-v2.vue'
import FooterV1 from '@/components/footer/Footer-v1.vue'
import FooterV2 from '@/components/footer/Footer-v2.vue'
import GalleryV1 from '@/components/gallery/Gallery-v1.vue'
import GalleryV2 from '@/components/gallery/Gallery-v2.vue'
import Headerv1 from '@/components/header/Header-v1.vue'
import Headerv2 from '@/components/header/Header-v2.vue'
import Headerv3 from '@/components/header/Header-v3.vue'
import Headerv4 from '@/components/header/Header-v4.vue'
import Headerv5 from '@/components/header/Header-v5.vue'
import Headerv6 from '@/components/header/Header-v6.vue'
import HeroHeaderV1 from '@/components/hero-headers/HeroHeaders-v1.vue'
import HeroHeaderV2 from '@/components/hero-headers/HeroHeaders-v2.vue'
import PricingTableV1 from '@/components/pricing/PricingTable-v1.vue'
import PricingTableV2 from '@/components/pricing/PricingTable-v2.vue'
import TeamV1 from '@/components/team/Team-v1.vue'
import TeamV2 from '@/components/team/Team-v2.vue'
import TestimonialV1 from '@/components/testimonial/Testimonial-v1.vue'
import TestimonialV2 from '@/components/testimonial/Testimonial-v2.vue'
import TitleV1 from '@/components/title/Title-v1.vue'
import TitleV2 from '@/components/title/Title-v2.vue'
import TitleV3 from '@/components/title/Title-v3.vue'
import TitleV4 from '@/components/title/Title-v4.vue'
import TitleV5 from '@/components/title/Title-v5.vue'
import TitleV6 from '@/components/title/Title-v6.vue'

const components = {
  BlogV1,
  BlogV2,
  CalltoActionV1,
  CalltoActionV2,
  ContactV1,
  ContactV2,
  ContentV1,
  ContentV2,
  ContentV3,
  ContentV4,
  EcommerceV1,
  EcommerceV2,
  FeaturesV1,
  FeaturesV2,
  FooterV1,
  FooterV2,
  GalleryV1,
  GalleryV2,
  Headerv1,
  Headerv2,
  Headerv3,
  Headerv4,
  Headerv5,
  Headerv6,
  HeroHeaderV1,
  HeroHeaderV2,
  PricingTableV1,
  PricingTableV2,
  TeamV1,
  TeamV2,
  TestimonialV1,
  TestimonialV2,
  TitleV1,
  TitleV2,
  TitleV3,
  TitleV4,
  TitleV5,
  TitleV6
}
</script>
