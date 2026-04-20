import { supabaseServer } from '@/lib/supabase'
import { Tag, TagWithCount, TagWithProducts } from '@/types'
import { DatabaseError } from '@/utils/error'

export async function getAllTags(): Promise<TagWithCount[]> {
  const { data, error } = await supabaseServer
    .from('tags')
    .select(`
      id,
      name,
      created_at,
      product_tags (count)
    `)
    .order('name', { ascending: true })

  if (error) throw new DatabaseError(`Failed to fetch tags: ${error.message}`)

  return (data ?? []).map((tag: any) => ({
    id: tag.id,
    name: tag.name,
    created_at: tag.created_at,
    product_count: tag.product_tags?.[0]?.count ?? 0,
  }))
}

export async function getTagById(id: string): Promise<Tag | null> {
  const { data, error } = await supabaseServer
    .from('tags')
    .select('id, name, created_at')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new DatabaseError(`Failed to fetch tag: ${error.message}`)
  return data
}

export async function getTagByName(name: string): Promise<Tag | null> {
  const { data, error } = await supabaseServer
    .from('tags')
    .select('id, name, created_at')
    .eq('name', name.toLowerCase().trim())
    .maybeSingle()

  if (error) throw new DatabaseError(`Failed to fetch tag: ${error.message}`)
  return data
}

export async function getProductTags(productId: string): Promise<Tag[]> {
  const { data, error } = await supabaseServer
    .from('product_tags')
    .select('tags (id, name, created_at)')
    .eq('product_id', productId)

  if (error) throw new DatabaseError(`Failed to fetch product tags: ${error.message}`)

  return (data ?? []).map((row: any) => row.tags).filter(Boolean)
}

export async function getTagProducts(tagId: string): Promise<TagWithProducts['products']> {
  const { data, error } = await supabaseServer
    .from('product_tags')
    .select('products (id, name, category_id)')
    .eq('tag_id', tagId)

  if (error) throw new DatabaseError(`Failed to fetch tag products: ${error.message}`)

  return (data ?? []).map((row: any) => row.products).filter(Boolean)
}

export async function createTag(name: string): Promise<Tag> {
  const normalized = name.toLowerCase().trim()

  const { data, error } = await supabaseServer
    .from('tags')
    .insert({ name: normalized })
    .select('id, name, created_at')
    .single()

  if (error) {
    if (error.code === '23505') {
      const existing = await getTagByName(normalized)
      if (existing) return existing
    }
    throw new DatabaseError(`Failed to create tag: ${error.message}`)
  }

  return data
}

export async function deleteTag(id: string): Promise<void> {
  const { error } = await supabaseServer
    .from('tags')
    .delete()
    .eq('id', id)

  if (error) throw new DatabaseError(`Failed to delete tag: ${error.message}`)
}

export async function syncProductTags(
  productId: string,
  tagNames: string[]
): Promise<void> {
  try {
    const normalized = tagNames
      .map((t) => t.toLowerCase().trim())
      .filter(Boolean)

    const tagIds: string[] = []

    for (const name of normalized) {
      const tag = await createTag(name)
      tagIds.push(tag.id)
    }

    const { error: deleteError } = await supabaseServer
      .from('product_tags')
      .delete()
      .eq('product_id', productId)

    if (deleteError) throw new DatabaseError(`Failed to clear product tags: ${deleteError.message}`)

    if (tagIds.length > 0) {
      const rows = tagIds.map((tagId) => ({
        product_id: productId,
        tag_id: tagId,
      }))

      const { error: insertError } = await supabaseServer
        .from('product_tags')
        .insert(rows)

      if (insertError) throw new DatabaseError(`Failed to link tags: ${insertError.message}`)
    }

  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : 'Failed to sync tags'
    )
  }
}

export async function getAllTagNames(): Promise<string[]> {
  const { data, error } = await supabaseServer
    .from('tags')
    .select('name')
    .order('name', { ascending: true })

  if (error) throw new DatabaseError(`Failed to fetch tag names: ${error.message}`)
  return (data ?? []).map((t: any) => t.name)
}

export async function getAllTagsWithProducts(): Promise<TagWithProducts[]> {
    const { data, error } = await supabaseServer
      .from('tags')
      .select(`
        id,
        name,
        created_at,
        product_tags (
          products (
            id,
            name,
            category_id
          )
        )
      `)
      .order('name', { ascending: true })
  
    if (error) throw new DatabaseError(`Failed to fetch tags: ${error.message}`)
  
    return (data ?? []).map((tag: any) => ({
      id: tag.id,
      name: tag.name,
      created_at: tag.created_at,
      product_count: tag.product_tags?.length ?? 0,
      products: (tag.product_tags ?? [])
        .map((pt: any) => pt.products)
        .filter(Boolean),
    }))
  }