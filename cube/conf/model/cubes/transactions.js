const denoms = {
  "Kusama": 1000000000000,
  "Polkadot": 10000000000,
  "Westend": 10000000000,
  "Dock PoS Mainnet": 1000000,
}

cube(`transaction`, {
  // sql_table: `subledgr_dev.\`Transactions\``,
  // data_source: `default`,

  sql_table: `"Transactions"`,
  data_source: `indexdb`,
  
  pre_aggregations: {
    // Pre-aggregation definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started
    main: {
      measures: [
        transaction.amountAsToken
      ],
      dimensions: [
        transaction.chain
      ],
      timeDimension: transaction.timestamp,
      granularity: `hour`
    }
  },
  
  joins: {
    
  },
  
  measures: {
    count: {
      type: `count`
    },
    
    amount: {
      sql: `amount`,
      type: `sum`
    },

    amountAsToken: {
      sql: `
      CASE 
        WHEN ${CUBE}.chain = 'Kusama'   THEN amount / 1000000000000
        WHEN ${CUBE}.chain = 'Polkadot' THEN amount / 10000000000
        ELSE amount
      END
      `,
      type: `sum`
    },

    totalFee: {
      sql: `"totalFee"`,
      type: `sum`
    },

    feeBalances: {
      sql: `"feeBalances"`,
      type: `sum`
    },

    feeTreasury: {
      sql: `"feeTreasury"`,
      type: `sum`
    },

    tip: {
      sql: `tip`,
      type: `sum`
    },
  },
  
  dimensions: {
    chain: {
      sql: `chain`,
      type: `string`,
      primary_key: true
    },
    
    id: {
      sql: `id`,
      type: `string`,
      primary_key: true
    },

    height: {
      sql: `${CUBE}.height`,
      type: `number`
    },
    
    blockhash: {
      sql: `${CUBE}."blockHash"`,
      type: `string`
    },
    
    type: {
      sql: `type`,
      type: `string`
    },
    
    subType: {
      sql: `${CUBE}."subType"`,
      type: `string`
    },
    
    event: {
      sql: `event`,
      type: `string`
    },
    
    addData: {
      sql: `${CUBE}."addData"`,
      type: `string`
    },
    
    timestamp: {
      // sql: `${CUBE}.timestamp`,
      sql: `to_timestamp(${CUBE}.timestamp / 1000.0)`,
      type: `time`
    },
    
    specVersion: {
      sql: `${CUBE}.specVersion`,
      type: `number`
    },

    transactionVersion: {
      sql: `${CUBE}."transactionVersion"`,
      type: `number`
    },

    authorid: {
      sql: `${CUBE}."authorId"`,
      type: `string`
    },
    
    senderId: {
      sql: `${CUBE}."senderId"`,
      type: `string`
    },
    
    recipientId: {
      sql: `${CUBE}."recipientId"`,
      type: `string`
    },

    success: {
      sql: `${CUBE}.success`,
      type: `boolean`
    },

    // createdat: {
    //   sql: `${CUBE}.\`createdAt\``,
    //   type: `time`
    // },
    
    // updatedat: {
    //   sql: `${CUBE}.\`updatedAt\``,
    //   type: `time`
    // }
  }
});
