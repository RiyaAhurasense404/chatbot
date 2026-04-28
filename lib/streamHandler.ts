import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { SYSTEM_PROMPT } from '@/lib/systemPrompt'
import { saveMessages } from '@/lib/db/messages'
import { updateSessionTitle } from '@/lib/db/sessions'
import { StreamHandlerParams } from '@/types'
import { ProviderError } from '@/utils/error'

export async function handleStream({
  sessionId,
  trimmedMessage,
  messages,
  messageCount,
}: StreamHandlerParams): Promise<Response> {

  const openAIKey = process.env.OPENAI_API_KEY
  if (!openAIKey) {
    throw new ProviderError('OPENAI_API_KEY is missing from .env.local')
  }

  const openai = createOpenAI({ apiKey: openAIKey })

  try {
    const result = await streamText({
      model: openai('gpt-4o'),
      system: SYSTEM_PROMPT,
      messages,
      temperature: 0.7,
      maxTokens: 1000,

      onFinish: async ({ text }) => {
        try {
          await saveMessages(sessionId, trimmedMessage, text, messageCount)
          console.log('Messages saved — length:', text.length)

          if (messageCount === 0) {
            await updateSessionTitle(sessionId, trimmedMessage.slice(0, 50))
            console.log('Title updated')
          }
        } catch (err) {
          console.error('[onFinish error]', err)
        }
      },
    })

    return result.toDataStreamResponse({
      headers: {
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error: unknown) {
    console.error('[handleStream error]', error)
    if (isOpenAIError(error, 401)) {
      throw new ProviderError('Invalid OpenAI API key')
    }
    if (isOpenAIError(error, 429)) {
      throw new ProviderError('Rate limit exceeded. Please try again later')
    }
    if (isOpenAIError(error, 404)) {
      throw new ProviderError('Model not found')
    }
    if (isOpenAIError(error, 500)) {
      throw new ProviderError('OpenAI service is currently unavailable')
    }
    throw new ProviderError('Failed to get response from AI provider')
  }
}

function isOpenAIError(error: unknown, status: number): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    (error as { status: number }).status === status
  )
}