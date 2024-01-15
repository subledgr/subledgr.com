<template>
  <v-container>
    <v-progress-linear indeterminate v-show="loading"></v-progress-linear>
    <Line id="price-history" :options="chartOptions" :data="chartData"></Line>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, ref } from 'vue'
import { useStore } from 'vuex';
import { useQuery, useMutation, useApolloClient } from '@vue/apollo-composable'
import moment from 'moment';
import { useTheme } from 'vuetify'

import { QUERY_PRICE_HISTORY, QUERY_ASSET } from '@/graphql';

import { Bar, Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, TimeSeriesScale, CategoryScale, LinearScale } from 'chart.js'
import 'chartjs-adapter-moment'

// ChartJS.register(Title, Tooltip, Legend, LineElement, Point, BarElement, CategoryScale, LinearScale)
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, TimeSeriesScale, CategoryScale, LinearScale)

export default defineComponent({
  components: {
    // Bar,
    Line
  },
  props: {
    assetId: {
      type: String,
      required: true
    },
    periods: {
      type: Number,
      default: 50
    }
  },
  setup(props) {
    const store = useStore()
    const profile = computed(() => store.state.profile)
    const periods = ref(props.periods)
    const isDarkMode = computed(() => store.state.isDarkMode)

    // watch(() => theme, (dark) => {
    //   console.debug('theme changed', dark)
    //   // this.chartOptions.scales.x.adapters.date.locale
    // })

    const {loading, result, refetch, onResult } = useQuery(QUERY_PRICE_HISTORY, {
      fCurr: props.assetId,
      tCurr: profile.value.defaultCurrency
    }, {
      fetchPolicy: 'cache-and-network', // 'cache-first'
    })
    const { result: assetResult } = useQuery(QUERY_ASSET, {
      id: props.assetId
    }, {
      fetchPolicy: 'cache-and-network', // 'cache-first'
    })

    const chartOptions = computed<any>(() => {
      return {
        responsive: true,
        title: {
          display: false,
          text: 'Price History'
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
            display: false
          },
          tooltip: {
            callbacks: {
              title: (context: any) => {
                // console.debug('title', context)
                return moment.utc(context[0].parsed.x).format(profile.value.dateTimeFormat)
              },
              label: (context: any) => {
                // console.debug('label', context)
                const label = context.dataset.label || ''
                if (label) {
                  return `${ label }: ${ context.parsed.y }`
                }
                return `${ context.parsed.y.toFixed(profile.value.defaultDecimals) } ${ assetResult.value?.Asset?.symbol }`
              }
            }
          }
        },
        scales: {
          y: {
            position: 'right',
            title: {
              display: true,
              text: 'Price'
            },
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
        labels: result.value?.PriceHistory?.slice(0, periods.value).map((m: any) => m.key) || [],
        datasets: [ {
          // data: [40, 20, 12]
          data: result.value?.PriceHistory?.slice(0, periods.value).map((m: any) => m.price) || []
        } ]
      }
    })

    return {
      profile,
      loading,
      result,
      chartData,
      chartOptions
    }
  },
})
</script>
