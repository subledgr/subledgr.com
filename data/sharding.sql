-- Table: public.transfer

DROP TABLE IF EXISTS public.transfer;

CREATE TABLE IF NOT EXISTS public.transfer
(
    chain_id character varying COLLATE pg_catalog."default" NOT NULL,
    id character varying COLLATE pg_catalog."default" NOT NULL,
    block_number integer NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    extrinsic_hash text COLLATE pg_catalog."default",
    amount numeric NOT NULL,
    fee numeric,
    from_id character varying COLLATE pg_catalog."default",
    to_id character varying COLLATE pg_catalog."default",
    extrinsic_id character varying(32) COLLATE pg_catalog."default",
    section character varying(32) COLLATE pg_catalog."default",
    method character varying(32) COLLATE pg_catalog."default",
    asset_id character varying(64) COLLATE pg_catalog."default",
    from_pk bytea,
    to_pk bytea
) PARTITION BY LIST (chain_id);

ALTER TABLE IF EXISTS public.transfer
    OWNER to subledgr_subsquid;

GRANT ALL ON TABLE public.transfer TO subledgr_subsquid;
-- Index: transfer_asset_id

-- DROP INDEX IF EXISTS public.transfer_asset_id;

CREATE INDEX IF NOT EXISTS transfer_asset_id
    ON public.transfer USING btree
    (asset_id COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (deduplicate_items=True)
;
-- Index: transfer_block_number

-- DROP INDEX IF EXISTS public.transfer_block_number;

CREATE INDEX IF NOT EXISTS transfer_block_number
    ON public.transfer USING btree
    (block_number ASC NULLS LAST)
    WITH (deduplicate_items=True)
;
-- Index: transfer_chain_id

-- DROP INDEX IF EXISTS public.transfer_chain_id;

CREATE INDEX IF NOT EXISTS transfer_chain_id
    ON public.transfer USING btree
    (chain_id COLLATE pg_catalog."default" ASC NULLS LAST)
;
-- Index: transfer_from_pk

-- DROP INDEX IF EXISTS public.transfer_from_pk;

CREATE INDEX IF NOT EXISTS transfer_from_pk
    ON public.transfer USING btree
    (from_pk ASC NULLS LAST)
    WITH (deduplicate_items=True)
;
-- Index: transfer_id

-- DROP INDEX IF EXISTS public.transfer_id;

CREATE INDEX IF NOT EXISTS transfer_id
    ON public.transfer USING btree
    (id COLLATE pg_catalog."default" ASC NULLS LAST)
;
-- Index: transfer_to_pk

-- DROP INDEX IF EXISTS public.transfer_to_pk;

CREATE INDEX IF NOT EXISTS transfer_to_pk
    ON public.transfer USING btree
    (to_pk ASC NULLS LAST)
    WITH (deduplicate_items=True)
;

-- Partitions SQL

CREATE TABLE public.transfer_acala PARTITION OF public.transfer
    FOR VALUES IN ('acala')
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.transfer_acala
    OWNER to postgres;
CREATE TABLE public.transfer_dock PARTITION OF public.transfer
    FOR VALUES IN ('dock')
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.transfer_dock
    OWNER to postgres;
CREATE TABLE public.transfer_kusama PARTITION OF public.transfer
    FOR VALUES IN ('kusama')
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.transfer_kusama
    OWNER to postgres;
CREATE TABLE public.transfer_polkadot PARTITION OF public.transfer
    FOR VALUES IN ('polkadot')
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.transfer_polkadot
    OWNER to postgres;