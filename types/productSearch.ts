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
}

export interface ProductSearchDocument {
  id: string
  name: string
  price: number
  discount: number | null
  imageUrl: string | null
  mediaType: string | null
  stock: number
  isActive: boolean
  displayOrder: number | null
  createdAt: string
  categoryId: string | null
  categoryName: string | null
  tagNames: string[]
}