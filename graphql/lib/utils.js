
// SUBLEDGR_IDXDB_KUSAMA_HOST=192.168.10.106
// SUBLEDGR_IDXDB_KUSAMA_DATABASE=subledgr_subsquid_kusama
// SUBLEDGR_IDXDB_KUSAMA_USER=subledgr_subsquid
// SUBLEDGR_IDXDB_KUSAMA_PASSWORD=subledgr_subsquid
// SUBLEDGR_IDXDB_KUSAMA_PORT=5432
// SUBLEDGR_IDXDB_KUSAMA_DIALECT=postgres
import Sequelize from 'sequelize';

export class IndexDbFactory {
  chains = []
  config = {}
  databases = []

  constructor(chains=[]) {
    this.chains = chains
    this.getConfig()
  }

  getConfig () {
    this.chains.forEach(chainId => {
      console.debug(chainId)
      this.config[chainId] = {
        host:     process.env[`SUBLEDGR_IDXDB_${String(chainId).toUpperCase()}_HOST`],
        database: process.env[`SUBLEDGR_IDXDB_${String(chainId).toUpperCase()}_DATABASE`],
        username: process.env[`SUBLEDGR_IDXDB_${String(chainId).toUpperCase()}_USER`],
        password: process.env[`SUBLEDGR_IDXDB_${String(chainId).toUpperCase()}_PASSWORD`],
        port:     process.env[`SUBLEDGR_IDXDB_${String(chainId).toUpperCase()}_PORT`],
        dialect:  process.env[`SUBLEDGR_IDXDB_${String(chainId).toUpperCase()}_DIALECT`],

        database: this.readEnv('SUBLEDGR_INDEXDB_DATABASE', 'subledgr'),
        username: this.readEnv('SUBLEDGR_INDEXDB_USER', 'subledgr'),
        password: this.readEnv('SUBLEDGR_INDEXDB_PASSWORD', 'subledgr'),
        options: {
          dialect: this.readEnv('SUBLEDGR_INDEXDB_DIALECT', 'postgres'),
          host: this.readEnv('SUBLEDGR_INDEXDB_HOST', 'subledgr-datastore'),
          port: this.readEnv('SUBLEDGR_INDEXDB_PORT', 5432),
          logging: this.readEnv('SUBLEDGR_INDEXDB_LOGGING', 'true')==='true' || false, // .env is always a string
        },

      }
    })
  }
  getDatabase(chainId) {
    if (!this.databases[chainId]) {
      if (!this.config[chainId]) {
        throw new Error(`Database configuration for ${chainId} not found`);
      }
      this.databases[chainId] = new Sequelize(this.config[chainId]);
    }
    return databases[chainId];
  }
}


export class BiDirectionalMap {
  constructor(initialMap = {}) {
    this.keyToValue = { ...initialMap };
    this.valueToKey = {};
    for (const [key, value] of Object.entries(initialMap)) {
      this.valueToKey[value] = key;
    }
  }

  // Methods to access the dictionary
  getByKey(key) {
    return this.keyToValue[key];
  }

  getByValue(value) {
    return this.valueToKey[value];
  }

  // Methods to modify the dictionary
  set(key, value) {
    // Check if key or value already exists and delete the existing association
    if (this.keyToValue[key]) {
      delete this.valueToKey[this.keyToValue[key]];
    }
    if (this.valueToKey[value]) {
      delete this.keyToValue[this.valueToKey[value]];
    }

    this.keyToValue[key] = value;
    this.valueToKey[value] = key;
  }

  deleteByKey(key) {
    const value = this.keyToValue[key];
    delete this.keyToValue[key];
    delete this.valueToKey[value];
  }

  deleteByValue(value) {
    const key = this.valueToKey[value];
    delete this.valueToKey[value];
    delete this.keyToValue[key];
  }
}

// // Usage:
// const assetMap = new BiDirectionalMap({
//   'dock': 'Dock PoS Mainnet',
//   'polkadot': 'Polkadot',
//   'kusama': 'Kusama'
// });

// console.log(assetMap.getByKey('dock'));        // Dock PoS Mainnet
// console.log(assetMap.getByValue('Polkadot'));  // polkadot

// assetMap.set('dock', 'New Dock Value');
// console.log(assetMap.getByKey('dock'));        // New Dock Value

// assetMap.deleteByKey('dock');
// console.log(assetMap.getByKey('dock'));        // undefined
