import { ConfigReader } from '../config/config-reader.js'
const cr = new ConfigReader('../docker/.env')
// read all config
const cfg = cr.getConfig()
// console.debug('cfg', cfg)

import express from 'express'
import { Queue, Worker } from 'bullmq'
import * as pkg1 from '@bull-board/express'
const { ExpressAdapter } = pkg1
import * as pkg2 from '@bull-board/api'
const { createBullBoard } = pkg2
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js'

// in docker we map 23000 to 3000
const PORT = cfg.bullmq.port // process.env.SUBLEDGR_BULLMQ_PORT || 3000

// import { asyncForeach } from './lib/utils.js'
import { getPricesCMC } from './functions/get-prices-coinmarketcap.js'
import { getPricesCG } from './functions/get-prices-coingecko.js'
import { getWalletsHistory } from './functions/get-wallets-history.js'
import { getWalletHistory } from './functions/get-wallet-history.js'

async function asyncForeach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index)
  }
}

// console.debug('cfg.redis', cfg.redis)

const qOpts = {
  // connection to Redis
  // connection: { host: "localhost", port: 6379 },
  connection: cfg.redis,
}

const jobs = [
  'getPricesCMC',
  'getPricesCG',
  'getWalletsHistory',
  'getWalletHistory',
]

async function onError(job, err) {
  const errStr = `ERROR: ${job}: ` + typeof err === 'string' ? err : JSON.stringify(err)
  console.log(errStr)
}

async function onFailed(job, event) {
  const errStr = `FAILED: ${job}: ` + typeof event === 'string' ? event : JSON.stringify(event)
  console.log(errStr)
}

const q_getPricesCMC = new Queue('getPricesCMC', qOpts)
const q_getPricesCG = new Queue('getPricesCG', qOpts)
const q_getWalletsHistory = new Queue('getWalletsHistory', qOpts)
const q_getWalletHistory = new Queue('getWalletHistory', qOpts)

const w_getPricesCMC = new Worker('getPricesCMC', getPricesCMC, qOpts)
const w_getPricesCG = new Worker('getPricesCG', getPricesCG, qOpts)
const w_getWalletsHistory = new Worker('getWalletsHistory', getWalletsHistory, qOpts)
const w_getWalletHistory = new Worker('getWalletHistory', getWalletHistory, qOpts)

// handle all error/failed
jobs.forEach((job) => {
  const worker = eval(`w_${job}`)
  worker.on('error', (err) => onError(job, err))
  worker.on('failed', (event) => onFailed(job, event))
})

const jobRetention = {
  removeOnComplete: {
    age: 24 * 60 *60, // keep up to 24 hour (in millis)
    count: 1000, // keep up to 1000 jobs
  },
  removeOnFail: {
    age: 48 * 60 * 60, // keep up to 48 hours (in millis)
  }
}

async function clearQueue(jobname) {
  let qname = eval(`q_${jobname}`)
  await qname.pause()
  // Removes all jobs that are waiting or delayed, but not active, completed or failed
  await qname.drain()
  await qname.resume()
  // Completely obliterates a queue and all of its contents, incl history.
  // await qname.obliterate({ force: true });
}

;(async () => {
  // on startup, drain the queues and start again
  async function clearQueues() {
    await asyncForeach(jobs, clearQueue)
  }

  async function addJobs() {
    const jOpts = {}
    await q_getPricesCMC.add('sl:getPricesCMC', jOpts, {
      repeat: { pattern: '0,15,30,45 * * * *' },
      ...jobRetention
    })
    await q_getPricesCG.add('sl:getPricesCG', jOpts, {
      repeat: { pattern: '0,15,30,45 * * * *' },
      ...jobRetention
    })
    await q_getWalletsHistory.add('sl:getWalletsHistory', jOpts, {
      repeat: { pattern: '0,15,30,45 * * * *' },
      ...jobRetention
    })
  }

  await clearQueues()
  await addJobs()

  const serverAdapter = new ExpressAdapter()
  serverAdapter.setBasePath('/admin/queues')
  // const queueMQ = new QueueMQ()
  const { setQueues, replaceQueues } = createBullBoard({
    queues: [
      new BullMQAdapter(q_getPricesCMC, { readOnlyMode: false }),
      new BullMQAdapter(q_getPricesCG, { readOnlyMode: false }),
      new BullMQAdapter(q_getWalletsHistory, { readOnlyMode: false }),
      new BullMQAdapter(q_getWalletHistory, { readOnlyMode: false }),
    ],
    serverAdapter: serverAdapter,
  })
  const app = express()
  app.use('/admin/queues', serverAdapter.getRouter())
  app.listen(PORT, () => {
    console.log(`Running on ${PORT}...`)
    console.log(`For the UI, open http://localhost:${PORT}/admin/queues`)
    console.log(`Make sure Redis is running on port ${cfg.redis.port} by default`);
  })
})()
