'use server'

import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { getSessionOptions } from '@/lib/admin/session'
import { validateCredentials } from '@/lib/admin/auth'
import { SessionData } from '@/types'

interface LoginResult {
  success: boolean
  error?: string
}

export async function loginAction(
  username: string,
  password: string
): Promise<LoginResult> {
  const trimmedUsername = username.trim()
  const trimmedPassword = password.trim()

  if (!trimmedUsername || !trimmedPassword) {
    return { success: false, error: 'Username and password are required.' }
  }

  const isValid = await validateCredentials(trimmedUsername, trimmedPassword)

  if (!isValid) {
    return { success: false, error: 'Invalid username or password.' }
  }

  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, getSessionOptions())

  session.isLoggedIn = true
  session.username = trimmedUsername
  await session.save()

  return { success: true }
}
