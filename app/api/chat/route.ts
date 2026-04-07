// app/api/chat/route.ts

import { loadContext } from '@/lib/contextLoader'
import { buildPrompt } from '@/lib/promptBuilder'
import { getMessageCount } from '@/lib/db/messages'
import { getSessionById } from '@/lib/db/sessions'
import { handleStream } from '@/lib/streamHandler'
import { handleApiError, ValidationError } from '@/utils/error'

export async function POST(request: Request): Promise<Response> {
  try {

    let body: any
    try {
      body = await request.json()
    } catch {
      throw new ValidationError('Invalid JSON in request body')
    }

    console.log('Request body:', JSON.stringify(body))

    // useChat sends messages array — extract last user message
    const { messages: incomingMessages, sessionId } = body

    if (!incomingMessages || incomingMessages.length === 0) {
      throw new ValidationError('message is required')
    }

    if (!sessionId || sessionId.trim() === '') {
      throw new ValidationError('sessionId is required')
    }

    // last message in array is what user just typed
    const lastMessage = incomingMessages[incomingMessages.length - 1]
    const trimmedMessage = lastMessage?.content?.trim()

    if (!trimmedMessage) {
      throw new ValidationError('message is required')
    }

    console.log('trimmedMessage:', trimmedMessage)
    console.log('sessionId:', sessionId)

    const session = await getSessionById(sessionId)
    if (!session) {
      throw new ValidationError('Session not found')
    }

    // load context from DB — not from useChat messages
    // useChat messages are for display only
    // DB history is the source of truth for AI context
    const [history, messageCount] = await Promise.all([
      loadContext(sessionId),
      getMessageCount(sessionId),
    ])

    const messages = buildPrompt(history, trimmedMessage)

    return await handleStream({
      sessionId,
      trimmedMessage,
      messages,
      messageCount,
    })

  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET(): Promise<Response> {
  return Response.json(
    { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' },
    { status: 405 }
  )
}