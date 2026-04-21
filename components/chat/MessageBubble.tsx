'use client'

import ReactMarkdown from 'react-markdown'
import { MessageBubbleProps } from '@/types/client'
import rehypeSanitize from 'rehype-sanitize'

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div style={{
      marginBottom: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
    }}>

      <span style={{
        fontSize: '12px',
        color: '#888',
        marginBottom: '4px',
      }}>
        {isUser ? 'You' : 'Flavor'}
      </span>

      <div style={{
        maxWidth: '75%',
        padding: '12px 16px',
        borderRadius: '12px',
        backgroundColor: isUser ? '#000000' : '#f0f0f0',
        color: isUser ? '#ffffff' : '#000000',
      }}>
        {isUser ? (
          <p style={{ margin: 0 }}>{message.content}</p>
        ) : (
          <ReactMarkdown rehypePlugins={[rehypeSanitize]}
            components={{
              p: ({ children }) => (
                <p style={{ margin: '0 0 8px 0' }}>{children}</p>
              ),
              ul: ({ children }) => (
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>{children}</ul>
              ),
              ol: ({ children }) => (
                <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>{children}</ol>
              ),
              li: ({ children }) => (
                <li style={{ marginBottom: '4px' }}>{children}</li>
              ),
              strong: ({ children }) => (
                <strong style={{ fontWeight: 'bold' }}>{children}</strong>
              ),
              h1: ({ children }) => (
                <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: '8px 0' }}>{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '8px 0' }}>{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '8px 0' }}>{children}</h3>
              ),
              code: ({ children }) => (
                <code style={{
                  backgroundColor: '#e0e0e0',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                }}>{children}</code>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>

    </div>
  )
}