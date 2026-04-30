import { supabaseServer } from '@/lib/supabase'
import {
  acquireCartLock,
  getCachedCart,
  getCachedCartCount,
  invalidateCartCache,
  refreshCartCache,
  releaseCartLock,
  setCachedCartCount,
} from '@/lib/cache/cartCache'
import type {
  CartActionResult,
  CartResponse,
  GuestCartItem,
} from '@/types/cart'
import {
  buildCartResponse,
  buildEmptyCartResponse,
  normalizeQuantity,
  validateProductForCart,
} from './cartUtils'
import {
  fetchCartItems,
  fetchProductForCart,
  getActiveCart,
  getExistingCartItem,
  getOrCreateActiveCart,
} from './cartQueries'

export { getActiveCart, getOrCreateActiveCart } from './cartQueries'

export async function getCart(userId: string): Promise<CartResponse> {
  const cachedCart = await getCachedCart(userId)

  if (cachedCart) {
    return cachedCart
  }

  const cart = await getActiveCart(userId)

  if (!cart) {
    const emptyCart = buildEmptyCartResponse()
    await refreshCartCache({ userId, cart: emptyCart })
    return emptyCart
  }

  const items = await fetchCartItems(cart.id)
  const cartResponse = buildCartResponse({ cart, items })

  await refreshCartCache({ userId, cart: cartResponse })

  return cartResponse
}

export async function getCartCount(userId: string): Promise<number> {
  const cachedCount = await getCachedCartCount(userId)

  if (cachedCount !== null) {
    return cachedCount
  }

  const cart = await getActiveCart(userId)

  if (!cart) {
    await setCachedCartCount(userId, 0)
    return 0
  }

  const { data, error } = await supabaseServer
    .from('cart_items')
    .select('quantity')
    .eq('cart_id', cart.id)

  if (error) {
    throw new Error(`Failed to fetch cart count: ${error.message}`)
  }

  const count = (data ?? []).reduce(
    (total, item) => total + Number(item.quantity ?? 0),
    0
  )

  await setCachedCartCount(userId, count)

  return count
}

async function refreshCartAfterMutation(userId: string): Promise<CartResponse> {
  await invalidateCartCache(userId)
  return getCart(userId)
}

async function getActiveCartOrThrow(userId: string) {
  const cart = await getActiveCart(userId)

  if (!cart) {
    throw new Error('Cart not found.')
  }

  return cart
}

