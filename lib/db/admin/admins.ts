import { supabaseServer } from '@/lib/supabase'
import { Admin } from '@/types'
import { DatabaseError } from '@/utils/error'

export async function getAdminByUsername(
  username: string
): Promise<Admin | null> {
  const { data, error } = await supabaseServer
    .from('admins')
    .select('id, username, password_hash')
    .eq('username', username)
    .maybeSingle()

  if (error) {
    throw new DatabaseError(`Failed to fetch admin: ${error.message}`)
  }

  return data
}

export async function getAllAdmins(): Promise<Omit<Admin, 'password_hash'>[]> {
  const { data, error } = await supabaseServer
    .from('admins')
    .select('id, username, created_at')
    .order('created_at', { ascending: true })

  if (error) {
    throw new DatabaseError(`Failed to fetch admins: ${error.message}`)
  }

  return data ?? []
}

export async function createAdmin(
  username: string,
  passwordHash: string
): Promise<void> {
  const { error } = await supabaseServer
    .from('admins')
    .insert({ username, password_hash: passwordHash })

  if (error) {
    if (error.code === '23505') {
      throw new DatabaseError('Username already exists')
    }
    throw new DatabaseError(`Failed to create admin: ${error.message}`)
  }
}

export async function deleteAdmin(id: string): Promise<void> {
  const { error } = await supabaseServer
    .from('admins')
    .delete()
    .eq('id', id)

  if (error) {
    throw new DatabaseError(`Failed to delete admin: ${error.message}`)
  }
}

export async function getAdminCount(): Promise<number> {
  const { count, error } = await supabaseServer
    .from('admins')
    .select('*', { count: 'exact', head: true })

  if (error) {
    throw new DatabaseError(`Failed to count admins: ${error.message}`)
  }

  return count ?? 0
}