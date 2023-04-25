<template>
  <v-container fluid>

    <v-toolbar density="compact">
      <v-toolbar-title>
        Currencies
      </v-toolbar-title>
      <v-toolbar-items>
        <!-- <v-btn icon @click="showPicker=true">
          <v-icon>mdi-plus</v-icon>
        </v-btn> -->
        <currency-picker-dialog @selectCurrency="onSelectCurrency"></currency-picker-dialog>

      </v-toolbar-items>
    </v-toolbar>

    <currency-list @selectCurrency="onSelectCurrency"></currency-list>
    <!-- <v-list>
      <v-list-item v-for="item in list" v-bind:key="item.symbol">
        {{ item.name }} ({{ item.symbol }})
      </v-list-item>
    </v-list> -->

</v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CurrencyList from './CurrencyList.vue';
import CurrencyPickerDialog from './CurrencyPickerDialog.vue';

export default defineComponent({
  name: 'WalletsC',
  setup () {
  },
  components: {
    CurrencyList,
    CurrencyPickerDialog
  },
  data () {
    return {
      showPicker: false,
      list: [
        { symbol: 'DOT', name: 'Polkadot' },
        { symbol: 'KSM', name: 'Kusama' }
      ]
    }
  },
  methods: {
    onSelectCurrency (item: any) {
      console.debug('Currencies.vue: onSelectCurrency()', item)
    }
  }
})
</script>
