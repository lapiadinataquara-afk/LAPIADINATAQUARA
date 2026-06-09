-- ============================================
-- LA PIADINA - Schema do Banco de Dados
-- Execute no Supabase > SQL Editor
-- ============================================

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── CATEGORIAS ──
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── PRODUTOS ──
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── USUÁRIOS (complementa auth.users) ──
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by UUID REFERENCES users(id) ON DELETE SET NULL,
  points INTEGER DEFAULT 0,
  total_spent NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── RECOMPENSAS DO CLUBE ──
CREATE TABLE IF NOT EXISTS loyalty_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  points_cost INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('desconto_valor', 'desconto_percentual', 'produto_gratis')),
  value NUMERIC(10,2) NOT NULL DEFAULT 0,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  min_order_value NUMERIC(10,2) DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── PEDIDOS ──
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  status TEXT NOT NULL DEFAULT 'pendente'
    CHECK (status IN ('pendente','confirmado','preparando','saiu','entregue','cancelado')),
  payment_method TEXT NOT NULL
    CHECK (payment_method IN ('pix','cartao_entrega','dinheiro_entrega')),
  payment_status TEXT NOT NULL DEFAULT 'aguardando'
    CHECK (payment_status IN ('aguardando','pago','cancelado')),
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  points_used INTEGER DEFAULT 0,
  delivery_address TEXT NOT NULL,
  delivery_complement TEXT,
  notes TEXT,
  reward_id UUID REFERENCES loyalty_rewards(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ITENS DO PEDIDO ──
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_price NUMERIC(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  subtotal NUMERIC(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── TRANSAÇÕES DE PONTOS ──
CREATE TABLE IF NOT EXISTS point_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('ganho_compra','ganho_indicacao','resgatado','expirado','bonus')),
  description TEXT NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── INDICAÇÕES ──
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points_awarded INTEGER DEFAULT 500,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SEGURANÇA (RLS - Row Level Security)
-- ============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Políticas públicas de leitura
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);
CREATE POLICY "products_public_read" ON products FOR SELECT USING (true);
CREATE POLICY "rewards_public_read" ON loyalty_rewards FOR SELECT USING (true);

-- Pedidos: qualquer um pode criar
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_select_own" ON orders FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "order_items_insert" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "order_items_select" ON order_items FOR SELECT USING (true);

-- Usuários
CREATE POLICY "users_select_own" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "users_insert_own" ON users FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (id = auth.uid());

-- Transações de pontos
CREATE POLICY "transactions_own" ON point_transactions FOR SELECT USING (user_id = auth.uid());

-- ============================================
-- STORAGE (Execute no Supabase > Storage)
-- ============================================
-- Crie um bucket chamado "produtos" com acesso público
-- INSERT INTO storage.buckets (id, name, public) VALUES ('produtos', 'produtos', true);

-- ============================================
-- DADOS INICIAIS (Opcional)
-- ============================================

-- Categoria de exemplo
INSERT INTO categories (name, description, order_index) VALUES
  ('Piadinas Clássicas', 'Sabores tradicionais italianos', 1),
  ('Piadinas Especiais', 'Combinações exclusivas da casa', 2),
  ('Bebidas', 'Sucos, refrigerantes e água', 3),
  ('Sobremesas', 'Doces para fechar com chave de ouro', 4)
ON CONFLICT DO NOTHING;
