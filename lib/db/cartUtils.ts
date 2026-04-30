import type {
  Cart,
  CartItemResponse,
  CartProductSnapshot,
  CartResponse,
} from '@/types/cart'
import type {
  CartItemWithProductRow,
  ProductForCartRow,
} from '@/types/cartDb'

export function calculateFinalPrice(price: number, discount: number): number {
  if (discount <= 0) return price

  return Number((price - (price * discount) / 100).toFixed(2))
}

function normalizeProduct(
  product: ProductForCartRow | ProductForCartRow[] | null
): ProductForCartRow | null {
  if (Array.isArray(product)) {
    return product[0] ?? null
  }

  return product
}

export function buildEmptyCartResponse(): CartResponse {
  return {
    cartId: null,
    status: null,
    items: [],
    totalQuantity: 0,
    subtotal: 0,
    hasUnavailableItems: false,
    hasPriceChanges: false,
  }
}

export function normalizeQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1

  return Math.max(1, Math.floor(quantity))
}

function normalizeExistingQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 0

  return Math.max(0, Math.floor(quantity))
}

export function buildCartResponse(params: {
  cart: Cart | null
  items: CartItemWithProductRow[]
}): CartResponse {
  if (!params.cart) {
    return buildEmptyCartResponse()
  }

  const items: CartItemResponse[] = params.items.map((item) => {
    const product = normalizeProduct(item.products)
    const latestPrice = Number(product?.price ?? item.price_at_add_time ?? 0)
    const discount = Number(product?.discount ?? 0)
    const latestFinalPrice = calculateFinalPrice(latestPrice, discount)
    const stock = Number(product?.stock ?? 0)
    const isActive = product?.is_active === true
    const isAvailable = Boolean(product && isActive && stock >= item.quantity)
    const itemSubtotal = Number((latestFinalPrice * item.quantity).toFixed(2))
    const hasPriceChanged =
      Number(item.price_at_add_time) !== Number(latestFinalPrice)

    return {
      id: item.id,
      cartId: item.cart_id,
      productId: item.product_id,
      quantity: item.quantity,

      priceAtAddTime: Number(item.price_at_add_time),
      latestPrice,
      latestFinalPrice,

      productName: product?.name ?? item.product_name_snapshot,
      productImage: product?.image_url ?? item.product_image_snapshot,
      mediaType: product?.media_type ?? null,

      stock,
      isActive,

      itemSubtotal,
      hasPriceChanged,
      isAvailable,
    }
  })

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = Number(
    items.reduce((total, item) => total + item.itemSubtotal, 0).toFixed(2)
  )

  return {
    cartId: params.cart.id,
    status: params.cart.status,
    items,
    totalQuantity,
    subtotal,
    hasUnavailableItems: items.some((item) => !item.isAvailable),
    hasPriceChanges: items.some((item) => item.hasPriceChanged),
  }
}

export function validateProductForCart(params: {
  product: CartProductSnapshot
  requestedQuantity: number
  existingQuantity?: number
}): number {
  const quantity = normalizeQuantity(params.requestedQuantity)
  const existingQuantity = normalizeExistingQuantity(
    params.existingQuantity ?? 0
  )
  const finalQuantity = existingQuantity + quantity

  if (!params.product.isActive) {
    throw new Error('This product is currently unavailable.')
  }

  if (params.product.stock <= 0) {
    throw new Error('This product is out of stock.')
  }

  if (finalQuantity > params.product.stock) {
    throw new Error(`Only ${params.product.stock} units are available.`)
  }

  return finalQuantity
}