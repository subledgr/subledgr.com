<template>
    <v-dialog v-model="x_visible" maxWidth="800px">
      <template v-slot:activator="{ props }">
        <v-btn v-if="icon !== ''">
          <v-icon :icon="icon" v-show="icon"></v-icon>
        </v-btn>
      </template>
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-card-title>Select Wallets for {{ portfolio?.name }}</v-card-title>
          <v-card-text>
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="items"
              show-select>
              <template v-slot:[`item.active`]="{ item }">
                {{ item.columns?.active ? 'Yes' : 'No' }}
              </template>
              <template v-slot:[`item.address`]="{ item }">
                {{ item.columns?.address }}
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="tonal" color="red" @click="closeDialog()">Close</v-btn>
            <v-btn @click="setPortfolioWallets()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed, PropType } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { IPortfolio, IWallet } from './types'

const QUERY_PORTFOLIO_WALLETS = gql`
query PortfolioWallets {
  #Portfolio(id: $portfolioId) {
  #  id
  #  name
  #  Wallets {
  #    id
  #  }
  #}
  Wallets {
    id
    name
    address
    Asset {
      id
      code
      name
    }
  }
}`

const MUT_PORTFOLIO_SET_WALLETS = gql`
  mutation SetPortfolioWallets($id: Int!, $walletIds: [String]!) {
    setPortfolioWallets(id: $id, walletIds: $walletIds) {
      success
      message
      portfolio {
        id
        name
        Currency {
          code
        }
        Wallets {
          id
          name
          Asset {
            id
            code
          }
        }
      }
    }
  }
`

export default defineComponent({
  props: {
    visible: Boolean,
    icon: {
      type: String,
      default: 'mdi-plus'
    },
    portfolio: {
      type: Object as PropType<IPortfolio>
    }
  },
  emits: ['closeDialog', 'openDialog'],
  setup(props, { emit }) {

    // const visible = computed(() => props.visible)
    const x_visible = ref(false) // ref(props.visible)
    const wallets = ref<IWallet[]>()
    const currentWalletIds = props.portfolio?.Wallets.map((wallet: IWallet) => wallet.id) || []
    // console.debug('currentWalletIds', currentWalletIds)
    const headers = [
      { key: 'active', title: 'Active' },
      // { key: 'id', title: 'ID' },
      { key: 'name', title: 'Name' },
      { key: 'code', title: 'Code' },
      // { key: 'asset', title: 'Asset' }
    ]
    const search = ref('')
    const items = computed(() => wallets.value?.map((w: IWallet) => {
      // if (search.value === '' || !w.name.toLowerCase().includes(search.value.toLowerCase())) {
        return {
          id: w.id,
          name: w.name,
          address: w.address,
          active: currentWalletIds.includes(w.id) ? true : false,
          code: w.Asset.code,
          asset: w.Asset.name
        }
      // }
    }))
    const selected = ref(props.portfolio?.Wallets?.map((w: IWallet) => w.id ))

    const { result, loading, error, onResult, refetch } = useQuery(QUERY_PORTFOLIO_WALLETS, {
      // portfolioId: Number(route.params.portfolioId)
    }, {
      fetchPolicy: 'cache-and-network',
      // fetchPolicy: 'no-cache',
      // pollInterval: 1000,
    });
    onResult((queryResult) => {
      // console.debug('onResult', queryResult)
      // if (queryResult.partial) return
      wallets.value = queryResult.data?.Wallets || []
      selected.value = props.portfolio?.Wallets?.map((w: IWallet) => w.id )
    })

    watch(() => props.visible, (newVal) => {
      console.debug('watch.visible', newVal)
      x_visible.value = newVal
    })

    watch(() => x_visible.value, (newVal) => {
      console.debug('watch.x_visible', newVal)
      if(!newVal) {
        emit('closeDialog')
      } else {
        emit('openDialog')
      }
    })

    var { mutate, loading: loading2, error: error2 } = useMutation(MUT_PORTFOLIO_SET_WALLETS, () => ({
      variables: {
        id: props.portfolio?.id,
        walletIds: selected.value,
      }
    }));
    const setPortfolioWallets = async () => {
      console.debug('setPortfolioWallets')
      console.debug(selected.value?.map((m: string) => m))

      const res: any = await mutate({
        id: props.portfolio?.id,
        walletIds: selected.value
      })
      console.debug(res)
      if (res.data?.setPortfolioWallets?.success) {
        emit('closeDialog')
      }
    }

    const closeDialog = () => {
      // showAssetPicker.value = false
      x_visible.value = false
      // currency.value = { symbol: '', logo: undefined }
      // name.value = ''
      // address.value = ''
    }

    return {
      error,
      x_visible,
      headers,
      items,
      search,
      selected,
      wallets,
      // addWallet,
      setPortfolioWallets,
      closeDialog,
    }

  },

})
</script>
