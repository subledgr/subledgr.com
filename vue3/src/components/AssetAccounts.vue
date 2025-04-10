<template>
  <v-container>
    <v-toolbar style="background: none;">
      <v-toolbar-title>
        Accounts
      </v-toolbar-title>
    </v-toolbar>
    <!-- {{ items }} -->
    <v-list max-height="200" :loading="loading" style="background: none;">
      <v-list-item v-for="item in list" v-bind:key="item.id" :to="`/account/${item.id}`">
        <template v-slot:prepend>
          <v-icon>mdi-wallet-outline</v-icon>
        </template>
        <v-list-item-title>{{ item.name }}</v-list-item-title>
        <template v-slot:append>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-list-item>
      <v-list-item v-show="(list?.length || 0) < 1 && !loading">
        <i>This asset is not used in any accounts</i>
      </v-list-item>
    </v-list>

  </v-container>
</template>

<script lang="ts">

import { defineComponent, ref, computed, type PropType } from 'vue'
import { IAccount } from './types'
// import { useQuery } from '@vue/apollo-composable';
// import { useStore } from 'vuex';

export default defineComponent({
  props: {
    list: {
      type: Object as PropType<IAccount[]>,
      required: true
    }
  },
  setup (props) {
    const items = computed(() => props.list.map((account: IAccount) => {
      return {
        id: account.id,
        name: account.name,
        value: account.balance
      }
    }))
    const loading = ref(false)
    return {
      items,
      loading
    }
  }
})
</script>
