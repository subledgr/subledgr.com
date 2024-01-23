<template>
  <v-dialog v-model="showMe" persistent maxWidth="600">
    <v-card>
      <v-card-title>Select Asset</v-card-title>
      <!-- <v-btn @click="showMe=false">Close</v-btn> -->

      <v-card-text style="height: 350px; overflow-y: auto;">
        <!-- <v-divider></v-divider> -->
        <asset-list @selectAsset="onSelectAsset"></asset-list>
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
import AssetList from './AssetList.vue';

export default defineComponent({
  components: {
    AssetList
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: 'mdi-currency-sign'
    },
    closeOnSelect: {
      type: Boolean,
      default: true
    }
  },
  emits: ['selectAsset', 'closeDialog'],
  setup (props, context) {
    const showMe = ref(false)

    watch(() => props.visible, (newVal: boolean) => {
      console.debug('watch.props.visible', props.visible)
      showMe.value = newVal
    })

    watch(() => showMe.value, (newVal: boolean) => {
      console.debug('watch.showMe', showMe.value)
      if (!newVal) context.emit('closeDialog', newVal)
    })

    const onSelectAsset = (item: any) => {
      console.debug('AssetPickerDialog.vue: onSelectAsset', item)
      context.emit('selectAsset', item)
      console.debug('closeOnSelect', props.closeOnSelect)
      if(props.closeOnSelect) showMe.value = false
    }

    const closeDialog = () => {
      console.debug('AssetPickerDialog.vue: closeDialog()')
      context.emit('closeDialog')
      showMe.value = false
    }

    return {
      showMe,
      onSelectAsset,
      closeDialog
    }
  }
})
</script>
