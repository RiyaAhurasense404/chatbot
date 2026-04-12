import bcrypt from 'bcryptjs'
import { getAdminByUsername } from '@/lib/db/admin/admins'

export async function validateCredentials(
  username: string,
  password: string
): Promise<boolean> {
  try {
    const admin = await getAdminByUsername(username)

    if (!admin) {
      return false
    }

    const isValidPassword = await bcrypt.compare(password, admin.password_hash)

    return isValidPassword

  } catch (error) {
    console.error('[Auth Error]', error)
    return false
  }
}