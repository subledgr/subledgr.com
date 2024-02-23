cube(`account_balance_day`, {
  // datasource: `default`,
  // filters: {
  //   interval: 30,
  // },
  sql: `
    WITH RECURSIVE DateSeries AS ( 
      SELECT CURDATE() - INTERVAL 90 DAY AS datetime 
      UNION ALL 
      SELECT DATE_ADD(datetime, INTERVAL 1 DAY) FROM DateSeries WHERE datetime < CURDATE()
    )
    SELECT 
      ds.datetime AS datetime,
      COALESCE( 
        (
          SELECT wb.balance 
          FROM account_balance wb 
          WHERE DATE(wb.timestamp) <= ds.datetime 
          AND wb.id = ac.id
          ORDER BY wb.timestamp DESC LIMIT 1 
        ), 
        0 
      ) AS closing_balance,
      ac.id,
      ac.assetId
    FROM DateSeries ds, account ac LEFT JOIN asset ON asset.id = ac.assetId
  `,
  joins: {
    // asset: {
    //   relationship: `belongsTo`,
    //   sql: `${account_balance_day}.assetId = ${asset}.id`
    // },
    account: {
      relationship: `belongsTo`,
      sql: `${CUBE}.id = ${account}.id`
    },
    account_asset: {
      relationship: `belongsTo`,
      sql: `${account_balance_day}.id = ${account_asset}.id AND ${account_balance_day}.assetId = ${account_asset}.assetId`
    },
    account_balance: {
      relationship: `hasMany`,
      sql: `${CUBE}.id = ${account_balance}.id AND ${CUBE}.datetime = ${account_balance}.timestamp`
    }
  },

  measures: {
    closing_balance: {
      type: `number`,
      sql: `${CUBE}.closing_balance / POWER(10, ${account_asset.decimals})`,
    },
    closing_price: {
      type: `number`,
      sql: `closing_price`
    }
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primary_key: true
    },
    datetime: {
      sql: `datetime`,
      type: `time`,
      primary_key: true
    },
    assetId: {
      sql: `assetId`,
      type: `string`
    },
  },

  preAggregations: {
    main: {
      measures: [
        account_balance_day.closing_balance
      ],
      dimensions: [
        account_balance_day.id
      ],
      timeDimension: account_balance_day.datetime,
      granularity: `day`
    }
  }
});
