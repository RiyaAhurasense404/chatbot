import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { SYSTEM_PROMPT } from '@/lib/systemPrompt'
import { saveMessages } from '@/lib/db/messages'
import { updateSessionTitle } from '@/lib/db/sessions'
import { StreamHandlerParams } from '@/types'
import { ConfigError, ProviderError } from '@/utils/error'

const openAIKey = process.env.OPENAI_API_KEY
if (!openAIKey) {
  throw new ConfigError('OPENAI_API_KEY is missing from .env.local')
}

const openai = createOpenAI({ apiKey: openAIKey })

export async function handleStream({
  sessionId,
  trimmedMessage,
  messages,
  messageCount,
}: StreamHandlerParams): Promise<Response> {
  try {

    const result = await streamText({
      model: openai('gpt-4o'),
      system: SYSTEM_PROMPT,
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    })

    const encoder = new TextEncoder()
    let fullText = ''

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.textStream) {
            fullText += chunk
            controller.enqueue(
              encoder.encode(`0:${JSON.stringify(chunk)}\n`)
            )
          }

          console.log('Stream complete')
          console.log('Full text length:', fullText.length)

          await saveMessages(
            sessionId,
            trimmedMessage,
            fullText,
            messageCount
          )
          console.log('Messages saved')

          if (messageCount === 0) {
            await updateSessionTitle(
              sessionId,
              trimmedMessage.slice(0, 50)
            )
            console.log('Title updated')
          }

          controller.enqueue(
            encoder.encode(
              `d:${JSON.stringify({ finishReason: 'stop' })}\n`
            )
          )
          controller.close()
          console.log('Stream closed')

        } catch (err) {
          console.error('[Stream processing error]', err)
          controller.error(err)
        }
      }
    })

    return new Response(readable, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1',
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