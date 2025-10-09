<template>
  <v-dialog v-model="showMe" persistent maxWidth="600">
    <v-card>
      <v-card-title>Select Blockchain</v-card-title>
      <!-- <v-btn @click="showMe=false">Close</v-btn> -->

      <v-card-text style="height: 350px; overflow-y: auto;">
        <!-- <v-divider></v-divider> -->
        <blockchain-list @selectBlockchain="onSelectBlockchain"></blockchain-list>
        <!-- <v-divider></v-divider> -->
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="closeDialog()"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import BlockchainList from './BlockchainList.vue';

export default defineComponent({
  components: {
    BlockchainList
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: 'mdi-link-variant'
    },
    closeOnSelect: {
      type: Boolean,
      default: true
    }
  },
  emits: ['selectBlockchain', 'closeDialog'],
  setup (props, context) {
    const showMe = ref(false)

    watch(() => props.visible, (newVal: boolean) => {
      console.debug('BlockchainPickerDialog: watch.props.visible', props.visible)
      showMe.value = newVal
    })

    watch(() => showMe.value, (newVal: boolean) => {
      console.debug('BlockchainPickerDialog: watch.showMe', showMe.value)
      if (!newVal) context.emit('closeDialog', newVal)
    })

    const onSelectBlockchain = (item: any) => {
      console.debug('BlockchainPickerDialog.vue: onSelectBlockchain', item)
      context.emit('selectBlockchain', item)
      console.debug('closeOnSelect', props.closeOnSelect)
      if(props.closeOnSelect) showMe.value = false
    }

    const closeDialog = () => {
      console.debug('BlockchainPickerDialog.vue: closeDialog()')
      context.emit('closeDialog')
      showMe.value = false
    }

    return {
      showMe,
      onSelectBlockchain,
      closeDialog
    }
  }
})
</script>
