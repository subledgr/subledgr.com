/**

NOT HERE, PUT THE FILE IN ../docker/data/schema.mariadb.sql

**/




--
-- PostgreSQL database dump
--

CREATE USER subledgr IDENTIFIED BY 'subledgr';
CREATE DATABASE subledgr;
GRANT ALL PRIVILEGES ON DATABASE subledgr TO subledgr;

USE subledgr;

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

-- Started on 2023-04-14 16:18:53 BST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 229 (class 1259 OID 16547)
-- Name: archive; Type: TABLE; Schema: public; Owner: subledgr
--

CREATE TABLE public.archive (
    id integer NOT NULL,
    "createdAt" bigint,
    "fromModel" text,
    "originalRecord" json,
    "originalRecordId" json
);


ALTER TABLE public.archive OWNER TO subledgr;

--
-- TOC entry 228 (class 1259 OID 16546)
-- Name: archive_id_seq; Type: SEQUENCE; Schema: public; Owner: subledgr
--

CREATE SEQUENCE public.archive_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.archive_id_seq OWNER TO subledgr;

--
-- TOC entry 3419 (class 0 OID 0)
-- Dependencies: 228
-- Name: archive_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: subledgr
--

ALTER SEQUENCE public.archive_id_seq OWNED BY public.archive.id;


--
-- TOC entry 233 (class 1259 OID 16637)
-- Name: currency; Type: TABLE; Schema: public; Owner: subledgr
--

