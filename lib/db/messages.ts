import { supabaseServer } from '@/lib/supabase'
import { ChatMessage } from '@/types'
import { DatabaseError } from '@/utils/error'

export async function getMessagesBySessionId(
  sessionId: string
): Promise<ChatMessage[]> {
  const { data, error } = await supabaseServer
    .from('messages')
    .select('role, content')
    .eq('session_id', sessionId)
    .order('order', { ascending: true })

  if (error) {
    throw new DatabaseError(`Failed to fetch messages: ${error.message}`)
  }

  if (!data || data.length === 0) {
    return []
  }

  return data.map((row) => ({
    role: row.role as ChatMessage['role'],
    content: row.content,
  }))
}

export async function getMessageCount(sessionId: string): Promise<number> {
  const { count, error } = await supabaseServer
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', sessionId)

  if (error) {
    throw new DatabaseError(`Failed to get message count: ${error.message}`)
  }

  return count ?? 0
}

export async function saveMessages(
  sessionId: string,
  userMessage: string,
  assistantMessage: string,
  currentOrder: number
): Promise<void> {
  const { error } = await supabaseServer
    .from('messages')
    .insert([
      {
        session_id: sessionId,
        role: 'user',
        content: userMessage,
        order: currentOrder,
      },
      {
        session_id: sessionId,
        role: 'assistant',
        content: assistantMessage,
        order: currentOrder + 1,
      },
    ])

  if (error) {
    throw new DatabaseError(`Failed to save messages: ${error.message}`)
  }
}