'use server'

import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { getSessionOptions } from '@/lib/admin/session'
import { SessionData } from '@/types'

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, getSessionOptions())

  await session.destroy()
}