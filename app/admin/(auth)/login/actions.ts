'use server'

import { cookies, headers } from 'next/headers'
import { getIronSession } from 'iron-session'
import { getSessionOptions } from '@/lib/admin/session'
import { validateCredentials } from '@/lib/admin/auth'
import { checkLoginRateLimit, recordFailedAttempt, clearLoginAttempts } from '@/lib/admin/loginRateLimit'
import { SessionData } from '@/types'

interface LoginResult {
  success: boolean
  error?: string
  attemptsLeft?: number
  retryAfterSeconds?: number
}

export async function loginAction(
  username: string,
  password: string
): Promise<LoginResult> {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  const rateLimit = await checkLoginRateLimit(ip)
  if (rateLimit.locked) {
    const minutes = Math.ceil(rateLimit.retryAfterSeconds / 60)
    return {
      success: false,
      error: `Too many failed attempts. Try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    }
  }

  const trimmedUsername = username.trim()
  const trimmedPassword = password.trim()

  if (!trimmedUsername || !trimmedPassword) {
    return { success: false, error: 'Username and password are required.' }
  }

  const isValid = await validateCredentials(trimmedUsername, trimmedPassword)

  if (!isValid) {
    const state = await recordFailedAttempt(ip)
    return {
      success: false,
      error: state.locked
        ? `Too many failed attempts. Try again in 5 minutes.`
        : `Invalid username or password. ${state.attemptsLeft} attempt${state.attemptsLeft !== 1 ? 's' : ''} left.`,
      attemptsLeft: state.attemptsLeft,
    }
  }

  await clearLoginAttempts(ip)

  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, getSessionOptions())

  session.isLoggedIn = true
  session.username = trimmedUsername
  await session.save()

  return { success: true }
}
