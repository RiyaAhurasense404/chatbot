'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createSession } from '@/lib/api'

export default function NewChatButton() {

  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  const handleNewChat = async () => {
    try {
      setIsCreating(true)
      const session = await createSession()
      router.push(`/chat/${session.id}`)
    } catch (error) {
      console.error('[NewChatButton error]', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <button
      onClick={handleNewChat}
      disabled={isCreating}
    >
      {isCreating ? 'Creating...' : '+ New Chat'}
    </button>
  )
}