export type SearchMode = 'public' | 'admin'

export type StockStatus = 'in_stock' | 'out_of_stock'

export type SearchSuggestionType =
  | 'product_name'
  | 'tag'
  | 'category'
  | 'synonym'
  | 'popular'

export interface ProductSearchDocument {
  id: string
  name: string

  price: number
  discount: number
  final_price: number

  stock: number
  stock_status: StockStatus
  is_active: boolean

  image_url: string | null
  media_type: string | null

  category_id: string | null
  category_name: string | null
  category_path: string[]

  tags: string[]
  tag_text: string

  display_order: number
  popularity_score: number

  created_at: number
  updated_at: number
}

export interface SearchSuggestionDocument {
  id: string
  text: string
  type: SearchSuggestionType
  weight: number
  source_id: string | null
}

export interface SearchProductResult {
  id: string
  name: string

  price: number
  discount: number
  finalPrice: number

  stockStatus: StockStatus

  imageUrl: string | null
  mediaType: string | null

  categoryName: string | null
  tags: string[]
  categoryId?: string | null
  stock?: number
  isActive?: boolean
}

export interface SearchSuggestionResult {
  text: string
  type: SearchSuggestionType
}

export interface SearchApiResponse {
  query: string
  source: 'cache' | 'meilisearch'
  total: number
  suggestions: SearchSuggestionResult[]
  products: SearchProductResult[]
}

export interface SearchOptions {
  mode: SearchMode
  query: string
  limit?: number
  includeInactive?: boolean
}

export interface SearchCachePayload {
  query: string
  total: number
  suggestions: SearchSuggestionResult[]
  products: SearchProductResult[]
}

export interface SearchDropdownProps {
  isOpen: boolean
  showHistory: boolean
  showSearchResults: boolean
  history: string[]
  data: SearchApiResponse | null
  isLoading: boolean
  error: string | null
  onHistorySelect: (historyText: string) => void
  onHistoryRemove: (historyText: string) => void
  onHistoryClear: () => void
  onSuggestionSelect: (suggestionText: string) => void
  onProductSelect: (productId: string, productName: string) => void
}