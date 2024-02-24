<template>
  <v-card elevation="0" style="background: none;">

    <v-card-text id="my-container" :style="`min-height: ${chartHeight}px;`">
      <v-row>
        <!-- <v-col>
          sm:{{ display.sm }}
          md:{{ display.md }}
          lg:{{ display.lg }}
          xl:{{ display.xl }}
        </v-col> -->
        <v-col align="center">
          <v-btn-toggle
            v-model="granularity"
            divided
          >
            <!-- <v-btn value="day">24h</v-btn> -->
            <v-btn style="background: none;" size="small" value="week">7d</v-btn>
            <v-btn style="background: none;" size="small" value="month">30d</v-btn>
            <v-btn style="background: none;" size="small" value="quarter">13w</v-btn>
            <v-btn style="background: none;" size="small" value="year">12m</v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
      <!-- <v-progress-linear indeterminate v-show="loading"></v-progress-linear> -->
      <!-- <v-skeleton-loader type="text" :loading="!renderChart" :style="renderChart ? 'background: none;' : ''"> -->
        <Line ref="chart" v-if="renderChart" id="value-history" :options="chartOptions" :data="chartData"></Line>
      <!-- </v-skeleton-loader> -->
      <Loading :loading="!renderChart" :contained="true"></Loading>
    </v-card-text>
    <!-- {{ chartOptions }} -->
    <!-- {{ chartData }} -->
    <!-- {{ isDarkMode }} -->

  </v-card>  
</template>

<script lang="ts">
import { defineComponent, computed, ref, onBeforeMount, onMounted, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useQuery } from '@vue/apollo-composable'
import { useDisplay } from 'vuetify'
import moment from 'moment'
import { ApolloQueryResult } from '@apollo/client/core'

import Loading from './Loading.vue'
import { QUERY_PORTFOLIO_HISTORY } from '@/graphql';
import { IAsset } from './types';

import { Line } from 'vue-chartjs'
// import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, TimeSeriesScale, CategoryScale, LinearScale } from 'chart.js'
import 'chartjs-adapter-moment'
// import { Chart } from 'chart.js'

