import { redis } from '@/lib/cache/redis'

const SEARCH_RATE_LIMIT_WINDOW_SECONDS = 60
const SEARCH_RATE_LIMIT_MAX_REQUESTS = 60

export async function checkSearchRateLimit(identifier: string): Promise<{
  allowed: boolean
  remaining: number
  resetInSeconds: number
}> {
  const key = `rate-limit:search:${identifier}`

  try {
    const currentCount = await redis.incr(key)

    if (currentCount === 1) {
      await redis.expire(key, SEARCH_RATE_LIMIT_WINDOW_SECONDS)
    }

    const ttl = await redis.ttl(key)

    return {
      allowed: currentCount <= SEARCH_RATE_LIMIT_MAX_REQUESTS,
      remaining: Math.max(0, SEARCH_RATE_LIMIT_MAX_REQUESTS - currentCount),
      resetInSeconds: ttl > 0 ? ttl : SEARCH_RATE_LIMIT_WINDOW_SECONDS,
    }
  } catch (error) {
    console.error('Search rate limit failed:', error)

    return {
      allowed: true,
      remaining: SEARCH_RATE_LIMIT_MAX_REQUESTS,
      resetInSeconds: SEARCH_RATE_LIMIT_WINDOW_SECONDS,
    }
  }
}