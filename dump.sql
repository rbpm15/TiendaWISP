--
-- PostgreSQL database dump
--

\restrict Depe2nv8GmFNV3FqMF0PTu2YtnZmfTXK9b8DjnFNUyQBazbUr5cAhiXEM2U70kw

-- Dumped from database version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)

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
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_messages (
    id integer NOT NULL,
    session_id text DEFAULT 'default'::text NOT NULL,
    role text NOT NULL,
    content text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.chat_messages OWNER TO postgres;

--
-- Name: chat_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chat_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chat_messages_id_seq OWNER TO postgres;

--
-- Name: chat_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chat_messages_id_seq OWNED BY public.chat_messages.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    sku text NOT NULL,
    name text NOT NULL,
    brand text NOT NULL,
    category text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    frequency text,
    gain_dbi double precision,
    max_distance_km double precision,
    throughput text,
    poe_type text,
    link_type text,
    use_case text,
    quantity integer DEFAULT 0 NOT NULL,
    min_stock integer DEFAULT 5 NOT NULL,
    cost_price double precision DEFAULT 0 NOT NULL,
    sell_price double precision DEFAULT 0 NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: stock_movements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_movements (
    id integer NOT NULL,
    product_id integer NOT NULL,
    type text NOT NULL,
    quantity integer NOT NULL,
    notes text DEFAULT ''::text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.stock_movements OWNER TO postgres;

--
-- Name: stock_movements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_movements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_movements_id_seq OWNER TO postgres;

--
-- Name: stock_movements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_movements_id_seq OWNED BY public.stock_movements.id;


--
-- Name: chat_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_messages ALTER COLUMN id SET DEFAULT nextval('public.chat_messages_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: stock_movements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements ALTER COLUMN id SET DEFAULT nextval('public.stock_movements_id_seq'::regclass);


--
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_messages (id, session_id, role, content, created_at) FROM stdin;
7	default	user	¿Qué antenas tengo para un enlace de 5 km?	2026-08-31 02:16:58.228
8	default	assistant	Para un enlace de 5 km, te recomiendo las siguientes antenas disponibles en inventario:\n\n1. **LiteBeam 5AC Gen2 (Ubiquiti)**\n   - **SKU:** UBQ-LBE-5AC-G2\n   - **Frecuencia:** 5 GHz\n   - **Ganancia:** 23 dBi\n   - **Stock Disponible:** ✅ 7 uds\n   - **Costo:** $1389\n   - **Precio de Venta:** $1650\n\n2. **NanoBeam 5AC**\n   - No está disponible en el inventario actual, por lo que no puedo recomendarlo.\n\nAmbas son opciones adecuadas para enlaces de hasta 7 km. Puedes elegir la LiteBeam 5AC Gen2. Si necesitas más ayuda, por favor házmelo saber.	2026-08-31 02:17:02.62
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, sku, name, brand, category, description, frequency, gain_dbi, max_distance_km, throughput, poe_type, link_type, use_case, quantity, min_stock, cost_price, sell_price, currency, is_active, created_at, updated_at) FROM stdin;
14	GAB-PLASTICO	Gabinete Plástico	Genérico	accessory	Gabinete de plástico para protección de equipos.	\N	\N	\N	\N	\N	\N	infraestructura	1	1	229	350	MXN	t	2026-08-21 21:23:31.757	2026-08-21 21:23:31.757
13	POE-RUJ-48V	PoE Ruijie 48V	Ruijie	poe	Inyector PoE 48V para equipos Ruijie.	\N	\N	\N	\N	48V	\N	general	1	1	389	500	MXN	t	2026-08-21 21:23:31.75	2026-08-21 21:23:31.75
12	POE-24V-1A	PoE 24V 1A	Ubiquiti	poe	Inyector PoE 24V 1A.	\N	\N	\N	\N	24V Passive	\N	general	2	1	370	450	MXN	t	2026-08-21 21:23:31.743	2026-08-21 21:23:31.743
11	POE-24V-05A	PoE 24V 0.5A	Ubiquiti	poe	Inyector PoE 24V 0.5A.	\N	\N	\N	\N	24V Passive	\N	general	2	1	307	400	MXN	t	2026-08-21 21:23:31.736	2026-08-21 21:23:31.736
9	RUJ-RG-EW1200	Ruijie RG-EW1200	Ruijie	router	Router inalámbrico de doble banda.	2.4/5 GHz	\N	\N	\N	\N	\N	cliente	2	1	475	600	MXN	t	2026-08-21 21:23:31.725	2026-08-21 21:23:31.725
6	UBQ-LBE-5AC-G2	LiteBeam 5AC Gen2	Ubiquiti	antenna	Antena direccional airMAX ac de 23 dBi para enlaces PtP.	5 GHz	23	\N	\N	\N	PtP	enlace	7	3	1389	1650	MXN	t	2026-08-21 21:23:31.708	2026-08-21 21:23:31.708
7	TPL-ARCHER-C50	Archer C50	TP-Link	router	Router Inalámbrico de Doble Banda AC1200.	2.4/5 GHz	\N	\N	\N	\N	\N	cliente	2	1	419	500	MXN	t	2026-08-21 21:23:31.714	2026-08-21 21:23:31.714
3	US-NS-M5	Nanostation (De uso)	Ubiquiti	antenna	Nanostation CPE de uso (usada).	5 GHz	\N	\N	\N	\N	\N	cliente	1	0	0	800	MXN	t	2026-08-21 21:23:31.687	2026-08-21 21:23:31.687
2	US-LOCO-M2	Loco M2 (De uso)	Ubiquiti	antenna	Antena CPE de uso (usada).	2.4 GHz	\N	\N	\N	\N	\N	cliente	1	0	0	600	MXN	t	2026-08-21 21:23:31.68	2026-08-21 21:23:31.68
1	US-LBE-M5	LiteBeam M5 (De uso)	Ubiquiti	antenna	Antena direccional de uso (usada) para enlaces.	5 GHz	\N	\N	\N	\N	\N	enlace	1	0	0	600	MXN	t	2026-08-21 21:23:31.412	2026-08-21 21:23:31.412
4	US-TPL-840N	TP-Link 840N (De uso)	TP-Link	router	Router básico de uso (usado).	2.4 GHz	\N	\N	\N	\N	\N	cliente	2	0	0	350	MXN	t	2026-08-21 21:23:31.695	2026-08-21 21:23:31.695
5	US-TPL-SW5	Switch TP-Link 5 puertos (De uso)	TP-Link	switch	Switch de 5 puertos de uso (usado).	\N	\N	\N	\N	\N	\N	infraestructura	1	0	0	200	MXN	t	2026-08-21 21:23:31.701	2026-08-21 21:23:31.701
10	CABLE-PROCAT5EXT-500	Cable Procat5ext (Bobina 500m)	Genérico	cable	Bobina de cable de 500 metros. Costo por bobina $1500, se puede vender a $20 el metro.	\N	\N	\N	\N	\N	\N	general	1	1	1500	10000	MXN	t	2026-08-21 21:23:31.73	2026-08-21 21:23:31.73
8	UBQ-PBE-5AC	PowerBeam 5AC	Ubiquiti	antenna	Antena de alto rendimiento para enlaces de larga distancia.	5 GHz	\N	\N	\N	\N	PtP	enlace	2	1	2776	3350	MXN	t	2026-08-21 21:23:31.719	2026-08-21 21:23:31.719
\.


--
-- Data for Name: stock_movements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_movements (id, product_id, type, quantity, notes, created_at) FROM stdin;
1	1	in	5	Stock inicial basado en inventario	2026-08-21 21:23:31.675
2	2	in	5	Stock inicial basado en inventario	2026-08-21 21:23:31.683
3	3	in	5	Stock inicial basado en inventario	2026-08-21 21:23:31.691
4	4	in	5	Stock inicial basado en inventario	2026-08-21 21:23:31.698
5	5	in	5	Stock inicial basado en inventario	2026-08-21 21:23:31.705
6	6	in	10	Stock inicial basado en inventario	2026-08-21 21:23:31.711
7	7	in	10	Stock inicial basado en inventario	2026-08-21 21:23:31.717
8	8	in	5	Stock inicial basado en inventario	2026-08-21 21:23:31.722
9	9	in	10	Stock inicial basado en inventario	2026-08-21 21:23:31.728
10	10	in	2	Stock inicial basado en inventario	2026-08-21 21:23:31.733
11	11	in	15	Stock inicial basado en inventario	2026-08-21 21:23:31.74
12	12	in	10	Stock inicial basado en inventario	2026-08-21 21:23:31.747
13	13	in	8	Stock inicial basado en inventario	2026-08-21 21:23:31.754
14	14	in	12	Stock inicial basado en inventario	2026-08-21 21:23:31.761
\.


--
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_messages_id_seq', 8, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 14, true);


--
-- Name: stock_movements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_movements_id_seq', 14, true);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: stock_movements stock_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_pkey PRIMARY KEY (id);


--
-- Name: products_sku_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX products_sku_key ON public.products USING btree (sku);


--
-- Name: stock_movements stock_movements_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict Depe2nv8GmFNV3FqMF0PTu2YtnZmfTXK9b8DjnFNUyQBazbUr5cAhiXEM2U70kw

