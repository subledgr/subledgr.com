<template>
  <v-dialog v-model="showMe" persistent maxWidth="700">
    <v-card>
      <v-card-title>
        <span>Select Blockchains</span>
        <v-spacer></v-spacer>
        <v-chip v-if="selectedBlockchains.length > 0" color="primary" variant="outlined">
          {{ selectedBlockchains.length }} selected
        </v-chip>
      </v-card-title>
      
      <v-divider></v-divider>
      
      <v-card-text style="height: 450px; overflow-y: auto;">
        <!-- Search -->
        <v-text-field
          v-model="search"
          id="search"
          ref="input"
          label="Search blockchains"
          @input="onSearch(search)"
          autofocus
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          class="mb-4"
        ></v-text-field>

        <!-- Blockchain List -->
        <v-list>
          <v-list-item
            v-for="(blockchain) in filteredBlockchains"
            :key="blockchain.id"
            @click="toggleSelection(blockchain)"
            :class="{ 'bg-grey-lighten-4': isSelected(blockchain) }"
          >
            <template v-slot:prepend>
              <v-checkbox
                :model-value="isSelected(blockchain)"
                @click.stop="toggleSelection(blockchain)"
                color="primary"
                hide-details
              ></v-checkbox>
            </template>
            
            <template v-slot:append>
              <v-avatar density="compact" class="ml-2">
                <v-img 
                  :src="blockchain.logo"
                  :alt="blockchain.name"
                ></v-img>
              </v-avatar>
            </template>
            
            <v-list-item-title>
              <div class="d-flex align-center flex-wrap">
                <span class="font-weight-medium">{{ blockchain.name }}</span>
                
                <!-- Blockchain Symbol -->
                <v-chip
                  v-if="blockchain.symbol"
                  size="x-small"
                  color="primary"
                  variant="outlined"
                  class="ml-2"
                >
                  {{ blockchain.symbol }}
                </v-chip>
              </div>
            </v-list-item-title>
            
            <template v-slot:append>
              <div class="d-flex align-center">
                <!-- Decimals Info -->
                <v-chip
                  v-if="blockchain.decimals"
                  size="x-small"
                  color="grey"
                  variant="text"
                  class="mr-2"
                >
                  {{ blockchain.decimals }}d
                </v-chip>
                
                <!-- Blockchain Type Indicator -->
                <v-icon 
                  color="blue" 
                  icon="mdi-link-variant"
                ></v-icon>
              </div>
            </template>
          </v-list-item>
        </v-list>

        <!-- Empty State -->
        <v-card v-if="filteredBlockchains.length === 0" class="mt-4" variant="outlined">
          <v-card-text class="text-center text-grey">
            <v-icon size="48" class="mb-2">mdi-magnify</v-icon>
            <div>No blockchains found matching your criteria</div>
            <div class="text-caption">Try adjusting your search</div>
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
          v-if="selectedBlockchains.length > 0"
          color="red"
          variant="text"
          @click="clearSelection"
        >
          Clear All ({{ selectedBlockchains.length }})
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
          :disabled="selectedBlockchains.length === 0"
          @click="confirmSelection"
        >
          Select {{ selectedBlockchains.length }} Blockchain{{ selectedBlockchains.length !== 1 ? 's' : '' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, nextTick, computed } from 'vue'
import { useStore } from 'vuex'
import debounce from 'lodash/debounce'
import { IBlockchain } from './types'

export default defineComponent({
  name: 'BlockchainPickerMultiDialog',
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
    preselectedBlockchains: {
      type: Array as () => IBlockchain[],
      default: () => []
    }
  },
  emits: ['selectBlockchain', 'closeDialog'],
  setup(props, context) {
    const store = useStore()
    const showMe = ref(false)
    const search = ref('')
    const selectedBlockchains = ref<IBlockchain[]>([])
    const filteredBlockchains = ref<IBlockchain[]>([])
    const snackbar = ref(false)
    const snackText = ref('')

    // Initialize with preselected blockchains
    watch(() => props.preselectedBlockchains, (newBlockchains) => {
      selectedBlockchains.value = [...newBlockchains]
    }, { immediate: true })

    watch(() => props.visible, (newVal: boolean) => {
      console.debug('BlockchainPickerMultiDialog: watch.props.visible', props.visible)
      showMe.value = newVal
      if (newVal) {
        // Reset search when dialog opens
        search.value = ''
        filteredBlockchains.value = []
      }
    })

    watch(() => showMe.value, (newVal: boolean) => {
      console.debug('BlockchainPickerMultiDialog: watch.showMe', showMe.value)
      if (!newVal) {
        context.emit('closeDialog', newVal)
      }
    })

    const onSearch = debounce((searchTerm: string) => {
      console.debug('BlockchainPickerMultiDialog: debounceSearch', searchTerm)
      applyFilters()
    }, 400)

    const applyFilters = () => {
      const allBlockchains = store.state.blockchain.list as IBlockchain[]
      let filtered = [...allBlockchains]

      // Apply search filter
      if (search.value.length >= 2) {
        filtered = filtered.filter((blockchain: IBlockchain) => {
          return blockchain.name.toLowerCase().includes(search.value.toLowerCase()) ||
                 blockchain.symbol?.toLowerCase().includes(search.value.toLowerCase()) ||
                 blockchain.id.toLowerCase().includes(search.value.toLowerCase())
        })
      }

      filteredBlockchains.value = filtered
    }

    const isSelected = (blockchain: IBlockchain): boolean => {
      return selectedBlockchains.value.some(selected => selected.id === blockchain.id)
    }

    const toggleSelection = (blockchain: IBlockchain) => {
      if (props.maxSelections && selectedBlockchains.value.length >= props.maxSelections && !isSelected(blockchain)) {
        snackText.value = `Maximum ${props.maxSelections} selections allowed`
        snackbar.value = true
        return
      }

      if (isSelected(blockchain)) {
        selectedBlockchains.value = selectedBlockchains.value.filter(selected => selected.id !== blockchain.id)
      } else {
        selectedBlockchains.value.push(blockchain)
      }
    }

    const clearSelection = () => {
      selectedBlockchains.value = []
    }

    const confirmSelection = () => {
      console.debug('BlockchainPickerMultiDialog: confirmSelection', selectedBlockchains.value)
      context.emit('selectBlockchain', [...selectedBlockchains.value])
      showMe.value = false
    }

    const closeDialog = () => {
      console.debug('BlockchainPickerMultiDialog: closeDialog()')
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
      selectedBlockchains,
      filteredBlockchains,
      snackbar,
      snackText,
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
.bg-grey-lighten-4 {
  background-color: rgb(var(--v-theme-grey-lighten-4));
}
</style>
