<template>
  <v-avatar :size="size">
    <v-img :src="imgUrl"></v-img>
  </v-avatar>  
</template>

<script lang="ts">
import { defineComponent } from 'vue'
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
    const currencies: ICurrency[] = store.state.currency.list
    const currency = currencies.find((f:ICurrency) => f.code === props.currencyCode) || { logo: '' }
    const imgUrl = `/${currency.logo}`
    return { imgUrl }
  },
})
</script>
