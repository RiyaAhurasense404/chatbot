import { supabaseServer } from '@/lib/supabase'
import { productsIndex, searchSuggestionsIndex } from './meilisearch'
import {
  PRODUCT_FILTERABLE_ATTRIBUTES,
  PRODUCT_RANKING_RULES,
  PRODUCT_SEARCHABLE_ATTRIBUTES,
  PRODUCT_SORTABLE_ATTRIBUTES,
  PRODUCT_SYNONYMS,
  SUGGESTION_FILTERABLE_ATTRIBUTES,
  SUGGESTION_RANKING_RULES,
  SUGGESTION_SEARCHABLE_ATTRIBUTES,
  SUGGESTION_SORTABLE_ATTRIBUTES,
} from './searchConfig'
import { incrementSearchCacheVersion } from './searchCache'
import { mapProductsToSearchDocuments, type ProductSearchSource } from './productSearchMapper'
import { buildSuggestionsFromProducts } from './searchSuggestions'

const REINDEX_BATCH_SIZE = 1000
const EMPTY_REINDEX_RESULT = {
  productsIndexed: 0,
  suggestionsIndexed: 0,
}

async function configureProductsIndex() {
  await productsIndex.updateSearchableAttributes([
    ...PRODUCT_SEARCHABLE_ATTRIBUTES,
  ])

  await productsIndex.updateFilterableAttributes([
    ...PRODUCT_FILTERABLE_ATTRIBUTES,
  ])

  await productsIndex.updateSortableAttributes([
    ...PRODUCT_SORTABLE_ATTRIBUTES,
  ])

  await productsIndex.updateRankingRules([
    ...PRODUCT_RANKING_RULES,
  ])

  await productsIndex.updateSynonyms(
    Object.fromEntries(
      Object.entries(PRODUCT_SYNONYMS).map(([key, values]) => [
        key,
        [...values],
      ])
    )
  )
}

async function configureSuggestionsIndex() {
  await searchSuggestionsIndex.updateSearchableAttributes([
    ...SUGGESTION_SEARCHABLE_ATTRIBUTES,
  ])

  await searchSuggestionsIndex.updateFilterableAttributes([
    ...SUGGESTION_FILTERABLE_ATTRIBUTES,
  ])

  await searchSuggestionsIndex.updateSortableAttributes([
    ...SUGGESTION_SORTABLE_ATTRIBUTES,
  ])

  await searchSuggestionsIndex.updateRankingRules([
    ...SUGGESTION_RANKING_RULES,
  ])
}

async function fetchProductsForSearchBatch(params: {
  from: number
  to: number
}): Promise<ProductSearchSource[]> {
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
      display_order,
      view_count,
      search_click_count,
      cart_add_count,
      order_count,
      popularity_score,
      created_at,
      category_id,
      catalog_categories (
        id,
        name,
        parent_id
      ),
      product_tags (
        tags (
          id,
          name
        )
      )
    `)
    .order('display_order', { ascending: true })
    .order('id', { ascending: true })
    .range(params.from, params.to)

  if (error) {
    throw new Error(`Failed to fetch products for search: ${error.message}`)
  }

  const normalizedProducts = (data ?? []).map((product) => ({
    ...product,
    catalog_categories: Array.isArray(product.catalog_categories)
      ? product.catalog_categories[0] ?? null
      : product.catalog_categories,
    product_tags: (product.product_tags ?? []).map((productTag) => ({
      ...productTag,
      tags: Array.isArray(productTag.tags)
        ? productTag.tags[0] ?? null
        : productTag.tags,
    })),
  }))

  return normalizedProducts as unknown as ProductSearchSource[]
}

export async function reindexProductsSearch() {
  await configureProductsIndex()
  await configureSuggestionsIndex()

  await productsIndex.deleteAllDocuments()
  await searchSuggestionsIndex.deleteAllDocuments()

  let offset = 0
  let productsIndexed = EMPTY_REINDEX_RESULT.productsIndexed
  let suggestionsIndexed = EMPTY_REINDEX_RESULT.suggestionsIndexed

  while (true) {
    const products = await fetchProductsForSearchBatch({
      from: offset,
      to: offset + REINDEX_BATCH_SIZE - 1,
    })

    if (products.length === 0) {
      break
    }

    const productDocuments = mapProductsToSearchDocuments(products)
    const suggestionDocuments = buildSuggestionsFromProducts(productDocuments)

    if (productDocuments.length > 0) {
      await productsIndex.addDocuments(productDocuments, {
        primaryKey: 'id',
      })
    }

    if (suggestionDocuments.length > 0) {
      await searchSuggestionsIndex.addDocuments(suggestionDocuments, {
        primaryKey: 'id',
      })
    }

    productsIndexed += productDocuments.length
    suggestionsIndexed += suggestionDocuments.length

    if (products.length < REINDEX_BATCH_SIZE) {
      break
    }

    offset += REINDEX_BATCH_SIZE
  }

  await incrementSearchCacheVersion()

  return {
    productsIndexed,
    suggestionsIndexed,
  }
}