'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { uploadMedia } from '@/lib/admin/uploadMedia'
import { createCatalogCategory, updateCatalogCategory, deleteCatalogCategory } from '@/lib/db/admin/catalog'
import { createProduct, updateProduct, deleteProduct, toggleProductActive } from '@/lib/db/admin/products'
import { SaveCatalogCategoryParams, UpdateCatalogCategoryParams, SaveProductParams, UpdateProductParams } from '@/types'
import { DatabaseError } from '@/utils/error'

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

export async function createProductAction(
  returnPath: string,
  params: SaveProductParams,
  file?: File
): Promise<void> {
  try {
    let imageUrl = params.imageUrl
    let mediaType = params.mediaType

    if (file) {
      const result = await uploadMedia({ file, source: 'products' })
      imageUrl = result.url
      mediaType = result.mediaType
    }

    await createProduct({ ...params, imageUrl, mediaType })
    revalidatePath(returnPath)

  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : 'Failed to create product'
    )
  }

  redirect(returnPath)
}

export async function updateProductAction(
  returnPath: string,
  params: UpdateProductParams,
  file?: File
): Promise<void> {
  try {
    let imageUrl = params.imageUrl
    let mediaType = params.mediaType

    if (file) {
      const result = await uploadMedia({ file, source: 'products' })
      imageUrl = result.url
      mediaType = result.mediaType
    }

    await updateProduct({ ...params, imageUrl, mediaType })
    revalidatePath(returnPath)

  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : 'Failed to update product'
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