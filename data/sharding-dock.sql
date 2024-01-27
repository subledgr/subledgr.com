-- DOCK
-- DROP SERVER IF EXISTS shard_dock;
CREATE SERVER shard_dock FOREIGN DATA WRAPPER postgres_fdw
  OPTIONS (dbname 'subledgr_subsquid_dock', host 'localhost', port '5432');

-- also for postgres!
CREATE USER MAPPING for subledgr_subsquid SERVER shard_dock 
  OPTIONS (user 'subledgr_subsquid', password 'subledgr_subsquid');

CREATE FOREIGN TABLE IF NOT EXISTS transfer_dock PARTITION OF transfer
  FOR VALUES IN ('dock')
  SERVER shard_dock
  OPTIONS (table_name 'transfer');
