<template>
  <v-navigation-drawer>
    <v-list>
      <logo />

      <template
        v-for="(item, index) in items"
        :key="index"
      >
        <template v-if="item.subheader">
          <v-list-subheader>{{ item.subheader }}</v-list-subheader>
        </template>

        <template v-else>
          <v-list-item
            :to="item.to"
            :title="item.title"
            exact
            color="primary"
            variant="elevated"
            elevation="0"
            v-bind="item"
          />
        </template>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
const items = [
  { subheader: 'PAGES' },
  { title: 'Home', prependIcon: 'mdi-home-variant', to: '/' },
  { title: 'Sink', prependIcon: 'mdi-faucet', to: '/sink' },
  { subheader: 'EXAMPLES' },
  { title: 'Headers', prependIcon: 'mdi-format-header-pound', to: 'headers' },
  { title: 'Hero Headers', prependIcon: 'mdi-view-dashboard', to: 'heroheaders' },
  { title: 'Content', prependIcon: 'mdi-text-box', to: 'content' },
  { title: 'Features', prependIcon: 'mdi-star-outline', to: 'features' },
  { title: 'Call To Action', prependIcon: 'mdi-bullhorn-outline', to: 'calltoaction' },
  { title: 'Gallery', prependIcon: 'mdi-image-multiple', to: 'gallery' },
  { title: 'Blog', prependIcon: 'mdi-rss', to: 'blog' },
  { title: 'Testimonial', prependIcon: 'mdi-message-text-outline', to: 'testimonial' },
  { title: 'E-commerce', prependIcon: 'mdi-cart-outline', to: 'ecommerce' },
  { title: 'Pricing Table', prependIcon: 'mdi-cash-multiple', to: 'pricing' },
  { title: 'Team', prependIcon: 'mdi-account-group', to: 'team' },
  { title: 'Contact', prependIcon: 'mdi-email-outline', to: 'contact' },
  { title: 'Title', prependIcon: 'mdi-format-title', to: 'title' },
  { title: 'Footer', prependIcon: 'mdi-page-layout-footer', to: 'footer' }
]
</script>
