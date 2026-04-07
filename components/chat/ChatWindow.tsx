'use client'

import { useChat } from '@ai-sdk/react'
import { useEffect, useRef } from 'react'
import { ChatWindowProps } from '@/types/client'
import { ChatMessage } from '@/types'
import MessageList from './MessageList'
import ChatInput from './ChatInput'

export default function ChatWindow({
  sessionId,
  initialMessages,
}: ChatWindowProps) {

  const bottomRef = useRef<HTMLDivElement>(null)

  const {
    messages,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    error,
  } = useChat({
    api: '/api/chat',
    initialMessages: initialMessages.map((m, index) => ({
      id: String(index),
      role: m.role,
      content: m.content,
    })),
    body: {
      sessionId,
    },
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const chatMessages: ChatMessage[] = messages.map((m) => ({
    role: m.role as ChatMessage['role'],
    content: m.content,
  }))

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>

      {error && (
        <div style={{ padding: '8px', color: 'red' }}>
          <p>Something went wrong. Please try again.</p>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <MessageList messages={chatMessages} />
        <div ref={bottomRef} />
      </div>

      <ChatInput
        input={input}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />

    </div>
  )
}