import { SessionOptions } from 'iron-session'
import { SessionData } from '@/types'

export type { SessionData }

export function getSessionOptions(): SessionOptions {
  const secret = process.env.IRON_SESSION_SECRET

  if (!secret) throw new Error('IRON_SESSION_SECRET is missing from .env.local')

  return {
    password: secret,
    cookieName: 'admin_session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    },
  }
}

export const sessionOptions: SessionOptions = new Proxy({} as SessionOptions, {
  get(_, prop) {
    return (getSessionOptions() as any)[prop]
  }
})