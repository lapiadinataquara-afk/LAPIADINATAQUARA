export type Category = {
  id: string
  name: string
  description: string | null
  image_url: string | null
  order_index: number
  active: boolean
  created_at: string
}

export type Product = {
  id: string
  category_id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  active: boolean
  featured: boolean
  created_at: string
  category?: Category
}

export type User = {
  id: string
  email: string
  name: string
  phone: string | null
  referral_code: string
  referred_by: string | null
  points: number
  total_spent: number
  created_at: string
}

export type Order = {
  id: string
  user_id: string | null
  customer_name: string
  customer_phone: string
  customer_email: string | null
  status: 'pendente' | 'confirmado' | 'preparando' | 'saiu' | 'entregue' | 'cancelado'
  payment_method: 'pix' | 'cartao_entrega' | 'dinheiro_entrega'
  payment_status: 'aguardando' | 'pago' | 'cancelado'
  subtotal: number
  discount: number
  total: number
  points_earned: number
  points_used: number
  delivery_address: string
  delivery_complement: string | null
  notes: string | null
  reward_id: string | null
  created_at: string
  items?: OrderItem[]
  user?: User
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_price: number
  quantity: number
  subtotal: number
  notes: string | null
  product?: Product
}

export type Reward = {
  id: string
  name: string
  description: string | null
  points_cost: number
  type: 'desconto_valor' | 'desconto_percentual' | 'produto_gratis'
  value: number
  product_id: string | null
  min_order_value: number
  active: boolean
  created_at: string
  product?: Product
}

export type Referral = {
  id: string
  referrer_id: string
  referred_id: string
  points_awarded: number
  order_id: string | null
  created_at: string
}

export type PointTransaction = {
  id: string
  user_id: string
  amount: number
  type: 'ganho_compra' | 'ganho_indicacao' | 'resgatado' | 'expirado' | 'bonus'
  description: string
  order_id: string | null
  created_at: string
}

export type CartItem = {
  product: Product
  quantity: number
  notes?: string
}
