import { supabaseServer } from '@/lib/supabase'
import type { GuestCartProduct } from '@/types/guestCartProduct'
import { GuestCartProductRow } from '@/types/guestCartProduct'



function calculateFinalPrice(price: number, discount: number | null): number {
  if (!discount || discount <= 0) return price

  return Number((price - (price * discount) / 100).toFixed(2))
}

export async function getGuestCartProducts(
  productIds: string[]
): Promise<GuestCartProduct[]> {
  const uniqueProductIds = Array.from(
    new Set(productIds.map((id) => id.trim()).filter(Boolean))
  )

  if (uniqueProductIds.length === 0) {
    return []
  }

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
      is_active
    `)
    .in('id', uniqueProductIds)

  if (error) {
    throw new Error(`Failed to fetch guest cart products: ${error.message}`)
  }

  return ((data ?? []) as unknown as GuestCartProductRow[]).map((product) => {
    const price = Number(product.price ?? 0)
    const discount = product.discount === null ? null : Number(product.discount)

    return {
      id: product.id,
      name: product.name,
      price,
      discount,
      finalPrice: calculateFinalPrice(price, discount),
      imageUrl: product.image_url,
      mediaType: product.media_type,
      stock: Number(product.stock ?? 0),
      isActive: product.is_active === true,
    }
  })
}