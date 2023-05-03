<template>
  <v-avatar :size="size">
    <v-img :src="imgUrl"></v-img>
  </v-avatar>  
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { ICurrency } from './types'

export default defineComponent({
  props: {
    currencyCode: {
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
    const currencies = computed<ICurrency[]>(() => store.state.currency.list)
    const currencyCode = computed(() => props.currencyCode)

    const currency = computed(() => {
      const cur = currencies.value.find((f:ICurrency) => f.code === currencyCode.value)
      return cur || { logo: '' }
    })

    watch(() => currencyCode.value, newVal => {
      console.debug('watch.currencyCode', newVal)
    })
    const imgUrl = computed(() => `/${currency.value.logo}`)
    return { imgUrl }
  },
})
</script>
