import { Meilisearch } from 'meilisearch'

const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST
const MEILISEARCH_ADMIN_KEY = process.env.MEILISEARCH_ADMIN_KEY

if (!MEILISEARCH_HOST) {
  throw new Error('Missing MEILISEARCH_HOST environment variable')
}

if (!MEILISEARCH_ADMIN_KEY) {
  throw new Error('Missing MEILISEARCH_ADMIN_KEY environment variable')
}


export const meilisearchClient = new Meilisearch({
  host: MEILISEARCH_HOST,
  apiKey: MEILISEARCH_ADMIN_KEY,
})

export const productsIndex = meilisearchClient.index('products')

export const searchSuggestionsIndex = meilisearchClient.index('search_suggestions')