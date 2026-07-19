-- ============================================================
-- Seed data — ported directly from the original prototype's
-- CATALOG array. Run after schema.sql + policies.sql.
-- ============================================================

insert into products (id, category, category_icon, sub_category, title, price, cost, image_url, description, fabric, sizing, turnaround, sizes) values
('agb-001', 'Agbada Suite', '👑', 'Premium Royal Embroidery', 'Grand Sultan Silk Agbada Set', 185000, 110000, 'https://i.ibb.co/Gvf51WJX/photo-12-2026-07-07-21-31-23.jpg',
  'A three-piece Agbada ensemble hand-finished with raised royal embroidery across the chest panel. Made for weddings, chieftaincy events, and formal ceremonial wear.',
  '100% Mulberry silk outer with cotton lining',
  'Made-to-measure. We''ll confirm chest, shoulder, and Agbada length via WhatsApp after booking.',
  '10–14 working days', array['X','XX','XXL']),
('agb-002', 'Agbada Suite', '👑', 'Premium Royal Embroidery', 'Imperial Cashmere Agbada Set', 145000, 90000, 'https://i.ibb.co/fY5HgKx9/photo-14-2026-07-07-21-31-23.jpg',
  'A warmer, softer-drape Agbada set in premium cashmere blend, finished with subtle tonal embroidery for understated luxury.',
  'Cashmere-wool blend with silk lining',
  'Made-to-measure. We''ll confirm chest, shoulder, and Agbada length via WhatsApp after booking.',
  '10–14 working days', array['X','XX','XXL']),

('sen-001', 'Senator Outfits', '👔', 'Luxury Senator Sets', 'Classic Geometric Monogram Senator', 55000, 30000, 'https://i.ibb.co/QvRMTDR7/photo-18-2026-07-07-21-31-23.jpg',
  'A sharp two-piece Senator set with a subtle geometric monogram texture, tailored for office, church, or formal outings.',
  'Premium cotton-linen blend',
  'Made-to-measure. We''ll confirm chest, waist, and trouser length via WhatsApp after booking.',
  '5–7 working days', array['X','XX','XXL']),
('sen-002', 'Senator Outfits', '👔', 'Luxury Senator Sets', 'Midnight Charcoal Executive Suit Senator', 60000, 35000, 'https://i.ibb.co/fVNkLzcS/photo-19-2026-07-07-21-31-23.jpg',
  'A deep charcoal Senator set designed for executive occasions — structured shoulders, clean lines, minimal embellishment.',
  'Wool-blend suiting fabric',
  'Made-to-measure. We''ll confirm chest, waist, and trouser length via WhatsApp after booking.',
  '5–7 working days', array['X','XX','XXL']),

('sul-001', 'Sultan Kaftans', '🕌', 'Embroidered Kaftans', 'Signature Minimalist Silk Kaftan', 75000, 40000, 'https://i.ibb.co/vxM1ZtQ3/photo-21-2026-07-07-21-31-23.jpg',
  'A relaxed-fit Kaftan in a clean, minimalist cut with fine collar embroidery — versatile for both casual and semi-formal wear.',
  'Silk-cotton blend',
  'Made-to-measure. We''ll confirm chest and body length via WhatsApp after booking.',
  '7–10 working days', array['X','XX','XXL']),

('con-001', 'Consultations', '🤝', 'Style Advisory & Bespoke Planning', 'Color Theory & Complexion Match Session', 15000, 0, 'https://i.ibb.co/8DhkqkyZ/photo-23-2026-07-07-21-31-23.jpg',
  'A one-on-one styling session to identify the fabric tones and colors that best suit your complexion and the occasions you dress for.',
  'Advisory service — no fabric selection included',
  'Not applicable',
  'Scheduled within 2–3 days of booking', null),
('con-002', 'Consultations', '🤝', 'Style Advisory & Bespoke Planning', 'Bespoke Large Scale Sewing Planning (Aso-Ebi/Weddings)', 35000, 5000, 'https://i.ibb.co/XxTN8SKt/photo-1-2026-07-07-21-31-23.jpg',
  'Full planning support for group orders — Aso-Ebi coordination, weddings, and large family/ceremonial events.',
  'Advisory service — fabric sourced separately per group',
  'Not applicable',
  'Scheduled within 3–5 days of booking', null),

('acc-001', 'Accessories', '⚙️', 'Premium Tailoring Equipment', 'Heavy Duty Industrial Sewing Machine', 280000, 210000, 'https://i.ibb.co/dwfqjRvP/photo-25-2026-07-07-21-31-23.jpg',
  'Industrial-grade sewing machine suited for heavy fabrics like Agbada and Kaftan material — built for daily production use.',
  'N/A — hardware item', 'N/A',
  '3–5 working days for delivery/pickup', null),
('acc-002', 'Accessories', '⚙️', 'Premium Tailoring Equipment', 'Professional Dressmaker Carbon Steel Scissors', 18000, 10000, 'https://i.ibb.co/4ZrWBnNL/photo-27-2026-07-07-21-31-23.jpg',
  'Carbon steel dressmaking shears for precision fabric cutting, built to hold an edge through daily tailoring use.',
  'N/A — hardware item', 'N/A',
  '1–2 working days for delivery/pickup', null),
('acc-003', 'Accessories', '⚙️', 'Premium Tailoring Equipment', 'Retractable Fiber Tailor Measuring Tape', 2500, 1000, 'https://i.ibb.co/RpNHZbZf/photo-26-2026-07-07-21-31-23.jpg',
  'Durable fiber measuring tape for accurate body and fabric measurements, retractable for easy storage.',
  'N/A — hardware item', 'N/A',
  '1–2 working days for delivery/pickup', null)

on conflict (id) do nothing;

-- Seed matching stock levels (mirrors the `stock` field from the original CATALOG)
insert into stock_levels (product_id, quantity) values
('agb-001', 15), ('agb-002', 20),
('sen-001', 25), ('sen-002', 30),
('sul-001', 15),
('con-001', 50), ('con-002', 10),
('acc-001', 5), ('acc-002', 40), ('acc-003', 100)
on conflict (product_id) do nothing;
