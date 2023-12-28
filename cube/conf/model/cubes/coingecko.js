cube(`coingecko`, {
  sql_table: `subledgr_dev.coingecko`,
  
  data_source: `default`,
  
  pre_aggregations: {
    // Pre-aggregation definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started
    main: {
      measures: [
        coingecko.price
      ],
      dimensions: [
        coingecko.f_curr,
        coingecko.t_curr
      ],
      timeDimension: coingecko.datetime,
      granularity: `hour`
    }
  },
  
  joins: {
    
  },
  
  measures: {
    count: {
      type: `count`
    },
    
    price: {
      sql: `price`,
      type: `sum`
    }
  },
  
  dimensions: {
    f_curr: {
      sql: `f_curr`,
      type: `string`
    },
    
    t_curr: {
      sql: `t_curr`,
      type: `string`
    },
    
    datetime: {
      sql: `datetime`,
      type: `time`
    }
  }
});
