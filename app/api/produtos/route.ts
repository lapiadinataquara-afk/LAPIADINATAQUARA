import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return NextResponse.json({ error: 'Missing env vars', url: !!url, key: !!key }, { status: 500 })
  }

  const supabase = createClient(url, key)
  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, featured, active')
    .eq('active', true)
    .limit(10)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ count: data?.length, products: data })
}
