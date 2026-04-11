import { supabaseServer } from '@/lib/supabase'
import { Category } from '@/types'
import { DatabaseError } from '@/utils/error'

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabaseServer
    .from('categories')
    .select('id, name, image_url, display_order, size')
    .order('display_order', { ascending: true })

  if (error) {
    throw new DatabaseError(`Failed to fetch categories: ${error.message}`)
  }

  return data ?? []
}
