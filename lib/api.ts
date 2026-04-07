import { Session } from '@/types'

export async function createSession(): Promise<Session> {
  const response = await fetch('/api/sessions', {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Failed to create session')
  }

  const { session } = await response.json()
  return session
}

export async function fetchSessions(): Promise<Session[]> {
  const response = await fetch('/api/sessions', {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch sessions')
  }

  const { sessions } = await response.json()
  return sessions
}

export async function fetchSession(sessionId: string): Promise<Session> {
  const response = await fetch(`/api/sessions/${sessionId}`, {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch session')
  }

  const { session } = await response.json()
  return session
}

export async function deleteSession(sessionId: string): Promise<void> {
  const response = await fetch(`/api/sessions/${sessionId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete session')
  }
}