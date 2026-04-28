'use server'

import { requireAdminSession } from '@/lib/admin/session'
import { uploadMedia } from '@/lib/admin/uploadMedia'
import { createBanner, updateBanner, deleteBanner} from '@/lib/db/admin/banners'
import { invalidateLandingCache } from '@/lib/admin/cacheInvalidator'
import { SaveBannerParams, UpdateBannerParams } from '@/types/admin'
import { DatabaseError } from '@/utils/error'

export async function createBannerAction(
  params: SaveBannerParams,
  files?: {
    primaryFile?: File
    backgroundFile?: File
  }
): Promise<void> {
  await requireAdminSession()
  try {
    let imageUrl = params.imageUrl
    let mediaType = params.mediaType
    let backgroundImageUrl = params.backgroundImageUrl
    let backgroundMediaType = params.backgroundMediaType

    if (files?.primaryFile) {
      const uploadResult = await uploadMedia({
        file: files.primaryFile,
        source: 'banners',
        field: 'primary',
      })

      imageUrl = uploadResult.url
      mediaType = uploadResult.mediaType
    }

    if (files?.backgroundFile) {
      const uploadResult = await uploadMedia({
        file: files.backgroundFile,
        source: 'banners',
        field: 'background',
      })

      backgroundImageUrl = uploadResult.url
      backgroundMediaType = uploadResult.mediaType
    }

    await createBanner({
      ...params,
      imageUrl,
      mediaType,
      backgroundImageUrl,
      backgroundMediaType,
    })

    await invalidateLandingCache()
  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : 'Failed to create banner'
    )
  }
}

export async function updateBannerAction(
  params: UpdateBannerParams,
  files?: {
    primaryFile?: File
    backgroundFile?: File
  }
): Promise<void> {
  await requireAdminSession()
  try {
    let imageUrl = params.imageUrl
    let mediaType = params.mediaType
    let backgroundImageUrl = params.backgroundImageUrl
    let backgroundMediaType = params.backgroundMediaType

    if (files?.primaryFile) {
      const uploadResult = await uploadMedia({
        file: files.primaryFile,
        source: 'banners',
        field: 'primary',
      })

      imageUrl = uploadResult.url
      mediaType = uploadResult.mediaType
    }

    if (files?.backgroundFile) {
      const uploadResult = await uploadMedia({
        file: files.backgroundFile,
        source: 'banners',
        field: 'background',
      })

      backgroundImageUrl = uploadResult.url
      backgroundMediaType = uploadResult.mediaType
    }

    await updateBanner({
      ...params,
      imageUrl,
      mediaType,
      backgroundImageUrl,
      backgroundMediaType,
    })

    await invalidateLandingCache()
  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : 'Failed to update banner'
    )
  }
}

export async function deleteBannerAction(id: string): Promise<void> {
  await requireAdminSession()
  try {
    await deleteBanner(id)
    await invalidateLandingCache()
  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : 'Failed to delete banner'
    )
  }
}