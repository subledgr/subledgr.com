<template>
  <v-btn>
    <v-icon :icon="icon"></v-icon>

    <v-dialog v-model="x_visible" activator="parent" maxWidth="800px">
      <v-card>
        <v-card-title>Edit Portfolio</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" validateOn="input">
            <!-- Valid: {{ valid }} -->
            <v-row>
              <v-text-field v-model="name" label="Name" :rules="rules.name"></v-text-field>
            </v-row>
            <v-row>
              <v-text-field readonly
                :error="false"
                :errorMessages="!currency?.name ? 'Currency is required' : undefined"
                @click="showPicker=true">
                <template v-slot:append-inner>
                  <v-avatar v-show="!!currency?.logo" density="compact">
                    <v-img :src="currency?.logo"></v-img>
                  </v-avatar>
                </template>
                {{ currency?.name || currency?.code }}
              </v-text-field>
              <currency-picker-dialog :visible="showPicker"
                :closeOnSelect="true"
                @selectCurrency="onSelectCurrency"
                @closeDialog="onClosePicker"></currency-picker-dialog>
            </v-row>
            <v-row>
              <v-text-field v-model="address" label="address" :rules="rules.address"></v-text-field>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="tonal" color="red" @click="closeDialog()">Close</v-btn>
          <v-btn variant="outlined" :disabled="!valid" color="primary" @click="addPortfolio()">Add</v-btn>
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
// import { SynchronousCachePersistor } from 'apollo3-cache-persist'
// import { emit } from 'process'
// import { useForm } from 'vuetify'
import { IAsset, ICurrency } from './types'

const MUT_PORTFOLIO_ADD = gql`
  mutation CreatePortfilio($name: String!, $currencyCode: String!) {
    createPortfolio(name: $name, currencyCode: $currencyCode) {
      success
      message
      portfolio {
        id
        name
        Currency {
          code
        }
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
      address: [
        (v: string) => !!v || 'Address is required',
        (v: string) => v.length >= 8 || 'Address must be more than 8 characters',
      ],
      name: [ (val:string) => !!val || 'Name is required' ],
      currency: [ (val: any) => {
        console.debug('rules.currency', val)
        return !!val?.symbol || 'Currency is required'
      } ]
    }

    const visible = ref(props.visible)
    const x_visible = ref(false)
    var showPicker = ref(false)
    var currency = ref<ICurrency>({} as ICurrency)
    var currencyEl = ref<HTMLFormElement>()
    var valid = ref(false)

    watch(() => visible.value, (newVal) => {
      console.debug('watch.visible', newVal)
      x_visible.value = newVal
    })

    watch(() => showPicker.value, (newVal) => {
      console.debug('watch.showAssetPicker', newVal)
      showPicker.value = newVal
    })

    const closeDialog = () => {
      showPicker.value = false
      x_visible.value = false
      currency.value = {} as ICurrency
      name.value = ''
      address.value = ''
    }

    const onClosePicker = () => {
      showPicker.value = false
    }

    const onSelectCurrency = (item: IAsset) => {
      showPicker.value = false
      console.debug('PortfolioAddDialog.vue: onSelectCurrency', item)
      currency.value = item
      console.log('checking validity')
      form.value?.checkValidity()
      form.value?.resetValidation()
    }

    var { mutate, loading, error } = useMutation(MUT_PORTFOLIO_ADD, () => ({
      variables: {
        name: name.value,
        currencyCode: currency?.value.code || '',
        // address: address.value
      }
    }));

    const addPortfolio = async () => {
      console.debug('addPortfolio', name.value, {...currency.value}, address.value)
      const input = { name: name.value, currencyCode: currency?.value.code, address: address.value };
      const res: any = await mutate(input);
      console.debug(res)
      if (res.data) {
        const { success, message, portfolio } = res.data.createPortfolio
        if(success) {
          context.emit('PortfolioAdded')
          closeDialog()
        }
      }
    }

    return {
      x_visible,
      currency,
      currencyEl,
      showPicker,
      name,
      address,
      valid,
      rules,
      onClosePicker,
      onSelectCurrency,
      addPortfolio,
      closeDialog,
    }

  },

})
</script>
