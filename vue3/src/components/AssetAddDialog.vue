<template>
  <v-btn>

    <!-- 
    
        NOT CURRENTLY USED?
    
    -->
    <v-icon :icon="icon"></v-icon>

    <v-dialog v-model="x_visible" activator="parent" maxWidth="800px">
      <v-card>
        <v-card-title>Add Account</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" validateOn="blur">
            <!-- Valid: {{ valid }} -->
            <v-row>
              <v-text-field v-model="name" label="Name" :rules="rules.name" autocomplete="off"></v-text-field>
            </v-row>
            <v-row>
              <!-- <v-text-field readonly :rules="rules.currency"></v-text-field> -->
              <v-text-field readonly
                :error="false"
                :errorMessages="!currency.symbol ? 'Asset is required' : undefined"
                @click="showAssetPicker=true">
                <template v-slot:append-inner>
                  <v-avatar  v-show="!!currency.logo" density="compact">
                    <v-img :src="currency.logo"></v-img>
                  </v-avatar>
                </template>
                {{ currency.symbol }}
              </v-text-field>
              <currency-picker-dialog :visible="showAssetPicker"
                :closeOnSelect="true"
                @selectAsset="onSelectAsset"
                @closeDialog="onCloseAssetPicker"></currency-picker-dialog>
            </v-row>
            <v-row>
              <v-text-field v-model="address" label="address" :rules="rules.address"></v-text-field>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="tonal" color="red" @click="closeDialog()">Close</v-btn>
          <v-btn variant="outlined" :disabled="!valid" color="primary" @click="addAccount()">Add</v-btn>
        </v-card-actions>
      </v-card>
  
    </v-dialog>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'
import AssetPickerDialog from './AssetPickerDialog.vue'
import { useQuery, useMutation, useApolloClient } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { SynchronousCachePersistor } from 'apollo3-cache-persist'
// import { emit } from 'process'
// import { useForm } from 'vuetify'

const MUT_ACCOUNT_ADD = gql`
  mutation CreateAccount($name: String!, $currencyCode: String!, $address: String!) {
    createAccount(name: $name, currencyCode: $currencyCode, address: $address) {
      success
      message
      account {
        id
        name
        address
      }
    }
  }
`

export default defineComponent({
  components: {
    AssetPickerDialog
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
        return !!val?.symbol || 'Asset is required'
      } ]
    }
    // const emits = defineEmits(['accountAdded'])

    const visible = ref(props.visible)
    const x_visible = ref(false)
    var showAssetPicker = ref(false)
    var currency = ref({ symbol: '', logo: undefined })
    var currencyEl = ref<HTMLFormElement>()
    var valid = ref(false)

    watch(() => visible.value, (newVal) => {
      console.debug('watch.visible', newVal)
      x_visible.value = newVal
    })

    watch(() => showAssetPicker.value, (newVal) => {
      console.debug('watch.showAssetPicker', newVal)
      showAssetPicker.value = newVal
    })

    const closeDialog = () => {
      showAssetPicker.value = false
      x_visible.value = false
      currency.value = { symbol: '', logo: undefined }
      name.value = ''
      address.value = ''
    }

    const onCloseAssetPicker = () => {
      showAssetPicker.value = false
    }

    const onSelectAsset = (item: any) => {
      showAssetPicker.value = false
      console.debug('AccountAddDialog.vue: onSelectAsset', item)
      currency.value = item
      console.log('checking validity')
      form.value?.checkValidity()
      form.value?.resetValidation()
    }

    var { mutate, loading, error } = useMutation(MUT_ACCOUNT_ADD, () => ({
      variables: {
        name: name.value,
        currencyCode: currency.value.symbol,
        address: address.value
      }
    }));

    const addAccount = async () => {
      console.debug('addAccount', name.value, {...currency.value}, address.value)
      const input = { name: name.value, currencyCode: currency.value.symbol, address: address.value };
      const res: any = await mutate(input);
      console.debug(res)
      if (res.data) {
        const { success, message, account } = res.data.createAccount
        if(success) context.emit('accountAdded')
      }
    }

    return {
      x_visible,
      currency,
      currencyEl,
      showAssetPicker,
      name,
      address,
      valid,
      rules,
      onCloseAssetPicker,
      onSelectAsset,
      addAccount,
      closeDialog,
    }

  },

})
</script>
