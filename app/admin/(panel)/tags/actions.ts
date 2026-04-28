'use server'

import { requireAdminSession } from '@/lib/admin/session'
import { revalidatePath } from 'next/cache'
import { deleteTag, syncProductTags, getTagProducts } from '@/lib/db/admin/tags'
import { DatabaseError } from '@/utils/error'

export async function deleteTagAction(id: string): Promise<void> {
  await requireAdminSession()
  try {
    await deleteTag(id)
    revalidatePath('/admin/tags')
    revalidatePath('/admin/catalog')
  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : 'Failed to delete tag'
    )
  }
}

export async function syncProductTagsAction(
  productId: string,
  tagNames: string[]
): Promise<void> {
  await requireAdminSession()
  try {
    await syncProductTags(productId, tagNames)
    revalidatePath('/admin/tags')
  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : 'Failed to sync tags'
    )
  }
}

