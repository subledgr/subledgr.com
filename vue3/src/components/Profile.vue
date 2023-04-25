<template>
  <v-container fluid class="py-0 px-0">

    <v-toolbar density="compact">
      <v-toolbar-title>
        Profile
      </v-toolbar-title>
    </v-toolbar>

    |{{ user }}|
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, watch} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup () {
    const store = useStore()
    const loggedIn = computed(() => store.getters.loggedIn)
    const router = useRouter()
    if (!loggedIn.value) {
      router.push('/login')
    }
    watch(() => loggedIn.value, (newVal, oldVal) => {
      console.debug('loggedIn.value', newVal, oldVal)
      if (!newVal) router.push('/')
    })

    const user = computed(() => store.getters.user )
    // const data = {}
    return {
      user
    }
  }
})
</script>
