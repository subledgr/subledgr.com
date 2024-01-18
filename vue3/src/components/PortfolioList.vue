<template>
  <v-list>

    <!-- <v-list-item>
      <v-text-field v-model="search" id="search" ref="input" label="Search" @input="onSearch(search)" autofocus>
      </v-text-field>
    </v-list-item> -->

    <v-list-item v-if="!loggedIn">
        <v-row>
          <v-col>
            <v-btn to="/login">Login</v-btn> to see your portfolios
          </v-col>
        </v-row>
      </v-list-item>

    <v-list-item v-for="(item) in list" v-bind:key="item.id" @click="onClick(item)">
      <!-- <template v-slot:prepend>
        <v-avatar density="compact">
          <v-img :class="!item.status=='active' ? 'inactive' : ''" :src="item.logo"></v-img>
        </v-avatar>
      </template> -->
      <v-list-item-title>
        {{ item.name }} <!-- (status: {{ item.status }}) -->
      </v-list-item-title>
      <template v-slot:append> 
        <!-- price {{ item.code }} -->
        <!-- <v-icon color="green" v-if="item.status==='active'">mdi-chevron-right</v-icon> -->
        <!-- <v-icon color="red" v-else>mdi-chevron-right</v-icon> -->
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted, nextTick, PropType } from "vue"
import { useStore } from 'vuex'
import debounce from 'lodash/debounce'
import { IPortfolio } from "./types"

export default defineComponent({
  props: {
    list: {
      type: Object as PropType<IPortfolio[]>,
    }
  },
  setup (_, { emit }) {
    //const store = useStore()
    const search = ref('')
    // const portfolios = ref<IPortfolio[]>([])
    // const input = ref(null)
    const store = useStore()
    const loggedIn = computed(() => store.getters.loggedIn)

    // const emits = defineEmits(['selectCurrency'])

    const onClick = (item: any) => {
      // console.debug('PortfolioList.vue: onClick', {...item})
      emit('selectPortfolio', {...item})
    }

    const onSearch = debounce((search: string) => {
      console.debug('debounceSearch', search)
      // if (search.length < 2) {
      //   assets.value = []
      // } else {
      //   assets.value = store.state.asset.list.filter((f: IAsset) => {
      //     // console.debug('filter', {...f})
      //     return f.name.toLowerCase().includes(search.toLowerCase())
      //       || f.code?.toLowerCase().includes(search.toLowerCase())
      //       || f.symbol?.toLowerCase().includes(search.toLowerCase())
      //   })
      // }
    }, 400)

    watch(() => search.value, (searchStr: string) => {
      console.debug('watch search', searchStr)
    })

    // watch(() => props?.list, (newList: IPortfolio[]) => {
    //   console.debug('props.list', newList)
    // })

    onMounted(() => {
      // console.debug('PortfolioList.vue: mounted()', props?.list)
      nextTick(() => {
        // this.$refs.input.$el.focus()
        const el = document.getElementById('search')
        if (el) el.focus()
      })
    })

    return {
      search,
      loggedIn,
      onClick,
      // assets,
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