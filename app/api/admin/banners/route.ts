import { getAllBanners, createBanner } from '@/lib/db/admin/banners'
import { invalidateLandingCache } from '@/lib/admin/cacheInvalidator'
import { handleApiError, ValidationError } from '@/utils/error'

export async function GET(): Promise<Response> {
  try {
    const banners = await getAllBanners()
    return Response.json({ banners }, { status: 200 })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request): Promise<Response> {
  try {

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

    await createBanner(
      text.trim(),
      imageUrl.trim(),
      backgroundImageUrl.trim(),
      displayOrder
    )

    await invalidateLandingCache()

    return Response.json(
      { message: 'Banner created successfully' },
      { status: 201 }
    )

  } catch (error) {
    return handleApiError(error)
  }
}