--
-- PostgreSQL database dump
--

\restrict dsYGjfUAAHcRgwbzRvfJxrmsEb2O1CYfxLrChE1vdHYVoWgvZdkuRDZPCtol8PJ

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

--
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.chat_messages (id, session_id, role, content, created_at) VALUES (7, 'default', 'user', '¿Qué antenas tengo para un enlace de 5 km?', '2026-08-31 02:16:58.228');
INSERT INTO public.chat_messages (id, session_id, role, content, created_at) VALUES (8, 'default', 'assistant', 'Para un enlace de 5 km, te recomiendo las siguientes antenas disponibles en inventario:

1. **LiteBeam 5AC Gen2 (Ubiquiti)**
   - **SKU:** UBQ-LBE-5AC-G2
   - **Frecuencia:** 5 GHz
   - **Ganancia:** 23 dBi
   - **Stock Disponible:** ✅ 7 uds
   - **Costo:** $1389
   - **Precio de Venta:** $1650

2. **NanoBeam 5AC**
   - No está disponible en el inventario actual, por lo que no puedo recomendarlo.

Ambas son opciones adecuadas para enlaces de hasta 7 km. Puedes elegir la LiteBeam 5AC Gen2. Si necesitas más ayuda, por favor házmelo saber.', '2026-08-31 02:17:02.62');


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.products (id, sku, name, brand, category, description, frequency, gain_dbi, max_distance_km, throughput, poe_type, link_type, use_case, quantity, min_stock, cost_price, sell_price, currency, is_active, created_at, updated_at) VALUES (14, 'GAB-PLASTICO', 'Gabinete Plástico', 'Genérico', 'accessory', 'Gabinete de plástico para protección de equipos.', NULL, NULL, NULL, NULL, NULL, NULL, 'infraestructura', 1, 1, 229, 350, 'MXN', true, '2026-08-21 21:23:31.757', '2026-08-21 21:23:31.757');
INSERT INTO public.products (id, sku, name, brand, category, description, frequency, gain_dbi, max_distance_km, throughput, poe_type, link_type, use_case, quantity, min_stock, cost_price, sell_price, currency, is_active, created_at, updated_at) VALUES (13, 'POE-RUJ-48V', 'PoE Ruijie 48V', 'Ruijie', 'poe', 'Inyector PoE 48V para equipos Ruijie.', NULL, NULL, NULL, NULL, '48V', NULL, 'general', 1, 1, 389, 500, 'MXN', true, '2026-08-21 21:23:31.75', '2026-08-21 21:23:31.75');
INSERT INTO public.products (id, sku, name, brand, category, description, frequency, gain_dbi, max_distance_km, throughput, poe_type, link_type, use_case, quantity, min_stock, cost_price, sell_price, currency, is_active, created_at, updated_at) VALUES (12, 'POE-24V-1A', 'PoE 24V 1A', 'Ubiquiti', 'poe', 'Inyector PoE 24V 1A.', NULL, NULL, NULL, NULL, '24V Passive', NULL, 'general', 2, 1, 370, 450, 'MXN', true, '2026-08-21 21:23:31.743', '2026-08-21 21:23:31.743');
INSERT INTO public.products (id, sku, name, brand, category, description, frequency, gain_dbi, max_distance_km, throughput, poe_type, link_type, use_case, quantity, min_stock, cost_price, sell_price, currency, is_active, created_at, updated_at) VALUES (11, 'POE-24V-05A', 'PoE 24V 0.5A', 'Ubiquiti', 'poe', 'Inyector PoE 24V 0.5A.', NULL, NULL, NULL, NULL, '24V Passive', NULL, 'general', 2, 1, 307, 400, 'MXN', true, '2026-08-21 21:23:31.736', '2026-08-21 21:23:31.736');
INSERT INTO public.products (id, sku, name, brand, category, description, frequency, gain_dbi, max_distance_km, throughput, poe_type, link_type, use_case, quantity, min_stock, cost_price, sell_price, currency, is_active, created_at, updated_at) VALUES (9, 'RUJ-RG-EW1200', 'Ruijie RG-EW1200', 'Ruijie', 'router', 'Router inalámbrico de doble banda.', '2.4/5 GHz', NULL, NULL, NULL, NULL, NULL, 'cliente', 2, 1, 475, 600, 'MXN', true, '2026-08-21 21:23:31.725', '2026-08-21 21:23:31.725');
INSERT INTO public.products (id, sku, name, brand, category, description, frequency, gain_dbi, max_distance_km, throughput, poe_type, link_type, use_case, quantity, min_stock, cost_price, sell_price, currency, is_active, created_at, updated_at) VALUES (6, 'UBQ-LBE-5AC-G2', 'LiteBeam 5AC Gen2', 'Ubiquiti', 'antenna', 'Antena direccional airMAX ac de 23 dBi para enlaces PtP.', '5 GHz', 23, NULL, NULL, NULL, 'PtP', 'enlace', 7, 3, 1389, 1650, 'MXN', true, '2026-08-21 21:23:31.708', '2026-08-21 21:23:31.708');
INSERT INTO public.products (id, sku, name, brand, category, description, frequency, gain_dbi, max_distance_km, throughput, poe_type, link_type, use_case, quantity, min_stock, cost_price, sell_price, currency, is_active, created_at, updated_at) VALUES (7, 'TPL-ARCHER-C50', 'Archer C50', 'TP-Link', 'router', 'Router Inalámbrico de Doble Banda AC1200.', '2.4/5 GHz', NULL, NULL, NULL, NULL, NULL, 'cliente', 2, 1, 419, 500, 'MXN', true, '2026-08-21 21:23:31.714', '2026-08-21 21:23:31.714');
INSERT INTO public.products (id, sku, name, brand, category, description, frequency, gain_dbi, max_distance_km, throughput, poe_type, link_type, use_case, quantity, min_stock, cost_price, sell_price, currency, is_active, created_at, updated_at) VALUES (3, 'US-NS-M5', 'Nanostation (De uso)', 'Ubiquiti', 'antenna', 'Nanostation CPE de uso (usada).', '5 GHz', NULL, NULL, NULL, NULL, NULL, 'cliente', 1, 0, 0, 800, 'MXN', true, '2026-08-21 21:23:31.687', '2026-08-21 21:23:31.687');
INSERT INTO public.products (id, sku, name, brand, category, description, frequency, gain_dbi, max_distance_km, throughput, poe_type, link_type, use_case, quantity, min_stock, cost_price, sell_price, currency, is_active, created_at, updated_at) VALUES (2, 'US-LOCO-M2', 'Loco M2 (De uso)', 'Ubiquiti', 'antenna', 'Antena CPE de uso (usada).', '2.4 GHz', NULL, NULL, NULL, NULL, NULL, 'cliente', 1, 0, 0, 600, 'MXN', true, '2026-08-21 21:23:31.68', '2026-08-21 21:23:31.68');
INSERT INTO public.products (id, sku, name, brand, category, description, frequency, gain_dbi, max_distance_km, throughput, poe_type, link_type, use_case, quantity, min_stock, cost_price, sell_price, currency, is_active, created_at, updated_at) VALUES (1, 'US-LBE-M5', 'LiteBeam M5 (De uso)', 'Ubiquiti', 'antenna', 'Antena direccional de uso (usada) para enlaces.', '5 GHz', NULL, NULL, NULL, NULL, NULL, 'enlace', 1, 0, 0, 600, 'MXN', true, '2026-08-21 21:23:31.412', '2026-08-21 21:23:31.412');
INSERT INTO public.products (id, sku, name, brand, category, description, frequency, gain_dbi, max_distance_km, throughput, poe_type, link_type, use_case, quantity, min_stock, cost_price, sell_price, currency, is_active, created_at, updated_at) VALUES (4, 'US-TPL-840N', 'TP-Link 840N (De uso)', 'TP-Link', 'router', 'Router básico de uso (usado).', '2.4 GHz', NULL, NULL, NULL, NULL, NULL, 'cliente', 2, 0, 0, 350, 'MXN', true, '2026-08-21 21:23:31.695', '2026-08-21 21:23:31.695');
INSERT INTO public.products (id, sku, name, brand, category, description, frequency, gain_dbi, max_distance_km, throughput, poe_type, link_type, use_case, quantity, min_stock, cost_price, sell_price, currency, is_active, created_at, updated_at) VALUES (5, 'US-TPL-SW5', 'Switch TP-Link 5 puertos (De uso)', 'TP-Link', 'switch', 'Switch de 5 puertos de uso (usado).', NULL, NULL, NULL, NULL, NULL, NULL, 'infraestructura', 1, 0, 0, 200, 'MXN', true, '2026-08-21 21:23:31.701', '2026-08-21 21:23:31.701');
INSERT INTO public.products (id, sku, name, brand, category, description, frequency, gain_dbi, max_distance_km, throughput, poe_type, link_type, use_case, quantity, min_stock, cost_price, sell_price, currency, is_active, created_at, updated_at) VALUES (10, 'CABLE-PROCAT5EXT-500', 'Cable Procat5ext (Bobina 500m)', 'Genérico', 'cable', 'Bobina de cable de 500 metros. Costo por bobina $1500, se puede vender a $20 el metro.', NULL, NULL, NULL, NULL, NULL, NULL, 'general', 1, 1, 1500, 10000, 'MXN', true, '2026-08-21 21:23:31.73', '2026-08-21 21:23:31.73');
INSERT INTO public.products (id, sku, name, brand, category, description, frequency, gain_dbi, max_distance_km, throughput, poe_type, link_type, use_case, quantity, min_stock, cost_price, sell_price, currency, is_active, created_at, updated_at) VALUES (8, 'UBQ-PBE-5AC', 'PowerBeam 5AC', 'Ubiquiti', 'antenna', 'Antena de alto rendimiento para enlaces de larga distancia.', '5 GHz', NULL, NULL, NULL, NULL, 'PtP', 'enlace', 2, 1, 2776, 3350, 'MXN', true, '2026-08-21 21:23:31.719', '2026-08-21 21:23:31.719');


--
-- Data for Name: stock_movements; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.stock_movements (id, product_id, type, quantity, notes, created_at) VALUES (1, 1, 'in', 5, 'Stock inicial basado en inventario', '2026-08-21 21:23:31.675');
INSERT INTO public.stock_movements (id, product_id, type, quantity, notes, created_at) VALUES (2, 2, 'in', 5, 'Stock inicial basado en inventario', '2026-08-21 21:23:31.683');
INSERT INTO public.stock_movements (id, product_id, type, quantity, notes, created_at) VALUES (3, 3, 'in', 5, 'Stock inicial basado en inventario', '2026-08-21 21:23:31.691');
INSERT INTO public.stock_movements (id, product_id, type, quantity, notes, created_at) VALUES (4, 4, 'in', 5, 'Stock inicial basado en inventario', '2026-08-21 21:23:31.698');
INSERT INTO public.stock_movements (id, product_id, type, quantity, notes, created_at) VALUES (5, 5, 'in', 5, 'Stock inicial basado en inventario', '2026-08-21 21:23:31.705');
INSERT INTO public.stock_movements (id, product_id, type, quantity, notes, created_at) VALUES (6, 6, 'in', 10, 'Stock inicial basado en inventario', '2026-08-21 21:23:31.711');
INSERT INTO public.stock_movements (id, product_id, type, quantity, notes, created_at) VALUES (7, 7, 'in', 10, 'Stock inicial basado en inventario', '2026-08-21 21:23:31.717');
INSERT INTO public.stock_movements (id, product_id, type, quantity, notes, created_at) VALUES (8, 8, 'in', 5, 'Stock inicial basado en inventario', '2026-08-21 21:23:31.722');
INSERT INTO public.stock_movements (id, product_id, type, quantity, notes, created_at) VALUES (9, 9, 'in', 10, 'Stock inicial basado en inventario', '2026-08-21 21:23:31.728');
INSERT INTO public.stock_movements (id, product_id, type, quantity, notes, created_at) VALUES (10, 10, 'in', 2, 'Stock inicial basado en inventario', '2026-08-21 21:23:31.733');
INSERT INTO public.stock_movements (id, product_id, type, quantity, notes, created_at) VALUES (11, 11, 'in', 15, 'Stock inicial basado en inventario', '2026-08-21 21:23:31.74');
INSERT INTO public.stock_movements (id, product_id, type, quantity, notes, created_at) VALUES (12, 12, 'in', 10, 'Stock inicial basado en inventario', '2026-08-21 21:23:31.747');
INSERT INTO public.stock_movements (id, product_id, type, quantity, notes, created_at) VALUES (13, 13, 'in', 8, 'Stock inicial basado en inventario', '2026-08-21 21:23:31.754');
INSERT INTO public.stock_movements (id, product_id, type, quantity, notes, created_at) VALUES (14, 14, 'in', 12, 'Stock inicial basado en inventario', '2026-08-21 21:23:31.761');


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
-- PostgreSQL database dump complete
--

\unrestrict dsYGjfUAAHcRgwbzRvfJxrmsEb2O1CYfxLrChE1vdHYVoWgvZdkuRDZPCtol8PJ