export default defineComponent(
  {
  name: 'PortfolioHistory',
  components: {
    Line,
    Loading
  },
  props: {
    portfolioId: {
      type: String,
      required: true
    },
    // granularity: {
    //   type: String,
    //   default: 'day'
    // },
    periods: {
      type: Number,
      default: 50
    }
  },
  // ref: 'lineChart',
  setup(props, context) {
    const store = useStore()
    const profile = computed(() => store.state.profile)
    const portfolioId = computed(() => props.portfolioId)
    // const granularity = ref(() => props.granularity)
    const granularity = ref('week')
    const periods = computed(() => props.periods)
    const display = useDisplay()
    const isDarkMode = computed(() => store.state.isDarkMode)

    const chart = ref<HTMLCanvasElement>()
    onMounted(() => {
      console.debug('onMounted')
      // console.debug('myChart', myChart)
      // console.debug('chart', chart)
      nextTick(() => {
        console.debug('nextTick')
        // console.debug('myChart', myChart)
        // console.debug('chart', chart)
        // const chart = document.getElementById('value-history')
        // console.debug('chart', chart)
        // redraw() the chart
        const el = document.getElementById('value-history') as HTMLCanvasElement
        console.debug('el', el)
        // const ctx = el.getContext('2d')
        // console.debug('el', el, ctx)
        chart.value = el
      })
    })

    const canvasHeights = {
      xs: 323,
      sm: 380,
      md: 513,
      lg: 664,
      xl: 525
    }

    const chartHeight = computed(() => {
      // const display = useDisplay()
      console.debug('display', display)
      if (display.xl.value) return canvasHeights.xl
      if (display.lg.value) return canvasHeights.lg
      if (display.md.value) return canvasHeights.md
      if (display.sm.value) return canvasHeights.sm
      if (display.xs.value) return canvasHeights.xs
    })
    
    const granularities: Record<string, any> = {
      day: { granularity: 'hour', periods: 24 }, // 24 hours
      week: { granularity: 'day', periods: 7 }, // 7 days
      month: { granularity: 'day', periods: 30 }, // 30 days
      quarter: { granularity: 'week', periods: 13 }, // 30 days
      year: { granularity: 'month', periods: 12 } // 12 months
      // year: { granularity: 'week', periods: 52 } // 12 months
    }

    // const assetIds = assets.value.filter(f => f.active).map(m => m.code)
    // // console.debug('assetIds', assetIds)
    const variables = {
      // ids: assetIds, // ['KSM', 'DOT', 'DOCK'], // FIXME where should this go?
      portfolioId: portfolioId.value,
      // periods: periods.value,
      periods: granularities[granularity.value].periods,
      granularity: granularities[granularity.value].granularity,
      // tCurr: profile.value.defaultCurrency, // 'GBP'
    }

    const renderChart = ref(false)
    const assets = ref<IAsset[]>([])

    // const result = ref<any>(null)
    const { result, onResult, refetch } = useQuery(QUERY_PORTFOLIO_HISTORY, variables)

    watch(() => granularity.value, (newVal, oldVal) => {
      console.debug('granularity', newVal, oldVal)
      variables.granularity = granularities[newVal].granularity
      variables.periods = granularities[newVal].periods
      console.debug('variables', variables)
      refetch(variables)
      nextTick(() => {
        renderChart.value = false
      })

      // remove the chart from the DOM, and replace it with a new one
      // let el = document.getElementById('value-history') as HTMLCanvasElement
      // el.remove()
      // create a new component
      // const chart = defineComponent({
      //   components: {
      //     Line
      //   },
      //   setup() {
      //     return {
      //       chartData,
      //       chartOptions
      //     }
      //   },
      //   template: `<Line ref="chart" v-if="renderChart" id="value-history" :options="chartOptions" :data="chartData"></Line>`
      // })
    })

    type IConsolidatedBalances = Record<string, IConsolidatedBalanceItem[]>
    interface IConsolidatedBalanceItem {
      datetime: string
      closing_balance: number
      closing_value: number
    }

    onResult((result) => {
      console.debug('result', result.data?.Assets)
      if (result.partial) return
      // data.Portfolio.balanceHistory.balanceHistory accountId, assetId, balanceHistoryItems
      // consolidate items by assetId
      setChartData(result)
    })

    const setChartData = (result: ApolloQueryResult<any>) => {
      console.debug('setChartData', result)
      assets.value = result.data.Assets
      var consolidatedBalances: IConsolidatedBalances = {} // { polkadot: accumulatedBalanceHistory, kusama: accumuldatedBalanceHistory }
      result.data.Portfolio.balanceHistory.balanceHistory.reduce((acc: any, item: any) => {
        const { accountId, assetId, balanceHistory: items } = item
        if (!acc[assetId]) {
          acc[assetId] = items.map((m: any) => {
            // console.debug('m', m)
            const closing_balance = Number(m.closing_balance)
            return { ...m, closing_balance }
          })
        } else {
          acc[assetId] = acc[assetId].map((m: any, i: number) => { 
            m.closing_balance += Number(items[i].closing_balance)
            return m
          })
        }
        return acc
      }, consolidatedBalances)
      // console.debug('consolidatedBalances', consolidatedBalances, Object.keys(consolidatedBalances))

      var consolidatedValues: any = {}
      for (const assetId in consolidatedBalances) {
        const asset = result.data.Assets.find((a: any) => a.id === assetId);// assets.value.find((a: IAsset) => a.id === assetId)
        const prices = result.data.Portfolio.balanceHistory.priceHistory.find((p: any) => p.assetId === assetId)
        // console.debug('asset', assetId, asset, prices)
        
        if (display.lgAndUp) {
          // we summarist by asset
          if (asset) {
            consolidatedValues[assetId] = consolidatedBalances[assetId].map((m: IConsolidatedBalanceItem, idx: number) => {
              const to_coin = Number(m.closing_balance) / Math.pow( 10, asset.decimals )
              const price = prices.priceHistory[idx].closing_price
              return {
                datetime: m.datetime,
                closing_balance: m.closing_balance,
                to_coin,
                closing_price: price,
                closing_value: to_coin * price
              }
            })
          }
        
        } else {
          // show the totals, don't summarise by asset
          const summ = consolidatedBalances[assetId].map((m: IConsolidatedBalanceItem, idx: number) => {
            const to_coin = Number(m.closing_balance) / Math.pow( 10, asset.decimals )
            const price = prices.priceHistory[idx].closing_price
            return {
              datetime: m.datetime,
              closing_balance: m.closing_balance,
              to_coin,
              closing_price: price,
              closing_value: to_coin * price
            }
          })
          // if (consolidatedValues[profile.value.defaultCurrency]) {
          //   consolidatedValues[profile.value.defaultCurrency] = consolidatedValues[profile.value.defaultCurrency].map((m: IConsolidatedBalanceItem, idx: number) => {
          //     m.closing_value += summ[idx].closing_value
          //     return m
          //   })
          // } else {
          //   consolidatedValues[profile.value.defaultCurrency] = summ       
          // }
        }
      }
      console.debug('consolidatedValues', consolidatedValues)
      // data.Portfolio.balanceHistory.priceHistory assetId, f_curr, t_curr, priceHistoryItems
      // mulitple balances with price, per assetId

      // format data for chart
      chartData.value.labels = consolidatedValues[Object.keys(consolidatedValues)[0]]?.map((m: any) => m.datetime)
      chartData.value.datasets = Object.keys(consolidatedValues).map((assetId: string, idx: number) => {
        const asset = result.data.Assets.find((a: any) => a.id === assetId);
        // const color = asset?.color || 'black'
        return {
          label: asset?.code || assetId,
          data: consolidatedValues[assetId].map((m: any) => m.closing_value), // || [],
          // yAxisID: 'y',
          // borderColor: color, // isDarkMode.value ? 'red' : 'rgba(0,0,0,0.5)',
          borderColor: graphColours[assetId] || 'blue',
          backgroundColor: graphColours[assetId] || 'blue',
          filled: true,
        }
      })
      // trigger chart update
      console.debug('chartData', chartData.value)
      // setTimeout(() => {
        renderChart.value = true
      // }, 500)
    }

    watch(() => isDarkMode.value, (newVal, oldVal) => {
      console.debug('isDarkMode', newVal, oldVal)
      console.debug('chartData', result.value)
      // replace the chart component with a new one
      const chart = document.getElementById('value-history') as HTMLCanvasElement
    })

    const graphColours: Record<string, string> = {
      kusama: isDarkMode.value ? 'white' : 'black',
      polkadot: isDarkMode.value ? 'rgb(252,15,192)' : 'rgb(252, 15, 192)',
      dock: 'grey',
      acala: 'red',
    }

    const chartOptions = ref<any>({
        responsive: true,
        animation: {
          duration: 0
        },
        title: {
          display: false,
          text: 'Portfolio History'
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        elements: {
          line: {
            tension: 0.2, // higher = more curvy
            // backgroundColor: isDarkMode.value ? 'black' : 'white',
            // borderColor: isDarkMode.value ? 'none' : 'red',
            borderWidth: 2,
          },
          point: {
            radius: 1.5,
            pointStyle: 'crosshair',
          }
        },
        plugins: {
          legend: {
            display: true,
            // position below the chart
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              title: (context: any) => {
                // console.debug('title', context)
                return moment.utc(context[0].parsed.x).format(profile.value.dateTimeFormat)
              },
              label: (context: any) => {
                // console.debug('label', context.dataset.label)
                let asset = assets.value.find((a: IAsset) => a.code === context.dataset.label)
                // console.debug('asset', asset)
                const label = asset?.code || context.dataset.label || ''
                if (asset) {
                  return `${profile.value.defaultCurrency} ${ context.parsed.y.toLocaleString('en-GB', { maximumFractionDigits: profile.value.defaultDecimals }) } (${label})`
                }
                return `${ context.parsed.y.toFixed(profile.value.defaultDecimals) } ${ result.value?.Asset?.symbol }`
              }
            }
          }
        },
        scales: {
          x: {
            type: 'timeseries',
            adapters: {
              date: {
                // locale: 'en' // FIXME, use profile.value.locale
                locale: profile.value.locale
              }
            }
          },
          y: {
            position: 'right',
            stacked: true,
            // filled: true,
            title: {
              display: false,
              text: 'Value'
            },
            // shift the y axis labels to the left, display inside the chart
            ticks: {
              // display: false,
              padding: -3,
              mirror: true,
              // reverse: true,
              // align: 'start',
              // crossAlign: 'start',
              // maxRotation: 0,
              // minRotation
              labelOffset: 0,
              // labelOffset: 0,
            }
          },
        }
      }
    )

    // const chartData = computed(() => {
    //   return {
    //     // labels: [ 'January', 'February', 'March' ],
    //     labels: result.value?.PriceHistory?.slice(0, periods.value).map((m: any) => m.key) || [],
    //     datasets: [ {
    //       // data: [40, 20, 12]
    //       data: result.value?.PriceHistory?.slice(0, periods.value).map((m: any) => m.price) || []
    //     } ]
    //   }
    // })
    const chartData = ref({
      labels: ['2024.01.12', '2024.01.13', '2024.01.14'],
      datasets: [
        {
          data: [1, 2, 3]
        },
        {
          data: [2, 3, 4]
        }
      ]
    })

    return {
      profile,
      display,
      result,
      granularity,
      renderChart,
      chartHeight,
      // chartData: computed(() => chartData.value),
      // chartOptions: computed(() => chartOptions.value),
      chartData,
      chartOptions,
      isDarkMode
    }
  },
})
</script>
