import { supabaseServer } from '@/lib/supabase'
import { CatalogCategory, SaveCatalogCategoryParams, UpdateCatalogCategoryParams } from '@/types'
import { DatabaseError } from '@/utils/error'

export async function getRootCategories(): Promise<CatalogCategory[]> {
    const { data, error } = await supabaseServer
      .from('catalog_categories')
      .select('id, name, parent_id, created_at')
      .is('parent_id', null)
      .order('created_at', { ascending: true })
  
    if (error) throw new DatabaseError(`Failed to fetch root categories: ${error.message}`)
    return data ?? []
  }
  
  export async function getSubCategories(parentId: string): Promise<CatalogCategory[]> {
    const { data, error } = await supabaseServer
      .from('catalog_categories')
      .select('id, name, parent_id, created_at')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: true })
  
    if (error) throw new DatabaseError(`Failed to fetch subcategories: ${error.message}`)
    return data ?? []
  }
  
  export async function getCatalogCategoryById(id: string): Promise<CatalogCategory | null> {
    const { data, error } = await supabaseServer
      .from('catalog_categories')
      .select('id, name, parent_id, created_at')
      .eq('id', id)
      .maybeSingle()
  
    if (error) throw new DatabaseError(`Failed to fetch category: ${error.message}`)
    return data
  }
  
  export async function hasSubCategories(id: string): Promise<boolean> {
    const { count, error } = await supabaseServer
      .from('catalog_categories')
      .select('*', { count: 'exact', head: true })
      .eq('parent_id', id)
  
    if (error) throw new DatabaseError(`Failed to check subcategories: ${error.message}`)
    return (count ?? 0) > 0
  }
  
  export async function createCatalogCategory(params: SaveCatalogCategoryParams): Promise<void> {
    const { error } = await supabaseServer
      .from('catalog_categories')
      .insert({
        name: params.name,
        parent_id: params.parentId ?? null,
      })
  
    if (error) throw new DatabaseError(`Failed to create category: ${error.message}`)
  }
  
  export async function updateCatalogCategory(params: UpdateCatalogCategoryParams): Promise<void> {
    const { error } = await supabaseServer
      .from('catalog_categories')
      .update({ name: params.name })
      .eq('id', params.id)
  
    if (error) throw new DatabaseError(`Failed to update category: ${error.message}`)
  }
  
  export async function deleteCatalogCategory(id: string): Promise<void> {
    const { error } = await supabaseServer
      .from('catalog_categories')
      .delete()
      .eq('id', id)
  
    if (error) throw new DatabaseError(`Failed to delete category: ${error.message}`)
  }
  
  export async function getCategoryBreadcrumb(id: string): Promise<CatalogCategory[]> {
    const breadcrumb: CatalogCategory[] = []
    let currentId: string | null = id
  
    while (currentId) {
      const category = await getCatalogCategoryById(currentId)
      if (!category) break
      breadcrumb.unshift(category)
      currentId = category.parent_id
    }
  
    return breadcrumb
  }