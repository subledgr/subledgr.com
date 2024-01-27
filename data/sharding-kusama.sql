-- KUSAMA
-- DROP SERVER IF EXISTS shard_kusama;
CREATE SERVER shard_kusama FOREIGN DATA WRAPPER postgres_fdw
  OPTIONS (dbname 'subledgr_subsquid_kusama', host 'localhost', port '5432');

-- also for postgres!
CREATE USER MAPPING for subledgr_subsquid SERVER shard_kusama 
  OPTIONS (user 'subledgr_subsquid', password 'subledgr_subsquid');

CREATE FOREIGN TABLE IF NOT EXISTS transfer_kusama PARTITION OF transfer
  FOR VALUES IN ('kusama')
  SERVER shard_kusama
  OPTIONS (table_name 'transfer');

