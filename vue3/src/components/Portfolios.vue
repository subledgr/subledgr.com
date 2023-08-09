<template>
  <v-container fluid class="py-0 px-0">

    <v-toolbar density="compact">
      <v-toolbar-title>
        Portfolios
      </v-toolbar-title>
    </v-toolbar>
    
    <v-list>
      <!-- <v-list-item v-for="item in list" v-bind:key="item.id">
        {{ item.name }} ({{ item.currency }})
      </v-list-item> -->
    </v-list>
    <v-card>
      <v-card-title>Portfolios</v-card-title>
      <v-card-text>
        <p>
          Portfolios will allow the user to group accounts from any currency into a named portfolio. 
          A portfolio can represent a business function, set of investments, or a project.
        </p>
        <p>
          A portfolio will have a reporting currency, which will be used to convert all transactions into the reporting currency.
        </p>
        <p>
          The same features for <router-link to="/asset">assets</router-link> & <router-link to="/wallet">wallets</router-link> (accounts) should be available at portfolio level, eg. 
          transactions, balances, reports, etc.
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  data () {
    return {
      list: [
        // { id: 1, name: 'Wallet 1', currency: 'DOT' },
        // { id: 2, name: 'Wallet 2', currency: 'KSM' }
      ]
    }
  }
})
</script>
