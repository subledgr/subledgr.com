import axios from "axios"
const BASEURL = 'https://%CHAINID%.api.subscan.io'
import networks from "./networks.js"

function filterParams (params) {
  return Object.fromEntries(
    Object.entries(params).filter(([key, value]) => value !== undefined && value !== null)
  )
}

export class SubscanAPI {

  apiKey = ''
  headers = {}
  chainId = ''
  chain = {}
  baseUrl = ''

  constructor (config) {
    console.debug('SubscanAPI()', config)
    this.apiKey = config.apiKey || ''
    this.headers = {
      'X-API-KEY': this.apiKey,
      'Content-Type': 'application/json'
    }
    this.chainId = config.chainId || 'kusama'
    this.chain = networks.find(n => n.chainId === this.chainId)
    this.baseUrl = BASEURL.replace('%CHAINID%', this.chainId)
    console.debug('SubscanAPI()', this.baseUrl)
  }

  // api resonse
  handleResponse (res) {
    // console.debug('handleResponse()', res.data)
    if (res.data.code !== 0) {
      throw new Error(res.statusText)
    }
    return res.data.data
  }

  async now () {
    const res = await axios.post(`${this.baseUrl}/api/scan/now`, {}, { headers: this.headers })
    return this.handleResponse(res)
  }

