import { ApiPromise, WsProvider } from '@polkadot/api'
// Dock SDK
// import { DockAPI } from '@docknetwork/sdk'

import axios from 'axios'
import moment from 'moment'
import path from "path"
import { Sequelize } from 'sequelize';
const __dirname = path.resolve();

// import { DataStore } from '../../data/data-store.js'
import cfg from '../../config/config.js'
import { transactionModel } from '../../graphql/models/transaction.js'
import { accountModel } from '../../graphql/models/account.js'
import { accountBalanceModel } from '../../graphql/models/account-balance.js';

// FIXME: get this from config
const DOTSAMA_REST_API_BASE_URL = 'https://api.metaspan.io/api'
const JOB_NAME = 'getAccountHistory'

/*
 * for each block where an account has events, calculate the balance
 */
export async function getAccountHistory(job) {

  console.debug(`[worker] ${JOB_NAME}`, job.data)
  job.log(`${JOB_NAME} starting...`)
  var { chainId='', accountId='', fromBlock=0 } = job.data

  var result = []

  const db = new Sequelize(
    cfg.db.database,
    cfg.db.username,
    cfg.db.password,
    cfg.db.options
  )
  // const indexDB = new DataStore(cfg.indexDb)
  const indexDB = new Sequelize(
    cfg.indexDb.database,
    cfg.indexDb.username,
    cfg.indexDb.password,
    cfg.indexDb.options
  )

  const Account = db.define('account', accountModel.definition, accountModel.options)
  const Transaction = indexDB.define('transaction', transactionModel.definition, transactionModel.options)
  const AccountBalance = db.define('account_balance', accountBalanceModel.definition, accountBalanceModel.options)

  // select distinct blockNumber from transaction where chainId = chainId and (from = address or to = address)
  // for each blockNumber, get the balance
  try {

    job.log(`Checking account for ${accountId}`)
    const account = await Account.findOne({ where: { id: accountId } })
    if (!account) throw new Error(`account not found: ${accountId}`)
    const address = account.address

    var rpcUrl = `wss://rpc.metaspan.io/${chainId}`
    if (chainId === 'acala') rpcUrl = `wss://acala-rpc.dwellir.com`
    console.debug('rpcUrl', rpcUrl)
    // connect to ws rpc
    job.log(`Creating provider for ${rpcUrl}`)
    const provider = new WsProvider(rpcUrl)
    provider.on('error', (error) => {
      console.error('ws provider error', error)
      job.log('Provider ERROR', JSON.stringify(error, Object.getOwnPropertyNames(error)))
    })
    let api
    // if (chainId === 'dock') {
    //   api = await DockAPI.init({ provider })
    // } else {
    job.log(`Creating api for ${rpcUrl}`)
    api = await ApiPromise.create({ provider })
    // }
    api.on('error', (error) => {
      console.error('api error', error)
      job.log('API ERROR', JSON.stringify(error, Object.getOwnPropertyNames(error)))
    })

    job.log(`Getting currentBlock`)
    var currentBlock = (await api.rpc.chain.getBlock()).toJSON()
    job.log(`...${currentBlock.block.header.number}`)
    console.debug('currentBlock', currentBlock.block.header.number)
    const currentBlockNumber = currentBlock.block.header.number

    // get the last block number of accountBalance for this accountId
    if (fromBlock === 0) {
      const lastBlockNumber = await AccountBalance.max('blockNumber', { where: { id: accountId } })
      if (lastBlockNumber) fromBlock = lastBlockNumber || 0
    }

    console.debug('fromBlock', fromBlock)
    job.log(`[worker] ${JOB_NAME} processing account ${account.id} ${account.assetId} ${account.address} fromBlock ${fromBlock}`)
    // process.exit(0)

    // const lastTransaction = await Transaction.findOne({
    //   where: {
    //     chainId,
    //     // blockNumber: { [Sequelize.Op.gt]: BigInt(fromBlock-1) },
    //     [Sequelize.Op.or]: [{ fromId: address }, { toId: address }] 
    //   },
    //   order: [['blockNumber', 'DESC']],
    // })
    // // console.debug('lastTransaction', lastTransaction)
    // const lastTransactionBlockNumber = lastTransaction ? lastTransaction.blockNumber : 0
    // console.debug('lastTransactionBlockNumber', lastTransactionBlockNumber)

    // Since the last known transaction, query the get the highest blockNumber for each day that has passed

    // TODO: limit this to the last 1000 blocks where an address/blockNumber has no balance?
    var blockNumbers = await Transaction.findAll({
      where: { 
        chainId,
        blockNumber: { [Sequelize.Op.gt]: BigInt(fromBlock-1) },
        [Sequelize.Op.or]: [{ fromId: address }, { toId: address }] 
      },
      attributes: [
        // 'blockNumber',
        [Sequelize.fn('DISTINCT', Sequelize.col('block_number')) ,'block_number'],
      ],
      // group: ['blockNumber']
    })
    console.log('found blocks', blockNumbers.length)
    job.log(`[worker] ${JOB_NAME} found blocks ${blockNumbers.length}`)
    blockNumbers = [...blockNumbers.map(b => b.dataValues.block_number), currentBlockNumber]

    var ret = { free: 0, reserved: 0, frozen: 0, pooled: 0, locked: 0 }
    for (let i = 0; i < blockNumbers.length; i++) {
      const blockNumber = blockNumbers[i] //.dataValues.block_number

      // // FIXME REMOVE THIS
      // if (blockNumber < 19145986) continue
      // // if( i > 10 ) break

      console.log('block', blockNumber)
      job.log(`processing block: ${blockNumber}`)
      const params = { at: blockNumber }
      const atHash = await api.rpc.chain.getBlockHash(blockNumber)
      const apiAt = await api.at(atHash)

      // timestamp
      const signedBlock = await api.rpc.chain.getBlock(atHash)
      const timestamp = signedBlock.block.extrinsics[0].method.args[0].toNumber()
      // console.log('timestamp', moment.unix(timestamp/1000))
      ret.timestamp = moment.unix(timestamp/1000).format('YYYY-MM-DDTHH:mm:ssZ')

      // free, reserved, frozen
      // var url = `${DOTSAMA_REST_API_BASE_URL}/${chainId}/query/system/account/${address}`
      // var rest = await axios.get(url, { params })
      var res = await apiAt.query.system.account(address)
      var { nonce, consumers, providers, sufficients, data } = res.toJSON()
      console.debug('res', data)

      ret.free = BigInt(data.free  || 0)
      ret.reserved = BigInt(data.reserved || 0)
      ret.frozen = BigInt(data.frozen || 0)

      // pooled
      // url = `${DOTSAMA_REST_API_BASE_URL}/${chainId}/query/nominationPools/poolMembersForAccount?accountId=${address}`
      // // console.debug('url', url)
      // var rest = await axios.get(url, { params })
      // if (rest.data) ret.pooled = rest.data.poolMembers?.points || 0
      // pools were added later, so check if the query exists
      res = await apiAt.query.nominationPools?.poolMembers(address) // || { toJSON: () => ({ points: 0 }) }
      var { points } = res?.toJSON() || { points: 0 }
      ret.pooled = BigInt(points) || 0n

      // pending pool rewards
      // url = `${DOTSAMA_REST_API_BASE_URL}/${chainId}/api/call/nominationPoolsApi/pendingRewards`
      // // console.debug('url', url)
      // var rest = await axios.get(url, { params: { at: blockNumber, accountId: address} })
      // // console.log('rest.data', rest.data)
      // if (rest.data) ret.claimable = rest.data.pendingRewards || 0
      // pools were added later, so check if the query exists
      res = await apiAt.call.nominationPoolsApi?.pendingRewards(address) // || { toJSON: () => ({ pendingRewards: 0 }) }
      // console.log('pending rewards', res?.toJSON())
      // continue
      // process.exit(0)
      var pendingRewards = res?.toJSON() || 0
      ret.claimable = BigInt(pendingRewards)

      // // locks
      // url = `${DOTSAMA_REST_API_BASE_URL}/${chainId}/query/balances/locks?accountId=${address}`
      // // console.debug('url', url)
      // var rest = await axios.get(url, { params })
      // if (rest.data) ret.locks = rest.data.locks.map(lock => {
      //   return { id: lock.id, amount: Number(lock.amount), reasons: lock.reasons }
      // }) || []
      res = await apiAt.query.balances.locks(address)
      var locks = res.toJSON()
      // get the maximum lock amount
      ret.locked = locks.reduce((acc, lock) => {
        return acc > BigInt(lock.amount) ? acc : BigInt(lock.amount)
      }, 0n)
      // console.log('locks', locks)
      // console.log(ret.locked)

      // console.log('result', JSON.stringify(ret))
      result.push({
        id: account.id,
        blockNumber,
        timestamp: 0,
        ...ret,
        balance: ret.free + ret.reserved + ret.pooled + ret.claimable,
        free: ret.free - ret.locked,
      })

      // commit every 10 blocks
      if (result.length > 10) {
        await AccountBalance.bulkCreate(result, {
          updateOnDuplicate: ['timestamp', 'free', 'reserved', 'frozen', 'pooled', 'claimable', 'locked', 'balance', 'updatedAt']
        })
        result = []
      }
    }

    console.debug('provider disconnecting...')
    await provider.disconnect()

    if (result.length > 0) {
      await AccountBalance.bulkCreate(result, {
        updateOnDuplicate: ['timestamp', 'free', 'reserved', 'frozen', 'pooled', 'claimable', 'locked', 'balance', 'updatedAt']
      })
    }
    console.log(`[worker] ${JOB_NAME} done...`)
    job.log(`${JOB_NAME} done...`)
    return Promise.resolve()

  } catch (err) {
    // job.log('debug 4')
    job.log('ERROR', JSON.stringify(err, Object.getOwnPropertyNames(err)))
    console.error(err)
    return Promise.reject(err)

  // } finally {
  //   // commit the last batch
  //   if (result.length > 0) {
  //     await AccountBalance.bulkCreate(result, {
  //       updateOnDuplicate: ['timestamp', 'free', 'reserved', 'frozen', 'pooled', 'claimable', 'locked', 'balance', 'updatedAt']
  //     })
  //   }
  //   console.log(`[worker] ${JOB_NAME} done...`)
  //   job.log(`${JOB_NAME} done...`)
  //   // return result
  }
}
