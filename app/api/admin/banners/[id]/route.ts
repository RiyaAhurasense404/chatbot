import { getBannerById, updateBanner, deleteBanner } from '@/lib/db/admin/banners'
import { invalidateLandingCache } from '@/lib/admin/cacheInvalidator'
import { handleApiError, ValidationError } from '@/utils/error'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params

    if (!id) {
      throw new ValidationError('Banner id is required')
    }

    const banner = await getBannerById(id)

    if (!banner) {
      return Response.json(
        { error: 'Banner not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    return Response.json({ banner }, { status: 200 })

  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params

    if (!id) {
      throw new ValidationError('Banner id is required')
    }

    let body: {
      text: string
      imageUrl: string
      backgroundImageUrl: string
      displayOrder: number
    }

    try {
      body = await request.json()
    } catch {
      throw new ValidationError('Invalid JSON in request body')
    }

    const { text, imageUrl, backgroundImageUrl, displayOrder } = body

    if (!text || text.trim() === '') {
      throw new ValidationError('Banner text is required')
    }

    if (!imageUrl || imageUrl.trim() === '') {
      throw new ValidationError('Image URL is required')
    }

    if (!backgroundImageUrl || backgroundImageUrl.trim() === '') {
      throw new ValidationError('Background image URL is required')
    }

    if (!displayOrder || isNaN(displayOrder)) {
      throw new ValidationError('Display order is required')
    }

    const existing = await getBannerById(id)
    if (!existing) {
      return Response.json(
        { error: 'Banner not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    await updateBanner(
      id,
      text.trim(),
      imageUrl.trim(),
      backgroundImageUrl.trim(),
      displayOrder
    )

    await invalidateLandingCache()

    return Response.json(
      { message: 'Banner updated successfully' },
      { status: 200 }
    )

  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params

    if (!id) {
      throw new ValidationError('Banner id is required')
    }

    const existing = await getBannerById(id)
    if (!existing) {
      return Response.json(
        { error: 'Banner not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    await deleteBanner(id)
    await invalidateLandingCache()

    return Response.json(
      { message: 'Banner deleted successfully' },
      { status: 200 }
    )

  } catch (error) {
    return handleApiError(error)
  }
}