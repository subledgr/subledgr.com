<template>
  <v-dialog v-model="showMe" max-width="600">
    <v-card>
      <v-card-title>Download Transactions</v-card-title>

      <v-card-text>
        <!-- <v-row>
          <v-col cols="12">
            <v-select
              readonly
              v-model="xAccount.id"
              :items="list"
              :item-title="getAccountSelectName"
              item-value="id"></v-select>
          </v-col>
        </v-row> -->
        <v-row>
          <v-text-field label="Account" v-model="xAccount.name" readonly></v-text-field>
        </v-row>
        <v-row>
          <v-text-field label="Chain" v-model="xAccount.Asset.name" readonly></v-text-field>
        </v-row>
        <v-row>
          <v-text-field label="Address" v-model="xAccount.address" readonly></v-text-field>
        </v-row>
        <v-form v-model="form">
          <v-row>
            <v-col cols="6">
              <v-text-field v-model="offset" label="Offset"
              :rules="[rules.isInteger, rules.isPositive]"></v-text-field>
            </v-col>
            <!-- <v-col cols="6">
              <v-text-field v-model="limit" label="Limit"
              :rules="[rules.required, rules.isInteger, rules.isPositive, rules.max10000]"></v-text-field>
            </v-col> -->
            <v-col cols="6">
              <v-select label="Limit"
                v-model="limit"
                :items="[1000, 5000, 10000]"
                ></v-select>
            </v-col>
          </v-row>
        </v-form>
        <v-row>
          <v-col cols="12">
            <v-btn @click="startDownload()" :loading="loading" :disabled="!form">Download</v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeDialog">Close</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, PropType } from 'vue'
import { useStore } from 'vuex';
import { useQuery, useApolloClient } from '@vue/apollo-composable';
import moment from 'moment';
import { QUERY_TRANSACTIONS, QUERY_ACCOUNTS_SELECT } from '@/graphql'
import { ITransaction, IAccount, IProfile } from './types';
import { useGlobalUtils } from './utils';
// import { apolloProvider } from '@/plugins/apollo/index';

export default defineComponent({
  name: 'TransactionDownload',
  props: {
    showDialog: {
      type: Boolean
    },
    account: {
      type: Object as PropType<IAccount>,
      required: true
    }
  },
  emits: ['dialogClose'],
  setup(props, context) {

    const store = useStore()
    const profile = computed<IProfile>(() => store.state.profile)
    const { shortStash, toCoin } = useGlobalUtils()
    const showMe = ref(false)
    // console.debug('account', props.account)
    const xAccount = computed(() => props.account)
    const offset = ref(0)
    const limit = ref(1000)
    const loading = ref(false)
    const form = ref(true)
    const rules = ref({
      required: (value: any) => !!value || 'Required.',
      isInteger: (value: any) => Number.isInteger(Number(value)) || 'Must be an integer',
      isPositive: (value: any) => (Number(value) >= 0) || 'Must be positive',
      max10000: (value: any) => (Number(value) <= 10000) || 'Max 10000',
    })
    // const apolloClient = apolloProvider.defaultClient
    const { client: apolloClient } = useApolloClient()
    console.debug(apolloClient.link)

    watch(() => props.showDialog, newVal => {
      // console.debug('watch.showDialog()', newVal)
      // console.debug('watch.showDialog()', props.transaction)
      showMe.value = newVal
    })
    watch(() => showMe.value, newVal => {
      if(!newVal) context.emit('dialogClose', newVal)
    })
    const closeDialog = () => {
      // console.debug('closeDialog()')
      showMe.value = false
      context.emit('dialogClose', false)
    }

    const list = ref<IAccount[]>([])
    const { result: accountsResult, refetch: accountsRefetch, onResult: accountsOnResult } = useQuery(QUERY_ACCOUNTS_SELECT)
    accountsRefetch()
    accountsOnResult((result) => {
      // console.debug('accountsOnResult', result.data.Accounts)
      list.value = result.data?.Accounts
    })

    async function startDownload() {
      console.debug('startDownload')
      loading.value = true
      const { data, error } = await apolloClient.query({
        query: QUERY_TRANSACTIONS, 
        variables: {
          ids: [xAccount.value.id],
          limit: Number(limit.value),
          offset: Number(offset.value),
        },
        fetchPolicy: 'network-only'
      })
      loading.value = false
      if (error) {
        console.error('error', error)
        return
      } else {
        console.debug('data', data)
        const csvData = convertJSONToCSV(data.Transactions || []);
        downloadCSV(csvData, `transactions-${xAccount.value.Asset.code}-${xAccount.value.address}.csv`)
      }
    }

    const convertJSONToCSV = (transactions: ITransaction[]) => {
      // Implement the conversion logic here
      // Convert the JSON data into a CSV string
      let csvContent = `account,block,extrinsic,timestamp,from,to,amount,${xAccount.value.Asset.code},fee,section,method,success\n`;
      // Loop through your JSON data and format it as CSV
      transactions.forEach((t) => {
        // const values = Object.values(transaction);
        // const csvRow = values.map((value) => `"${value}"`).join(',');
        // const extrinsicId = (t.extrinsicId || '--').split('-').filter((x) => Number.isInteger(x)).join('-')
        const parts = t.extrinsicId?.split('-') || ['','','']
        const extrinsicId = `${Number(parts[0])}-${Number(parts[2])}`
        const csvRow = `"${xAccount.value.address}",`
          + `${t.blockNumber},`
          + `"${extrinsicId}",`
          + `${moment.unix(t.timestamp/1000).format(profile.value.dateTimeFormat)},`
          + `"${t.fromId}","${t.toId}",`
          + `${t.amount},`
          + `${toCoin(xAccount.value.Asset.id, t.amount)},`
          + `${t.fee},`
          + `${t.section},`
          + `${t.method},`
          + `${t.success}`
        csvContent += `${csvRow}\n`;
      });
      return csvContent;
    }

    const downloadCSV = (csvData: string, fileName: string) => {
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }

    const getAccountSelectName = (account: IAccount) => {
      // console.debug('getAccountSelectName', account)
      return `${account.name} (${account.Asset.id}), ${shortStash(account.address)}`
    }

    return {
      showMe,
      xAccount,
      offset,
      limit,
      accountsResult,
      list,
      loading,
      form,
      rules,
      startDownload,
      closeDialog,
      getAccountSelectName
    }
  }
})
</script>
