<template>
  <div>
    <span class="click-to-copy" @click.stop="copyToClipboard()">{{display || text}}</span>
    <v-snackbar
      :absolute="false"
      bottom
      v-model="snackbar"
    >
      {{ snackText }}
      <template v-slot:actions>
        <v-btn
          color="pink"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
export default defineComponent({
  props: ['text', 'display'],
  setup (props) {
    const snackbar = ref(false)
    const snackText = ref('')
    // console.debug('ClickToCopy.vue: setup', props)

    // watch(() => props.text, (newVal: string) => {
    //   console.debug('watch.props.text', props.text, newVal)
    //   // if (newVal) {
    //   //   // showMe.value = newVal
    //   //   snackText.value = newVal
    //   //   snackbar.value = true
    //   //   setTimeout(() => { snackbar.value = false }, 2000)
    //   // }
    // })

    const copyToClipboard = async () => {
      console.debug('ClickToCopy.vue: copyToClipboard', props.text)
      // navigator clipboard api needs a secure context (https)
      if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        navigator.clipboard.writeText(props.text)
      } else {
        // text area method
        const textArea = document.createElement('textarea')
        textArea.value = props.text
        // make the textarea out of viewport
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        await new Promise((resolve, reject) => {
          // here the magic happens
          document.execCommand('copy') ? resolve(1) : reject(new Error('no reason'))
          textArea.remove()
        })
      }
      snackText.value = 'Copied to clipboard'
      snackbar.value = true
      setTimeout(() => { snackbar.value = false }, 2000)
    }
    return {
      snackbar,
      snackText,
      copyToClipboard
    }
  }
})
</script>
<style scoped>
.click-to-copy:hover {
  cursor: pointer;
  text-decoration-line: underline;
  text-decoration-style: dotted;
}
</style>
