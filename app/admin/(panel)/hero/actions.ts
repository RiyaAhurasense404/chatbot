'use server'

import { requireAdminSession } from '@/lib/admin/session'
import { uploadMedia } from '@/lib/admin/uploadMedia'
import { updateHeroMedia } from '@/lib/db/admin/hero'
import { invalidateLandingCache } from '@/lib/admin/cacheInvalidator'
import { UpdateHeroMediaParams } from '@/types/admin'
import { DatabaseError } from '@/utils/error'

export async function updateHeroAction(
  params: UpdateHeroMediaParams,
  file?: File
): Promise<void> {
  await requireAdminSession()
  try {
    let backgroundImageUrl = params.backgroundImageUrl
    let backgroundMediaType = params.backgroundMediaType

    if (file) {
      const uploadResult = await uploadMedia({
        file,
        source: 'hero',
      })

      backgroundImageUrl = uploadResult.url
      backgroundMediaType = uploadResult.mediaType
    }

    await updateHeroMedia({
      backgroundImageUrl,
      backgroundMediaType,
    })

    await invalidateLandingCache()
  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : 'Failed to update hero'
    )
  }
}