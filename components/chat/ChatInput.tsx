'use client'

import { ChatInputProps } from '@/types/client'

export default function ChatInput({
  input,
  isLoading,
  onInputChange,
  onSubmit,
}: ChatInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: 'flex',
        gap: '8px',
        padding: '16px',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#ffffff',
      }}
    >
      <input
        type="text"
        value={input}
        onChange={onInputChange}
        placeholder="Ask me anything about food..."
        disabled={isLoading}
        style={{
          flex: 1,
          padding: '12px 16px',
          fontSize: '15px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          outline: 'none',
          backgroundColor: '#f9f9f9',
          color: '#000000',
          minHeight: '48px',
        }}
      />
      <button
        type="submit"
        disabled={isLoading || input.trim() === ''}
        style={{
          padding: '12px 24px',
          fontSize: '15px',
          backgroundColor: isLoading || input.trim() === '' ? '#cccccc' : '#000000',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          cursor: isLoading || input.trim() === '' ? 'not-allowed' : 'pointer',
          minHeight: '48px',
          whiteSpace: 'nowrap',
        }}
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </form>
  )
}