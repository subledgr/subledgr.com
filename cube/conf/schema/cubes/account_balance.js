cube(`account_balance`, {
  sql_table: `subledgr_prod.account_balance`,
  // sql_table: `account_balance`,
  public: false,

  data_source: `default`,
  
  joins: {
    account: {
      relationship: `belongsTo`,
      sql: `${CUBE}.id = ${account}.id`
    },
    // asset: {
    //   relationship: `belongsTo`,
    //   sql: `${account}.assetId = ${asset}.id`
    // },
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primary_key: true,
    },
    
    createdAt: {
      sql: `createdAt`,
      type: `time`
    },
    
    updatedAt: {
      sql: `updatedAt`,
      type: `time`
    },
    
    timestamp: {
      sql: `timestamp`,
      type: `time`
    }
  },
  
  measures: {
    count: {
      type: `count`
    },
    
    blocknumber: {
      sql: `blockNumber`,
      type: `sum`
    },    
  
    balance: {
      sql: `${CUBE}.balance / POWER(10, ${account_asset.decimals})`,
      type: `max`
    },

  },
  
  pre_aggregations: {
    // Pre-aggregation definitions go here.
    // Learn more in the documentation: https://cube.dev/docs/caching/pre-aggregations/getting-started
    // main: {
    //   measures: [
    //     account_balance.max_balance / 1000000000
    //   ],
    //   dimensions: [
    //     account.address,
    //     account_balance.id
    //   ],
    //   timeDimension: account_balance.timestamp,
    //   granularity: `day`
    // }
  }
});
