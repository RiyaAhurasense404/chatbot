import { SessionOptions } from 'iron-session'
import { SessionData } from '@/types'
import { ConfigError } from '@/utils/error'

export type { SessionData }

const secret = process.env.IRON_SESSION_SECRET

if (!secret) {
  throw new ConfigError('IRON_SESSION_SECRET is missing from .env.local')
}

export const sessionOptions: SessionOptions = {
  password: secret,
  cookieName: 'admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24,
  },
}