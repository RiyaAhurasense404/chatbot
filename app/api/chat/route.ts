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

    const { messages: incomingMessages, sessionId } = body

    if (!sessionId || sessionId.trim() === '') {
      throw new ValidationError('sessionId is required')
    }

    if (!incomingMessages || incomingMessages.length === 0) {
      throw new ValidationError('message is required')
    }

    const lastMessage = incomingMessages[incomingMessages.length - 1]
    const trimmedMessage = lastMessage?.content?.trim()

    if (!trimmedMessage) {
      throw new ValidationError('message is required')
    }

    const session = await getSessionById(sessionId)
    if (!session) {
      throw new ValidationError('Session not found')
    }

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