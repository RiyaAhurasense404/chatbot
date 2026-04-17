import { supabaseServer } from '@/lib/supabase'
import { Product, SaveProductParams, UpdateProductParams } from '@/types'
import { DatabaseError } from '@/utils/error'

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const { data, error } = await supabaseServer
    .from('products')
    .select('id, category_id, name, price, discount, image_url, media_type, stock, is_active, display_order, created_at')
    .eq('category_id', categoryId)
    .order('display_order', { ascending: true })

  if (error) throw new DatabaseError(`Failed to fetch products: ${error.message}`)
  return data ?? []
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabaseServer
    .from('products')
    .select('id, category_id, name, price, discount, image_url, media_type, stock, is_active, display_order, created_at')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new DatabaseError(`Failed to fetch product: ${error.message}`)
  return data
}

export async function createProduct(params: SaveProductParams): Promise<void> {
  const { error } = await supabaseServer
    .from('products')
    .insert({
      category_id: params.categoryId,
      name: params.name,
      price: params.price,
      discount: params.discount,
      image_url: params.imageUrl ?? null,
      media_type: params.mediaType,
      stock: params.stock,
      display_order: params.displayOrder,
    })

  if (error) throw new DatabaseError(`Failed to create product: ${error.message}`)
}

export async function updateProduct(params: UpdateProductParams): Promise<void> {
  const { error } = await supabaseServer
    .from('products')
    .update({
      name: params.name,
      price: params.price,
      discount: params.discount,
      image_url: params.imageUrl ?? null,
      media_type: params.mediaType,
      stock: params.stock,
      display_order: params.displayOrder,
    })
    .eq('id', params.id)

  if (error) throw new DatabaseError(`Failed to update product: ${error.message}`)
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabaseServer
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw new DatabaseError(`Failed to delete product: ${error.message}`)
}

export async function toggleProductActive(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabaseServer
    .from('products')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) throw new DatabaseError(`Failed to toggle product status: ${error.message}`)
}