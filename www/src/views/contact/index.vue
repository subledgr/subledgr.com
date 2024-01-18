<template>
  <v-container>
    <h1>Contact</h1>

    <p>
      Contact forms that make it easy to receive messages from your visitors.
    </p>

    <br>

    <h2>Version 1</h2>

    <ContactV1 />

    <br>

    <h2>Version 2</h2>

    <ContactV2 />
  </v-container>
</template>

<script lang="ts" setup>
import ContactV1 from '@/components/contact/Contact-v1.vue'
import ContactV2 from '@/components/contact/Contact-v2.vue'
</script>
