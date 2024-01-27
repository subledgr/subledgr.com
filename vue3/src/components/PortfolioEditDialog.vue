<template>
  <v-btn>
    <v-icon :icon="icon"></v-icon>
    <v-dialog v-model="x_visible" activator="parent" maxWidth="800px">
      <v-card>
        <v-card-title>Edit Portfolio</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" validateOn="input">
            <v-row>
              <v-text-field v-model="l_portfolio.name"
                label="Name"
                :rules="rules.name"
                v-on:keyup.enter="savePortfolio()"></v-text-field>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="tonal" color="red" @click="closeDialog()">Close</v-btn>
          <v-btn variant="outlined" :disabled="!valid" color="primary" @click="savePortfolio()">Save</v-btn>
        </v-card-actions>
      </v-card>  
    </v-dialog>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, watch, ref, PropType } from 'vue'
import { useMutation } from '@vue/apollo-composable'

import { ICurrency, IPortfolio } from './types'
import { MUT_PORTFOLIO_EDIT } from '@/graphql'

import { useGlobalUtils } from './utils'

export default defineComponent({
  components: {
    // CurrencyPickerDialog
  },
  emits: ['closeDialog', 'portfolioSaved'],
  props: {
    portfolio: {
      type: Object as PropType<IPortfolio>,
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

    const { handleError } = useGlobalUtils()
    const form = ref<HTMLFormElement>()
    // const name = ref('')
    // const address = ref('')
    const rules = {
    //   address: [
    //     (v: string) => !!v || 'Address is required',
    //     (v: string) => v.length >= 8 || 'Address must be more than 8 characters',
    //   ],
      name: [ (val:string) => !!val || 'Name is required' ],
    //   currency: [ (val: any) => {
    //     console.debug('rules.currency', val)
    //     return !!val?.symbol || 'Currency is required'
    //   } ]
    }

    // const visible = ref(props.visible)
    const l_portfolio = ref<IPortfolio>({ id: '', name: '', Currency: {} as ICurrency, status: '', start_date: '', Accounts: [] })
    l_portfolio.value.name = props.portfolio.name
    l_portfolio.value.id = props.portfolio.id
    const x_visible = ref(false)

    var showPicker = ref(false)
    var currency = ref<ICurrency>({} as ICurrency)
    var currencyEl = ref<HTMLFormElement>()
    var valid = ref(false)

    watch(() => props.portfolio, (newVal) => {
      l_portfolio.value.id = newVal?.id
      l_portfolio.value.name = newVal?.name
    })

    watch(() => props.visible, (newVal) => {
      // console.debug('watch.visible', newVal)
      x_visible.value = newVal
    })

    const closeDialog = () => {
      x_visible.value = false
      context.emit('closeDialog')
    }

    var { mutate, loading, error, onError } = useMutation(MUT_PORTFOLIO_EDIT, () => ({
      variables: {
        id: l_portfolio.value?.id,
        name: l_portfolio.value?.name,
      }
    }));

    onError((error: any) => {
      console.error(error)
      handleError(error)
    })

    const savePortfolio = async () => {
      // console.debug('savePortfolio', l_portfolio.value)
      const variables = { id: l_portfolio.value?.id, name: l_portfolio.value?.name };
      // console.debug('variables', variables)
      const res: any = await mutate(variables);
      console.debug(res)
      if (res.data) {
        const { success, message, portfolio } = res.data.savePortfolio
        if(success) {
          context.emit('portfolioSaved')
          closeDialog()
        } else {
          console.error('savePortfolio', message)
        }
      }
    }

    return {
      x_visible,
      l_portfolio,
      currency,
      currencyEl,
      showPicker,
      name,
      // address,
      valid,
      rules,
      // onClosePicker,
      // onSelectCurrency,
      savePortfolio,
      closeDialog,
    }

  },

})
</script>
