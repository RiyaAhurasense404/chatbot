export type ProductTagRow = {
  tags: {
    id: string
    name: string
  } | null
}

export type CatalogCategoryRow = {
  id: string
  name: string
  parent_id: string | null
}

export type ProductSearchSource = {
  id: string
  name: string
  price: number
  discount: number | null
  image_url: string | null
  media_type: string | null
  stock: number | null
  is_active: boolean
  display_order: number | null
  created_at: string
  updated_at?: string | null
  category_id: string | null
  catalog_categories?: CatalogCategoryRow | null
  product_tags?: ProductTagRow[]
  view_count?: number | null
  search_click_count?: number | null
  cart_add_count?: number | null
  order_count?: number | null
  popularity_score?: number | null
}

