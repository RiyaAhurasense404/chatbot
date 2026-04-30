import type { CartItem } from '@/types/cart'

export type ProductForCartRow = {
  id: string
  name: string
  price: number
  discount: number | null
  image_url: string | null
  media_type: string | null
  stock: number | null
  is_active: boolean
}

export type CartItemWithProductRow = CartItem & {
  products: ProductForCartRow | ProductForCartRow[] | null
}
