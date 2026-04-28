import { redis } from '@/lib/cache/redis'
import { SEARCH_CONFIG } from './searchConfig'
import {buildSearchCacheKey, buildSuggestionCacheKey} from './searchUtils'
import type {SearchApiResponse, SearchCachePayload, SearchMode, SearchSuggestionResult} from '@/types/search'

const SEARCH_VERSION_KEY = 'search:version'

export async function getSearchCacheVersion(): Promise<number> {
  try {
    const version = await redis.get<number>(SEARCH_VERSION_KEY)

    if (!version) {
      await redis.set(SEARCH_VERSION_KEY, SEARCH_CONFIG.DEFAULT_SEARCH_VERSION)
      return SEARCH_CONFIG.DEFAULT_SEARCH_VERSION
    }

    return Number(version)
  } catch (error) {
    console.error('Failed to get search cache version:', error)
    return SEARCH_CONFIG.DEFAULT_SEARCH_VERSION
  }
}

export async function incrementSearchCacheVersion(): Promise<void> {
  try {
    await redis.incr(SEARCH_VERSION_KEY)
  } catch (error) {
    console.error('Failed to increment search cache version:', error)
  }
  console.log('Incrementing search cache version')
}

export async function getCachedSearchResults(params: {
  mode: SearchMode
  query: string
  limit: number
}): Promise<SearchApiResponse | null> {
  try {
    const version = await getSearchCacheVersion()

    const cacheKey = buildSearchCacheKey({
      mode: params.mode,
      version,
      query: params.query,
      limit: params.limit,
    })

    const cachedResult = await redis.get<SearchCachePayload>(cacheKey)

    if (!cachedResult) {
      return null
    }

    return {
      ...cachedResult,
      source: 'cache',
    }
  } catch (error) {
    console.error('Failed to get cached search results:', error)
    return null
  }
}

export async function setCachedSearchResults(params: {
  mode: SearchMode
  query: string
  limit: number
  payload: SearchCachePayload
  ttlSeconds?: number
}): Promise<void> {
  try {
    const version = await getSearchCacheVersion()

    const cacheKey = buildSearchCacheKey({
      mode: params.mode,
      version,
      query: params.query,
      limit: params.limit,
    })

    await redis.set(cacheKey, params.payload, {
      ex:
        params.ttlSeconds ??
        (params.mode === 'admin'
          ? SEARCH_CONFIG.ADMIN_SEARCH_TTL_SECONDS
          : SEARCH_CONFIG.PUBLIC_SEARCH_TTL_SECONDS),
    })
  } catch (error) {
    console.error('Failed to set cached search results:', error)
  }
}

export async function getCachedSuggestions(params: {
  mode: SearchMode
  query: string
  limit: number
}): Promise<SearchSuggestionResult[] | null> {
  try {
    const version = await getSearchCacheVersion()

    const cacheKey = buildSuggestionCacheKey({
      mode: params.mode,
      version,
      query: params.query,
      limit: params.limit,
    })

    const cachedSuggestions =
      await redis.get<SearchSuggestionResult[]>(cacheKey)

    return cachedSuggestions ?? null
  } catch (error) {
    console.error('Failed to get cached suggestions:', error)
    return null
  }
}

export async function setCachedSuggestions(params: {
  mode: SearchMode
  query: string
  limit: number
  suggestions: SearchSuggestionResult[]
  ttlSeconds?: number
}): Promise<void> {
  try {
    const version = await getSearchCacheVersion()

    const cacheKey = buildSuggestionCacheKey({
      mode: params.mode,
      version,
      query: params.query,
      limit: params.limit,
    })

    await redis.set(cacheKey, params.suggestions, {
      ex: params.ttlSeconds ?? SEARCH_CONFIG.PUBLIC_SUGGESTION_TTL_SECONDS,
    })
  } catch (error) {
    console.error('Failed to set cached suggestions:', error)
  }
}