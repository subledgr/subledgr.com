<template>
  <v-dialog v-model="showMe" persistent maxWidth="900">
    <v-card>
      <v-card-title>
        <span>Select Chains</span>
        <v-spacer></v-spacer>
        <v-chip v-if="selectedChains.length > 0" color="primary" variant="outlined">
          {{ selectedChains.length }} selected
        </v-chip>
      </v-card-title>
      
      <v-divider></v-divider>
      
      <v-card-text style="height: 500px; overflow-y: auto;">
        <!-- Search and Filters -->
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              id="search"
              ref="input"
              label="Search chains"
              @input="onSearch(search)"
              autofocus
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="filterType"
              :items="filterOptions"
              label="Filter by type"
              variant="outlined"
              density="compact"
              clearable
              @update:model-value="applyFilters"
            ></v-select>
          </v-col>
        </v-row>

        <!-- Chain List -->
        <v-list>
          <v-list-item
            v-for="(chain) in filteredChains"
            :key="chain.id"
            @click="toggleSelection(chain)"
            :class="{ 'bg-grey-lighten-4': isSelected(chain) }"
          >
            <template v-slot:prepend>
              <v-checkbox
                :model-value="isSelected(chain)"
                @click.stop="toggleSelection(chain)"
                color="primary"
                hide-details
              ></v-checkbox>
            </template>
            
            <template v-slot:append>
              <v-avatar density="compact" class="ml-2">
                <v-img 
                  :class="!chain.active ? 'inactive' : ''" 
                  :src="chain.logo"
                  :alt="chain.name"
                ></v-img>
              </v-avatar>
            </template>
            
            <v-list-item-title>
              <div class="d-flex align-center flex-wrap">
                <span class="font-weight-medium">{{ chain.name }}</span>
                
                <!-- Chain Type Badges -->
                <v-chip
                  v-if="chain.parachain"
                  size="x-small"
                  color="blue"
                  variant="outlined"
                  class="ml-2"
                >
                  Parachain
                </v-chip>
                <v-chip
                  v-else
                  size="x-small"
                  color="green"
                  variant="outlined"
                  class="ml-2"
                >
                  Relay Chain
                </v-chip>
                
                <!-- Parent Chain Info -->
                <span v-if="chain.parent" class="text-caption text-grey ml-2">
                  (//{{ chain.parent }})
                </span>
                
                <!-- Chain Code -->
                <v-chip
                  v-if="chain.code"
                  size="x-small"
                  color="primary"
                  variant="outlined"
                  class="ml-2"
                >
                  {{ chain.code }}
                </v-chip>
              </div>
            </v-list-item-title>
            
            <template v-slot:append>
              <div class="d-flex align-center">
                <!-- Decimals Info -->
                <v-chip
                  v-if="chain.decimals"
                  size="x-small"
                  color="grey"
                  variant="text"
                  class="mr-2"
                >
                  {{ chain.decimals }}d
                </v-chip>
                
                <!-- Active Status -->
                <v-icon 
                  :color="chain.active ? 'green' : 'red'" 
                  :icon="chain.active ? 'mdi-check-circle-outline' : 'mdi-lock-outline'"
                ></v-icon>
              </div>
            </template>
          </v-list-item>
        </v-list>

        <!-- Empty State -->
        <v-card v-if="filteredChains.length === 0" class="mt-4" variant="outlined">
          <v-card-text class="text-center text-grey">
            <v-icon size="48" class="mb-2">mdi-magnify</v-icon>
            <div>No chains found matching your criteria</div>
            <div class="text-caption">Try adjusting your search or filters</div>
          </v-card-text>
        </v-card>

        <v-snackbar v-model="snackbar" timeout="3000">
          {{ snackText }}
          <template v-slot:actions>
            <v-btn color="pink" variant="text" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-card-text>
      
      <v-divider></v-divider>
      
      <v-card-actions>
        <v-btn
          v-if="selectedChains.length > 0"
          color="red"
          variant="text"
          @click="clearSelection"
        >
          Clear All ({{ selectedChains.length }})
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :disabled="selectedChains.length === 0"
          @click="confirmSelection"
        >
          Select {{ selectedChains.length }} Chain{{ selectedChains.length !== 1 ? 's' : '' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, nextTick, computed } from 'vue'
import { useStore } from 'vuex'
import debounce from 'lodash/debounce'
import { IAsset } from './types'

export default defineComponent({
  name: 'ChainPickerMulti',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: 'mdi-link-variant'
    },
    maxSelections: {
      type: Number,
      default: null
    },
    allowInactive: {
      type: Boolean,
      default: false
    },
    preselectedChains: {
      type: Array as () => IAsset[],
      default: () => []
    },
    showParachainsOnly: {
      type: Boolean,
      default: false
    },
    showRelayChainsOnly: {
      type: Boolean,
      default: false
    },
    parentChain: {
      type: String,
      default: null
    }
  },
  emits: ['selectChains', 'closeDialog'],
  setup(props, context) {
    const store = useStore()
    const showMe = ref(false)
    const search = ref('')
    const selectedChains = ref<IAsset[]>([])
    const filteredChains = ref<IAsset[]>([])
    const snackbar = ref(false)
    const snackText = ref('')
    const filterType = ref('')

    const filterOptions = [
      { title: 'All Chains', value: '' },
      { title: 'Active Only', value: 'active' },
      { title: 'Parachains Only', value: 'parachain' },
      { title: 'Relay Chains Only', value: 'relay' },
      { title: 'Polkadot Ecosystem', value: 'polkadot' },
      { title: 'Kusama Ecosystem', value: 'kusama' }
    ]

    // Initialize with preselected chains
    watch(() => props.preselectedChains, (newChains) => {
      selectedChains.value = [...newChains]
    }, { immediate: true })

    watch(() => props.visible, (newVal: boolean) => {
      console.debug('ChainPickerMulti: watch.props.visible', props.visible)
      showMe.value = newVal
      if (newVal) {
        // Reset search and filters when dialog opens
        search.value = ''
        filterType.value = ''
        filteredChains.value = []
      }
    })

    watch(() => showMe.value, (newVal: boolean) => {
      console.debug('ChainPickerMulti: watch.showMe', showMe.value)
      if (!newVal) {
        context.emit('closeDialog', newVal)
      }
    })

    const onSearch = debounce((searchTerm: string) => {
      console.debug('ChainPickerMulti: debounceSearch', searchTerm)
      applyFilters()
    }, 400)

    const applyFilters = () => {
      const allChains = store.state.asset.list as IAsset[]
      let filtered = [...allChains]

      // Apply search filter
      if (search.value.length >= 2) {
        filtered = filtered.filter((chain: IAsset) => {
          return chain.name.toLowerCase().includes(search.value.toLowerCase()) ||
                 chain.code?.toLowerCase().includes(search.value.toLowerCase()) ||
                 chain.id.toLowerCase().includes(search.value.toLowerCase())
        })
      }

      // Apply type filter
      if (filterType.value) {
        switch (filterType.value) {
          case 'active':
            filtered = filtered.filter(chain => chain.active)
            break
          case 'parachain':
            filtered = filtered.filter(chain => chain.parachain)
            break
          case 'relay':
            filtered = filtered.filter(chain => !chain.parachain)
            break
          case 'polkadot':
            filtered = filtered.filter(chain => chain.parent === 'polkadot' || chain.id === 'polkadot')
            break
          case 'kusama':
            filtered = filtered.filter(chain => chain.parent === 'kusama' || chain.id === 'kusama')
            break
        }
      }

      // Apply prop-based filters
      if (props.showParachainsOnly) {
        filtered = filtered.filter(chain => chain.parachain)
      }
      
      if (props.showRelayChainsOnly) {
        filtered = filtered.filter(chain => !chain.parachain)
      }
      
      if (props.parentChain) {
        filtered = filtered.filter(chain => chain.parent === props.parentChain || chain.id === props.parentChain)
      }

      filteredChains.value = filtered
    }

    const isSelected = (chain: IAsset): boolean => {
      return selectedChains.value.some(selected => selected.id === chain.id)
    }

    const toggleSelection = (chain: IAsset) => {
      if (!props.allowInactive && !chain.active) {
        snackText.value = 'Chain is not active'
        snackbar.value = true
        return
      }

      if (props.maxSelections && selectedChains.value.length >= props.maxSelections && !isSelected(chain)) {
        snackText.value = `Maximum ${props.maxSelections} selections allowed`
        snackbar.value = true
        return
      }

      if (isSelected(chain)) {
        selectedChains.value = selectedChains.value.filter(selected => selected.id !== chain.id)
      } else {
        selectedChains.value.push(chain)
      }
    }

    const clearSelection = () => {
      selectedChains.value = []
    }

    const confirmSelection = () => {
      console.debug('ChainPickerMulti: confirmSelection', selectedChains.value)
      context.emit('selectChains', [...selectedChains.value])
      showMe.value = false
    }

    const closeDialog = () => {
      console.debug('ChainPickerMulti: closeDialog()')
      context.emit('closeDialog')
      showMe.value = false
    }

    onMounted(() => {
      nextTick(() => {
        const el = document.getElementById('search')
        if (el) el.focus()
      })
    })

    return {
      showMe,
      search,
      selectedChains,
      filteredChains,
      snackbar,
      snackText,
      filterType,
      filterOptions,
      onSearch,
      applyFilters,
      isSelected,
      toggleSelection,
      clearSelection,
      confirmSelection,
      closeDialog
    }
  }
})
</script>

<style scoped>
.inactive {
  filter: grayscale(100%);
}

.bg-grey-lighten-4 {
  background-color: rgb(var(--v-theme-grey-lighten-4));
}
</style>
