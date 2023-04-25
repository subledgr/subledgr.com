<template>
  <v-btn>
    <v-icon :icon="icon"></v-icon>

    <v-dialog v-model="x_visible" activator="parent" maxWidth="800px">
      <v-card>
        <v-card-title>Add Wallet</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" validateOn="blur">
            <!-- Valid: {{ valid }} -->
            <v-row>
              <v-text-field v-model="name" label="Name" :rules="rules.name"></v-text-field>
            </v-row>
            <v-row>
              <!-- <v-text-field readonly :rules="rules.currency"></v-text-field> -->
              <v-text-field readonly
                :error="false"
                :errorMessages="!currency.symbol ? 'Currency is required' : undefined"
                @click="showCurrencyPicker=true">
                <template v-slot:append-inner>
                  <v-avatar  v-show="!!currency.logo" density="compact">
                    <v-img :src="currency.logo"></v-img>
                  </v-avatar>
                </template>
                {{ currency.symbol }}
              </v-text-field>
              <currency-picker-dialog :visible="showCurrencyPicker"
                :closeOnSelect="true"
                @selectCurrency="onSelectCurrency"
                @closeDialog="onCloseCurrencyPicker"></currency-picker-dialog>
            </v-row>
            <v-row>
              <v-text-field v-model="address" label="address" :rules="rules.address"></v-text-field>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="tonal" color="red" @click="closeDialog()">Close</v-btn>
          <v-btn variant="outlined" :disabled="!valid" color="primary" @click="addWallet()">Add</v-btn>
          <!-- Valid: {{ valid }} -->
        </v-card-actions>
      </v-card>
  
    </v-dialog>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'
import CurrencyPickerDialog from './CurrencyPickerDialog.vue'
import { useQuery, useMutation, useApolloClient } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { SynchronousCachePersistor } from 'apollo3-cache-persist'
// import { emit } from 'process'
// import { useForm } from 'vuetify'

const MUT_WALLET_ADD = gql`
  mutation CreateWallet($name: String!, $currencyCode: String!, $address: String!) {
    createWallet(name: $name, currencyCode: $currencyCode, address: $address) {
      success
      message
      wallet {
        id
        name
        address
      }
    }
  }
`

export default defineComponent({
  components: {
    CurrencyPickerDialog
  },
  props: {
    visible: Boolean,
    icon: {
      type: String,
      default: 'mdi-plus'
    }
  },
  setup(props, context) {

    const form = ref<HTMLFormElement>()
    const name = ref('')
    const address = ref('')
    const rules = {
      address: [(v: string) => !!v || 'Address is required'],
      name: [ (val:string) => !!val || 'Name is required' ],
      currency: [ (val: any) => {
        console.debug('rules.currency', val)
        return !!val?.symbol || 'Currency is required'
      } ]
    }
    // const emits = defineEmits(['walletAdded'])

    const visible = ref(props.visible)
    const x_visible = ref(false)
    var showCurrencyPicker = ref(false)
    var currency = ref({ symbol: '', logo: undefined })
    var currencyEl = ref<HTMLFormElement>()
    var valid = ref(false)

    watch(() => visible.value, (newVal) => {
      console.debug('watch.visible', newVal)
      x_visible.value = newVal
    })

    watch(() => showCurrencyPicker.value, (newVal) => {
      console.debug('watch.showCurrencyPicker', newVal)
      showCurrencyPicker.value = newVal
    })

    const closeDialog = () => {
      showCurrencyPicker.value = false
      x_visible.value = false
      currency.value = { symbol: '', logo: undefined }
      name.value = ''
      address.value = ''
    }

    const onCloseCurrencyPicker = () => {
      showCurrencyPicker.value = false
    }

    const onSelectCurrency = (item: any) => {
      showCurrencyPicker.value = false
      console.debug('WalletAddDialog.vue: onSelectCurrency', item)
      currency.value = item
      console.log('checking validity')
      form.value?.checkValidity()
      form.value?.resetValidation()
    }

    var { mutate, loading, error } = useMutation(MUT_WALLET_ADD, () => ({
      variables: {
        name: name.value,
        currencyCode: currency.value.symbol,
        address: address.value
      }
    }));

    const addWallet = async () => {
      console.debug('addWallet', name.value, {...currency.value}, address.value)
      const input = { name: name.value, currencyCode: currency.value.symbol, address: address.value };
      const res: any = await mutate(input);
      console.debug(res)
      if (res.data) {
        const { success, message, wallet } = res.data.createWallet
        if(success) context.emit('walletAdded')
      }
    }

    return {
      x_visible,
      currency,
      currencyEl,
      showCurrencyPicker,
      name,
      address,
      valid,
      rules,
      onCloseCurrencyPicker,
      onSelectCurrency,
      addWallet,
      closeDialog,
    }

  },

})
</script>
