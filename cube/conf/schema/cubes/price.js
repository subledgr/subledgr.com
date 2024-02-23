cube(`price`, {
  sql_table: `subledgr_prod.price`,
  
  data_source: `default`,
  
  joins: {
    // account_balance: {
    //   relationship: `hasMany`,
    //   sql: `${account}.id = ${account_balance}.id`
    // },    
  },
  
  dimensions: {
    datetime: {
      sql: `datetime`,
      type: `time`,
      primary_key: true
    },

    f_curr: {
      sql: `f_curr`,
      type: `string`,
      primary_key: true
    },

    t_curr: {
      sql: `t_curr`,
      type: `string`,
      primary_key: true
    },

    source: {
      sql: `source`,
      type: `string`
    },
    
  },
  
  measures: {
    count: {
      type: `count`
    },
    value: {
      sql: `value`,
      type: `number`
    },
  },
  
  pre_aggregations: {
    // Pre-aggregation definitions go here.
    // Learn more in the documentation: https://cube.dev/docs/caching/pre-aggregations/getting-started
  }
});
