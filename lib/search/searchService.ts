import { productsIndex } from './meilisearch'
import { supabaseServer } from '@/lib/supabase'
import { SEARCH_CONFIG } from './searchConfig'
import { getCachedSearchResults, setCachedSearchResults } from './searchCache'
import {
  calculateFinalPrice,
  isValidSearchQuery,
  sanitizeSearchQuery,
} from './searchUtils'
import type {
  ProductSearchDocument,
  SearchApiResponse,
  SearchMode,
  SearchOptions,
  SearchProductResult,
  SearchSuggestionResult,
} from '@/types/search'

function mapProductDocumentToResult(
  product: ProductSearchDocument
): SearchProductResult {
  return {
    id: product.id,
    name: product.name,

    price: product.price,
    discount: product.discount,
    finalPrice: product.final_price,

    stockStatus: product.stock_status,

    imageUrl: product.image_url,
    mediaType: product.media_type,

    categoryId: product.category_id,
    categoryName: product.category_name,
    tags: product.tags,

    stock: product.stock,
    isActive: product.is_active,
  }
}

type FreshAdminProductRow = {
  id: string
  name: string
  price: number
  discount: number | null
  image_url: string | null
  media_type: string | null
  stock: number | null
  is_active: boolean | null
  category_id: string | null
  catalog_categories:
    | {
        id: string
        name: string
        parent_id: string | null
      }
    | {
        id: string
        name: string
        parent_id: string | null
      }[]
    | null
}

async function hydrateAdminProductsFromSupabase(
  productIds: string[]
): Promise<SearchProductResult[]> {
  if (productIds.length === 0) {
    return []
  }

  const { data, error } = await supabaseServer
    .from('products')
    .select(`
      id,
      name,
      price,
      discount,
      image_url,
      media_type,
      stock,
      is_active,
      category_id,
      catalog_categories (
        id,
        name,
        parent_id
      )
    `)
    .in('id', productIds)

  if (error) {
    throw new Error(`Failed to hydrate admin search products: ${error.message}`)
  }

  const productsById = new Map(
    ((data ?? []) as unknown as FreshAdminProductRow[]).map((product) => [
      product.id,
      product,
    ])
  )

  return productIds
    .map((productId) => productsById.get(productId))
    .filter((product): product is FreshAdminProductRow => Boolean(product))
    .map((product) => {
      const price = Number(product.price ?? 0)
      const discount = Number(product.discount ?? 0)
      const stock = Number(product.stock ?? 0)
      const category = Array.isArray(product.catalog_categories)
        ? product.catalog_categories[0] ?? null
        : product.catalog_categories

      return {
        id: product.id,
        name: product.name,
        price,
        discount,
        finalPrice: calculateFinalPrice(price, discount),
        stockStatus: stock > 0 ? 'in_stock' : 'out_of_stock',
        imageUrl: product.image_url,
        mediaType: product.media_type,
        categoryId: product.category_id,
        categoryName: category?.name ?? null,
        tags: [],
        stock,
        isActive: product.is_active === true,
      }
    })
}

function buildProductNameSuggestions(
  products: ProductSearchDocument[]
): SearchSuggestionResult[] {
  const suggestionMap = new Map<string, SearchSuggestionResult>()

  for (const product of products) {
    const text = product.name.trim()

    if (!text) continue

    const key = text.toLowerCase()

    if (!suggestionMap.has(key)) {
      suggestionMap.set(key, {
        text,
        type: 'product_name',
      })
    }
  }

  return Array.from(suggestionMap.values()).slice(
    0,
    SEARCH_CONFIG.PUBLIC_SUGGESTION_LIMIT
  )
}

function buildProductFilter(options: {
  mode: SearchMode
  includeInactive?: boolean
}): string | undefined {
  if (options.mode === 'admin') {
    return options.includeInactive ? undefined : 'is_active = true'
  }

  return 'is_active = true'
}

export async function searchProducts(
  options: SearchOptions
): Promise<SearchApiResponse> {
  const sanitizedQuery = sanitizeSearchQuery(options.query)

  if (!isValidSearchQuery(sanitizedQuery)) {
    return {
      query: sanitizedQuery,
      source: 'meilisearch',
      total: 0,
      suggestions: [],
      products: [],
    }
  }

  const limit =
    options.limit ??
    (options.mode === 'admin'
      ? SEARCH_CONFIG.ADMIN_PRODUCT_LIMIT
      : SEARCH_CONFIG.PUBLIC_PRODUCT_LIMIT)

  const shouldUseCache = options.mode === 'public'

  if (shouldUseCache) {
    const cachedResult = await getCachedSearchResults({
      mode: options.mode,
      query: sanitizedQuery,
      limit,
    })

    if (cachedResult) {
      return cachedResult
    }
  }

  const productFilter = buildProductFilter({
    mode: options.mode,
    includeInactive: options.includeInactive,
  })

  const productSearchResult = await productsIndex.search<ProductSearchDocument>(
    sanitizedQuery,
    {
      limit,
      filter: productFilter,
    }
  )

  const products =
    options.mode === 'admin'
      ? await hydrateAdminProductsFromSupabase(
          productSearchResult.hits.map((product) => product.id)
        )
      : productSearchResult.hits.map(mapProductDocumentToResult)

  const suggestions = buildProductNameSuggestions(productSearchResult.hits)

  const responseWithoutSource = {
    query: sanitizedQuery,
    total: productSearchResult.estimatedTotalHits ?? products.length,
    suggestions,
    products,
  }

  if (shouldUseCache) {
    await setCachedSearchResults({
      mode: options.mode,
      query: sanitizedQuery,
      limit,
      payload: responseWithoutSource,
      ttlSeconds: SEARCH_CONFIG.PUBLIC_SEARCH_TTL_SECONDS,
    })
  }

  return {
    ...responseWithoutSource,
    source: 'meilisearch',
  }
}