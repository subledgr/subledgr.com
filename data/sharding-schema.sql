-- Role: subledgr_subsquid
-- DROP ROLE IF EXISTS subledgr_subsquid;

CREATE ROLE subledgr_subsquid WITH
  LOGIN
  NOSUPERUSER
  INHERIT
  CREATEDB
  NOCREATEROLE
  NOREPLICATION
  ENCRYPTED PASSWORD 'SCRAM-SHA-256$4096:nsccScHyaoy4cPSMVrAl1Q==$2t49vp5g0fKrz4s4VTSRbxEc5h7PpM6C/QGPKSL4XC8=:51rmypg75Bf6klt2TIQocNntGFuA+rnfv4laQpNMeQQ=';

-- there is a central database
-- one shard for each chain data

-- DROP DATABASE IF EXISTS subledgr_subsquid;
CREATE DATABASE subledgr_subsquid
  WITH
  OWNER = subledgr_subsquid
  ENCODING = 'UTF8'
  LC_COLLATE = 'en_GB.UTF-8'
  LC_CTYPE = 'en_GB.UTF-8'
  LOCALE_PROVIDER = 'libc'
  TABLESPACE = pg_default
  CONNECTION LIMIT = -1
  IS_TEMPLATE = False;
USE DATABASE subledgr_subsquid;

-- DROP TABLE IF EXISTS public.transfer;
CREATE TABLE IF NOT EXISTS public.transfer
(
	"chain_id" character varying NOT NULL,
  "id" character varying COLLATE pg_catalog."default" NOT NULL,
  "block_number" integer NOT NULL,
  "timestamp" timestamp with time zone NOT NULL,
  "extrinsic_hash" text COLLATE pg_catalog."default",
  "amount" numeric NOT NULL,
  "fee" numeric,
  "from_id" character varying COLLATE pg_catalog."default",
  "to_id" character varying COLLATE pg_catalog."default",
  "extrinsic_id" character varying(32) COLLATE pg_catalog."default",
  "section" character varying(32) COLLATE pg_catalog."default",
  "method" character varying(32) COLLATE pg_catalog."default"
  -- CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" 
	-- PRIMARY KEY ("id")
) PARTITION BY LIST("chain_id");

CREATE INDEX transfer_chain_id ON transfer("chain_id");
CREATE INDEX transfer_id ON transfer("id");

ALTER TABLE IF EXISTS public.transfer
  OWNER to subledgr_subsquid;

-- Enable sharding
CREATE EXTENSION postgres_fdw;
GRANT USAGE ON FOREIGN DATA WRAPPER postgres_fdw to subledgr_subsquid;

-- Shard for each chain =======================================================

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
