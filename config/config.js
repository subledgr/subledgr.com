export default {
  // redis for bullmq
  redis: {
    // hostname = docker service name
    // host: 'subledgr-redis',
    host: 'localhost',
    port: 6379,
  },

  sequelize: {
    database: 'subledgr',
    username: 'subledgr',
    password: 'subledgr',
    options: {
      dialect: 'postgres',
      // hostname = docker service name
      // host: 'subledgr-datastore',
      // host: 'localhost',
      host: '192.168.1.91',
      port: 5432,
      logging: false,
    },
  },

}
