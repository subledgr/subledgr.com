<template>
  <v-dialog v-model="showMe" maxWidth="800px">
    <v-card :style="`background: ${theme.current.value.colors.background}`">
      <v-card-title>Edit Portfolio</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" validateOn="input">
          <v-row>
            <v-text-field v-model="portfolioName"
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
</template>

<script lang="ts">
import { defineComponent, watch, ref, PropType } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { ThemeDefinition, useTheme } from 'vuetify'

import { ICurrency, IPortfolio } from './types'
import { MUT_PORTFOLIO_EDIT } from '@/graphql'

import { useGlobalUtils } from './utils'

export default defineComponent({
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

    const theme = useTheme()
    console.debug('theme', theme.current.value.dark)
    const { handleError } = useGlobalUtils()
    // const form = ref<HTMLFormElement>()

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

    const portfolioName = ref(props.portfolio.name)
    const portfolioId = ref(props.portfolio.id)
    
    const showMe = ref(false)
    var currency = ref<ICurrency>({} as ICurrency)
    var currencyEl = ref<HTMLFormElement>()
    var valid = ref(false)

    watch(() => props.portfolio, (newVal) => {
      portfolioId.value = newVal?.id
      portfolioName.value = newVal?.name
    })

    watch(() => props.visible, (newVal) => {
      // console.debug('watch.showMe', newVal)
      showMe.value = newVal
      console.debug('theme', theme.current.value.colors)
    })

    watch(() => showMe.value, (newVal) => {
      // console.debug('watch.showMe', newVal)
      if (!newVal) {
        context.emit('closeDialog')
      }
    })

    const closeDialog = () => {
      // console.debug('closeDialog')
      showMe.value = false
      context.emit('closeDialog')
    }

    var { mutate, loading, error, onError } = useMutation(MUT_PORTFOLIO_EDIT, () => ({
      variables: {
        id: portfolioId.value,
        name: portfolioName.value,
      }
    }));

    onError((error: any) => {
      console.error(error)
      handleError(error)
    })

    const savePortfolio = async () => {
      // console.debug('savePortfolio', l_portfolio.value)
      const variables = { id: portfolioId.value, name: portfolioName.value };
      // console.debug('variables', variables)
      const res: any = await mutate(variables);
      // console.debug(res)
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
      theme,
      portfolioName,
      currency,
      currencyEl,
      showMe,
      valid,
      rules,
      savePortfolio,
      closeDialog,
    }

  },

})
</script>
