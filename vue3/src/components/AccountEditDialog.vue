<template>
  <v-btn>
    <v-icon :icon="icon"></v-icon>
    <v-dialog v-model="x_visible" activator="parent" maxWidth="800px">
      <v-card>
        <v-card-title>Edit Account</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" validateOn="input">
            <v-row>
              <v-text-field v-model="_account.name"
                label="Name"
                :rules="rules.name"
                v-on:keyup.enter="saveAccount()"></v-text-field>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="tonal" color="red" @click="closeDialog()">Close</v-btn>
          <v-btn variant="outlined" :disabled="!valid" color="primary" :loading="loading" @click="saveAccount()">Save</v-btn>
        </v-card-actions>
      </v-card>  
    </v-dialog>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, watch, ref, PropType } from 'vue'
// import CurrencyPickerDialog from './CurrencyPickerDialog.vue'
import { useMutation } from '@vue/apollo-composable'
import { ICurrency, IAccount, IAccountBalance, IAsset } from './types'
import { MUT_PORTFOLIO_EDIT } from '@/graphql'

export default defineComponent({
  components: {
    // CurrencyPickerDialog
  },
  emits: ['closeDialog', 'accountSaved'],
  props: {
    account: {
      type: Object as PropType<IAccount>,
      // required: true,
      default: () => ({})
    },
    visible: Boolean,
    icon: {
      type: String,
      default: 'mdi-plus'
    }
  },
  setup(props, context) {

    const form = ref<HTMLFormElement>()
    const rules = {
      // address: [
      //   (v: string) => !!v || 'Address is required',
      //   (v: string) => v.length >= 8 || 'Address must be more than 8 characters',
      // ],
      name: [ (val:string) => !!val || 'Name is required' ],
      // currency: [ (val: any) => {
      //   console.debug('rules.currency', val)
      //   return !!val?.symbol || 'Currency is required'
      // } ]
    }

    const _account = ref<IAccount>({ id: '', name: '', assetId: '', Asset: {} as IAsset, address: '', balance: {} as IAccountBalance, transactions: [] })
    _account.value.name = props.account.name
    _account.value.id = props.account.id
    const x_visible = ref(false)

    var showPicker = ref(false)
    var currency = ref<ICurrency>({} as ICurrency)
    var currencyEl = ref<HTMLFormElement>()
    var valid = ref(false)

    watch(() => props.account, (newVal) => {
      _account.value.id = newVal?.id
      _account.value.name = newVal?.name
    })

    watch(() => props.visible, (newVal) => {
      // console.debug('watch.visible', newVal)
      x_visible.value = newVal
    })

    const closeDialog = () => {
      x_visible.value = false
      context.emit('closeDialog')
    }

    var { mutate, loading, error } = useMutation(MUT_PORTFOLIO_EDIT, () => ({
      variables: {
        id: _account.value?.id,
        name: _account.value?.name,
      }
    }));

    const saveAccount = async () => {
      // console.debug('saveAccount', _account.value)
      const variables = { id: _account.value?.id, name: _account.value?.name };
      // console.debug('variables', variables)
      const res: any = await mutate(variables);
      console.debug(res)
      if (res.data) {
        const { success, message, account } = res.data.saveAccount
        if(success) {
          context.emit('accountSaved')
          closeDialog()
        } else {
          console.error('saveAccount', message)
        }
      }
    }

    return {
      x_visible,
      _account,
      loading,
      currency,
      currencyEl,
      showPicker,
      name,
      // address,
      valid,
      rules,
      // onClosePicker,
      // onSelectCurrency,
      saveAccount,
      closeDialog,
    }

  },

})
</script>
