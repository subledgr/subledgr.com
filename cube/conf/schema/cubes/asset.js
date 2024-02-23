cube(`asset`, {
  sql_table: `subledgr_prod.asset`,
  
  data_source: `default`,
  
  joins: {
    // account_balance: {
    //   relationship: `hasMany`,
    //   sql: `${account}.id = ${account_balance}.id`
    // },    
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primary_key: true
    },

    code: {
      sql: `code`,
      type: `string`
    },

    name: {
      sql: `name`,
      type: `string`
    },
    
    decimals: {
      sql: `decimals`,
      type: `number`
    },
    
    createdat: {
      sql: `createdAt`,
      type: `time`
    },
    
    updatedat: {
      sql: `updatedAt`,
      type: `time`
    }
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
