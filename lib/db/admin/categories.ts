import { supabaseServer } from '@/lib/supabase'
import { Category } from '@/types'
import { DatabaseError } from '@/utils/error'

export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabaseServer
    .from('categories')
    .select('id, name, image_url, display_order, size')
    .order('display_order', { ascending: true })

  if (error) {
    throw new DatabaseError(`Failed to fetch categories: ${error.message}`)
  }

  return data ?? []
}

export async function createCategory(
  name: string,
  imageUrl: string,
  displayOrder: number,
  size: 'large' | 'small'
): Promise<void> {
  const { error } = await supabaseServer
    .from('categories')
    .insert({
      name,
      image_url: imageUrl,
      display_order: displayOrder,
      size,
    })

  if (error) {
    throw new DatabaseError(`Failed to create category: ${error.message}`)
  }
}

export async function updateCategory(
  id: string,
  name: string,
  imageUrl: string,
  displayOrder: number,
  size: 'large' | 'small'
): Promise<void> {
  const { error } = await supabaseServer
    .from('categories')
    .update({
      name,
      image_url: imageUrl,
      display_order: displayOrder,
      size,
    })
    .eq('id', id)

  if (error) {
    throw new DatabaseError(`Failed to update category: ${error.message}`)
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabaseServer
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    throw new DatabaseError(`Failed to delete category: ${error.message}`)
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const { data, error } = await supabaseServer
    .from('categories')
    .select('id, name, image_url, display_order, size')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new DatabaseError(`Failed to fetch category: ${error.message}`)
  }

  return data
}