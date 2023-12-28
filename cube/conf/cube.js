// Cube configuration options: https://cube.dev/docs/config

const PostgresDriver = require("@cubejs-backend/postgres-driver");
const MysqlDriver = require("@cubejs-backend/mysql-driver");

/** @type{ import('@cubejs-backend/server-core').CreateOptions } */
module.exports = {
  
  // queryRewrite: (query, queryContext) => {
  //   console.debug('queryRewrite()', query, queryContext);
  //   // if (securityContext.filterByRegion) {
  //   //   query.filters.push({
  //   //     member: "regions.id",
  //   //     operator: "equals",
  //   //     values: [securityContext.region_id],
  //   //   });
  //   // }
  //   return query;
  // },

  // dbType: ({ dataSource }) => {
  //   console.debug('dbType()', 'dataSource =', dataSource)
  //   var ret = 'mysql';
  //   if (dataSource === 'indexDb') ret = 'postgres';
  //   console.debug('dbType()', 'dataSource =', dataSource, 'ret =', ret)
  //   return ret;
  // },

  // driverFactory: ({ dataSource }) => {
  //   console.debug('driverFactory()', 'dataSource =', dataSource)
  //   if (dataSource === 'default' || dataSource === undefined) {
  //     // return {
  //     //   type: 'postgres',
  //     //   database: 'subledgr',
  //     //   // host: '192.168.1.91',
  //     //   host: '10.10.10.1',
  //     //   user: 'postgres',
  //     //   password: 'thisIsASecret',
  //     //   port: '5432',
  //     // };
  //     return {
  //       type: 'mysql',
  //       database: 'subledgr_dev',
  //       // host: '192.168.1.91',
  //       host: 'host.docker.internal',
  //       // host: '26cd11d83fba', // internal hostname of mariadb
  //       user: 'subledgr_dev',
  //       password: 'subledgr_dev',
  //       port: '3306',
  //     };
  //   }
  //   if (dataSource === 'indexDb') {
  //     return {
  //       type: 'postgres',
  //       database: 'polkastore',
  //       // host: '192.168.10.97',
  //       host: '192.168.1.92',
  //       user: 'postgres',
  //       // password: 'thisIsASecret',
  //       password: 'hydra',
  //       // port: '5433',
  //       port: '9432',
  //     };
  //   }
  //   throw new Error(`dataSource ${dataSource} is not defined`);
  // },

  // schema: {
  //   transactions: {},
  //   price: {},

  // },

  // // Other configuration options
  // devServer: {
  //   port: 4001,
  //   cors: {
  //     origin: '*',
  //   },
  // },

};
