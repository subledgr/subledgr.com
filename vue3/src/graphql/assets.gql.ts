import { gql } from '@apollo/client/core'

export const QUERY_ASSET = gql`
  query QueryAsset($id: String!) {
    Asset(id: $id) {
      id
      code
      type
      name
      symbol
      symbolPosition
      decimals
      status
      logo
      # totalSupply
      # owner
      # mintable
      # burnable
      # updatedAt
      # createdAt
    }
  }
`
