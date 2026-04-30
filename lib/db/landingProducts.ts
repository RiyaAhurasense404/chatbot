import { supabaseServer } from '@/lib/supabase'
import type { LandingProduct } from '@/types/landingProducts'

type LandingProductRow = {
  id: string
  name: string
  price: number
  discount: number | null
  image_url: string | null
  media_type: string | null
  stock: number | null
  is_active: boolean
  category_id: string | null
}

export async function getLandingProducts(): Promise<LandingProduct[]> {
  const { data, error } = await supabaseServer
    .from('products')
    .select(`
      id,
      name,
      price,
      discount,
      image_url,
      media_type,
      stock,
      is_active,
      category_id
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(12)

  if (error) {
    throw new Error(`Failed to fetch landing products: ${error.message}`)
  }

  return ((data ?? []) as unknown as LandingProductRow[]).map((product) => ({
    id: product.id,
    name: product.name,
    description: null,
    price: Number(product.price ?? 0),
    discount: product.discount === null ? null : Number(product.discount),
    image_url: product.image_url,
    media_type: product.media_type,
    stock: product.stock,
    is_active: product.is_active,
    category_id: product.category_id,
    categoryName: null,
  }))
}