
import axios from 'axios'
import path from "path"
const __dirname = path.resolve();

// import { DataStore } from '../../data/data-store.js'
// import cfg from '../../config/config.js'

// FIXME: get this from config
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
  const account = { id: null, assetId, address }

  var result = {}
  try {
    const params = {}
    if (blockNumber) {
      params.at = blockNumber
    }
    console.debug('params', params)

    var ret = { balance: { feeFrozen: 0, free: 0, id: 0, miscFrozen: 0, pooled: 0, reserved: 0 }, locks: [] }
    try {
      var url = `${dotsamaRestApiBaseUrl}/${account.assetId}/query/system/account/${account.address}`
      console.debug('url', url)
      var rest = await axios.get(url)
      if (rest.data) ret = rest.data.data
      // pooled value
      url = `${dotsamaRestApiBaseUrl}/${account.assetId}/query/nominationPools/poolMembersForAccount?accountId=${account.address}`
      console.debug('url', url)
      var rest = await axios.get(url)
      console.debug('nominationPools...', rest.data)
      if (rest.data) ret.pooled = rest.data.poolMembers?.points || 0
      if (rest.data.poolMembers?.unbondingEras) {
        console.debug('unbondingEras...', rest.data.poolMembers.unbondingEras)
        const eras = Object.keys(rest.data.poolMembers.unbondingEras)
        for (let i = 0; i < eras.length; i++) {
          const era = eras[i]
          const unbonding = rest.data.poolMembers.unbondingEras[era]
          if (unbonding) {
            ret.pooled += unbonding
          }
        }
        console.debug('pooled...', ret.pooled)
      }
      // locks
      url = `${dotsamaRestApiBaseUrl}/${account.assetId}/query/balances/locks?accountId=${account.address}`
      console.debug('url', url)
      var rest = await axios.get(url)
      if (rest.data) ret.locks = rest.data.locks.map(lock => {
        return { id: lock.id, amount: Number(lock.amount), reasons: lock.reasons }
      }) || []
      ret.id = account.id

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
