// get data from api, not from chain
//import { ApiPromise } from '@polkadot/api'
import axios from 'axios'
import moment from 'moment'
import path from "path"
const __dirname = path.resolve();

import { DataStore } from '../../data/data-store.js'
import cfg from '../../config/config.js'

const dotsamaRestApiBaseUrl = 'https://api.metaspan.io/api'

/**
 * Keep this in sync with [graphql](../../graphql/lib/resolvers.js)
 */

const jobName = 'getAccountBalance'
export async function getAccountBalance(job) {
  // console.log('job.data', job.data);
  console.debug(`[worker] ${jobName}`, job.data)
  job.log(`[worker] ${jobName}`, job.data)

  let example_job_data = {
    assetId: "polkadot",
    address: "5EYCAeV2G6NvY7tGx3VXvZ7uS6QjP9X8XfXG4rZ6YXy1VXcK",
    blockNumber: null, // latest block
  }
  const { assetId, address, blockNumber } = job.data
  const wallet = { id: null, assetId, address }

  var result = {}
  try {
    const params = {}
    if (blockNumber) {
      params.at = blockNumber
    }
    console.debug('params', params)

    var ret = { balance: { feeFrozen: 0, free: 0, id: 0, miscFrozen: 0, pooled: 0, reserved: 0 }, locks: [] }
    try {
      var url = `${dotsamaRestApiBaseUrl}/${wallet.assetId}/query/system/account/${wallet.address}`
      console.debug('url', url)
      var rest = await axios.get(url)
      if (rest.data) ret = rest.data.data
      // pooled value
      url = `${dotsamaRestApiBaseUrl}/${wallet.assetId}/query/nominationPools/poolMembersForAccount?accountId=${wallet.address}`
      console.debug('url', url)
      var rest = await axios.get(url)
      if (rest.data) ret.pooled = rest.data.poolMembers?.points || 0
      // locks
      url = `${dotsamaRestApiBaseUrl}/${wallet.assetId}/query/balances/locks?accountId=${wallet.address}`
      console.debug('url', url)
      var rest = await axios.get(url)
      if (rest.data) ret.locks = rest.data.locks.map(lock => {
        return { id: lock.id, amount: Number(lock.amount), reasons: lock.reasons }
      }) || []
      ret.id = wallet.id

    } catch(err) {
      console.warn('last url', url)
      console.error('error', err.toString())
    }
    // return ret
    result = ret

  } catch (err) {
    // job.log('debug 4')
    console.error(err)
    job.log(err.toString())
  } finally {
    console.log(`[worker] ${jobName} done...`)
    job.log(`${jobName} done...`)
    return result
  }
}