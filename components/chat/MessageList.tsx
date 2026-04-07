'use client'

import MessageBubble from './MessageBubble'
import { MessageListProps } from '@/types/client'


export default function MessageList({ messages }: MessageListProps) {

  if (messages.length === 0) {
    return (
      <div>
        <p>No messages yet. Ask me anything about food.</p>
      </div>
    )
  }

  return (
    <div>
      {messages.map((message, index) => (
        <MessageBubble key={index} message={message} />
      ))}
    </div>
  )
}