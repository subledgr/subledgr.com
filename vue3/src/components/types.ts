
export interface ICurrency {
  id: string // 'kusama'
  type: string // 'crypto'
  decimals: number // 12
  name: string // 'Kusama'
  active: boolean // true
  parent: string // ''
  parachain: boolean // false
  code: string // 'KSM'
  logo: string // 'images/logos/chains/kusama.svg'
}

export interface ITransaction {
  chain: string
  id: string
  height: bigint
  blockHash: string
  type: string
  subType: string
  event: string
  addData: string
  timestamp: number
  specVersion: string
  transactionVersion: string
  authorId: string
  senderId: string
  recipientId: string
  amount: bigint
  totalFee: bigint
  feeBalances: bigint
  feeTreasury: bigint
  tip: bigint
  success: boolean
  updatedAt: string
  createdAt: string
}

export interface IWalletData {
  feeFrozen: bigint
  free: bigint
  miscFrozen: bigint
  pooled: bigint
  reserved: bigint
}

// interface ICurrency {
//   code: string
// }

export interface IWallet {
  // TODO: decide how Currency and currencyCode work...!
  currencyCode: string
  Currency: ICurrency
  address: string
  balance: IWalletData
  id: string
  name: string
}
