import { ChatMessage } from '@/types'
import { ValidationError } from '@/utils/error'

export function buildPrompt(
  history: ChatMessage[],
  newMessage: string
): ChatMessage[] {

  if (!newMessage || newMessage.trim() === '') {
    throw new ValidationError('Message cannot be empty')
  }

  const sanitizedMessage = newMessage.trim()

  if (sanitizedMessage.length > 2000) {
    throw new ValidationError('Message is too long. Please keep it under 2000 characters')
  }

  const messages: ChatMessage[] = [
    ...history,
    {
      role: 'user',
      content: sanitizedMessage,
    },
  ]

  return messages
}