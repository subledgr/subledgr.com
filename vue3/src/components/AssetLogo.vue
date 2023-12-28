<template>
  <v-avatar :size="size">
    <v-img :src="imgUrl"></v-img>
  </v-avatar>  
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { IAsset } from './types'

export default defineComponent({
  props: {
    assetId: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 24
    },
  },
  setup(props) {
    const store = useStore()
    const assets = computed<IAsset[]>(() => store.state.asset.list)
    // console.debug('assets', assets.value)
    const assetId = computed(() => props.assetId)

    const currency = computed(() => {
      const cur = assets.value?.find((f:IAsset) => f.id === assetId.value)
      return cur || { logo: '' }
    })

    watch(() => assetId.value, newVal => {
      console.debug('watch.assetId', newVal)
    })
    const imgUrl = computed(() => `/${currency.value.logo}`)
    return { imgUrl }
  },
})
</script>
