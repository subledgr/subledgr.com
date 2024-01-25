<template>
  <v-btn>
    <v-icon :icon="icon"></v-icon>

    <v-dialog v-model="showMe" activator="parent" maxWidth="800px">
      <v-card>
        <v-card-title>Add Account</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" validateOn="input">
            <!-- Valid: {{ valid }} -->
            <v-row>
              <v-text-field v-model="name" label="Name" :rules="rules.name"></v-text-field>
            </v-row>
            <v-row>
              <!-- <v-text-field readonly :rules="rules.asset"></v-text-field> -->
              <v-text-field readonly
                :error="false"
                :errorMessages="!asset?.name ? 'Asset is required' : undefined"
                @click="showAssetPicker=true">
                <template v-slot:append-inner>
                  <v-avatar v-show="!!asset?.logo" density="compact">
                    <v-img :src="asset?.logo"></v-img>
                  </v-avatar>
                </template>
                {{ asset?.name || asset?.code }}
              </v-text-field>
              <asset-picker-dialog
                :visible="showAssetPicker"
                @selectAsset="onSelectAsset"
                @closeDialog="onCloseAssetPicker"></asset-picker-dialog>
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
          <!-- Valid: {{ valid }} -->
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
// import { SynchronousCachePersistor } from 'apollo3-cache-persist'
// import { emit } from 'process'
// import { useForm } from 'vuetify'
import { IAsset } from './types'

const MUT_ACCOUNT_ADD = gql`
  mutation CreateAccount($name: String!, $assetId: String!, $address: String!) {
    createAccount(name: $name, assetId: $assetId, address: $address) {
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
      address: [
        (v: string) => !!v || 'Address is required',
        (v: string) => v.length >= 8 || 'Address must be more than 8 characters',
      ],
      name: [ (val:string) => !!val || 'Name is required' ],
      asset: [ (val: any) => {
        console.debug('rules.asset', val)
        return !!val?.symbol || 'Asset is required'
      } ]
    }

    const showMe = ref(false)
    var showAssetPicker = ref(false)
    var asset = ref<IAsset>({} as IAsset)
    var assetEl = ref<HTMLFormElement>()
    var valid = ref(false)

    watch(() => props.visible, (newVal: boolean) => {
      console.debug('watch.props.visible', newVal)
      showMe.value = newVal
    })

    watch(() => showMe.value, (newVal: boolean) => {
      console.debug('watch.showMe', newVal)
      if(!newVal) closeDialog()
    })

    watch(() => showAssetPicker.value, (newVal) => {
      console.debug('watch.showAssetPicker', newVal)
      showAssetPicker.value = newVal
    })

    const closeDialog = () => {
      console.debug('AccountAddDialog.vue: closeDialog()')
      showAssetPicker.value = false
      // showMe.value = false
      asset.value = {} as IAsset
      name.value = ''
      address.value = ''
      // the activator is a button in this component, emit won't close the dialog
      // context.emit('closeDialog', false)
      showMe.value = false
    }

    const onCloseAssetPicker = () => {
      console.debug('AccountAddDialog.vue: onCloseAssetPicker')
      showAssetPicker.value = false
    }

    const onSelectAsset = (item: IAsset) => {
      showAssetPicker.value = false
      console.debug('AccountAddDialog.vue: onSelectAsset', item)
      asset.value = item
      console.log('checking validity')
      form.value?.checkValidity()
      form.value?.resetValidation()
    }

    var { mutate, loading, error, onDone, onError } = useMutation(MUT_ACCOUNT_ADD, () => ({
      variables: {
        name: name.value,
        assetId: asset?.value.id || '',
        address: address.value
      }
    }));

    onDone((data) => {
      console.debug('onDone', data)
    })

    onError((data) => {
      console.debug('onError', data)
    })

    const addAccount = async () => {
      console.debug('addAccount', name.value, {...asset.value}, address.value)
      const input = { name: name.value, assetId: asset?.value.id, address: address.value };
      const res: any = await mutate(input);
      console.debug(res)
      if (res.data) {
        const { success, message, account } = res.data.createAccount
        if(success) {
          context.emit('accountAdded', account)
          closeDialog()
        }
      }
    }

    return {
      showMe,
      asset,
      assetEl,
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
