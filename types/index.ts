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
  background_image_url: string
}

export interface Category {
  id: string
  name: string
  image_url: string
  display_order: number
  size: 'large' | 'small'
}

export interface LandingPageData {
  hero: HeroContent
  categories: Category[]
  banners: Banner[]
}

export interface Banner {
  id: string
  text: string
  image_url: string
  background_image_url: string
  display_order: number
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