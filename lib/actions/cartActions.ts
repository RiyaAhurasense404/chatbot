'use server'

import { revalidatePath } from 'next/cache'
import { requireCustomerAuthWithRedirect } from '@/lib/auth/customer'
import {
  addToCart,
  clearCart,
  decrementCartItem,
  getCart,
  getCartCount,
  incrementCartItem,
  mergeGuestCart,
  removeCartItem,
  updateCartItemQuantity,
} from '@/lib/db/cart'
import { validateCartForCheckout } from '@/lib/db/cartCheckout'
import { getGuestCartProducts } from '@/lib/db/guestCartProducts'
import type {
  AddToCartInput,
  CartActionResult,
  GuestCartItem,
  UpdateCartItemQuantityInput,
} from '@/types/cart'
import type { CheckoutValidationResult } from '@/types/cartCheckout'
import type { GuestCartProduct } from '@/types/guestCartProduct'

function getSafeQuantity(quantity: unknown): number {
  const parsedQuantity = Number(quantity ?? 1)

  if (!Number.isFinite(parsedQuantity)) {
    return 1
  }

  return Math.max(1, Math.floor(parsedQuantity))
}

function getSafeProductId(productId: unknown): string {
  const safeProductId = String(productId ?? '').trim()

  if (!safeProductId) {
    throw new Error('Product is required.')
  }

  return safeProductId
}

function revalidateCartViews() {
  revalidatePath('/')
  revalidatePath('/cart')
  revalidatePath('/checkout')
}

export async function getCartAction(): Promise<CartActionResult> {
  try {
    const user = await requireCustomerAuthWithRedirect('/cart')
    const cart = await getCart(user.id)

    return {
      success: true,
      message: 'Cart loaded.',
      cart,
      count: cart.totalQuantity,
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to load cart.',
    }
  }
}

export async function getCartCountAction(): Promise<CartActionResult> {
  try {
    const user = await requireCustomerAuthWithRedirect('/')
    const count = await getCartCount(user.id)

    return {
      success: true,
      message: 'Cart count loaded.',
      count,
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to load cart count.',
      count: 0,
    }
  }
}

export async function addToCartAction(
  input: AddToCartInput
): Promise<CartActionResult> {
  try {
    const user = await requireCustomerAuthWithRedirect('/')
    const productId = getSafeProductId(input.productId)
    const quantity = getSafeQuantity(input.quantity)

    const result = await addToCart({
      userId: user.id,
      productId,
      quantity,
    })

    revalidateCartViews()

    return result
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to add product to cart.',
    }
  }
}

export async function updateCartItemQuantityAction(
  input: UpdateCartItemQuantityInput
): Promise<CartActionResult> {
  try {
    const user = await requireCustomerAuthWithRedirect('/cart')
    const productId = getSafeProductId(input.productId)
    const quantity = getSafeQuantity(input.quantity)

    const result = await updateCartItemQuantity({
      userId: user.id,
      productId,
      quantity,
    })

    revalidateCartViews()

    return result
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to update cart item.',
    }
  }
}

export async function incrementCartItemAction(
  productId: string
): Promise<CartActionResult> {
  try {
    const user = await requireCustomerAuthWithRedirect('/cart')
    const safeProductId = getSafeProductId(productId)

    const result = await incrementCartItem({
      userId: user.id,
      productId: safeProductId,
    })

    revalidateCartViews()

    return result
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to increase quantity.',
    }
  }
}

export async function decrementCartItemAction(
  productId: string
): Promise<CartActionResult> {
  try {
    const user = await requireCustomerAuthWithRedirect('/cart')
    const safeProductId = getSafeProductId(productId)

    const result = await decrementCartItem({
      userId: user.id,
      productId: safeProductId,
    })

    revalidateCartViews()

    return result
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to decrease quantity.',
    }
  }
}

export async function removeCartItemAction(
  productId: string
): Promise<CartActionResult> {
  try {
    const user = await requireCustomerAuthWithRedirect('/cart')
    const safeProductId = getSafeProductId(productId)

    const result = await removeCartItem({
      userId: user.id,
      productId: safeProductId,
    })

    revalidateCartViews()

    return result
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to remove item.',
    }
  }
}

export async function clearCartAction(): Promise<CartActionResult> {
  try {
    const user = await requireCustomerAuthWithRedirect('/cart')
    const result = await clearCart(user.id)

    revalidateCartViews()

    return result
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to clear cart.',
    }
  }
}

export async function mergeGuestCartAction(
  guestItems: GuestCartItem[]
): Promise<CartActionResult> {
  try {
    const user = await requireCustomerAuthWithRedirect('/')
    const safeGuestItems = guestItems
      .map((item) => ({
        productId: getSafeProductId(item.productId),
        quantity: getSafeQuantity(item.quantity),
        addedAt: item.addedAt,
      }))
      .filter((item) => item.productId)

    const result = await mergeGuestCart({
      userId: user.id,
      items: safeGuestItems,
    })

    revalidateCartViews()

    return result
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to merge guest cart.',
    }
  }
}

export async function validateCartForCheckoutAction(): Promise<CheckoutValidationResult> {
  const user = await requireCustomerAuthWithRedirect('/checkout')

  return validateCartForCheckout(user.id)
}

export async function getGuestCartProductsAction(
  productIds: string[]
): Promise<GuestCartProduct[]> {
  const safeProductIds = productIds
    .map((productId) => String(productId ?? '').trim())
    .filter(Boolean)

  return getGuestCartProducts(safeProductIds)
}