import { SEARCH_CONFIG } from './searchConfig'
import type { StockStatus } from '@/types/search'

export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function isValidSearchQuery(query: string): boolean {
  const normalizedQuery = normalizeSearchQuery(query)

  return (
    normalizedQuery.length >= SEARCH_CONFIG.MIN_QUERY_LENGTH &&
    normalizedQuery.length <= SEARCH_CONFIG.MAX_QUERY_LENGTH
  )
}

export function sanitizeSearchQuery(query: string): string {
  return normalizeSearchQuery(query).replace(/[<>:"'`;{}()[\]\\]/g, '')
}

export function calculateFinalPrice(price: number, discount: number): number {
  if (!discount || discount <= 0) {
    return price
  }

  const finalPrice = price - (price * discount) / 100

  return Math.max(0, Number(finalPrice.toFixed(2)))
}

export function getStockStatus(stock: number): StockStatus {
  return stock > 0 ? 'in_stock' : 'out_of_stock'
}

export function buildSuggestionId(text: string, type: string): string {
  const safeText = normalizeSearchQuery(text)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${type}-${safeText}`
}

export function buildSearchCacheKey(params: {
  mode: 'public' | 'admin'
  version: number
  query: string
  limit: number
}): string {
  const normalizedQuery = normalizeSearchQuery(params.query).replace(/\s+/g, '-')

  return `search:${params.mode}:v${params.version}:q=${normalizedQuery}:limit=${params.limit}`
}

export function buildSuggestionCacheKey(params: {
  mode: 'public' | 'admin'
  version: number
  query: string
  limit: number
}): string {
  const normalizedQuery = normalizeSearchQuery(params.query).replace(/\s+/g, '-')

  return `suggest:${params.mode}:v${params.version}:q=${normalizedQuery}:limit=${params.limit}`
}

export function toUnixTimestamp(date: string | Date | null | undefined): number {
  if (!date) {
    return Math.floor(Date.now() / 1000)
  }

  return Math.floor(new Date(date).getTime() / 1000)
}