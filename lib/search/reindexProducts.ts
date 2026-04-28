import { supabaseServer } from '@/lib/supabase'
import { productsIndex, searchSuggestionsIndex } from './meilisearch'
import { PRODUCT_FILTERABLE_ATTRIBUTES, PRODUCT_RANKING_RULES, PRODUCT_SEARCHABLE_ATTRIBUTES, PRODUCT_SORTABLE_ATTRIBUTES,PRODUCT_SYNONYMS, SUGGESTION_FILTERABLE_ATTRIBUTES, SUGGESTION_RANKING_RULES, SUGGESTION_SEARCHABLE_ATTRIBUTES, SUGGESTION_SORTABLE_ATTRIBUTES } from './searchConfig'
import { incrementSearchCacheVersion } from './searchCache'
import { mapProductsToSearchDocuments, type ProductSearchSource } from './productSearchMapper'

import { buildSuggestionsFromProducts } from './searchSuggestions'

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

async function fetchProductsForSearch(): Promise<ProductSearchSource[]> {
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
  const products = await fetchProductsForSearch()

  const productDocuments = mapProductsToSearchDocuments(products)
  const suggestionDocuments = buildSuggestionsFromProducts(productDocuments)

  await configureProductsIndex()
  await configureSuggestionsIndex()

  await productsIndex.deleteAllDocuments()
  await searchSuggestionsIndex.deleteAllDocuments()

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

  await incrementSearchCacheVersion()

  return {
    productsIndexed: productDocuments.length,
    suggestionsIndexed: suggestionDocuments.length,
  }
}