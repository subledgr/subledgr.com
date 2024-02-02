<template>
  <v-container fluid class="mt-1 pa-0">
    <!-- <v-toolbar density="compact" style="background: none; ">
      <v-toolbar-title>
        Home
      </v-toolbar-title>
    </v-toolbar> -->

    <HeroHeadersv1></HeroHeadersv1>
    
    <v-container>
      <!-- sync with www/src/components/Content... -->
      <v-carousel>
        <v-carousel-item>
          <contentv1></contentv1>
        </v-carousel-item>
        <v-carousel-item>
          <Contentv2></Contentv2>
        </v-carousel-item>
        <v-carousel-item>
          <contentv3></contentv3>
        </v-carousel-item>
      </v-carousel>

      <v-toolbar style="background: none;">
        <v-toolbar-title>Active Assets</v-toolbar-title>
      </v-toolbar>

      <v-row>
        <v-col>
          <div class="center">
            The following assets are live on subledgr!
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="asset in activeAssets" v-bind:key="asset.id">
          <v-card elevation="0" style="background: none;" to="/asset">
            <v-card-title>
              <v-avatar size="48">
                <!-- <v-img :src="asset.logo" style="grayscale(100%)"></v-img> -->
                <img height="48" :src="asset.logo">
              </v-avatar>
              {{ asset.name }}
            </v-card-title>
            <!-- <v-card-text>
            </v-card-text> -->
          </v-card>
        </v-col>
      </v-row>

      <br>
      <br>
      <v-toolbar style="background: none;">
        <v-toolbar-title>Inactive Assets</v-toolbar-title>
      </v-toolbar>
      <v-row>
        <v-col>
          <div class="center">
            To request your favourite asset, please <a href="https://github.com/subledgr/subledgr.com/labels/tokenRequest" target="_blank">raise a ticket on github</a>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="asset in inactiveAssets" v-bind:key="asset.id">
          <v-btn variant="text" class="text-none" @click="showUnsupportedAssetDialog(asset)">
            <template v-slot:prepend>
              <v-avatar size="22">
                <v-img :src="asset.logo" class="image-inactive"></v-img>
              </v-avatar>
            </template>
            {{ asset.name }}
          </v-btn>
          <!-- <v-container fluid style="background: none;" elevation="0">
              <v-avatar size="22">
              <v-img :src="asset.logo" class="image-inactive"></v-img>
            </v-avatar>
              {{ asset.name }}
          </v-container> -->
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="showUnsupportedAsset" max-width="500">
      <v-card :style="`background: ${theme.current.value.colors.background}`">
        <v-card-title>
          <v-avatar size="22">
            <v-img :src="unsupportedAsset?.logo" class="image-inactive"></v-img>
          </v-avatar>
          {{ unsupportedAsset?.name }}
        </v-card-title>
        <v-card-text>
          <p>
            This asset is not yet supported on subledgr. Please raise a ticket on github to request support.
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useTheme } from 'vuetify'

import { IAsset } from '@/components/types'
import HeroHeadersv1 from '@/components/content/HeroHeaders-v1.vue'
import Contentv1 from '@/components/content/Content-v1.vue'
import Contentv2 from '@/components/content/Content-v2.vue'
import Contentv3 from '@/components/content/Content-v3.vue'

// import HelloWorld from '../components/HelloWorld.vue'
// import { CryptoMarket } from 'vue-tradingview-widgets'
export default defineComponent({
  components: {
    // HelloWorld
    // CryptoMarket,
    HeroHeadersv1,
    Contentv1,
    Contentv2,
    Contentv3,
  },
  setup() {
    const theme = useTheme()
    const store = useStore()
    const assets = computed<IAsset[]>(() => store.state.asset.list)
    const activeAssets = computed(() => {
      return assets.value.filter((f: IAsset) => f.active)
    })
    const inactiveAssets = computed(() => {
      return assets.value.filter((f: IAsset) => !f.active)
    })
    const showUnsupportedAsset = ref(false)
    const unsupportedAsset = ref<IAsset | null>(null)
    const showUnsupportedAssetDialog = (asset: IAsset) => {
      // console.debug('showUnsupportedAssetDialog', asset)
      unsupportedAsset.value = asset
      showUnsupportedAsset.value = true
    }

    return {
      theme,
      assets,
      activeAssets,
      inactiveAssets,
      unsupportedAsset,
      showUnsupportedAsset,
      showUnsupportedAssetDialog
    }
  }
})
</script>

<style>
.image-inactive {
  filter: gray; /* IE6-9 */
  -webkit-filter: grayscale(1); /* Google Chrome, Safari 6+ & Opera 15+ */
  filter: grayscale(1); /* Microsoft Edge and Firefox 35+ */
}

/* Disable grayscale on hover */
.image-inactive:hover {
  -webkit-filter: grayscale(0);
  filter: none;
}

.center {
  text-align: center
}
</style>
