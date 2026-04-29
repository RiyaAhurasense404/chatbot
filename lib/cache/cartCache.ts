import { redis } from '@/lib/cache/redis'
import type { CartResponse } from '@/types/cart'

const CART_CACHE_TTL_SECONDS = 60 * 30
const CART_COUNT_CACHE_TTL_SECONDS = 60 * 30
const CART_LOCK_TTL_SECONDS = 10

function getCartCacheKey(userId: string): string {
  return `cart:user:${userId}`
}

function getCartCountCacheKey(userId: string): string {
  return `cart_count:user:${userId}`
}

function getCartVersionKey(userId: string): string {
  return `cart_version:user:${userId}`
}

function getCartLockKey(userId: string): string {
  return `cart_lock:user:${userId}`
}

export async function getCachedCart(
  userId: string
): Promise<CartResponse | null> {
  try {
    const cart = await redis.get<CartResponse>(getCartCacheKey(userId))
    return cart ?? null
  } catch (error) {
    console.error('Failed to get cached cart:', error)
    return null
  }
}

export async function setCachedCart(
  userId: string,
  cart: CartResponse
): Promise<void> {
  try {
    await redis.set(getCartCacheKey(userId), cart, {
      ex: CART_CACHE_TTL_SECONDS,
    })
  } catch (error) {
    console.error('Failed to set cached cart:', error)
  }
}

export async function getCachedCartCount(userId: string): Promise<number | null> {
  try {
    const count = await redis.get<number>(getCartCountCacheKey(userId))

    if (count === null || count === undefined) {
      return null
    }

    return Number(count)
  } catch (error) {
    console.error('Failed to get cached cart count:', error)
    return null
  }
}

export async function setCachedCartCount(
  userId: string,
  count: number
): Promise<void> {
  try {
    await redis.set(getCartCountCacheKey(userId), count, {
      ex: CART_COUNT_CACHE_TTL_SECONDS,
    })
  } catch (error) {
    console.error('Failed to set cached cart count:', error)
  }
}

export async function invalidateCartCache(userId: string): Promise<void> {
  try {
    await Promise.all([
      redis.del(getCartCacheKey(userId)),
      redis.del(getCartCountCacheKey(userId)),
      incrementCartVersion(userId),
    ])
  } catch (error) {
    console.error('Failed to invalidate cart cache:', error)
  }
}

export async function refreshCartCache(params: {
  userId: string
  cart: CartResponse
}): Promise<void> {
  try {
    await Promise.all([
      setCachedCart(params.userId, params.cart),
      setCachedCartCount(params.userId, params.cart.totalQuantity),
      incrementCartVersion(params.userId),
    ])
  } catch (error) {
    console.error('Failed to refresh cart cache:', error)
  }
}

export async function getCartVersion(userId: string): Promise<number> {
  try {
    const version = await redis.get<number>(getCartVersionKey(userId))

    if (!version) {
      await redis.set(getCartVersionKey(userId), 1)
      return 1
    }

    return Number(version)
  } catch (error) {
    console.error('Failed to get cart version:', error)
    return 1
  }
}

export async function incrementCartVersion(userId: string): Promise<void> {
  try {
    await redis.incr(getCartVersionKey(userId))
  } catch (error) {
    console.error('Failed to increment cart version:', error)
  }
}

export async function acquireCartLock(userId: string): Promise<boolean> {
  try {
    const result = await redis.set(getCartLockKey(userId), 'locked', {
      nx: true,
      ex: CART_LOCK_TTL_SECONDS,
    })

    return result === 'OK'
  } catch (error) {
    console.error('Failed to acquire cart lock:', error)
    return false
  }
}

export async function releaseCartLock(userId: string): Promise<void> {
  try {
    await redis.del(getCartLockKey(userId))
  } catch (error) {
    console.error('Failed to release cart lock:', error)
  }
}