import { productsIndex } from './meilisearch'
import { SEARCH_CONFIG } from './searchConfig'
import { getCachedSearchResults, setCachedSearchResults } from './searchCache'
import { isValidSearchQuery, sanitizeSearchQuery } from './searchUtils'
import type { ProductSearchDocument, SearchApiResponse, SearchMode, SearchOptions, SearchProductResult, SearchSuggestionDocument, SearchSuggestionResult } from '@/types/search'

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

        categoryName: product.category_name,
        tags: product.tags,
    }
}

// function mapSuggestionDocumentToResult(
//     suggestion: SearchSuggestionDocument
// ): SearchSuggestionResult {
//     return {
//         text: suggestion.text,
//         type: suggestion.type,
//     }
// }

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

    const cachedResult = await getCachedSearchResults({
        mode: options.mode,
        query: sanitizedQuery,
        limit,
    })

    if (cachedResult) {
        return cachedResult
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
      
      const products = productSearchResult.hits.map(mapProductDocumentToResult)
      const suggestions = buildProductNameSuggestions(productSearchResult.hits)

    const responseWithoutSource = {
        query: sanitizedQuery,
        total: productSearchResult.estimatedTotalHits ?? products.length,
        suggestions,
        products,
    }

    await setCachedSearchResults({
        mode: options.mode,
        query: sanitizedQuery,
        limit,
        payload: responseWithoutSource,
        ttlSeconds:
            options.mode === 'admin'
                ? SEARCH_CONFIG.ADMIN_SEARCH_TTL_SECONDS
                : SEARCH_CONFIG.PUBLIC_SEARCH_TTL_SECONDS,
    })

    return {
        ...responseWithoutSource,
        source: 'meilisearch',
    }
}