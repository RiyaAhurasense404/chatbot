'use server'

import { requireAdminSession } from '@/lib/admin/session'
import bcrypt from 'bcryptjs'
import {createAdmin, updateAdmin, deleteAdmin} from '@/lib/db/admin/admins'
import { DatabaseError } from '@/utils/error'

interface CreateAdminActionParams {
  username: string
  password: string
}

interface UpdateAdminActionParams {
  id: string
  username: string
  password?: string
}

export async function createAdminAction({
  username,
  password,
}: CreateAdminActionParams): Promise<void> {
  await requireAdminSession()
  try {
    const trimmedUsername = username.trim()
    const trimmedPassword = password.trim()

    if (!trimmedUsername) {
      throw new DatabaseError('Username is required.')
    }

    if (!trimmedPassword) {
      throw new DatabaseError('Password is required.')
    }

    const passwordHash = await bcrypt.hash(trimmedPassword, 10)

    await createAdmin(trimmedUsername, passwordHash)
  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : 'Failed to create admin'
    )
  }
}

export async function updateAdminAction({
  id,
  username,
  password,
}: UpdateAdminActionParams): Promise<void> {
  await requireAdminSession()
  try {
    const trimmedUsername = username.trim()

    if (!trimmedUsername) {
      throw new DatabaseError('Username is required.')
    }

    let passwordHash: string | undefined

    if (password && password.trim()) {
      passwordHash = await bcrypt.hash(password.trim(), 10)
    }

    await updateAdmin(id, trimmedUsername, passwordHash)
  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : 'Failed to update admin'
    )
  }
}

export async function deleteAdminAction(id: string): Promise<void> {
  await requireAdminSession()
  try {
    await deleteAdmin(id)
  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : 'Failed to delete admin'
    )
  }
}