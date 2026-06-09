-- ============================================================
-- LA PIADINA — Tabela de Configurações do Restaurante
-- Execute no Supabase > SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  label TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "settings_public_read" ON settings;
DROP POLICY IF EXISTS "settings_auth_write" ON settings;

CREATE POLICY "settings_public_read" ON settings FOR SELECT USING (true);
CREATE POLICY "settings_auth_write" ON settings FOR ALL USING (auth.role() = 'authenticated');

INSERT INTO settings (key, value, label) VALUES
  ('pix_key',              'lapiadina@pix.com.br',  'Chave PIX'),
  ('delivery_fee',         '6.00',                   'Taxa de entrega (R$)'),
  ('free_delivery_above',  '80.00',                  'Entrega grátis acima de (R$) — 0 para desativar'),
  ('min_order_value',      '25.00',                  'Valor mínimo do pedido (R$)'),
  ('restaurant_phone',     '(51) 99999-9999',        'Telefone do restaurante'),
  ('restaurant_whatsapp',  '5551999999999',           'WhatsApp (com DDI e DDD, sem espaços)'),
  ('restaurant_address',   'Rua da Piadina, 123 — Taquara/RS', 'Endereço completo'),
  ('restaurant_hours',     'Seg–Dom: 11h às 22h',    'Horário de funcionamento'),
  ('points_per_real',      '100',                    'Pontos por R$1 gasto'),
  ('referral_points',      '500',                    'Pontos bônus por indicação confirmada'),
  ('first_order_bonus',    '200',                    'Bônus de pontos no primeiro pedido'),
  ('birthday_bonus',       '1000',                   'Bônus de pontos no aniversário')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, label = EXCLUDED.label, updated_at = NOW();

-- ─── ATUALIZA RECOMPENSAS COM VALORES MAIS ATRAENTES ───
DELETE FROM loyalty_rewards;

INSERT INTO loyalty_rewards (name, description, points_cost, type, value, min_order_value, active) VALUES
  ('Desconto R$5',        'R$5 de desconto em qualquer pedido',               500,  'desconto_valor',      5.00,  0.00,  true),
  ('Frete Grátis',        'Entrega gratuita no seu pedido',                   800,  'desconto_valor',      6.00,  25.00, true),
  ('Desconto R$10',       'R$10 de desconto em pedidos acima de R$40',        1000, 'desconto_valor',      10.00, 40.00, true),
  ('Desconto 15%',        '15% de desconto no pedido inteiro',                1500, 'desconto_percentual', 15.00, 30.00, true),
  ('Piadina Clássica',    'Uma Piadina Clássica grátis (R$29,90)',            2500, 'desconto_valor',      29.90, 29.90, true),
  ('Desconto R$20',       'R$20 de desconto em pedidos acima de R$60',        2000, 'desconto_valor',      20.00, 60.00, true),
  ('Desconto 25%',        '25% de desconto especial — nosso maior desconto',  3000, 'desconto_percentual', 25.00, 35.00, true),
  ('Combo Especial',      'R$40 de desconto para um jantar completo',         4000, 'desconto_valor',      40.00, 80.00, true);
