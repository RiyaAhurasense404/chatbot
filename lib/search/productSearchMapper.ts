import type { ProductSearchDocument } from '@/types/search'
import type {
  ProductTagRow,
  CatalogCategoryRow,
  ProductSearchSource,
} from '@/types/productSearch'

export type { ProductSearchSource } from '@/types/productSearch'
import { calculateFinalPrice, getStockStatus, toUnixTimestamp } from './searchUtils'

export function buildCategoryPath(
  category: CatalogCategoryRow | null | undefined
): string[] {
  if (!category?.name) {
    return []
  }

  return [category.name]
}

export function extractProductTags(productTags?: ProductTagRow[]): string[] {
  if (!productTags?.length) {
    return []
  }

  const tags = productTags
    .map((productTag) => productTag.tags?.name)
    .filter((tag): tag is string => Boolean(tag))
    .map((tag) => tag.trim().toLowerCase())

  return Array.from(new Set(tags))
}

export function mapProductToSearchDocument(
  product: ProductSearchSource
): ProductSearchDocument {
  const price = Number(product.price ?? 0)
  const discount = Number(product.discount ?? 0)
  const finalPrice = calculateFinalPrice(price, discount)

  const stock = Number(product.stock ?? 0)
  const stockStatus = getStockStatus(stock)
  const stockRank = stock > 0 ? 1 : 0

  const viewCount = Number(product.view_count ?? 0)
  const searchClickCount = Number(product.search_click_count ?? 0)
  const cartAddCount = Number(product.cart_add_count ?? 0)
  const orderCount = Number(product.order_count ?? 0)

  const calculatedPopularityScore =
    viewCount * 1 +
    searchClickCount * 3 +
    cartAddCount * 6 +
    orderCount * 10 +
    stockRank * 20

  const popularityScore = Math.max(
    Number(product.popularity_score ?? 0),
    calculatedPopularityScore
  )

  const tags = extractProductTags(product.product_tags)
  const categoryName = product.catalog_categories?.name ?? null
  const categoryPath = buildCategoryPath(product.catalog_categories)

  return {
    id: product.id,
    name: product.name,

    price,
    discount,
    final_price: finalPrice,

    stock,
    stock_status: stockStatus,
    is_active: Boolean(product.is_active),

    image_url: product.image_url,
    media_type: product.media_type,

    category_id: product.category_id,
    category_name: categoryName,
    category_path: categoryPath,

    tags,
    tag_text: tags.join(' '),

    display_order: Number(product.display_order ?? 0),
    stock_rank: stockRank,
    view_count: viewCount,
    search_click_count: searchClickCount,
    cart_add_count: cartAddCount,
    order_count: orderCount,
    popularity_score: popularityScore,

    created_at: toUnixTimestamp(product.created_at),
    updated_at: toUnixTimestamp(product.updated_at ?? product.created_at),
  }
}

export function mapProductsToSearchDocuments(
  products: ProductSearchSource[]
): ProductSearchDocument[] {
  return products.map(mapProductToSearchDocument)
}