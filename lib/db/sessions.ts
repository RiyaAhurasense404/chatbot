import { supabaseServer } from '@/lib/supabase'
import { Session } from '@/types'
import { DatabaseError } from '@/utils/error'

export async function getAllSessions(): Promise<Session[]> {
  const { data, error } = await supabaseServer
    .from('sessions')
    .select('id, title, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    throw new DatabaseError(`Failed to fetch sessions: ${error.message}`)
  }

  return data ?? []
}

export async function getSessionById(sessionId: string): Promise<Session | null> {
  const { data, error } = await supabaseServer
    .from('sessions')
    .select('id, title, created_at')
    .eq('id', sessionId)
    .maybeSingle()

  if (error) {
    throw new DatabaseError(`Failed to fetch session: ${error.message}`)
  }

  return data
}

export async function createSession(): Promise<Session> {
  const { data, error } = await supabaseServer
    .from('sessions')
    .insert({ title: null })
    .select('id, title, created_at')
    .single()

  if (error) {
    throw new DatabaseError(`Failed to create session: ${error.message}`)
  }

  if (!data) {
    throw new DatabaseError('Session was not created')
  }

  return data
}

export async function updateSessionTitle(
  sessionId: string,
  title: string
): Promise<void> {
  const { error } = await supabaseServer
    .from('sessions')
    .update({ title })
    .eq('id', sessionId)

  if (error) {
    throw new DatabaseError(`Failed to update session title: ${error.message}`)
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  const { error } = await supabaseServer
    .from('sessions')
    .delete()
    .eq('id', sessionId)

  if (error) {
    throw new DatabaseError(`Failed to delete session: ${error.message}`)
  }
}