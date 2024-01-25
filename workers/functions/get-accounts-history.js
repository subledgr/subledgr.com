
import path from "path"
import { Sequelize } from 'sequelize';
const __dirname = path.resolve();
import { Queue } from 'bullmq'

import cfg from '../../config/config.js'
import { accountModel } from '../../graphql/models/account.js'

const JOB_NAME = 'getAccountsHistory'

/*
 * for each account, trigger the getAccountHistory job
 */
export async function getAccountsHistory(job) {

  console.debug(`[worker] ${JOB_NAME}`, job.data)

  const db = new Sequelize(
    cfg.db.database,
    cfg.db.username,
    cfg.db.password,
    cfg.db.options
  )

  const Account = db.define('account', accountModel.definition, accountModel.options)

  // same redis connection as the workers.js
  const qOpts = {
    connection: cfg.redis,
  }
  const q_getAccountHistory = new Queue('getAccountHistory', qOpts)

  let count = 0
  try {

    const accounts = await Account.findAll()

    for (let i = 0; i < accounts.length; i++) {
      let account = accounts[i]
      // let { assetId, address } = accounts[i]
      console.log(`[worker] ${JOB_NAME} processing account ${account.id} ${account.assetId} ${account.address}`)
      job.log(`[worker] ${JOB_NAME} processing account ${account.id} ${account.assetId} ${account.address}`)
      await q_getAccountHistory.add('getAccountHistory', { chainId: accounts[i].assetId, accountId: accounts[i].id })
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
