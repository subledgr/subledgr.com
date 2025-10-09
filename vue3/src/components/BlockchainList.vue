<template>
  <v-list>
    <v-list-item>
      <v-text-field v-model="search" id="search" ref="input" label="Search" @input="onSearch(search)" autofocus>
      </v-text-field>
    </v-list-item>

    <v-list-item v-for="(item) in blockchains" v-bind:key="item.id" @click="onClick(item)">
      <template v-slot:prepend>
        <v-avatar density="compact">
          <v-img :src="item.logo" :alt="item.name"></v-img>
        </v-avatar>
      </template>
      <v-list-item-title>
        {{ item.name }}
      </v-list-item-title>
      <template v-slot:append> 
        <v-chip size="small" color="primary" variant="outlined">
          {{ item.symbol }}
        </v-chip>
      </template>
    </v-list-item>
    <v-snackbar
      v-model="snackbar"
    >
      {{ snackText }}
      <template v-slot:actions>
        <v-btn
          color="pink"
          variant="text"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-list>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, nextTick } from "vue"
import { useStore } from 'vuex'
import debounce from 'lodash/debounce'
import { IBlockchain } from "./types"

/*
 * Used for blockchain list / pickers
 * Similar to AssetList.vue but for blockchains
 */
export default defineComponent({
  emits: ['selectBlockchain'],
  setup (_, { emit }: any) {
    const store = useStore()
    const search = ref('')
    const blockchains = ref<IBlockchain[]>([])
    const snackbar = ref(false)

    const onClick = (item: any) => {
      console.debug('BlockchainList.vue: onClick', {...item})
      emit('selectBlockchain', {...item})
    }

    const onSearch = debounce((search: string) => {
      console.debug('debounceSearch', search)
      if (search.length < 2) {
        blockchains.value = []
      } else {
        blockchains.value = store.state.blockchain.list.filter((f: IBlockchain) => {
          return f.name.toLowerCase().includes(search.toLowerCase())
            || f.symbol?.toLowerCase().includes(search.toLowerCase())
            || f.id.toLowerCase().includes(search.toLowerCase())
        })
      }
    }, 400)

    onMounted(() => {
      console.debug('BlockchainList.vue: mounted()')
      nextTick(() => {
        const el = document.getElementById('search')
        if (el) el.focus()
      })
    })

    return {
      search,
      snackbar,
      snackText: 'Blockchain selected',
      onClick,
      blockchains,
      onSearch,
    }
  }
})
</script>

<style scoped>
</style>
