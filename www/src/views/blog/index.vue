<template>
  <v-container>
    <h1>Blog</h1>

    <p>
      Blog is a component that is used to display a blog post.
    </p>

    <br>

    <h2>Version 1</h2>

    <BlogV1 />

    <br>

    <h2>Version 2</h2>

    <BlogV2 />
  </v-container>
</template>

<script lang="ts" setup>
import BlogV1 from '@/components/blog/Blog-v1.vue'
import BlogV2 from '@/components/blog/Blog-v2.vue'
</script>
