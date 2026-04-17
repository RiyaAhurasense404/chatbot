import { MediaType } from './media'

export type MessageRole = 'user' | 'assistant' | 'system'

export interface Message {
  id: string
  session_id: string
  role: MessageRole
  content: string
  order: number
  created_at: string
}

export interface Session {
  id: string
  title: string | null
  created_at: string
}

export interface ChatRequestBody {
  message: string
  sessionId: string
}

export interface ChatMessage {
  role: MessageRole
  content: string
}

export interface AIProvider {
  stream(messages: ChatMessage[], systemPrompt: string): Promise<Response>
}

export interface ApiErrorResponse {
  error: string
  code: string
}

export interface StreamHandlerParams {
  sessionId: string
  trimmedMessage: string
  messages: ChatMessage[]
  messageCount: number
}

export interface HeroContent {
  id?: string
  background_image_url: string
  background_media_type: MediaType
}

export interface Category {
  id: string
  name: string
  image_url: string
  media_type: MediaType
  display_order: number
  size: 'large' | 'small'
}

export interface Banner {
  id: string
  text: string
  image_url: string
  media_type: MediaType
  background_image_url: string
  background_media_type: MediaType
  display_order: number
}

export interface LandingPageData {
  hero: HeroContent
  categories: Category[]
  banners: Banner[]
}

export interface SessionData {
  isLoggedIn: boolean
  username: string
}

export interface Admin {
  id: string
  username: string
  password_hash: string
  created_at?: string
}

export interface CatalogCategory {
  id: string
  name: string
  parent_id: string | null
  created_at: string
}

export interface Product {
  id: string
  category_id: string
  name: string
  price: number
  discount: number
  image_url: string | null
  media_type: MediaType
  stock: number
  is_active: boolean
  display_order: number
  created_at: string
}

export interface SaveCatalogCategoryParams {
  name: string
  parentId?: string | null
}

export interface UpdateCatalogCategoryParams extends SaveCatalogCategoryParams {
  id: string
}

export interface SaveProductParams {
  categoryId: string
  name: string
  price: number
  discount: number
  imageUrl?: string
  mediaType: MediaType
  stock: number
  displayOrder: number
}

export interface UpdateProductParams extends SaveProductParams {
  id: string
}

export interface CatalogCategoryFormProps {
  category?: CatalogCategory
  parentId?: string | null
  returnPath: string
}

export interface ProductFormProps {
  categoryId: string
  product?: Product
  returnPath: string
}

export interface DeleteCatalogCategoryButtonProps {

  id: string
  name: string
  returnPath: string
}

export interface DeleteProductButtonProps {
  id: string
  name: string
  categoryId: string
}

export interface ToggleProductButtonProps {
  id: string
  isActive: boolean
  categoryId: string
}