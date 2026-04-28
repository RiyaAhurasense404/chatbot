import { supabaseServer } from '@/lib/supabase'
import { CatalogCategory, SaveCatalogCategoryParams, UpdateCatalogCategoryParams } from '@/types'
import { DatabaseError } from '@/utils/error'
import {
  removeProductFromSearch,
  syncProductsByCategory,
} from '@/lib/search/productSearchSync'

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

  async function getDescendantCategoryIds(categoryId: string): Promise<string[]> {
    const descendantIds: string[] = []
    const queue = [categoryId]

    while (queue.length > 0) {
      const currentId = queue.shift()

      if (!currentId) continue

      descendantIds.push(currentId)

      const { data, error } = await supabaseServer
        .from('catalog_categories')
        .select('id')
        .eq('parent_id', currentId)

      if (error) {
        throw new DatabaseError(
          `Failed to fetch descendant categories: ${error.message}`
        )
      }

      queue.push(...(data ?? []).map((category) => category.id))
    }

    return descendantIds
  }

  async function getProductIdsByCategoryIds(categoryIds: string[]): Promise<string[]> {
    if (categoryIds.length === 0) {
      return []
    }

    const { data, error } = await supabaseServer
      .from('products')
      .select('id')
      .in('category_id', categoryIds)

    if (error) {
      throw new DatabaseError(
        `Failed to fetch products by categories: ${error.message}`
      )
    }

    return (data ?? []).map((product) => product.id)
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

    await syncProductsByCategory(params.id)
  }
  
  export async function deleteCatalogCategory(id: string): Promise<void> {
    const categoryIds = await getDescendantCategoryIds(id)
    const affectedProductIds = await getProductIdsByCategoryIds(categoryIds)

    const { error } = await supabaseServer
      .from('catalog_categories')
      .delete()
      .eq('id', id)

    if (error) throw new DatabaseError(`Failed to delete category: ${error.message}`)

    await Promise.all(
      affectedProductIds.map((productId) => removeProductFromSearch(productId))
    )
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