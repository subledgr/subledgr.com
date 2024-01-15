
import path from "path"
import { Sequelize } from 'sequelize';
const __dirname = path.resolve();
import { Queue } from 'bullmq'

import cfg from '../../config/config.js'
import { walletModel } from '../../graphql/models/wallet.js'

const JOB_NAME = 'getWalletsHistory'

/*
 * for each wallet, trigger the getWalletHistory job
 */
export async function getWalletsHistory(job) {

  console.debug(`[worker] ${JOB_NAME}`, job.data)

  const db = new Sequelize(
    cfg.db.database,
    cfg.db.username,
    cfg.db.password,
    cfg.db.options
  )

  const Wallet = db.define('wallet', walletModel.definition, walletModel.options)

  // same redis connection as the workers.js
  const qOpts = {
    connection: cfg.redis,
  }
  const q_getWalletHistory = new Queue('getWalletHistory', qOpts)

  let count = 0
  try {

    const wallets = await Wallet.findAll()

    for (let i = 0; i < wallets.length; i++) {
      let wallet = wallets[i]
      // let { assetId, address } = wallets[i]
      console.log(`[worker] ${JOB_NAME} processing wallet ${wallet.id} ${wallet.assetId} ${wallet.address}`)
      job.log(`[worker] ${JOB_NAME} processing wallet ${wallet.id} ${wallet.assetId} ${wallet.address}`)
      await q_getWalletHistory.add('getWalletHistory', { chainId: wallets[i].assetId, walletId: wallets[i].id })
      count++
      console.debug(`[worker] count:${count}`)
    }

  } catch (err) {
    // job.log('debug 4')
    console.error(err)

  } finally {
    console.log(`[worker] ${JOB_NAME} done...`)
    job.log(`${JOB_NAME} done...`)
    // return result
  }
  return { count }
}
