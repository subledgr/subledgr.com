<template>
  <v-dialog v-model="dialog" persistent maxWidth="600">
    <v-card>
      <v-card-title>Select Asset</v-card-title>
      <!-- <v-btn @click="dialog=false">Close</v-btn> -->
      <v-divider></v-divider>
      <v-card-text style="height: 300px;">
        <asset-list @selectAsset="onSelectAsset"></asset-list>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="closeDialog()"
        >
          Close
        </v-btn>
        <!-- <v-btn
          color="blue-darken-1"
          variant="text"
          @click="dialog = false"
        >
          Save
        </v-btn> -->
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
  setup (props) {
    // console.log('props', props)
    // const visible = props.visible
    const dialog = ref(false)
    watch(props, () => {
      // console.debug('watch.props', props.visible)
      dialog.value = props.visible
    })
    return {
      dialog
    }
  },
  data: () => {
    return {
      // dialog: false,
      dialogm1: 1
    }
  },
  methods: {
    onSelectAsset (item: any) {
      console.debug('AssetPickerDialog.vue: onSelectAsset', item)
      this.$emit('selectAsset', item)
      console.debug('closeOnSelect', this.closeOnSelect)
      if(this.closeOnSelect) this.dialog = false
    },
    closeDialog () {
      console.debug('AssetPickerDialog.vue: closeDialog()')
      this.$emit('closeDialog')
      this.dialog = false
    }
  }
})
</script>
