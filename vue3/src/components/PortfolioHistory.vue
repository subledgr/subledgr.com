<template>
  <v-container>

    <v-parallax
      height="200"
      src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg"
      >
      insert portfolio value chart here
    </v-parallax>

  </v-container>  
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useQuery } from '@vue/apollo-composable'
import moment from 'moment'
import { QUERY_PORTFOLIO_VIEW } from '@/graphql';

import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, TimeSeriesScale, CategoryScale, LinearScale } from 'chart.js'
import 'chartjs-adapter-moment'

export default defineComponent({
  name: 'PortfolioHistory',
  components: {
    Line
  },
  props: {
    portfolioId: String,
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
    
    const variables = {
      ids: ['KSM', 'DOT', 'DOCK'], // FIXME where should this go?
      id: props.portfolioId,
      tCurr: profile.value.defaultCurrency, // 'GBP'
    }
    const { result } = useQuery(QUERY_PORTFOLIO_VIEW, variables)

    const chartOptions = computed(() => {
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
                return `${ context.parsed.y.toFixed(profile.value.defaultDecimals) } ${ result.value?.Asset?.symbol }`
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
        labels: result.value?.PriceHistory?.slice(0, periods.value).map((m) => m.key) || [],
        datasets: [ {
          // data: [40, 20, 12]
          data: result.value?.PriceHistory?.slice(0, periods.value).map((m) => m.price) || []
        } ]
      }
    })

    return {
      profile,
      result,
      chartData,
      chartOptions
    }
  },
})
</script>
