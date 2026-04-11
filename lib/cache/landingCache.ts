import { redis } from '@/lib/cache/redis'
import { getLandingPageDataFromDB } from '@/lib/db/landing'
import { getLatestUpdatedAt } from '@/lib/db/landingMeta'
import { LandingPageData } from '@/types'

const CACHE_KEY = 'landing:page_data'
const LAST_CHECKED_KEY = 'landing:last_checked'
const UPDATED_AT_KEY = 'landing:updated_at'
const FIVE_MINUTES = 5 * 60 * 1000

function isExpired(lastChecked: string): boolean {
  return Date.now() - parseInt(lastChecked) > FIVE_MINUTES
}

async function updateCache(data: LandingPageData, updatedAt: string): Promise<void> {
  await Promise.all([
    redis.set(CACHE_KEY, data),
    redis.set(UPDATED_AT_KEY, updatedAt),
    redis.set(LAST_CHECKED_KEY, String(Date.now())),
  ])
}

export async function getLandingPageData(): Promise<LandingPageData> {

  const [cached, lastChecked] = await Promise.all([
    redis.get<LandingPageData>(CACHE_KEY),
    redis.get<string>(LAST_CHECKED_KEY),
  ])

  if (cached && lastChecked && !isExpired(lastChecked)) {
    console.log('Serving from Redis cache')
    return cached
  }

  try {
    const latestUpdatedAt = await getLatestUpdatedAt()
    const cachedUpdatedAt = await redis.get<string>(UPDATED_AT_KEY)

    if (!cachedUpdatedAt || latestUpdatedAt !== cachedUpdatedAt) {
      console.log('Changes detected — updating cache')

      const freshData = await getLandingPageDataFromDB()
      await updateCache(freshData, latestUpdatedAt)
      return freshData
    }

    console.log('No changes — resetting timer')
    await redis.set(LAST_CHECKED_KEY, String(Date.now()))
    return cached!

  } catch (error) {
    console.error('[Landing Cache Error]', error)
    return cached ?? getLandingPageDataFromDB()
  }
}