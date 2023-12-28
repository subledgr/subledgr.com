'use strict'

import axios from 'axios'
import moment from 'moment'
import path from "path"
const __dirname = path.resolve();

import { DataStore } from '../../data/data-store.js'
import cfg from '../../config/config.js'

const baseUrl = 'https://api.coingecko.com'
const service = '/api/v3/simple/price'
// Using free api, TODO do we need an apiKey?
// const apiKey = 'd2585f10-f0f8-4b05-811d-9cb20de495f5'

const ds = new DataStore({ pruning: cfg.pruning })

// const apiUrl = 'http://subledgr-api:4000/api/'

// TODO move this to a central config / model?
const currencies = {
  polkadot: { code: 'DOT', },
  kusama: { code: 'KSM' },
  dock: { code: 'DOCK' }
}

export async function getPricesCG(job) {
  // console.log('job.data', job.data);
  console.debug('[worker] getPrices:coingecko', job.data)

  var result = {}
  try {
    const params = {
      ids: Object.keys(currencies).join(','),
      // ids: ['polkadot','kusama', 'dock'],
      vs_currencies: 'GBP,USD,EUR',
      precision: 6
    }
    console.debug('params', params)
    const ret = await axios.get(`${baseUrl}${service}`, {
      // headers: { 'X-CMC_PRO_API_KEY': apiKey },
      // auth: {
      //   username: 'foo',
      //   password: 'bar'
      // },
      params
    })
    // var ret = JSON.parse(fs.readFileSync(__dirname+'/workers/functions/get-prices-coinmarketcap.json', 'utf-8'))
    // ret = { data: ret }
    const example_response = {
      "dock": {
        "gbp": 0.0161935,
        "usd": 0.02019029,
        "eur": 0.01829244
      },
      "kusama": {
        "gbp": 23.83,
        "usd": 29.71,
        "eur": 26.92
      },
      "polkadot": {
        "gbp": 4.68,
        "usd": 5.83,
        "eur": 5.28
      }
    }
    // console.debug(ret)
    if (ret.data && JSON.stringify(ret.data) !== '{}') {
      job.log('we have some data')
      console.log(ret.data)
      result = ret.data
      const last_updated = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
      for (const [currency, data] of Object.entries(ret.data)) {
        for (const [quote, price] of Object.entries(data)) {
          job.log(`Create price for ${last_updated}, ${currencies[currency]}, ${quote.toUpperCase()}, ${price}`)
          const res = await ds.Price.create({
            datetime: last_updated,
            f_curr: currencies[currency].code,
            t_curr: quote.toUpperCase(),
            value: price,
            source: 'coingecko.com'
          })
          if (res) {
            console.log(res)
          }
        }
      }  
      // job.log('debug 2')
    } else {
      // job.log('debug 3')
      console.log(ret)
    }

  } catch (err) {
    // job.log('debug 4')
    console.error(err)

  } finally {
    // do not close the connection, or, open it at the start?
    // ds.close()
    // job.log('debug 5')
    console.log('[worker] getPrices:coingecko done...')
    job.log('getPrices:coingecko done...')
    return result
  }
}
