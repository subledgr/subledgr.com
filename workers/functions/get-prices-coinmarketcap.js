'use strict'

import axios from 'axios'
import fs from 'fs'
import { serializeError } from 'serialize-error'

import path from "path"
const __dirname = path.resolve();

import { DataStore } from '../../data/data-store.js'
// import pkg from '../../data/data-store.js';
// const { DataStore } = pkg;

// import { config } from '../../config/config.js'
// import { config as configLocal } from '../config/config.local.js'
// const cfg = Object.assign(config, configLocal)
import cfg from '../../config/config.js'

const baseUrl = 'https://pro-api.coinmarketcap.com'
const service = '/v1/cryptocurrency/listings/latest?convert=GBP&limit=200'
const apiKey = 'd2585f10-f0f8-4b05-811d-9cb20de495f5'

const ds = new DataStore({ pruning: cfg.pruning })
// const apiUrl = 'http://subledgr-api:4000/api/'

export async function getPricesCMC(job) {
  // console.log('job.data', job.data);
  // const { subdomain, member, service, monitorId } = job.data
  console.debug('[worker] getPrices', job.data)

  var result = {}
  try {

    // await ds.connect()

    const ret = await axios.get(`${baseUrl}${service}`, { headers: { 'X-CMC_PRO_API_KEY': apiKey } })
    // var ret = JSON.parse(fs.readFileSync(__dirname+'/workers/functions/get-prices-coinmarketcap.json', 'utf-8'))
    // ret = { data: ret }
    if (ret.data && ret.data.status?.error_code === 0) {
      job.log('we have some data')
      // console.log(ret.data)
      result = ret.data.data
      for(let i = 0; i < ret.data.data?.length; i++) {
        const price = ret.data.data[i]
        for (const [t_curr, data] of Object.entries(price.quote)) {
          job.log(`Create price for ${price.last_updated}, ${price.symbol}, ${t_curr}, ${data.price}`)
          const res = await ds.Price.create({
            datetime: price.last_updated,
            f_curr: price.symbol,
            t_curr,
            value: data.price,
            source: 'coinmarketcap.com'
          // }, {
          //   fields: ['value'],
          //   conflictFields: ['datetime', 'f_curr', 't_curr']
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
    console.log('[worker] getPrices done...')
    job.log('getPrices done...')
    return result
  }
}
