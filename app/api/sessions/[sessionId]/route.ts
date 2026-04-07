import { getSessionById, deleteSession } from '@/lib/db/sessions'
import { handleApiError, ValidationError } from '@/utils/error'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
): Promise<Response> {
  try {

    const { sessionId } = await params

    if (!sessionId || sessionId.trim() === '') {
      throw new ValidationError('sessionId is required')
    }

    const session = await getSessionById(sessionId)

    if (!session) {
      return Response.json(
        { error: 'Session not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    return Response.json({ session }, { status: 200 })

  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
): Promise<Response> {
  try {

    const { sessionId } = await params

    if (!sessionId || sessionId.trim() === '') {
      throw new ValidationError('sessionId is required')
    }

    const session = await getSessionById(sessionId)

    if (!session) {
      return Response.json(
        { error: 'Session not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    await deleteSession(sessionId)

    return Response.json(
      { message: 'Session deleted successfully' },
      { status: 200 }
    )

  } catch (error) {
    return handleApiError(error)
  }
}