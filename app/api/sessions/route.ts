import { getAllSessions, createSession } from '@/lib/db/sessions'
import { handleApiError } from '@/utils/error'

export async function GET(): Promise<Response> {
  try {
    const sessions = await getAllSessions()
    return Response.json({ sessions }, { status: 200 })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(): Promise<Response> {
  try {
    const session = await createSession()
    return Response.json({ session }, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}