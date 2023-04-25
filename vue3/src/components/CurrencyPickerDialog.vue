<template>
  <!-- <v-btn> -->
    <!-- <v-icon :icon="icon"></v-icon> -->
    <v-dialog v-model="dialog" persistent maxWidth="600">
      <v-card>
          <v-card-title>Select Currency</v-card-title>
          <!-- <v-btn @click="dialog=false">Close</v-btn> -->
          <v-divider></v-divider>
          <v-card-text style="height: 300px;">
            <currency-list @selectCurrency="onSelectCurrency"></currency-list>
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
  <!-- </v-btn> -->
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import CurrencyList from './CurrencyList.vue';
export default defineComponent({
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
    console.log('props', props)
    // const visible = props.visible
    const dialog = ref(false)
    watch(props, () => {
      console.debug('watch.props', props.visible)
      dialog.value = props.visible
    })
    return {
      dialog
    }
  },
  components: {
    CurrencyList
  },
  data: () => {
    return {
      // dialog: false,
      dialogm1: 1
    }
  },
  methods: {
    onSelectCurrency (item: any) {
      console.debug('CurrencyPickerDialog.vue: onSelectCurrency', item)
      this.$emit('selectCurrency', item)
      console.debug('closeOnSelect', this.closeOnSelect)
      if(this.closeOnSelect) this.dialog = false
    },
    closeDialog () {
      console.debug('CurrencyPickerDialog.vue: closeDialog()')
      this.$emit('closeDialog')
      this.dialog = false
    }
  }
})
</script>
