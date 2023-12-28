cube(`rate`, {

  sql_table: `subledgr_dev.rates`,
    data_source: `default`,
  
  pre_aggregations: {
    // Pre-aggregation definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started
    // pre_hourlyClose: {
    //   measures: [
    //     rate.hourlyClose
    //   ],
    //   dimensions: [
    //     rate.f_curr,
    //     rate.t_curr
    //   ],
    //   timeDimension: rate.time,
    //   granularity: `hour`
    // },

    // preDailyClose: {
    //   measures: [
    //     rate.dailyClose
    //   ],
    //   dimensions: [
    //     rate.f_curr,
    //     rate.t_curr
    //   ],
    //   timeDimension: rate.time,
    //   granularity: `day`
    // }
  },
  
  joins: {
    
  },
  
  measures: {
    count: {
      type: `count`
    },

    open: {
      sql: `open`,
      type: `sum`
    },
    high: {
      sql: `high`,
      type: `sum`
    },
    low: {
      sql: `low`,
      type: `sum`
    },
    close: {
      sql: `close`,
      type: `sum`
    },

    hourlyClose: {
      sql: `
        LAST_VALUE(${CUBE}.close) OVER (
          PARTITION BY DATE(${CUBE}.time), HOUR(${CUBE}.time)
          ORDER BY ${CUBE}.time
          ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        )
      `,
      type: `number`
    },

    dailyOpen: {
      sql: `
        FIRST_VALUE(${CUBE}.open) OVER (
          PARTITION BY DATE(${CUBE}.time)
          ORDER BY ${CUBE}.time
          ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        )
      `,
      type: `number`
    },

    dailyClose: {
      sql: `
        LAST_VALUE(${CUBE}.close) OVER (
          PARTITION BY DATE(${CUBE}.time)
          ORDER BY ${CUBE}.time
          ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        )
      `,
      type: `number`
    },

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
    
    time: {
      sql: `time`,
      type: `time`
    },

    vwap: {
      sql: `vwap`,
      type: `number`
    },

    volume: {
      sql: `volume`,
      type: `number`
    },

    countx: {
      sql: `count`,
      type: `number`
    },

    source: {
      sql: `source`,
      type: `string`
    },

  }
});
