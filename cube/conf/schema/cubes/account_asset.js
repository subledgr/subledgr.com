cube(`account_asset`, {

  // sql_table: `subledgr_prod.account`,  
  // data_source: `default`,
  // virtual table
  sql: `
    SELECT DISTINCT ac.id,
      ac.assetId,
      ac.address,
      b.code,
      b.name,
      b.decimals
    FROM subledgr_prod.account ac
    LEFT JOIN subledgr_prod.asset b ON ac.assetId = b.id
  `,
  
  joins: {
    account_balance: {
      relationship: `hasMany`,
      sql: `${CUBE}.id = ${account_balance}.id`
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primary_key: true
    },

    assetid: {
      sql: `assetId`,
      type: `string`
    },

    decimals: {
      sql: `decimals`,
      type: `number`
    },
    
  },
  
  measures: {
    count: {
      type: `count`
    },
  },
  
  pre_aggregations: {
    // Pre-aggregation definitions go here.
    // Learn more in the documentation: https://cube.dev/docs/caching/pre-aggregations/getting-started
  }
});
