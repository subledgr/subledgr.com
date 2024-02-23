cube(`account`, {
  sql_table: `subledgr_prod.account`,
  public: false,
  
  data_source: `default`,
  
  joins: {
    account_balance: {
      relationship: `hasMany`,
      sql: `${account}.id = ${account_balance}.id`
    },
    asset: {
      relationship: `belongsTo`,
      sql: `${account}.assetId = ${asset}.id`
    },
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primary_key: true
    },
    
    name: {
      sql: `name`,
      type: `string`
    },
    
    assetId: {
      sql: `assetId`,
      type: `string`
    },
    
    address: {
      sql: `address`,
      type: `string`
    },
    
    createdAt: {
      sql: `createdAt`,
      type: `time`
    },
    
    updatedAt: {
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
