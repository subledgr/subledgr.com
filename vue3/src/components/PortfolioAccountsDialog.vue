<template>
    <v-dialog v-model="x_visible" maxWidth="800px">
      <template v-slot:activator="{ props }">
        <v-btn v-if="icon !== ''">
          <v-icon :icon="icon" v-show="icon"></v-icon>
        </v-btn>
      </template>
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-card-title>Select Accounts for {{ portfolio?.name }}</v-card-title>
          <v-card-text>
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="items"
              show-select>
              <template v-slot:[`item.active`]="{ item }">
                {{ item.active ? 'Yes' : 'No' }}
              </template>
              <template v-slot:[`item.address`]="{ item }">
                {{ item.address }}
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="tonal" color="red" @click="closeDialog()">Close</v-btn>
            <v-btn @click="setPortfolioAccounts()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed, PropType } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { IPortfolio, IAccount } from './types'

// TODO: move this to ../graphql/
const QUERY_PORTFOLIO_ACCOUNTS = gql`
query PortfolioAccounts {
  #Portfolio(id: $portfolioId) {
  #  id
  #  name
  #  Accounts {
  #    id
  #  }
  #}
  Accounts {
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

// TODO: move this to ../graphql/
const MUT_PORTFOLIO_SET_ACCOUNTS = gql`
  mutation SetPortfolioAccounts($id: String!, $accountIds: [String]!) {
    setPortfolioAccounts(id: $id, accountIds: $accountIds) {
      success
      message
      portfolio {
        id
        name
        # Currency {
        #   code
        # }
        Accounts {
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
    const accounts = ref<IAccount[]>()
    const currentAccountIds = props.portfolio?.Accounts.map((account: IAccount) => account.id) || []
    // console.debug('currentAccountIds', currentAccountIds)
    const headers = [
      { key: 'active', title: 'Active' },
      // { key: 'id', title: 'ID' },
      { key: 'name', title: 'Name' },
      { key: 'code', title: 'Code' },
      // { key: 'asset', title: 'Asset' }
    ]
    const search = ref('')
    const items = computed(() => accounts.value?.map((w: IAccount) => {
      // if (search.value === '' || !w.name.toLowerCase().includes(search.value.toLowerCase())) {
        return {
          id: w.id,
          name: w.name,
          address: w.address,
          active: currentAccountIds.includes(w.id) ? true : false,
          code: w.Asset.code,
          asset: w.Asset.name
        }
      // }
    }))
    const selected = ref(props.portfolio?.Accounts?.map((w: IAccount) => w.id ))

    const { result, loading, error, onResult, refetch } = useQuery(QUERY_PORTFOLIO_ACCOUNTS, {
      // portfolioId: Number(route.params.portfolioId)
    }, {
      fetchPolicy: 'cache-and-network',
      // fetchPolicy: 'no-cache',
      // pollInterval: 1000,
    });
    onResult((queryResult) => {
      // console.debug('onResult', queryResult)
      // if (queryResult.partial) return
      accounts.value = queryResult.data?.Accounts || []
      selected.value = props.portfolio?.Accounts?.map((w: IAccount) => w.id )
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

    var { mutate, loading: loading2, error: error2 } = useMutation(MUT_PORTFOLIO_SET_ACCOUNTS, () => ({
      variables: {
        id: props.portfolio?.id,
        accountIds: selected.value,
      }
    }));
    const setPortfolioAccounts = async () => {
      console.debug('setPortfolioAccounts')
      console.debug(selected.value?.map((m: string) => m))

      const res: any = await mutate({
        id: props.portfolio?.id,
        accountIds: selected.value
      })
      console.debug(res)
      if (res.data?.setPortfolioAccounts?.success) {
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
      accounts,
      // addAccount,
      setPortfolioAccounts,
      closeDialog,
    }

  },

})
</script>
