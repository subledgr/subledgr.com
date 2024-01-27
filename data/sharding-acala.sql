-- ACALA
-- DROP SERVER IF EXISTS shard_polkadot;
CREATE SERVER shard_acala FOREIGN DATA WRAPPER postgres_fdw
  OPTIONS (dbname 'subledgr_subsquid_acala', host 'localhost', port '5432');

-- also for postgres!
CREATE USER MAPPING for subledgr_subsquid SERVER shard_acala 
  OPTIONS (user 'subledgr_subsquid', password 'subledgr_subsquid');

CREATE FOREIGN TABLE IF NOT EXISTS transfer_acala PARTITION OF transfer
  FOR VALUES IN ('acala')
  SERVER shard_acala
  OPTIONS (table_name 'transfer');