CREATE TABLE public.currency (
    code character varying(32) NOT NULL,
    name character varying(64),
    symbol character varying(64),
    "symbolPosition" smallint DEFAULT '-1'::integer,
    decimals integer,
    status character varying(16),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.currency OWNER TO subledgr;

--
-- TOC entry 230 (class 1259 OID 16565)
-- Name: portfolio; Type: TABLE; Schema: public; Owner: subledgr
--

CREATE TABLE public.portfolio (
    id integer NOT NULL,
    name character varying(64),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer,
    "currencyId" integer
);


ALTER TABLE public.portfolio OWNER TO subledgr;

--
-- TOC entry 231 (class 1259 OID 16580)
-- Name: portfolio_wallet; Type: TABLE; Schema: public; Owner: subledgr
--

CREATE TABLE public.portfolio_wallet (
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "walletId" integer NOT NULL,
    "portfolioId" integer NOT NULL
);


ALTER TABLE public.portfolio_wallet OWNER TO subledgr;

--
-- TOC entry 236 (class 1259 OID 24585)
-- Name: price; Type: TABLE; Schema: public; Owner: subledgr
--

CREATE TABLE public.price (
    datetime character varying,
    f_curr character varying(24),
    t_curr character varying(24),
    value double precision
);


ALTER TABLE public.price OWNER TO subledgr;

--
-- TOC entry 235 (class 1259 OID 16660)
-- Name: user; Type: TABLE; Schema: public; Owner: subledgr
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    email character varying(64),
    password character varying(64),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."user" OWNER TO subledgr;

--
-- TOC entry 237 (class 1259 OID 24638)
-- Name: user_asset; Type: TABLE; Schema: public; Owner: subledgr
--

CREATE TABLE public.user_asset (
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer NOT NULL,
    code character varying(32) NOT NULL
);


ALTER TABLE public.user_asset OWNER TO subledgr;

--
-- TOC entry 234 (class 1259 OID 16659)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: subledgr
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO subledgr;

--
-- TOC entry 3420 (class 0 OID 0)
-- Dependencies: 234
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: subledgr
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- TOC entry 232 (class 1259 OID 16618)
-- Name: wallet; Type: TABLE; Schema: public; Owner: subledgr
--

CREATE TABLE public.wallet (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(64),
    address character varying(64),
    balance bigint,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer,
    "currencyCode" character varying(32)
);


ALTER TABLE public.wallet OWNER TO subledgr;

--
-- TOC entry 3239 (class 2604 OID 16550)
-- Name: archive id; Type: DEFAULT; Schema: public; Owner: subledgr
--

ALTER TABLE ONLY public.archive ALTER COLUMN id SET DEFAULT nextval('public.archive_id_seq'::regclass);


--
-- TOC entry 3242 (class 2604 OID 16663)
-- Name: user id; Type: DEFAULT; Schema: public; Owner: subledgr
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- TOC entry 3405 (class 0 OID 16547)
-- Dependencies: 229
-- Data for Name: archive; Type: TABLE DATA; Schema: public; Owner: subledgr
--

COPY public.archive (id, "createdAt", "fromModel", "originalRecord", "originalRecordId") FROM stdin;
\.


--
-- TOC entry 3409 (class 0 OID 16637)
-- Dependencies: 233
-- Data for Name: currency; Type: TABLE DATA; Schema: public; Owner: subledgr
--

COPY public.currency (code, name, symbol, "symbolPosition", decimals, status, "createdAt", "updatedAt") FROM stdin;
GBP	British Pound	£	-1	2	active	2023-03-20 00:00:00+00	2023-03-20 00:00:00+00
DOT	Polkadot	DOT	1	10	active	2023-03-20 00:00:00+00	2023-03-20 00:00:00+00
KSM	Kusama	KSM	1	12	active	2023-03-20 00:00:00+00	2023-03-20 00:00:00+00
DOCK	Dock	DOCK	1	8	active	2023-03-20 00:00:00+00	2023-03-20 00:00:00+00
\.


--
-- TOC entry 3406 (class 0 OID 16565)
-- Dependencies: 230
-- Data for Name: portfolio; Type: TABLE DATA; Schema: public; Owner: subledgr
--

COPY public.portfolio (id, name, "createdAt", "updatedAt", "userId", "currencyId") FROM stdin;
1	Portfolio 1	2023-03-20 16:36:30+00	2023-03-20 16:36:30+00	1	1
\.


--
-- TOC entry 3407 (class 0 OID 16580)
-- Dependencies: 231
-- Data for Name: portfolio_wallet; Type: TABLE DATA; Schema: public; Owner: subledgr
--

COPY public.portfolio_wallet ("createdAt", "updatedAt", "walletId", "portfolioId") FROM stdin;
2023-03-20 16:36:30+00	2023-03-20 16:36:30+00	1	1
\.


--
-- TOC entry 3412 (class 0 OID 24585)
-- Dependencies: 236
-- Data for Name: price; Type: TABLE DATA; Schema: public; Owner: subledgr
--

COPY public.price (datetime, f_curr, t_curr, value) FROM stdin;
1	2	3	4
20230409144600	DOCK	GBP	0.01776596
20230409144600	KSM	GBP	25.78
20230409144600	DOT	GBP	4.93
20230409150900	DOT	GBP	4.95
20230409150900	DOCK	GBP	0.01780817
20230409150900	KSM	GBP	25.77
20230410101500	DOCK	GBP	0.01846781
20230410101500	KSM	GBP	26.21
20230410101500	DOT	GBP	4.97
20230411123600	DOCK	GBP	0.01885578
20230411123600	KSM	GBP	27.03
20230411123600	DOT	GBP	4.97
20230411163400	DOCK	GBP	0.01882685
20230411163400	KSM	GBP	27.26
20230411163400	DOT	GBP	5.18
20230412091400	DOCK	GBP	0.01810772
20230412091400	KSM	GBP	26.75
20230412091400	DOT	GBP	5.07
20230412091400	DOCK	GBP	0.01810772
20230412091400	KSM	GBP	26.75
20230412091400	DOT	GBP	5.07
\.


--
-- TOC entry 3411 (class 0 OID 16660)
-- Dependencies: 235
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: subledgr
--

COPY public."user" (id, email, password, "createdAt", "updatedAt") FROM stdin;
1	derek@colley.cc	$2b$08$EoTSIZNGRY5li0p4fWhxCu4UbPdLZS756bzs8Ai5e/IgI9KdymJHK	2023-03-21 10:30:01.769+00	2023-03-21 10:30:01.769+00
\.


--
-- TOC entry 3413 (class 0 OID 24638)
-- Dependencies: 237
-- Data for Name: user_asset; Type: TABLE DATA; Schema: public; Owner: subledgr
--

COPY public.user_asset ("createdAt", "updatedAt", "userId", code) FROM stdin;
2023-04-10 08:20:49.935+00	2023-04-10 08:20:49.935+00	1	DOT
2023-04-10 08:23:47.121+00	2023-04-10 08:23:47.121+00	1	DOCK
2023-04-10 09:07:46.65+00	2023-04-10 09:07:46.65+00	1	KSM
\.


--
-- TOC entry 3408 (class 0 OID 16618)
-- Dependencies: 232
-- Data for Name: wallet; Type: TABLE DATA; Schema: public; Owner: subledgr
--

COPY public.wallet (id, name, address, balance, "createdAt", "updatedAt", "userId", "currencyCode") FROM stdin;
cd05716e-f3c5-4bb5-923c-af0ec02777a8	GBP Wallet	IBAN 22-22-22 12345678	0	2023-03-20 20:23:34.296+00	2023-03-20 20:23:34.296+00	1	GBP
c6811b6b-1976-4917-9283-bdf9f7d62617	Kusama Staking Stash 1	Ew5NJucSyE17T4QYBhjbm1WYrGk2oULTHyjiJacLbCNfc4Q	0	2023-03-23 17:35:30.818+00	2023-03-23 17:35:30.818+00	1	KSM
59bf7287-62b3-4cff-bd69-f0b0944896fb	Polkadot Staking Stash	13pnRtJAQ3A7eg6m2hEYnsA9a4fLC1WgEBzi9E6CUTGqtSHu	0	2023-03-20 20:12:06.698+00	2023-03-20 20:12:06.698+00	1	DOT
5ce5ce3a-0ce2-45e1-bef4-8087b0e789f4	Polkadot Validator Stash 1	165YJj6sSsY4G59yQPa1ZFTP989FMBXcAe4DMYBT1hcgCNxE	0	2023-03-20 20:15:37.491+00	2023-03-20 20:15:37.491+00	1	DOT
ce80ba37-5fbb-40df-8092-bf5633e20476	Polkadot Stash Account	12WPkGHWYhL7Vdtwqbjo7ugbaoajr8KLMChnE3puX4Q5Cxsf	0	2023-04-09 17:16:06.405+00	2023-04-09 17:16:06.405+00	1	DOT
6728703a-892b-4195-a3c8-44ea2865cb0d	Polkadot Validator Control	158ih8ak7jWnKPvBDTnvY9mqxdV3MTPaRDwiwin21mir851p	0	2023-04-09 17:16:47.111+00	2023-04-09 17:16:47.111+00	1	DOT
4bf3bc4b-c7b4-49e6-acfc-276bc5dc3e60	Polkadot Staking Miner	14VbV1eqDCFVf4ykPbf1KmNVxZc4ex3EXsjgTBQDC3vHg1AV	0	2023-04-09 17:17:30.13+00	2023-04-09 17:17:30.13+00	1	DOT
150831de-4bbc-4ebf-a0f5-58bc831c3fe0	Polkadot Validator Stash	16ce9zrmiuAtdi9qv1tuiQ1RC1xR6y6NgnBcRtMoQeAobqpZ	0	2023-04-09 17:18:19.529+00	2023-04-09 17:18:19.529+00	1	DOT
8428f6e9-d6c8-41d4-9da9-36915f3504cd	Kusama Staking Stash 1	HyLisujX7Cr6D7xzb6qadFdedLt8hmArB6ZVGJ6xsCUHqmx	0	2023-04-09 17:20:00.208+00	2023-04-09 17:20:00.208+00	1	KSM
bdc5d5be-c2f3-442e-bb05-b9810761c24e	Kusama Staking Stash 2	FAR296Aqh9i8W5bi7BS7a8Bkhbw5LX5xCXP22c1Jvc2tM5v	0	2023-04-09 17:20:31.387+00	2023-04-09 17:20:31.387+00	1	KSM
926eaa1e-da62-46f6-bbc8-8fd72bf2939c	Kusama Projects	HRsFmUc7veGbV9fyFAz2q7mxEGaCH3k2dHPy5MvT61r1vMN	0	2023-04-09 17:20:47.065+00	2023-04-09 17:20:47.065+00	1	KSM
367a26f2-886d-4bdf-9dbd-a1a84185b897	Kusama Staking Control	HhYuQCR1pJKVwPruCSNr8xp4R1ovqtAbNy3S8VuMXsPtBmH	0	2023-04-09 17:21:11.372+00	2023-04-09 17:21:11.372+00	1	KSM
2b097ccc-6055-4a1d-9718-ee0485f31063	Kusama Validator Control 1	EuKPqqwM5Q3jxCxGqrHcLnBM1Edv5QR5Cnzjhi1MttQWwLp	0	2023-04-09 17:21:40.984+00	2023-04-09 17:21:40.984+00	1	KSM
bb0af128-c206-4f95-a91e-8934129c5d70	Kusama Validator Control 2	GnwqjJsoSjL4B2XuvGgkVB7SdZ9fBymBhG7bwBe83PKoWyE	0	2023-04-09 17:21:53.095+00	2023-04-09 17:21:53.095+00	1	KSM
693c8272-d993-4193-948d-c7e087ca7519	Kusama Staking Miner	H2LjzjkgpyUiNeazaBxVNjTujzUEgCJKGJ5VykHsj3JD5rx	0	2023-04-09 17:22:11.815+00	2023-04-09 17:22:11.815+00	1	KSM
6a129c37-7292-4c90-95dc-8fe0f749a33e	Dock Staking Account 1	3FQUnxLPabNRzihRwc2iJtBUJfpYgpZnsQkcyGq2dybugmvL	0	2023-04-09 17:23:43.581+00	2023-04-09 17:23:43.581+00	1	DOCK
a00d37a9-5930-4cd3-9038-6e1b83ad5a72	Dock Validator Stash 1	3D6KKyNq3rocxZUjV9ZKrM3gWP6dXKxmV9umCepjbsGBE5di	0	2023-04-09 17:23:57.064+00	2023-04-09 17:23:57.064+00	1	DOCK
3ef2bdaa-9a32-4d89-adfe-2771f0bac08e	Dock Validator Control 1	3FBGf97RxFKGJmoCJxmmPwUbAsyugpEZQ53yp2qysw6H3ibz	0	2023-04-09 17:24:10.991+00	2023-04-09 17:24:10.991+00	1	DOCK
49364765-cc6a-4fd7-a2c2-8c916fed9baf	Dock Staking Controller 1	3CRPzi8bmCUai67tCKKGdjtURAMjnX8sGBnqY3jTaRzaGsxY	0	2023-04-09 17:24:28.607+00	2023-04-09 17:24:28.607+00	1	DOCK
5a06f92d-935e-408d-8380-655188a505a8	Dock Payout Bot	3GgB5XbVKerzR8MXjUDCvWJ3gwiADW8e77gVeC93LEhcU7w7	0	2023-04-09 17:24:42.187+00	2023-04-09 17:24:42.187+00	1	DOCK
cc7de2e4-f4c4-4930-92d7-15837cab65cc	Dock Staking Acct 2	3Hafb5mAogGc3w6sv4QbjZ1LjCYmzs6uTyZhfaRYLtHDFKyo	0	2023-04-09 17:24:56.042+00	2023-04-09 17:24:56.042+00	1	DOCK
24a0a449-fcc2-489a-bfec-4528064d2d4a	Dock Staking Controller 2	3Eutpnx4o5kMR1C8wNbQ5Bfcf3yf2KbW4AEzxrzZ5ndRw42p	0	2023-04-09 17:25:13.762+00	2023-04-09 17:25:13.762+00	1	DOCK
f7c0eb64-e6e0-4680-a708-4bcfe880f397	Dock Validator Stash 2	3E6NNUnsrTPSRQ59bSBAPf2UVwWawyy4VsYWnHRvf1Z4F2SA	0	2023-04-09 17:25:29.701+00	2023-04-09 17:25:29.701+00	1	DOCK
efd32d5a-09fb-4a33-b1d1-95d5f70ddff5	Dock Validator Control 2	3DCJvzrANJyW2XLhN8in88Q8WsbGiFmkSC4qeTWh2kiVnG5G	0	2023-04-09 17:25:40.217+00	2023-04-09 17:25:40.217+00	1	DOCK
ae24b8a4-bcc4-40ff-8164-073b9e6151c2	Dock Staking Acct 3	3CLJVoZpRHMFkhiK4JYCi7YepJwqf9oQUfD7411mefw5UEFE	0	2023-04-09 17:25:54.625+00	2023-04-09 17:25:54.625+00	1	DOCK
fafc3db8-314c-4195-9c31-d32d05b3277b	Dock Staking Controller 3	3CKn6syxRhdEn6UeLtSLrraQwwj4qh85EbtJv7hqZPpuMZrS	0	2023-04-09 17:26:07.194+00	2023-04-09 17:26:07.194+00	1	DOCK
22deb804-0b40-4157-8991-71682957c470	Kusama Ledger 1	EJSmY9hUoQjvWfDJxwT8GXUJYn69Fwq4hKHciG47gp8veKm	0	2023-04-12 08:12:21.761+00	2023-04-12 08:12:21.761+00	1	KSM
\.


--
-- TOC entry 3421 (class 0 OID 0)
-- Dependencies: 228
-- Name: archive_id_seq; Type: SEQUENCE SET; Schema: public; Owner: subledgr
--

SELECT pg_catalog.setval('public.archive_id_seq', 1, false);


--
-- TOC entry 3422 (class 0 OID 0)
-- Dependencies: 234
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: subledgr
--

SELECT pg_catalog.setval('public.user_id_seq', 3, true);


--
-- TOC entry 3244 (class 2606 OID 16554)
-- Name: archive archive_pkey; Type: CONSTRAINT; Schema: public; Owner: subledgr
--

ALTER TABLE ONLY public.archive
    ADD CONSTRAINT archive_pkey PRIMARY KEY (id);


--
-- TOC entry 3252 (class 2606 OID 16642)
-- Name: currency currency_pkey; Type: CONSTRAINT; Schema: public; Owner: subledgr
--

ALTER TABLE ONLY public.currency
    ADD CONSTRAINT currency_pkey PRIMARY KEY (code);


--
-- TOC entry 3246 (class 2606 OID 16569)
-- Name: portfolio portfolio_pkey; Type: CONSTRAINT; Schema: public; Owner: subledgr
--

ALTER TABLE ONLY public.portfolio
    ADD CONSTRAINT portfolio_pkey PRIMARY KEY (id);


--
-- TOC entry 3248 (class 2606 OID 16584)
-- Name: portfolio_wallet portfolio_wallet_pkey; Type: CONSTRAINT; Schema: public; Owner: subledgr
--

ALTER TABLE ONLY public.portfolio_wallet
    ADD CONSTRAINT portfolio_wallet_pkey PRIMARY KEY ("walletId", "portfolioId");


--
-- TOC entry 3257 (class 2606 OID 24642)
-- Name: user_asset user_asset_pkey; Type: CONSTRAINT; Schema: public; Owner: subledgr
--

ALTER TABLE ONLY public.user_asset
    ADD CONSTRAINT user_asset_pkey PRIMARY KEY ("userId", code);


--
-- TOC entry 3254 (class 2606 OID 16665)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: subledgr
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- TOC entry 3250 (class 2606 OID 16623)
-- Name: wallet wallet_pkey; Type: CONSTRAINT; Schema: public; Owner: subledgr
--

ALTER TABLE ONLY public.wallet
    ADD CONSTRAINT wallet_pkey PRIMARY KEY (id);


--
-- TOC entry 3255 (class 1259 OID 24589)
-- Name: primary_key; Type: INDEX; Schema: public; Owner: subledgr
--

CREATE INDEX primary_key ON public.price USING btree (datetime, f_curr, t_curr);


--
-- TOC entry 3258 (class 2606 OID 16590)
-- Name: portfolio_wallet portfolio_wallet_portfolioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: subledgr
--

ALTER TABLE ONLY public.portfolio_wallet
    ADD CONSTRAINT "portfolio_wallet_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES public.portfolio(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3259 (class 2606 OID 16585)
-- Name: portfolio_wallet portfolio_wallet_walletId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: subledgr
--

ALTER TABLE ONLY public.portfolio_wallet
    ADD CONSTRAINT "portfolio_wallet_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES public.portfolio(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3260 (class 2606 OID 24648)
-- Name: user_asset user_asset_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: subledgr
--

ALTER TABLE ONLY public.user_asset
    ADD CONSTRAINT user_asset_code_fkey FOREIGN KEY (code) REFERENCES public.currency(code) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3261 (class 2606 OID 24643)
-- Name: user_asset user_asset_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: subledgr
--

ALTER TABLE ONLY public.user_asset
    ADD CONSTRAINT "user_asset_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2023-04-14 16:18:54 BST

--
-- PostgreSQL database dump complete
--