export async function addToCart(params: {
  userId: string
  productId: string
  quantity?: number
}): Promise<CartActionResult> {
  const quantity = normalizeQuantity(params.quantity ?? 1)
  const product = await fetchProductForCart(params.productId)
  const cart = await getOrCreateActiveCart(params.userId)
  const existingItem = await getExistingCartItem({
    cartId: cart.id,
    productId: params.productId,
  })

  const finalQuantity = validateProductForCart({
    product,
    requestedQuantity: quantity,
    existingQuantity: existingItem?.quantity ?? 0,
  })

  if (existingItem) {
    const { error } = await supabaseServer
      .from('cart_items')
      .update({
        quantity: finalQuantity,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingItem.id)

    if (error) {
      throw new Error(`Failed to update cart item: ${error.message}`)
    }
  } else {
    const { error } = await supabaseServer.from('cart_items').insert({
      cart_id: cart.id,
      product_id: params.productId,
      quantity,
      price_at_add_time: product.finalPrice,
      product_name_snapshot: product.name,
      product_image_snapshot: product.imageUrl,
    })

    if (error) {
      throw new Error(`Failed to add product to cart: ${error.message}`)
    }
  }

  const updatedCart = await refreshCartAfterMutation(params.userId)

  return {
    success: true,
    message: 'Product added to cart.',
    cart: updatedCart,
    count: updatedCart.totalQuantity,
  }
}

export async function updateCartItemQuantity(params: {
  userId: string
  productId: string
  quantity: number
}): Promise<CartActionResult> {
  const quantity = normalizeQuantity(params.quantity)
  const product = await fetchProductForCart(params.productId)
  const cart = await getActiveCartOrThrow(params.userId)

  const existingItem = await getExistingCartItem({
    cartId: cart.id,
    productId: params.productId,
  })

  if (!existingItem) {
    throw new Error('Cart item not found.')
  }

  validateProductForCart({
    product,
    requestedQuantity: quantity,
    existingQuantity: 0,
  })

  const { error } = await supabaseServer
    .from('cart_items')
    .update({
      quantity,
      updated_at: new Date().toISOString(),
    })
    .eq('id', existingItem.id)

  if (error) {
    throw new Error(`Failed to update cart quantity: ${error.message}`)
  }

  const updatedCart = await refreshCartAfterMutation(params.userId)

  return {
    success: true,
    message: 'Cart updated.',
    cart: updatedCart,
    count: updatedCart.totalQuantity,
  }
}

export async function incrementCartItem(params: {
  userId: string
  productId: string
}): Promise<CartActionResult> {
  const cart = await getActiveCartOrThrow(params.userId)

  const existingItem = await getExistingCartItem({
    cartId: cart.id,
    productId: params.productId,
  })

  if (!existingItem) {
    throw new Error('Cart item not found.')
  }

  return updateCartItemQuantity({
    userId: params.userId,
    productId: params.productId,
    quantity: existingItem.quantity + 1,
  })
}

export async function decrementCartItem(params: {
  userId: string
  productId: string
}): Promise<CartActionResult> {
  const cart = await getActiveCartOrThrow(params.userId)

  const existingItem = await getExistingCartItem({
    cartId: cart.id,
    productId: params.productId,
  })

  if (!existingItem) {
    throw new Error('Cart item not found.')
  }

  if (existingItem.quantity <= 1) {
    return removeCartItem({
      userId: params.userId,
      productId: params.productId,
    })
  }

  return updateCartItemQuantity({
    userId: params.userId,
    productId: params.productId,
    quantity: existingItem.quantity - 1,
  })
}

export async function removeCartItem(params: {
  userId: string
  productId: string
}): Promise<CartActionResult> {
  const cart = await getActiveCartOrThrow(params.userId)

  const { error } = await supabaseServer
    .from('cart_items')
    .delete()
    .eq('cart_id', cart.id)
    .eq('product_id', params.productId)

  if (error) {
    throw new Error(`Failed to remove cart item: ${error.message}`)
  }

  const updatedCart = await refreshCartAfterMutation(params.userId)

  return {
    success: true,
    message: 'Item removed from cart.',
    cart: updatedCart,
    count: updatedCart.totalQuantity,
  }
}

export async function clearCart(userId: string): Promise<CartActionResult> {
  const cart = await getActiveCart(userId)

  if (!cart) {
    const emptyCart = buildEmptyCartResponse()
    await invalidateCartCache(userId)
    await refreshCartCache({ userId, cart: emptyCart })
    await setCachedCartCount(userId, 0)

    return {
      success: true,
      message: 'Cart cleared.',
      cart: emptyCart,
      count: 0,
    }
  }

  const { error } = await supabaseServer
    .from('cart_items')
    .delete()
    .eq('cart_id', cart.id)

  if (error) {
    throw new Error(`Failed to clear cart: ${error.message}`)
  }

  const emptyCart: CartResponse = {
    cartId: cart.id,
    status: cart.status,
    items: [],
    totalQuantity: 0,
    subtotal: 0,
    hasUnavailableItems: false,
    hasPriceChanges: false,
  }

  await invalidateCartCache(userId)
  await refreshCartCache({ userId, cart: emptyCart })
  await setCachedCartCount(userId, 0)

  return {
    success: true,
    message: 'Cart cleared.',
    cart: emptyCart,
    count: 0,
  }
}

export async function mergeGuestCart(params: {
  userId: string
  items: GuestCartItem[]
}): Promise<CartActionResult> {
  const lockAcquired = await acquireCartLock(params.userId)

  if (!lockAcquired) {
    throw new Error('Cart is currently being updated. Please try again.')
  }

  try {
    const uniqueItems = new Map<string, number>()

    for (const item of params.items) {
      const currentQuantity = uniqueItems.get(item.productId) ?? 0
      uniqueItems.set(
        item.productId,
        currentQuantity + normalizeQuantity(item.quantity)
      )
    }

    for (const [productId, quantity] of uniqueItems.entries()) {
      await addToCart({
        userId: params.userId,
        productId,
        quantity,
      })
    }

    const updatedCart = await getCart(params.userId)

    return {
      success: true,
      message: 'Cart merged successfully.',
      cart: updatedCart,
      count: updatedCart.totalQuantity,
    }
  } finally {
    await releaseCartLock(params.userId)
  }
}