  get scan() {
    return {
      async metadata() {
        const res = await axios.post(`${this.baseUrl}/api/scan/metadata`, {}, { headers: this.headers })
        return this.handleResponse(res)
      },
      async blocks(row, page) {
        const res = await axios.post(`${this.baseUrl}/api/scan/blocks`, { row, page }, { headers: this.headers })
        return this.handleResponse(res)
      },
      async block(block_hash) {
        const res = await axios.post(`${this.baseUrl}/api/scan/block`, { block_hash }, { headers: this.headers })
        return this.handleResponse(res)
      },
      extrinsics: async (row=20, page=0, signed, address, module, no_params, call, from, to, block_num, block_range, success) => {
        // console.debug('extrinsics()', row, page, signed, address, module, no_params, call, from, to, block_num, block_range, success)
        console.debug('scan.extrinsics()', this.baseUrl);
        const params = { row, page, signed, address, module, no_params, call, from, to, block_num, block_range, success }
        try {
          const res = await axios.post(`${this.baseUrl}/api/scan/extrinsics`, filterParams(params), { headers: this.headers })
          // console.debug('extrinsics()', res)
          return this.handleResponse(res)
        } catch (err) {
          console.error('extrinsics()', err)
        }
        // console.debug('extrinsics()', res)
        return this.handleResponse(res)
      },
      extrinsic: async (extrinsic_index, hash, events_limit, focus) => {
        const params = { extrinsic_index, hash, events_limit, focus }
        const res = await axios.post(`${this.baseUrl}/api/scan/extrinsic`, params, { headers: this.headers })
        console.debug('extrinsic()', res)
        return this.handleResponse(res)
      },
      // https://support.subscan.io/#extrinsic
      events: async (row=20, page=0, module, call, from_block, from, to, address, finalized, block_num, block_range, extrinsic_index, phase) => {
        const params = { row, page, module, call, from_block, from, to, address, finalized, block_num, block_range, extrinsic_index, phase }
        try {
          const res = await axios.post(`${this.baseUrl}/api/scan/events`, filterParams(params), { headers: this.headers })
          return this.handleResponse(res)
        } catch (err) {
          console.error('events()', err)
        }
        return this.handleResponse(res)
      },
      // ...
      staking: {
        async validators(order, order_field, row, page) {
          const params = { address, row, page, order, order_field }
          const res = await axios.post(`${this.baseUrl}/api/scan/staking/validators`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        // waiting validator
        async nominators(address, row, page, order, order_field) {
          const params = { address, row, page, order, order_field }
          const res = await axios.post(`${this.baseUrl}/api/scan/staking/nominators`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async validator(stash) {
          const params = { stash }
          const res = await axios.post(`${this.baseUrl}/api/scan/staking/validator`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async nominator(address) {
          const params = { address }
          const res = await axios.post(`${this.baseUrl}/api/scan/staking/nominator`, params, { headers: this.headers })
          return this.handleResponse(res)
        }
      },
      nominationPool: {
        async pools (state) {
          const params = { state }
          const res = await axios.post(`${this.baseUrl}/api/scan/nomination_pool/pools`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async pool (pool_id) {
          const params = { pool_id }
          const res = await axios.post(`${this.baseUrl}/api/scan/nomination_pool/pool`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async activities (pool_id, row, page) {
          const params = { pool_id, row, page }
          const res = await axios.post(`${this.baseUrl}/api/scan/nomination_pool/activities`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async poolRewards (address, pool_id, row, page) {
          const params = { address, pool_id, row, page }
          const res = await axios.post(`${this.baseUrl}/api/scan/nomination_pool/pool_rewards`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async poolMembers (pool_id, row, page) {
          const params = { pool_id, row, page }
          const res = await axios.post(`${this.baseUrl}/api/scan/nomination_pool/pool_members`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async poolMember (address) {
          const params = { address }
          const res = await axios.post(`${this.baseUrl}/api/scan/nomination_pool/pool_member`, params, { headers: this.headers })
          return this.handleResponse(res)
        }
      },
      async accounts (row, page, order, order_field, min_balance, max_balance, filter, address) {
        const params = { row, page, order, order_field, min_balance, max_balance, filter, address }
        const res = await axios.post(`${this.baseUrl}/api/scan/accounts`, params, { headers: this.headers })
        return this.handleResponse(res)
      },
      treasury: {
        async proposals (row, page) {
          const params = { row, page }
          const res = await axios.post(`${this.baseUrl}/api/scan/treasury/proposals`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async proposal (proposal_id) {
          const params = { proposal_id }
          const res = await axios.post(`${this.baseUrl}/api/scan/treasury/proposal`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async tippers (hash) {
          const params = { hash }
          const res = await axios.post(`${this.baseUrl}/api/scan/treasury/tippers`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async tips (hash, page) {
          const params = { hash, page }
          const res = await axios.post(`${this.baseUrl}/api/scan/treasury/tips`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async tip (hash) {
          const params = { hash }
          const res = await axios.post(`${this.baseUrl}/api/scan/treasury/tip`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
      },
      techcomm: {
        async proposals (row, page) {
          const params = { row, page }
          const res = await axios.post(`${this.baseUrl}/api/scan/techcomm/proposals`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async proposal (proposal_id) {
          const params = { proposal_id }
          const res = await axios.post(`${this.baseUrl}/api/scan/techcomm/proposal`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
      },
      council: {
        async proposals (row, page) {
          const params = { row, page }
          const res = await axios.post(`${this.baseUrl}/api/scan/council/proposals`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async proposal (proposal_id) {
          const params = { proposal_id }
          const res = await axios.post(`${this.baseUrl}/api/scan/council/proposal`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
      },
      democracy: {
        async referendums (status, row, page) {
          const params = { status, row, page }
          const res = await axios.post(`${this.baseUrl}/api/scan/democracy/referendums`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async referendum (referendum_index) {
          const params = { referendum_index }
          const res = await axios.post(`${this.baseUrl}/api/scan/democracy/referendum`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async votes (referendum_index, row, page, sort, order, valid, status) {
          const params = { referendum_index, row, page, sort, order, valid, status }
          const res = await axios.post(`${this.baseUrl}/api/scan/democracy/votes`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async proposals (row, page, status, order_field) {
          const params = { row, page, status, order_field }
          const res = await axios.post(`${this.baseUrl}/api/scan/democracy/proposals`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async proposal (democracy_id) {
          const params = { democracy_id }
          const res = await axios.post(`${this.baseUrl}/api/scan/democracy/proposal`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async seconded (proposal_id, page, row) {
          const params = { proposal_id, page, row }
          const res = await axios.post(`${this.baseUrl}/api/scan/democracy/seconded`, params, { headers: this.headers })
          return this.handleResponse(res)
        }
      },
      bounties: {
        async proposals (row, page, status) {
          const params = { row, page, status }
          const res = await axios.post(`${this.baseUrl}/api/scan/bounties/proposals`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async proposal (proposal_id) {
          const params = { proposal_id }
          const res = await axios.post(`${this.baseUrl}/api/scan/bounties/proposal`, params, { headers: this.headers })
          return this.handleResponse(res)
        }
      },
      referenda: {
        async referendums (page, row, status, Origins) {
          const params = { page, row, status, Origins }
          const res = await axios.post(`${this.baseUrl}/api/scan/referenda/referendums`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async referendum (referendum_index) {
          const params = { referendum_index }
          const res = await axios.post(`${this.baseUrl}/api/scan/referenda/referendum`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async votes (referendum_index, page, row, sort, order, valid, status) {
          const params = { referendum_index, page, row, sort, order, valid, status }
          const res = await axios.post(`${this.baseUrl}/api/scan/referenda/votes`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async tracks () {
          const res = await axios.post(`${this.baseUrl}/api/scan/referenda/tracks`, {}, { headers: this.headers })
          return this.handleResponse(res)
        },
        async statistics () {
          const res = await axios.post(`${this.baseUrl}/api/scan/referenda/statistics`, {}, { headers: this.headers })
          return this.handleResponse(res)
        }
      },
      fellowship: {
        async referendums (row, page, status, Origins) {
          const params = { row, page, status, Origins }
          const res = await axios.post(`${this.baseUrl}/api/scan/fellowship/referendums`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async referendum (referendum_index) {
          const params = { referendum_index }
          const res = await axios.post(`${this.baseUrl}/api/scan/fellowship/referendum`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async votes (referendum_index, page, row) {
          const params = { referendum_index, page, row }
          const res = await axios.post(`${this.baseUrl}/api/scan/fellowship/votes`, params, { headers: this.headers })
          return this.handleResponse(res)
        },
        async tracks () {
          const res = await axios.post(`${this.baseUrl}/api/scan/fellowship/tracks`, {}, { headers: this.headers })
          return this.handleResponse(res)
        },
        async statistics () {
          const res = await axios.post(`${this.baseUrl}/api/scan/fellowship/statistics`, {}, { headers: this.headers })
          return this.handleResponse(res)
        }
      },
      runtime: {
        async list () {
          const res = await axios.post(`${this.baseUrl}/api/scan/runtime/list`, {}, { headers: this.headers })
          return this.handleResponse(res)
        },
        async metadata (spec) {
          const params = { spec }
          const res = await axios.post(`${this.baseUrl}/api/scan/runtime/metadata`, params, { headers: this.headers })
          return this.handleResponse(res)
        }
      }
    }
  }

  open = {
    async price (base, quote, time) {
      const params = { base, quote, time }
      const res = await axios.post(`${this.baseUrl}/api/open/price`, params, { headers: this.headers })
      return this.handleResponse(res)
    },
    async priceConverter (value, from, quote, time) {
      const params = { value, from, quote, time }
      const res = await axios.post(`${this.baseUrl}/api/open/price_converter`, params, { headers: this.headers })
      return this.handleResponse(res)
    },
    async priceHistory (start, end, format, currency) {
      const params = { start, end, format, currency }
      const res = await axios.post(`${this.baseUrl}/api/open/price_history`, params, { headers: this.headers })
      return this.handleResponse(res)
    },
    async currencies () {
      const res = await axios.post(`${this.baseUrl}/api/open/currencies`, {}, { headers: this.headers })
      return this.handleResponse(res)
    }
  }

}
