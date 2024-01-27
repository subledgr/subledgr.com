-- POLKADOT
-- DROP SERVER IF EXISTS shard_polkadot;
CREATE SERVER shard_polkadot FOREIGN DATA WRAPPER postgres_fdw
  OPTIONS (dbname 'subledgr_subsquid_polkadot', host 'localhost', port '5432');

-- also for postgres!
CREATE USER MAPPING for subledgr_subsquid SERVER shard_polkadot 
  OPTIONS (user 'subledgr_subsquid', password 'subledgr_subsquid');

CREATE FOREIGN TABLE IF NOT EXISTS transfer_polkadot PARTITION OF transfer
  FOR VALUES IN ('polkadot')
  SERVER shard_polkadot
  OPTIONS (table_name 'transfer');
