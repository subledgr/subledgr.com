import axios from 'axios'
import coinbase from 'coinbase'
import moment from 'moment'
// var Client = coinbase.Client;
var client

export class Coinbase {

  baseUrl = 'https://api.coinbase.com/v2'
  apiKey = undefined
  apiSecret = undefined
  currencies = undefined
  curr_date = 0
  cryptoCurrencies = undefined
  cryp_date = 0

  constructor(config) {
    const { apiKey, apiSecret } = config
    this.apiKey = apiKey || process.env.API_KEY
    this.apiSecret = apiSecret || process.env.API_SECRET
    client = new coinbase.Client({ apiKey, apiSecret })
  }

  async getCurrencies () {
    const marker = moment(this.curr_date).add(30, 'minutes')
    if (!this.currencies || moment().isAfter(marker)) {
      // this.currencies = await client.getCurrencies()
      const ret = await axios.get(`${this.baseUrl}/currencies`)
      this.currencies = ret.data ? ret.data : []
      this.curr_date = moment()
    }
    return this.currencies
  }

  async getCryptoCurrencies () {
    console.debug('getCryptoCurrencies()...')
    const marker = moment(this.cryp_date).add(30, 'minutes')
    if (!this.cryptoCurrencies || moment().isAfter(marker)) {
      // this.cryptoCurrencies = await client.getCurrencies()
      const ret = await axios.get(`${this.baseUrl}/currencies/crypto`)
      console.debug('ret.data', ret.data?.data)
      this.cryptoCurrencies = ret.data ? ret.data.data : []
    }
    return this.cryptoCurrencies
  }

  async getExchangeRates(currency = 'BTC', token = 'BTCUSDT') {
    const ret = await axios.get(`${this.baseUrl}/exchange-rates?currency=${currency}`)
    return ret.data
  }

}
