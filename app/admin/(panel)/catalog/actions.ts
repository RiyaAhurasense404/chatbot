'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { uploadMedia } from '@/lib/admin/uploadMedia'
import { createCatalogCategory, updateCatalogCategory, deleteCatalogCategory } from '@/lib/db/admin/catalog'
import { updateProduct, deleteProduct, toggleProductActive } from '@/lib/db/admin/products'
import { SaveCatalogCategoryParams, UpdateCatalogCategoryParams, SaveProductParams, UpdateProductParams } from '@/types'
import { DatabaseError } from '@/utils/error'
import { syncProductTags } from '@/lib/db/admin/tags'
import { supabaseServer } from '@/lib/supabase'


export async function createCatalogCategoryAction(
    returnPath: string,
    params: SaveCatalogCategoryParams
  ): Promise<void> {
    try {
      await createCatalogCategory(params)
      revalidatePath('/admin/catalog')
      revalidatePath(returnPath)
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to create category'
      )
    }
    redirect(returnPath)
  }
  
  export async function updateCatalogCategoryAction(
    returnPath: string,
    params: UpdateCatalogCategoryParams
  ): Promise<void> {
    try {
      await updateCatalogCategory(params)
      revalidatePath('/admin/catalog')
      revalidatePath(returnPath)
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to update category'
      )
    }
    redirect(returnPath)
  }
  
  export async function deleteCatalogCategoryAction(
    id: string,
    returnPath: string
  ): Promise<void> {
    try {
      await deleteCatalogCategory(id)
      revalidatePath('/admin/catalog')
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to delete category'
      )
    }
    redirect(returnPath)
  }

export async function deleteProductAction(
  id: string,
  categoryId: string
): Promise<void> {
  try {
    await deleteProduct(id)
    revalidatePath(`/admin/catalog/${categoryId}`)
  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : 'Failed to delete product'
    )
  }

  redirect(`/admin/catalog/${categoryId}`)
}

export async function toggleProductActiveAction(
  id: string,
  isActive: boolean,
  categoryId: string
): Promise<void> {
  try {
    await toggleProductActive(id, isActive)
    revalidatePath(`/admin/catalog/${categoryId}`)
  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : 'Failed to toggle product status'
    )
  }
}

export async function createProductAction(
  returnPath: string,
  params: SaveProductParams,
  tagNames: string[],    // ← add this
  file?: File
): Promise<void> {
  try {
    let imageUrl = params.imageUrl
    let mediaType = params.mediaType

    if (file) {
      const result = await uploadMedia({ file, source: 'categories' })
      imageUrl = result.url
      mediaType = result.mediaType
    }

    // create product first to get id
    const { data, error } = await supabaseServer
      .from('products')
      .insert({
        category_id: params.categoryId,
        name: params.name,
        price: params.price,
        discount: params.discount,
        image_url: imageUrl ?? null,
        media_type: mediaType,
        stock: params.stock,
        display_order: params.displayOrder,
      })
      .select('id')
      .single()

    if (error) throw new DatabaseError(`Failed to create product: ${error.message}`)

    // sync tags after product created
    if (tagNames.length > 0) {
      await syncProductTags(data.id, tagNames)
    }

    revalidatePath(returnPath)

  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : 'Failed to create product'
    )
  }

  redirect(returnPath)
}

// update updateProductAction
export async function updateProductAction(
  returnPath: string,
  params: UpdateProductParams,
  tagNames: string[],    // ← add this
  file?: File
): Promise<void> {
  try {
    let imageUrl = params.imageUrl
    let mediaType = params.mediaType

    if (file) {
      const result = await uploadMedia({ file, source: 'categories' })
      imageUrl = result.url
      mediaType = result.mediaType
    }

    await updateProduct({ ...params, imageUrl, mediaType })

    // sync tags after product updated
    await syncProductTags(params.id, tagNames)

    revalidatePath(returnPath)

  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : 'Failed to update product'
    )
  }

  redirect(returnPath)
}