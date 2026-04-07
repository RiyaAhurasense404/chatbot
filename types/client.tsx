import { Session, ChatMessage } from '@/types'

export interface ChatLayoutProps {
  sessions: Session[]
  activeSessionId?: string
  initialMessages?: ChatMessage[]
}

export interface SidebarProps {
  sessions: Session[]
  activeSessionId?: string
}

export interface SessionItemProps {
  session: Session
  isActive: boolean
}

export interface ChatWindowProps {
  sessionId: string
  initialMessages: ChatMessage[]
}

export interface MessageListProps {
  messages: ChatMessage[]
}

export interface MessageBubbleProps {
  message: ChatMessage
}

export interface ChatInputProps {
    input: string
    isLoading: boolean
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  }