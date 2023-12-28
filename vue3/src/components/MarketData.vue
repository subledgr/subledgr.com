<template>
  <v-container style="width: fit-content;">
    <Chart :options="chartOptions"></Chart>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex';
// import cubejs from '@cubejs-client/core';
// // import { QueryRenderer } from '@cubejs-client/react';

// import { Bar } from 'vue-chartjs'
// import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
// import { useApolloClient } from '@vue/apollo-composable';
// import { gql } from '@apollo/client';
// // import { ApolloClient } from '@apollo/client';

// ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

import { Chart,CryptoMarket, Snaps, Screener, SymbolOverview } from 'vue-tradingview-widgets';

// const QUERY_MARKET_DATA = gql`
// query CubeQuery  { 
//   cube(
//     where: {price: {f_curr: {equals: "KSM" } , t_curr: {equals: "GBP"}, datetime: {inDateRange: "Last 30 days"}}}
//   ) {
//     price(orderBy: {datetime: asc}) {
//       minValue
//       maxValue
//       datetime {
//         day
//       }
//     }
//   }
// }
// `
interface ISymbol {
  symbol: string
  exchange: string
}
const symbols = {
  'DOTUSD': { symbol: 'DOTUSD', exchange: 'COINBASE'},
  'DOTGBP': { symbol: 'DOTGBP', exchange: 'COINBASE'},
  'DOTEUR': { symbol: 'DOTEUR', exchange: 'COINBASE'},
  'KSMGBP': { symbol: 'KSMGBP', exchange: 'KRAKEN' },
  'KSMUSD': { symbol: 'KSMUSD', exchange: 'COINBASE' },
  'KSMEUR': { symbol: 'KSMEUR', exchange: 'KRAKEN' },
  'DOCKGBP': { symbol: 'DOCKGBP', exchange: 'CRYPTO' },
  'DOCKEUR': { symbol: 'DOCKEUR', exchange: 'CRYPTO' },
  'DOCKUSD': { symbol: 'DOCKUSD', exchange: 'COINBASE' },
} as Record<string, ISymbol>

export default defineComponent({
  components: {
    Chart,
    // CryptoMarket,
    // Screener,
    // Snaps,
    // SymbolOverview
  },
  props: {
    fromCurrency: {
      type: String,
      required: true
    },
    toCurrency: {
      type: String,
      // required: true
    }
  },
  setup(props) {
    const store = useStore()
    const profile = computed(() => store.state.profile)
    const symbolKey = `${props.fromCurrency || 'DOT'}${profile.value.defaultCurrency || 'GBP'}`
    const ticker = `${symbols[symbolKey].exchange}:${symbols[symbolKey].symbol}`
    console.debug('symbolKey', symbolKey, ticker)
    const symbolOverviewOptions = {
    //   "symbols": [
    //     [props.fromCurrency || 'DOT' , ticker ],
    //     // ["Apple","AAPL|1D"],
    //     // ["Google","GOOGL|1D"],
    //     // ["Microsoft","MSFT|1D"]
    //   ],
    //   "chartOnly": false,
    //   "width": window.innerWidth || 800,
    //   "height": window.innerWidth * .6 || 450,
    //   "locale": "en",
    //   "colorTheme": "light",
    //   "autosize": false,
    //   "showVolume": false,
    //   "showMA": false,
    //   "hideDateRanges": false,
    //   "hideMarketStatus": true,
    //   "hideSymbolLogo": true,
    //   "scalePosition": "right",
    //   "scaleMode": "Normal",
    //   // "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
    //   "fontSize": "10",
    //   "noTimeScale": true,
    //   "valuesTracking": "1",
    //   "changeMode": "price-and-percent",
    //   "chartType": "area",
    //   "maLineColor": "#2962FF",
    //   "maLineWidth": 1,
    //   "maLength": 9,
    //   "lineWidth": 2,
    //   "lineType": 0
    }
    // use this to check config: https://www.tradingview.com/widget/advanced-chart/

    const el = ref()
    const onResize = () => {
      console.debug('resize')
      chartOptions.value.width = el.value.offsetWidth - 25
      chartOptions.value.height = Math.min(window.innerWidth * .6, 350)
    }

    onMounted(() => {
      el.value = document.getElementById('MarketData')
      // console.debug('mounted', el.value.offsetWidth, el.value.offsetHeight)
      chartOptions.value.width = el.value.offsetWidth - 25
      window.addEventListener('resize', onResize)
    })

    onBeforeUnmount(() => {
      console.debug('unmounted')
      window.removeEventListener('resize', onResize)
    })

    const chartOptions = ref({
      autosize: false,
      // width: window.innerWidth || 800,
      width: 800, // el.value?.offsetWidth || 800,
      height: Math.min(window.innerWidth * .6, 350),
      theme: 'light',
      chartOnly: true,
      // symbol: props.fromCurrency || 'DOT' + 'GBP',
      symbol: ticker,
      interval: 'H',
      timezone: 'Etc/UTC',
      style: '3',
      locale: 'en',
      toolbar_bg: 'purple',
      hide_top_toolbar: window.innerWidth < 480,
      hide_legend: false,
      enable_publishing: false,
      allow_symbol_change: false,
      save_image: false
    })
    // const client = useApolloClient('indexDb')
    // const chartData = ref({
    //   labels: [ 'January', 'February', 'March'],
    //   datasets: [
    //     {
    //       label: 'Data One',
    //       backgroundColor: '#f87979',
    //       data: [40, 20, 12]
    //     }
    //   ]
    // })

    // const cubejsApi = cubejs(
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODMxNTI3MjYsImV4cCI6MTY4MzIzOTEyNn0.ZscHZZOmdk2DUxHkbAec3yTKX3PhMnSFRJS52igLn6w',
    //   { apiUrl: 'http://localhost:4001/cubejs-api/v1' }
    // );


    return {
      // chartData,
      chartOptions,
      symbolOverviewOptions
    }
  },
})
</script>
