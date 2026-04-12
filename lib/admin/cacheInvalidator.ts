import { redis } from '@/lib/cache/redis'

const CACHE_KEY = 'landing:page_data'
const LAST_CHECKED_KEY = 'landing:last_checked'
const UPDATED_AT_KEY = 'landing:updated_at'

export async function invalidateLandingCache(): Promise<void> {
  try {
    await Promise.all([
      redis.del(CACHE_KEY),
      redis.del(LAST_CHECKED_KEY),
      redis.del(UPDATED_AT_KEY),
    ])
    console.log('Landing cache invalidated successfully')
  } catch (error) {
    console.error('[Cache Invalidation Error]', error)
  }
}