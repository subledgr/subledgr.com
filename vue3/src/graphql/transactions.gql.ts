import { gql } from '@apollo/client/core'

export const QUERY_TRANSACTIONS = gql`
query QueryTransactions($chainId: String, $ids: [String], $offset: Int, $limit: Int) {
  Transactions(chainId: $chainId, ids: $ids, offset: $offset, limit: $limit) {
    chainId
    Asset {
      id
      name
      code
    }
    id
    # height
    blockNumber
    extrinsicId
    extrinsicHash
    # type
    # subType
    # event
    # addData
    section
    method
    timestamp
    # specVersion
    # transactionVersion
    # authorId
    # senderId
    # recipientId
    fromId
    toId
    amount
    # totalFee
    # feeBalances
    # feeTreasury
    # tip
    fee
    # success
    # updatedAt
    # createdAt
  }
}
`
