import { getAllAdmins, createAdmin } from '@/lib/db/admin/admins'
import { handleApiError, ValidationError } from '@/utils/error'
import bcrypt from 'bcryptjs'

export async function GET(): Promise<Response> {
  try {
    const admins = await getAllAdmins()
    return Response.json({ admins }, { status: 200 })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const { username, password } = await request.json()

    if (!username || username.trim() === '') {
      throw new ValidationError('Username is required')
    }

    if (!password || password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters')
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await createAdmin(username.trim(), passwordHash)

    return Response.json(
      { message: 'Admin created successfully' },
      { status: 201 }
    )

  } catch (error) {
    return handleApiError(error)
  }
}