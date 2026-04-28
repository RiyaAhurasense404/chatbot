import { supabaseServer } from '@/lib/supabase'
import { productsIndex } from './meilisearch'
import { incrementSearchCacheVersion } from './searchCache'
import {mapProductToSearchDocument, type ProductSearchSource } from './productSearchMapper'

async function fetchProductForSearch(
  productId: string
): Promise<ProductSearchSource | null> {
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
    .eq('id', productId)
    .single()

  if (error) {
    console.error(`Failed to fetch product for search sync: ${error.message}`)
    return null
  }

  if (!data) {
    return null
  }

  const normalizedProduct = {
    ...data,
    catalog_categories: Array.isArray(data.catalog_categories)
      ? data.catalog_categories[0] ?? null
      : data.catalog_categories,
    product_tags: (data.product_tags ?? []).map((productTag) => ({
      ...productTag,
      tags: Array.isArray(productTag.tags)
        ? productTag.tags[0] ?? null
        : productTag.tags,
    })),
  }

  return normalizedProduct as unknown as ProductSearchSource
}

export async function syncProductToSearch(productId: string): Promise<void> {
  const product = await fetchProductForSearch(productId)

  if (!product) {
    return
  }

  const productDocument = mapProductToSearchDocument(product)

  await productsIndex.addDocuments([productDocument], {
    primaryKey: 'id',
  })

  await incrementSearchCacheVersion()
  console.log('Syncing product to Meilisearch:', productId)
}

export async function removeProductFromSearch(productId: string): Promise<void> {
  await productsIndex.deleteDocument(productId)
  await incrementSearchCacheVersion()
}

export async function syncProductsToSearch(productIds: string[]): Promise<void> {
  const uniqueProductIds = Array.from(new Set(productIds)).filter(Boolean)

  if (uniqueProductIds.length === 0) {
    return
  }

  const products = await Promise.all(
    uniqueProductIds.map((productId) => fetchProductForSearch(productId))
  )

  const productDocuments = products
    .filter((product): product is ProductSearchSource => Boolean(product))
    .map(mapProductToSearchDocument)

  if (productDocuments.length === 0) {
    return
  }

  await productsIndex.addDocuments(productDocuments, {
    primaryKey: 'id',
  })

  await incrementSearchCacheVersion()
}

export async function syncProductsByCategory(
  categoryId: string
): Promise<void> {
  const { data, error } = await supabaseServer
    .from('products')
    .select('id')
    .eq('category_id', categoryId)

  if (error) {
    throw new Error(`Failed to fetch products by category: ${error.message}`)
  }

  const productIds = (data ?? []).map((product) => product.id)

  await syncProductsToSearch(productIds)
}

export async function syncProductsByTag(tagId: string): Promise<void> {
  const { data, error } = await supabaseServer
    .from('product_tags')
    .select('product_id')
    .eq('tag_id', tagId)

  if (error) {
    throw new Error(`Failed to fetch products by tag: ${error.message}`)
  }

  const productIds = (data ?? []).map((productTag) => productTag.product_id)

  await syncProductsToSearch(productIds)
}

export async function invalidateSearchCache(): Promise<void> {
  await incrementSearchCacheVersion()
}