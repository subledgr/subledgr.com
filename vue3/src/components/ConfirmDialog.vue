<template>
  <v-dialog v-model="showDialog" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <span>{{ message }}</span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" @click="confirm">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: false,
      default: 'Confirm',
    },
    message: {
      type: String,
      required: true,
    },
    confirm: {
      type: Function,
      required: true,
    },
    close: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    // const confirm = () => {
    //   console.log('confirm')
    // }    
    // const close = () => {
    //   console.log('close')
    // }
    const showDialog = ref(false)
    watch(
      () => props.modelValue,
      (value) => {
        console.log('modelValue', value)
        showDialog.value = value
      },
    )
    return {
      showDialog,
      // confirm,
      // close,
    }
  },
})
</script>
