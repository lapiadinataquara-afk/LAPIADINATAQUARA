-- ============================================================
-- LA PIADINA — Cardápio Inicial com Fotos Reais
-- Execute no Supabase > SQL Editor
-- ============================================================

-- Limpa dados anteriores (respeitando a ordem das FKs)
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM categories;

-- ─── INSERIR CATEGORIAS ───────────────────────────────────
INSERT INTO categories (name, description, order_index, active) VALUES
  ('Piadinas Clássicas',  'As tradicionais, com ingredientes selecionados', 1, true),
  ('Piadinas Especiais',  'Combinações exclusivas da casa',                  2, true),
  ('Piadinas Veganas',    'Sem carne, cheias de sabor',                      3, true),
  ('Saladas',             'Frescas e nutritivas',                            4, true),
  ('Bebidas',             'Para acompanhar sua piadina',                     5, true),
  ('Sobremesas',          'Para finalizar com doçura',                       6, true);

-- ─── INSERIR PRODUTOS (usando subquery para pegar o ID da categoria) ───

-- Piadinas Clássicas
INSERT INTO products (name, description, price, category_id, image_url, active, featured) VALUES
(
  'Piadina Clássica',
  'Massa artesanal com presunto italiano, queijo mozzarella e rúcula fresca. O clássico de sempre.',
  29.90,
  (SELECT id FROM categories WHERE name = 'Piadinas Clássicas'),
  'https://images.pexels.com/photos/21792198/pexels-photo-21792198.jpeg?auto=compress&cs=tinysrgb&w=800',
  true, true
),
(
  'Piadina Caprese',
  'Mozzarella de búfala, tomate italiano, manjericão fresco e azeite extra virgem.',
  32.90,
  (SELECT id FROM categories WHERE name = 'Piadinas Clássicas'),
  'https://images.pexels.com/photos/30301906/pexels-photo-30301906.jpeg?auto=compress&cs=tinysrgb&w=800',
  true, true
),
(
  'Piadina Calabresa',
  'Calabresa artesanal, queijo provolone, pimentões assados e cebola caramelizada.',
  31.90,
  (SELECT id FROM categories WHERE name = 'Piadinas Clássicas'),
  'https://images.pexels.com/photos/33571051/pexels-photo-33571051.jpeg?auto=compress&cs=tinysrgb&w=800',
  true, false
),
(
  'Piadina com Atum',
  'Atum selecionado, tomate, cebola roxa, azeitona preta e maionese de ervas.',
  30.90,
  (SELECT id FROM categories WHERE name = 'Piadinas Clássicas'),
  'https://images.pexels.com/photos/30910213/pexels-photo-30910213.jpeg?auto=compress&cs=tinysrgb&w=800',
  true, false
);

-- Piadinas Especiais
INSERT INTO products (name, description, price, category_id, image_url, active, featured) VALUES
(
  'Piadina Frango Grelhado',
  'Frango grelhado temperado, mozzarella derretida, rúcula, tomate e molho especial da casa.',
  34.90,
  (SELECT id FROM categories WHERE name = 'Piadinas Especiais'),
  'https://images.pexels.com/photos/36925854/pexels-photo-36925854.jpeg?auto=compress&cs=tinysrgb&w=800',
  true, true
),
(
  'Piadina Strogonoff',
  'Frango ao molho strogonoff cremoso, batata palha crocante e queijo mozzarella.',
  36.90,
  (SELECT id FROM categories WHERE name = 'Piadinas Especiais'),
  'https://images.pexels.com/photos/20051317/pexels-photo-20051317.jpeg?auto=compress&cs=tinysrgb&w=800',
  true, false
),
(
  'Piadina Prosciutto & Rúcula',
  'Prosciutto di Parma, rúcula selvagem, parmesão lascado e redução balsâmica.',
  39.90,
  (SELECT id FROM categories WHERE name = 'Piadinas Especiais'),
  'https://images.pexels.com/photos/37690811/pexels-photo-37690811.jpeg?auto=compress&cs=tinysrgb&w=800',
  true, true
);

