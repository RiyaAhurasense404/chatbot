import { supabaseServer } from '@/lib/supabase'
import { Category } from '@/types'
import { DatabaseError } from '@/utils/error'
import { SaveCategoryParams, UpdateCategoryParams } from '@/types/admin'


export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabaseServer
    .from('categories')
    .select('id, name, image_url, media_type, display_order, size')
    .order('display_order', { ascending: true })

  if (error) {
    throw new DatabaseError(`Failed to fetch categories: ${error.message}`)
  }

  return data ?? []
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const { data, error } = await supabaseServer
    .from('categories')
    .select('id, name, image_url, media_type, display_order, size')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new DatabaseError(`Failed to fetch category: ${error.message}`)
  }

  return data
}

export async function createCategory({
  name,
  imageUrl,
  mediaType,
  displayOrder,
  size,
}: SaveCategoryParams): Promise<void> {
  const { error } = await supabaseServer
    .from('categories')
    .insert({
      name,
      image_url: imageUrl,
      media_type: mediaType,
      display_order: displayOrder,
      size,
    })

  if (error) {
    throw new DatabaseError(`Failed to create category: ${error.message}`)
  }
}

export async function updateCategory({
  id,
  name,
  imageUrl,
  mediaType,
  displayOrder,
  size,
}: UpdateCategoryParams): Promise<void> {
  const { error } = await supabaseServer
    .from('categories')
    .update({
      name,
      image_url: imageUrl,
      media_type: mediaType,
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