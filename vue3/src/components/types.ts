
export interface IAsset {
  id: string // 'kusama'
  code: string // 'KSM | GBP'
  type: string // 'crypto | currency'
  decimals: number // 12
  name: string // 'Kusama'
  active: boolean // true
  parent: string // ''
  parachain: boolean // false
  symbol: string // '₭SM | £'
  symbolPosition?: string // 'left'
  status: string // 'active'
  logo: string // 'images/logos/chains/kusama.svg'
}

export interface IBalanceLock {
  id: string
  amount: string // bigint
  reasons: string
}

export interface ICurrency {
  code: string // 'kusama'
  // type: string // 'crypto'
  decimals: number // 12
  name: string // 'Kusama'
  active: boolean // true
  // parent: string // ''
  // parachain: boolean // false
  symbol: string // '₭'
  logo: string // 'images/logos/chains/kusama.svg'
}

export interface Judgement {
  index: number
  judgement: string
}

export interface AccountDisplay {
  address: string
  display: string
  judgements: [Judgement]
  account_index: string
  identity: boolean
  parent: AccountDisplayParent
}

export interface AccountDisplayParent {
  address:  string
  display:  string
  sub_symbol:  string
  identity: boolean
}

export interface IExtrinsic {
  account_display: AccountDisplay
  account_id: string
  account_index: string
  block_num: bigint
  block_timestamp: bigint
  call_module: string
  call_module_function:  string
  extrinsic_hash:  string
  extrinsic_index:  string
  fee: bigint
  fee_used: bigint
  nonce: number
  params: string
  signature: string
  from_hex: string
  finalized: boolean
  success: boolean
}

export interface IPortfolio {
  id: string
  name: string
  Currency: ICurrency
  status: string
  start_date: string
  Wallets: IWallet[]
}

export interface IPrice {
  datetime: string
  f_curr: string
  t_curr: string
  value: number
}

export interface IProfile {
  id: string
  email: string
  defaultCurrency: string
  defaultDecimals: number
  dateTimeFormat: string
  locale: string
  itemsPerPage: number
}



export interface ITransaction {
  chainId: string // TODO: rename to assetId
  Asset: IAsset
  id: string
  blockNumber: bigint
  extrinsicId: string
  extrinsicHash: string
  section: string
  method: string
  // addData: string
  timestamp: number
  // specVersion: string
  // transactionVersion: string
  // authorId: string
  fromId: string
  toId: string
  amount: bigint
  fee: bigint
  // feeBalances: bigint
  // feeTreasury: bigint
  // tip: bigint
  // success: boolean
  // updatedAt: string
  // createdAt: string
}

// matching polka-store
// export interface ITransaction {
//   chain: string // TODO: rename to assetId
//   Asset: IAsset
//   id: string
//   height: bigint
//   blockHash: string
//   type: string
//   subType: string
//   event: string
//   addData: string
//   timestamp: number
//   specVersion: string
//   transactionVersion: string
//   authorId: string
//   senderId: string
//   recipientId: string
//   amount: bigint
//   totalFee: bigint
//   feeBalances: bigint
//   feeTreasury: bigint
//   tip: bigint
//   success: boolean
//   updatedAt: string
//   createdAt: string
// }

export interface IWalletData {
  locked: number
  feeFrozen: bigint
  free: bigint
  miscFrozen: bigint
  reserved: bigint
  pooled: bigint
  pooledClaimable: bigint
}

export interface IWalletBalance {
  feeFrozen: bigint
  free: bigint
  locked: bigint
  reserved: bigint
  pooled: bigint
  claimable: bigint
  balance: bigint
  blockNumber: number
  timestamp: number
}

// interface ICurrency {
//   code: string
// }

export interface IWallet {
  // TODO: decide how Currency and currencyCode work...!
  assetId: string
  Asset: IAsset
  address: string
  // balance: IWalletData
  balance: IWalletBalance
  id: string
  name: string
  transactions: ITransaction[]
}
