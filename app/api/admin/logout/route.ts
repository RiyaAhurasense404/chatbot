import { getIronSession } from 'iron-session'
import { sessionOptions } from '@/lib/admin/session'
import { handleApiError } from '@/utils/error'
import { SessionData } from '@/types'

export async function POST(request: Request): Promise<Response> {
  try {

    const response = Response.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    )

    const session = await getIronSession<SessionData>(
      request,
      response,
      sessionOptions
    )

    session.destroy()

    return response

  } catch (error) {
    return handleApiError(error)
  }
}