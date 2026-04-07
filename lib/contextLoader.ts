import { getMessagesBySessionId } from '@/lib/db/messages'
import { ChatMessage } from '@/types'
import { ValidationError } from '@/utils/error'

export async function loadContext(sessionId: string): Promise<ChatMessage[]> {

  if (!sessionId || sessionId.trim() === '') {
    throw new ValidationError('sessionId is required to load context')
  }

  const messages = await getMessagesBySessionId(sessionId)

  return messages
}