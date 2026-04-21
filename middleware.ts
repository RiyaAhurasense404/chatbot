import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getIronSession } from 'iron-session'
import { getSessionOptions, SessionData } from '@/lib/admin/session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    const response = NextResponse.next()

    const session = await getIronSession<SessionData>(
      request,
      response,
      getSessionOptions()
    )

    if (!session.isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}