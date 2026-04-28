import { getRedis } from '@/lib/cache/redis'

const MAX_ATTEMPTS = 5
const WINDOW_SECONDS = 5 * 60

export interface RateLimitState {
  locked: boolean
  attemptsLeft: number
  retryAfterSeconds: number
}

function key(ip: string) {
  return `admin:login:attempts:${ip}`
}

export async function checkLoginRateLimit(ip: string): Promise<RateLimitState> {
  const redis = getRedis()
  const attempts = await redis.get<number>(key(ip)) ?? 0

  if (attempts >= MAX_ATTEMPTS) {
    const ttl = await redis.ttl(key(ip))
    return { locked: true, attemptsLeft: 0, retryAfterSeconds: ttl }
  }

  return { locked: false, attemptsLeft: MAX_ATTEMPTS - attempts, retryAfterSeconds: 0 }
}

export async function recordFailedAttempt(ip: string): Promise<RateLimitState> {
  const redis = getRedis()
  const attempts = await redis.incr(key(ip))

  if (attempts === 1) {
    await redis.expire(key(ip), WINDOW_SECONDS)
  }

  if (attempts >= MAX_ATTEMPTS) {
    
    await redis.expire(key(ip), WINDOW_SECONDS)
    return { locked: true, attemptsLeft: 0, retryAfterSeconds: WINDOW_SECONDS }
  }

  return { locked: false, attemptsLeft: MAX_ATTEMPTS - attempts, retryAfterSeconds: 0 }
}

export async function clearLoginAttempts(ip: string): Promise<void> {
  await getRedis().del(key(ip))
}
