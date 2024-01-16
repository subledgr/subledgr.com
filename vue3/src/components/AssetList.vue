<template>
  <v-list>

    <v-list-item>
      <v-text-field v-model="search" id="search" ref="input" label="Search" @input="onSearch(search)" autofocus>
      </v-text-field>
    </v-list-item>

    <v-list-item v-for="(item) in assets" v-bind:key="item.id" @click="onClick(item)">
      <template v-slot:prepend>
        <v-avatar density="compact">
          <v-img :class="!item.active ? 'inactive' : ''" :src="item.logo"></v-img>
        </v-avatar>
      </template>
      <v-list-item-title>
        {{ item.name }} <span v-show="item.parachain">(//{{ item.parent }})</span>
      </v-list-item-title>
      <template v-slot:append> 
        <!-- price {{ item.code }} -->
        <v-icon color="green" v-if="item.active">mdi-check-circle-outline</v-icon>
        <v-icon color="red" v-if="!item.active">mdi-close-circle-outline</v-icon>
      </template>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, nextTick } from "vue"
import { useStore } from 'vuex'
import debounce from 'lodash/debounce'
import { IAsset } from "./types"

/*
 * Used mostly for list / pickers
 * see also AssetValueList.vue
 */
export default defineComponent({
  emits: ['selectAsset'],
  setup (_, { emit }: any) {
    const store = useStore()
    const search = ref('')
    const assets = ref<IAsset[]>([])
    // const input = ref(null)

    const onClick = (item: any) => {
      // console.debug('AssetList.vue: onClick', {...item})
      if(item.active) {
        // console.debug('AssetList.vue: onClick: emitting', {...item})
        emit('selectAsset', {...item})
      }
    }

    const onSearch = debounce((search: string) => {
      // console.debug('debounceSearch', search)
      if (search.length < 2) {
        assets.value = []
      } else {
        assets.value = store.state.asset.list.filter((f: IAsset) => {
          // console.debug('filter', {...f})
          return f.name.toLowerCase().includes(search.toLowerCase())
            || f.code?.toLowerCase().includes(search.toLowerCase())
            || f.symbol?.toLowerCase().includes(search.toLowerCase())
        })
      }
    }, 400)

    // watch(() => search.value, (searchStr: string) => {
    //   console.debug('watch search', searchStr)
    // })

    onMounted(() => {
      // console.debug('CurrencyList.vue: mounted()')
      nextTick(() => {
        // this.$refs.input.$el.focus()
        const el = document.getElementById('search')
        if (el) el.focus()
      })
    })

    return {
      search,
      // emits,
      onClick,
      assets,
      onSearch,
      // onMounted
    }
  }
})
</script>

<style scoped>
.inactive {
  filter: grayscale(100%);
}
</style>