-- Piadinas Veganas
INSERT INTO products (name, description, price, category_id, image_url, active, featured) VALUES
(
  'Piadina Primavera',
  'Legumes grelhados (abobrinha, berinjela, pimentão), queijo de cabra, rúcula e pesto de manjericão.',
  30.90,
  (SELECT id FROM categories WHERE name = 'Piadinas Veganas'),
  'https://images.pexels.com/photos/36268502/pexels-photo-36268502.jpeg?auto=compress&cs=tinysrgb&w=800',
  true, false
),
(
  'Piadina Mediterrânea',
  'Homus artesanal, tomate cereja, pepino, azeitona, queijo feta e hortelã fresca.',
  29.90,
  (SELECT id FROM categories WHERE name = 'Piadinas Veganas'),
  'https://images.pexels.com/photos/28618631/pexels-photo-28618631.jpeg?auto=compress&cs=tinysrgb&w=800',
  true, false
);

-- Saladas
INSERT INTO products (name, description, price, category_id, image_url, active, featured) VALUES
(
  'Salada Mediterrânea',
  'Mix de folhas, tomate cereja, pepino, azeitona, queijo feta e vinagrete de limão siciliano.',
  24.90,
  (SELECT id FROM categories WHERE name = 'Saladas'),
  'https://images.pexels.com/photos/28618631/pexels-photo-28618631.jpeg?auto=compress&cs=tinysrgb&w=800',
  true, false
),
(
  'Salada Caprese',
  'Mozzarella de búfala, tomate italiano, manjericão fresco e azeite extra virgem.',
  22.90,
  (SELECT id FROM categories WHERE name = 'Saladas'),
  'https://images.pexels.com/photos/30301906/pexels-photo-30301906.jpeg?auto=compress&cs=tinysrgb&w=800',
  true, false
);

-- Bebidas
INSERT INTO products (name, description, price, category_id, image_url, active, featured) VALUES
(
  'Limonada Italiana',
  'Limão siciliano, água com gás, hortelã e um toque de mel. Refrescante e sofisticada.',
  12.90,
  (SELECT id FROM categories WHERE name = 'Bebidas'),
  'https://images.pexels.com/photos/16976656/pexels-photo-16976656.jpeg?auto=compress&cs=tinysrgb&w=800',
  true, false
),
(
  'Refrigerante',
  'Coca-Cola, Pepsi, Guaraná ou água tônica. Gelado e na medida certa.',
  8.90,
  (SELECT id FROM categories WHERE name = 'Bebidas'),
  'https://images.pexels.com/photos/8880727/pexels-photo-8880727.jpeg?auto=compress&cs=tinysrgb&w=800',
  true, false
),
(
  'Água Mineral',
  'Água mineral natural ou com gás. 500ml.',
  5.90,
  (SELECT id FROM categories WHERE name = 'Bebidas'),
  'https://images.pexels.com/photos/8880727/pexels-photo-8880727.jpeg?auto=compress&cs=tinysrgb&w=800',
  true, false
);

-- Sobremesas
INSERT INTO products (name, description, price, category_id, image_url, active, featured) VALUES
(
  'Piadina Doce Nutella',
  'Massa artesanal quentinha com Nutella generosa, morangos frescos fatiados e açúcar de confeiteiro.',
  22.90,
  (SELECT id FROM categories WHERE name = 'Sobremesas'),
  'https://images.pexels.com/photos/19738943/pexels-photo-19738943.jpeg?auto=compress&cs=tinysrgb&w=800',
  true, true
);

-- ─── RECOMPENSAS DO CLUBE ─────────────────────────────────
DELETE FROM loyalty_rewards;

INSERT INTO loyalty_rewards (name, description, points_cost, type, value, min_order_value, active) VALUES
  ('Desconto R$5',   'R$5 de desconto em qualquer pedido',          500,  'desconto_valor',      5.00,  0,     true),
  ('Desconto R$10',  'R$10 de desconto em pedidos acima de R$30',  1000, 'desconto_valor',      10.00, 30.00, true),
  ('Desconto 15%',   '15% de desconto no pedido inteiro',           1500, 'desconto_percentual', 15.00, 25.00, true),
  ('Desconto R$20',  'R$20 de desconto em pedidos acima de R$50',  2000, 'desconto_valor',      20.00, 50.00, true),
  ('Desconto 25%',   '25% de desconto especial',                    3000, 'desconto_percentual', 25.00, 30.00, true);
