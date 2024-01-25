<!--
  Display list of accounts summarised by asset
-->
<template>
  <v-card>
    <v-card-title v-show="title !== ''">{{ title }}</v-card-title>
    <v-card-text>

    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { useStore } from 'vuex';
import { IPrice, IAccount } from './types';

export default defineComponent({
  name: 'PortfolioAssets',
  props: {
    title: {
      type: String,
      required: false,
      default: 'Portfolio Assets'
    },
    accounts: {
      type: Object as PropType<IAccount[]>
    },
    prices: {
      type: Object as PropType<IPrice[]>
    },
  },
  setup() {
    const store = useStore()
    const profile = computed(() => store.state.profile)
    return {
      profile
    }
  },
})
</script>
