-- ==============================================
-- ENOTECA OS — Seed Data
-- First customer: Antiche Bottiglie (EBW Consulting Spa)
-- ==============================================

-- Organization
INSERT INTO organizations (id, name, slug, plan, whatsapp_number, email) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Antiche Bottiglie', 'antiche-bottiglie', 'pro', '+393331234567', 'info@antichibottiglie.it');

-- Sample sellers
INSERT INTO sellers (id, org_id, full_name, phone, province, city, seller_type, source_channel) VALUES
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Mario Rossi', '+393401234567', 'TO', 'Torino', 'inheritance', 'whatsapp'),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', 'Lucia Bianchi', '+393402345678', 'MI', 'Milano', 'collector', 'website'),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000001', 'Franco Verdi', '+393403456789', 'CN', 'Alba', 'restaurant_closure', 'phone');

-- Sample buyers
INSERT INTO buyers (id, org_id, full_name, company_name, buyer_type, phone, country, city) VALUES
  ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0000-000000000001', 'Hans Weber', 'WeinKeller GmbH', 'dealer_international', '+491234567890', 'DE', 'Munich'),
  ('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0000-000000000001', 'Pierre Dubois', 'Cave Parisienne', 'dealer_international', '+331234567890', 'FR', 'Paris'),
  ('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0000-000000000001', 'Gabriele Neri', NULL, 'collector', '+393404567890', 'IT', 'Roma');

-- Sample bottles
INSERT INTO bottles (id, org_id, category, producer, name, vintage, denomination, region, country, format, status, purchase_price, target_sell_price, market_price_low, market_price_high, authenticity_score, label_condition, liquid_level, overall_condition, seller_id, photos, primary_photo) VALUES
  ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0000-000000000001', 'wine', 'Giacomo Conterno', 'Barolo Monfortino Riserva', 1978, 'DOCG', 'Piemonte', 'IT', '750ml', 'listed', 450.00, 1800.00, 1200.00, 2400.00, 94, 7.5, 'high_shoulder', 8.0, '00000000-0000-0000-0001-000000000001', NULL, NULL),
  ('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0000-000000000001', 'wine', 'Bruno Giacosa', 'Barolo Falletto Riserva', 1985, 'DOCG', 'Piemonte', 'IT', '750ml', 'in_inventory', 320.00, 950.00, 700.00, 1200.00, 91, 8.0, 'base_neck', 8.5, '00000000-0000-0000-0001-000000000001', NULL, NULL),
  ('00000000-0000-0000-0003-000000000003', '00000000-0000-0000-0000-000000000001', 'wine', 'Gaja', 'Barbaresco', 1990, 'DOCG', 'Piemonte', 'IT', '750ml', 'listed', 180.00, 480.00, 350.00, 550.00, 88, 8.5, 'into_neck', 9.0, '00000000-0000-0000-0001-000000000002', NULL, NULL),
  ('00000000-0000-0000-0003-000000000004', '00000000-0000-0000-0000-000000000001', 'wine', 'Biondi-Santi', 'Brunello di Montalcino Riserva', 1975, 'DOCG', 'Toscana', 'IT', '750ml', 'valued', NULL, NULL, 800.00, 1500.00, 87, 6.5, 'mid_shoulder', 7.0, '00000000-0000-0000-0001-000000000003', NULL, NULL),
  ('00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0000-000000000001', 'whisky', 'The Macallan', 'Sherry Oak 25 Years', 1997, NULL, 'Speyside', 'GB', '750ml', 'listed', 600.00, 1400.00, 1100.00, 1800.00, 96, 9.0, NULL, 9.5, '00000000-0000-0000-0001-000000000002', NULL, NULL),
  ('00000000-0000-0000-0003-000000000006', '00000000-0000-0000-0000-000000000001', 'wine', 'Masseto', 'Masseto', 2006, 'IGT', 'Toscana', 'IT', '750ml', 'sold', 280.00, 750.00, 600.00, 900.00, 93, 9.0, 'into_neck', 9.5, '00000000-0000-0000-0001-000000000001', NULL, NULL),
  ('00000000-0000-0000-0003-000000000007', '00000000-0000-0000-0000-000000000001', 'cognac', 'Hennessy', 'Paradis Extra', NULL, NULL, 'Cognac', 'FR', '750ml', 'in_inventory', 350.00, 800.00, 650.00, 950.00, 95, 9.5, NULL, 9.5, NULL, NULL, NULL),
  ('00000000-0000-0000-0003-000000000008', '00000000-0000-0000-0000-000000000001', 'wine', 'Sassicaia', 'Bolgheri Sassicaia', 1985, 'DOC', 'Toscana', 'IT', '750ml', 'pending_valuation', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '00000000-0000-0000-0001-000000000003', NULL, NULL);

-- Sample acquisitions
INSERT INTO acquisitions (id, org_id, seller_id, status, total_bottles, total_offer, total_final) VALUES
  ('00000000-0000-0000-0004-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000001', 'completed', 3, 950.00, 950.00),
  ('00000000-0000-0000-0004-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000003', 'negotiating', 5, NULL, NULL);

-- Sample sales
INSERT INTO sales (id, org_id, buyer_id, status, total_amount, margin_amount, margin_percent) VALUES
  ('00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0002-000000000001', 'completed', 750.00, 470.00, 62.67),
  ('00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0002-000000000003', 'negotiating', 1800.00, NULL, NULL);

-- Sample alerts
INSERT INTO alerts (org_id, alert_type, priority, title, message) VALUES
  ('00000000-0000-0000-0000-000000000001', 'trophy_bottle', 'high', 'Trophy detected: Barolo Monfortino 1978', 'Giacomo Conterno Monfortino 1978 — market value €1,200-€2,400. Authenticity score: 94/100.'),
  ('00000000-0000-0000-0000-000000000001', 'stagnant_inventory', 'medium', '3 bottles stagnant >90 days', 'Consider repricing: Gaja Barbaresco 1990, Hennessy Paradis, Bruno Giacosa Falletto 1985.'),
  ('00000000-0000-0000-0000-000000000001', 'new_lead', 'medium', 'New seller lead from WhatsApp', 'Franco Verdi (Alba) — closing restaurant, has ~40 bottles from Piemonte. Potential high-value lot.'),
  ('00000000-0000-0000-0000-000000000001', 'deal_pending', 'high', 'Deal #AB-0002 needs attention', 'Acquisition from Franco Verdi in negotiating status for 3 days. Follow up recommended.');
