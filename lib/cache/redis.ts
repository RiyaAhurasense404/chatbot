import { Redis } from '@upstash/redis'

let _redis: Redis | null = null

export function getRedis(): Redis {
  if (_redis) return _redis

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url) throw new Error('UPSTASH_REDIS_REST_URL is missing from .env.local')
  if (!token) throw new Error('UPSTASH_REDIS_REST_TOKEN is missing from .env.local')

  _redis = new Redis({ url, token })
  return _redis
}

export const redis = new Proxy({} as Redis, {
  get(_, prop) {
    return (getRedis() as any)[prop]
  }
})