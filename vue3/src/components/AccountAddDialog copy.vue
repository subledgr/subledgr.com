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
              <v-select multiple
                v-model="assets"
                :items="assetList"
                item-title="name"
                item-value="id"
                :error="false"
                :errorMessages="!assets?.length ? 'Asset is required' : undefined"
                @click="showAssetPicker=false">
                <!-- <template v-slot:append-inner>
                  <v-avatar v-show="!!asset?.logo" density="compact">
                    <v-img :src="assets[0]?.logo"></v-img>
                  </v-avatar>
                </template> -->
                <!-- {{ assets[0]?.name || assets[0]?.code }} -->
              </v-select>
            </v-row>
            <v-row>
              <v-select multiple
                v-model="blockchains"
                :items="blockchainList"
                item-title="name"
                item-value="id"
                :error="false"
                :errorMessages="!blockchains?.length ? 'Blockchain is required' : undefined"
                @click="showBlockchainPicker=false">
              </v-select>

              <!-- <blockchain-picker-multi-dialog
                :visible="showBlockchainPicker"
                @selectBlockchain="onSelectBlockchains"
                @closeDialog="onCloseBlockchainPicker"></blockchain-picker-multi-dialog>

              <asset-picker-multi-dialog
                :visible="showAssetPicker"
                @selectAsset="onSelectAssets"
                @closeDialog="onCloseAssetPicker"></asset-picker-multi-dialog> -->
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
import { defineComponent, watch, ref, computed } from 'vue'
import { useStore } from 'vuex'
import AssetPickerDialog from './AssetPickerDialog.vue'
import { useQuery, useMutation, useApolloClient } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import { IAsset, IBlockchain } from './types'
import AssetPickerMultiDialog from './AssetPickerMultiDialog.vue'
import BlockchainPickerMultiDialog from './BlockchainPickerMultiDialog.vue'

const MUT_ACCOUNT_ADD = gql`
  mutation CreateAccount($name: String!, $address: String!, $blockchainIds: [String]!, $assetIds: [String]!) {
    createAccount(name: $name, address: $address, blockchainIds: $blockchainIds, assetIds: $assetIds) {
      id
      name
      address
      Asset {
        id
        code
      }
      Chain {
        id
        code
      }
    }
  }
`

export default defineComponent({
  components: {
    AssetPickerMultiDialog,
    BlockchainPickerMultiDialog
  },
  props: {
    visible: Boolean,
    icon: {
      type: String,
      default: 'mdi-plus'
    }
  },
  setup(props, context) {

    const store = useStore()
    const assetList = computed<IAsset[]>(() => store.state.asset.list)
    const blockchainList = computed<IBlockchain[]>(() => store.state.blockchain.list)

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
    var assets = ref<IAsset[]>([])
    // var assetEl = ref<HTMLFormElement>()
    var valid = ref(false)
    var showAssetPicker = ref(false)
    var showBlockchainPicker = ref(false)
    var blockchains = ref<IBlockchain[]>([])
    // var blockchainMultiEl = ref<HTMLFormElement>()

    watch(() => props.visible, (newVal: boolean) => {
      console.debug('watch.props.visible', newVal)
      showMe.value = newVal
    })

    watch(() => showMe.value, (newVal: boolean) => {
      console.debug('watch.showMe', newVal)
      if(!newVal) closeDialog()
    })

    // watch(() => assetList.value, (newVal) => {
    //   console.debug('watch.assetList', newVal)
    //   assets.value = newVal
    // }, { immediate: true, deep: true })
    // watch(() => blockchainList.value, (newVal) => {
    //   console.debug('watch.blockchainList', newVal)
    //   blockchains.value = newVal
    // })

    watch(() => showAssetPicker.value, (newVal) => {
      console.debug('watch.showAssetPicker', newVal)
      showAssetPicker.value = newVal
    })

    watch(() => showBlockchainPicker.value, (newVal) => {
      console.debug('watch.showBlockchainPicker', newVal)
      showBlockchainPicker.value = newVal
    })

    const closeDialog = () => {
      console.debug('AccountAddDialog.vue: closeDialog()')
      showAssetPicker.value = false
      showBlockchainPicker.value = false
      // showMe.value = false
      assets.value = []
      blockchains.value = []
      name.value = ''
      address.value = ''
      // the activator is a button in this component, emit won't close the dialog
      // context.emit('closeDialog', false)
      showMe.value = false
    }

    const onCloseBlockchainPicker = () => {
      console.debug('AccountAddDialog.vue: onCloseBlockchainPicker')
      showBlockchainPicker.value = false
    }

    const onCloseAssetPicker = () => {
      console.debug('AccountAddDialog.vue: onCloseAssetPicker')
      showAssetPicker.value = false
    }

    const onSelectAssets = (items: IAsset[]) => {
      showAssetPicker.value = false
      console.debug('AccountAddDialog.vue: onSelectAssets', items)
      assets.value = items
      console.log('checking validity')
      form.value?.checkValidity()
      form.value?.resetValidation()
    }

    const onSelectBlockchains = (items: IBlockchain[]) => {
      console.debug('AccountAddDialog.vue: onSelectBlockchains', items)
      blockchains.value = items
      console.log('checking validity')
      form.value?.checkValidity()
      form.value?.resetValidation()
    }

    var { mutate, loading, error, onDone, onError } = useMutation(MUT_ACCOUNT_ADD, () => ({
      variables: {
        name: name.value,
        address: address.value,
        assetIds: assets?.value.map((a: IAsset) => a.id) || [],
        blockchainIds: blockchains?.value.map((b: IBlockchain) => b.id) || []
      }
    }));

    onDone((data) => {
      console.debug('onDone', data)
    })

    onError((data) => {
      console.debug('onError', data)
    })

    const addAccount = async () => {
      console.debug('addAccount', name.value, {...assets.value}, {...blockchains.value}, address.value)
      const input = {
        name: name.value,
        assetIds: assets?.value.map((a: IAsset) => a.id) || [],
        blockchainIds: blockchains?.value.map((b: IBlockchain) => b.id) || [],
        address: address.value
      };
      const res: any = await mutate(input);
      console.debug(res)
      if (res) {
        const account = res
        context.emit('accountAdded', account)
        closeDialog()
      }
    }

    return {
      showMe,
      assetList,
      assets,
      blockchainList,
      blockchains,
      // assetEl,
      showBlockchainPicker,
      // assetEl,
      showAssetPicker,
      name,
      address,
      valid,
      rules,
      onCloseAssetPicker,
      onCloseBlockchainPicker,
      onSelectAssets,
      onSelectBlockchains,
      addAccount,
      closeDialog,
    }

  },

})
</script>
