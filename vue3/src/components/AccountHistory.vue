<template>
  <v-card elevation="0" style="background: none;">
    <v-toolbar density="compact" style="background: none;">
      <div variant="text" class="text-none font-weight-bold">History ({{ profile.defaultCurrency }})</div>
      <v-spacer></v-spacer>
      <v-btn icon size="small" @click="refetch" :loading="loading">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- <v-card-title>
      History ({{ profile.defaultCurrency }})
      <v-btn flat icon @click="refetch" :loading="loading"><v-icon size="v-small">mdi-refresh</v-icon></v-btn>
    </v-card-title> -->

    <v-card-text>
      <!-- <v-progress-linear indeterminate v-show="loading"></v-progress-linear> -->
      <Line id="account-history" :options="chartOptions" :data="chartData"></Line>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useQuery } from '@vue/apollo-composable'
import moment from 'moment'
import { QUERY_ACCOUNT_VALUE_HISTORY } from '@/graphql';
import { useGlobalUtils } from './utils'

import { Line } from 'vue-chartjs'
// import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, TimeSeriesScale, CategoryScale, LinearScale } from 'chart.js'
import 'chartjs-adapter-moment'

export default defineComponent({
  name: 'PortfolioHistory',
  components: {
    Line
  },
  props: {
    accountId: String,
    periods: {
      type: Number,
      default: 50
    },
    granularity: {
      type: String,
      default: 'DAY'
    }
  },
  setup(props) {
    const store = useStore()
    const profile = computed(() => store.state.profile)
    // const periods = ref(props.periods)
    // const granularity = ref(props.granularity)
    const { toCoin } = useGlobalUtils()
    const isDarkMode = computed(() => store.state.isDarkMode)
    
    const variables = {
      accountId: props.accountId,
      tCurr: profile.value.defaultCurrency, // 'GBP'
      periods: props.periods,
      granularity: props.granularity
    }
    const { result, loading, refetch } = useQuery(QUERY_ACCOUNT_VALUE_HISTORY, variables, {
      fetchPolicy: 'cache-and-network', // 'cache-first'
    })

    const chartOptions = computed<any>(() => {
      return {
        responsive: true,
        animation: {
          duration: 0
        },
        title: {
          display: false,
          // text: 'Price History'
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        elements: {
          line: {
            tension: 0.2,
            backgroundColor: isDarkMode.value ? 'white' : 'rgba(0,0,0,0)',
            borderColor: isDarkMode.value ? 'grey' : 'rgba(0,0,0,0.5)',
            borderWidth: 1,
          },
          point: {
            radius: 1.5,
            pointStyle: 'crosshair',
          }
        },
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            callbacks: {
              title: (context: any) => {
                // console.debug('title', context)
                return moment.utc(context[0].parsed.x).format(profile.value.dateTimeFormat)
              },
              // label: (context: any) => {
              //   // console.debug('label', context)
              //   const label = context.dataset.label || ''
              //   if (label) {
              //     return `${ label }: ${ context.parsed.y }`
              //   }
              //   return `${ context.parsed.y.toFixed(profile.value.defaultDecimals) } ${ result.value?.Asset?.symbol }`
              // }
            }
          }
        },
        scales: {
          y: {
            position: 'right',
            border: {
              color: 'red'
            },
            ticks: {
              color: 'red'
            },
            title: {
              display: true,
              text: `Value (${profile.value.defaultCurrency})`
            },
          },
          y1: {
            position: 'left',
            border: {
              color: 'purple'
            },
            ticks: {
              color: 'purple'
            },
            title: {
              display: true,
              text: `Token (${result.value?.Account.Asset?.code})`
            }
          },
          x: {
            type: 'timeseries',
            adapters: {
              date: {
                // locale: 'en' // FIXME, use profile.value.locale
                locale: profile.value.locale
              }
            }
          }
        }
      }
    })
    const chartData = computed(() => {
      return {
        // labels: [ 'January', 'February', 'March' ],
        // labels: result.value?.PriceHistory?.slice(0, periods.value).map((m) => m.key) || [],
        labels: result.value?.Account.valueHistory?.map((m: any) => m.datetime) || [],
        datasets: [ {
          // data: [40, 20, 12]
          // data: result.value?.PriceHistory?.slice(0, periods.value).map((m) => m.price) || []
          yAxisID: 'y',
          borderColor: 'red', // isDarkMode.value ? 'red' : 'rgba(0,0,0,0.5)',
          label: 'Value',
          data: result.value?.Account.valueHistory?.map((m: any) => {
            const assetId = result.value.Account.Asset.id
            const coinVal = toCoin(assetId, m.closing_balance)
            // console.debug('coinVal', assetId, coinVal)
            return coinVal * m.closing_price
          }) || []
        }, {
          yAxisID: 'y1',
          borderColor: 'purple', // isDarkMode.value ? 'blue' : 'rgba(0,0,0,0.5)',
          label: 'Token',
          data: result.value?.Account.valueHistory?.map((m: any) => {
            const assetId = result.value.Account.Asset.id
            return toCoin(assetId, m.closing_balance)
          }) || []
        } ]
      }
    })

    return {
      profile,
      result,
      loading,
      refetch,
      chartData,
      chartOptions
    }
  },
})
</script>
