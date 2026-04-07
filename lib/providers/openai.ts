import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { AIProvider, ChatMessage } from '@/types'
import { ProviderError, ConfigError } from '@/utils/error'

const openAIKey = process.env.OPENAI_API_KEY

if (!openAIKey) {
  throw new ConfigError('OPENAI_API_KEY is missing from .env.local')
}

const openai = createOpenAI({
  apiKey: openAIKey,
})

export class OpenAIProvider implements AIProvider {
  private model: string

  constructor(model: string = 'gpt-5') {
    this.model = model
  }

  async stream(messages: ChatMessage[], systemPrompt: string): Promise<Response> {
    try {
      const result = await streamText({
        model: openai(this.model),
        system: systemPrompt,
        messages,
        temperature: 0.7,
        maxTokens: 1000,
      })

      return result.toDataStreamResponse()

    } catch (error: unknown) {

      if (isOpenAIError(error, 401)) {
        throw new ProviderError('Invalid OpenAI API key')
      }

      if (isOpenAIError(error, 429)) {
        throw new ProviderError('Rate limit exceeded. Please try again later')
      }

      if (isOpenAIError(error, 404)) {
        throw new ProviderError(`Model ${this.model} not found`)
      }

      if (isOpenAIError(error, 500)) {
        throw new ProviderError('OpenAI service is currently unavailable')
      }

      throw new ProviderError('Failed to get response from AI provider')
    }
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

export const openAIProvider = new OpenAIProvider('gpt-5')