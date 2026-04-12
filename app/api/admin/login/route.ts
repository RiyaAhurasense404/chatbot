import { getIronSession } from 'iron-session'
import { sessionOptions } from '@/lib/admin/session'
import { validateCredentials } from '@/lib/admin/auth'
import { handleApiError, ValidationError } from '@/utils/error'
import { SessionData } from '@/types'

export async function POST(request: Request): Promise<Response> {
  try {

    let body: { username: string; password: string }
    try {
      body = await request.json()
    } catch {
      throw new ValidationError('Invalid JSON in request body')
    }

    const { username, password } = body

    if (!username || username.trim() === '') {
      throw new ValidationError('Username is required')
    }

    if (!password || password.trim() === '') {
      throw new ValidationError('Password is required')
    }

    const isValid = await validateCredentials(username.trim(), password)

    if (!isValid) {
      return Response.json(
        { error: 'Invalid username or password', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      )
    }

    const response = Response.json(
      { message: 'Login successful' },
      { status: 200 }
    )

    const session = await getIronSession<SessionData>(
      request,
      response,
      sessionOptions
    )

    session.isLoggedIn = true
    session.username = username.trim()
    await session.save()

    return response

  } catch (error) {
    return handleApiError(error)
  }
}