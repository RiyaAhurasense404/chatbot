import type { GuestCart, GuestCartItem } from '@/types/cart'

export const GUEST_CART_STORAGE_KEY = 'samatva_guest_cart'

function canUseBrowserStorage(): boolean {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

function createEmptyGuestCart(): GuestCart {
  return {
    items: [],
    updatedAt: new Date().toISOString(),
  }
}

function normalizeQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1

  return Math.max(1, Math.floor(quantity))
}

function normalizeGuestCart(cart: Partial<GuestCart> | null): GuestCart {
  if (!cart || !Array.isArray(cart.items)) {
    return createEmptyGuestCart()
  }

  const itemMap = new Map<string, GuestCartItem>()

  for (const item of cart.items) {
    const productId = String(item.productId ?? '').trim()

    if (!productId) continue

    const existingItem = itemMap.get(productId)
    const quantity = normalizeQuantity(Number(item.quantity ?? 1))

    itemMap.set(productId, {
      productId,
      quantity: (existingItem?.quantity ?? 0) + quantity,
      addedAt: existingItem?.addedAt ?? item.addedAt ?? new Date().toISOString(),
    })
  }

  return {
    items: Array.from(itemMap.values()),
    updatedAt: cart.updatedAt ?? new Date().toISOString(),
  }
}

export function getGuestCart(): GuestCart {
  if (!canUseBrowserStorage()) {
    return createEmptyGuestCart()
  }

  try {
    const rawCart = window.localStorage.getItem(GUEST_CART_STORAGE_KEY)

    if (!rawCart) {
      return createEmptyGuestCart()
    }

    return normalizeGuestCart(JSON.parse(rawCart) as Partial<GuestCart>)
  } catch (error) {
    console.error('Failed to read guest cart:', error)
    return createEmptyGuestCart()
  }
}

export function setGuestCart(cart: GuestCart): GuestCart {
  const normalizedCart = normalizeGuestCart({
    ...cart,
    updatedAt: new Date().toISOString(),
  })

  if (!canUseBrowserStorage()) {
    return normalizedCart
  }

  window.localStorage.setItem(
    GUEST_CART_STORAGE_KEY,
    JSON.stringify(normalizedCart)
  )

  window.dispatchEvent(new Event('guest-cart-updated'))

  return normalizedCart
}

export function getGuestCartCount(): number {
  const cart = getGuestCart()

  return cart.items.reduce((total, item) => total + item.quantity, 0)
}

export function addGuestCartItem(params: {
  productId: string
  quantity?: number
}): GuestCart {
  const productId = params.productId.trim()

  if (!productId) {
    throw new Error('Product is required.')
  }

  const cart = getGuestCart()
  const quantity = normalizeQuantity(params.quantity ?? 1)
  const existingItem = cart.items.find((item) => item.productId === productId)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.items.push({
      productId,
      quantity,
      addedAt: new Date().toISOString(),
    })
  }

  return setGuestCart(cart)
}

export function updateGuestCartItemQuantity(params: {
  productId: string
  quantity: number
}): GuestCart {
  const productId = params.productId.trim()
  const quantity = normalizeQuantity(params.quantity)
  const cart = getGuestCart()

  const updatedItems = cart.items.map((item) => {
    if (item.productId !== productId) {
      return item
    }

    return {
      ...item,
      quantity,
    }
  })

  return setGuestCart({
    items: updatedItems,
    updatedAt: new Date().toISOString(),
  })
}

export function incrementGuestCartItem(productId: string): GuestCart {
  const cart = getGuestCart()
  const item = cart.items.find((cartItem) => cartItem.productId === productId)

  if (!item) {
    return addGuestCartItem({ productId, quantity: 1 })
  }

  return updateGuestCartItemQuantity({
    productId,
    quantity: item.quantity + 1,
  })
}

export function decrementGuestCartItem(productId: string): GuestCart {
  const cart = getGuestCart()
  const item = cart.items.find((cartItem) => cartItem.productId === productId)

  if (!item) {
    return cart
  }

  if (item.quantity <= 1) {
    return removeGuestCartItem(productId)
  }

  return updateGuestCartItemQuantity({
    productId,
    quantity: item.quantity - 1,
  })
}

export function removeGuestCartItem(productId: string): GuestCart {
  const cart = getGuestCart()

  return setGuestCart({
    items: cart.items.filter((item) => item.productId !== productId),
    updatedAt: new Date().toISOString(),
  })
}

export function clearGuestCart(): GuestCart {
  const emptyCart = createEmptyGuestCart()

  if (canUseBrowserStorage()) {
    window.localStorage.removeItem(GUEST_CART_STORAGE_KEY)
    window.dispatchEvent(new Event('guest-cart-updated'))
  }

  return emptyCart
}