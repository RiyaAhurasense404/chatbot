'use server'

import { requireAdminSession } from '@/lib/admin/session'
import { uploadMedia } from '@/lib/admin/uploadMedia'
import{ createCategory, updateCategory, deleteCategory,} from '@/lib/db/admin/categories'
import { invalidateLandingCache } from '@/lib/admin/cacheInvalidator'
import { SaveCategoryParams, UpdateCategoryParams} from '@/types/admin'
import { DatabaseError } from '@/utils/error'

export async function createCategoryAction(
    params: SaveCategoryParams,
    file?: File
): Promise<void> {
    await requireAdminSession()
    try {
        let imageUrl = params.imageUrl
        let mediaType = params.mediaType

        if (file) {
            const uploadResult = await uploadMedia({
                file,
                source: 'categories',
            })

            imageUrl = uploadResult.url
            mediaType = uploadResult.mediaType
        }

        await createCategory({
            ...params,
            imageUrl,
            mediaType,
        })

        await invalidateLandingCache()
    } catch (error) {
        throw new DatabaseError(
            error instanceof Error ? error.message : 'Failed to create category'
        )
    }
}

export async function updateCategoryAction(
    params: UpdateCategoryParams,
    file?: File
): Promise<void> {
    await requireAdminSession()
    try {
        let imageUrl = params.imageUrl
        let mediaType = params.mediaType

        if (file) {
            const uploadResult = await uploadMedia({
                file,
                source: 'categories',
            })

            imageUrl = uploadResult.url
            mediaType = uploadResult.mediaType
        }

        await updateCategory({
            ...params,
            imageUrl,
            mediaType,
        })

        await invalidateLandingCache()
    } catch (error) {
        throw new DatabaseError(
            error instanceof Error ? error.message : 'Failed to update category'
        )
    }
}

export async function deleteCategoryAction(id: string): Promise<void> {
    await requireAdminSession()
    try {
        await deleteCategory(id)

        await invalidateLandingCache()
    } catch (error) {
        throw new DatabaseError(
            error instanceof Error ? error.message : 'Failed to delete category'
        )
    }
}