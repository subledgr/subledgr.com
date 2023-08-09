<template>
  <v-container fluid class="pa-0 ma-0">
    <!-- <v-hero>
      Hero section
    </v-hero> -->
    <v-toolbar density="compact">
      <v-toolbar-title>
        Example Market Overview (API to MarketView List)
      </v-toolbar-title>
    </v-toolbar>
    <!-- <v-row>
      <v-col>
        <p class="text-caption text-center">todo: ...</p>
      </v-col>
    </v-row> -->
    <crypto-market :options="{ width:'100%', height: '800'}"></crypto-market>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import HelloWorld from '../components/HelloWorld.vue'
import { CryptoMarket } from 'vue-tradingview-widgets'
export default defineComponent({
  name: 'HomeC',

  components: {
    // HelloWorld
    CryptoMarket
  },
  setup() {

  }
})
</script>
