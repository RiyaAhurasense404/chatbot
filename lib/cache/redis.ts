import { Redis } from '@upstash/redis'
import { ConfigError } from '@/utils/error'

const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

if (!redisUrl) {
  throw new ConfigError('UPSTASH_REDIS_REST_URL is missing from .env.local')
}

if (!redisToken) {
  throw new ConfigError('UPSTASH_REDIS_REST_TOKEN is missing from .env.local')
}

export const redis = new Redis({
  url: redisUrl,
  token: redisToken,
})