export type CartStatus = 'active' | 'converted' | 'abandoned' | 'cleared'

export interface Cart {
  id: string
  user_id: string
  status: CartStatus
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  quantity: number
  price_at_add_time: number
  product_name_snapshot: string
  product_image_snapshot: string | null
  created_at: string
  updated_at: string
}

export interface CartProductSnapshot {
  id: string
  name: string
  price: number
  discount: number
  finalPrice: number
  stock: number
  isActive: boolean
  imageUrl: string | null
  mediaType: string | null
}

export interface CartItemResponse {
  id: string
  cartId: string
  productId: string
  quantity: number

  priceAtAddTime: number
  latestPrice: number
  latestFinalPrice: number

  productName: string
  productImage: string | null
  mediaType: string | null

  stock: number
  isActive: boolean

  itemSubtotal: number
  hasPriceChanged: boolean
  isAvailable: boolean
}

export interface CartResponse {
  cartId: string | null
  status: CartStatus | null
  items: CartItemResponse[]
  totalQuantity: number
  subtotal: number
  hasUnavailableItems: boolean
  hasPriceChanges: boolean
}

export interface GuestCartItem {
  productId: string
  quantity: number
  addedAt: string
}

export interface GuestCart {
  items: GuestCartItem[]
  updatedAt: string
}

export interface AddToCartInput {
  productId: string
  quantity?: number
}

export interface UpdateCartItemQuantityInput {
  productId: string
  quantity: number
}

export interface MergeGuestCartInput {
  items: GuestCartItem[]
}

export interface CartActionResult {
  success: boolean
  message: string
  cart?: CartResponse
  count?: number
}