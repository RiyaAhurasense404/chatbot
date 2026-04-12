import { getHero, updateHeroImage } from '@/lib/db/admin/hero'
import { invalidateLandingCache } from '@/lib/admin/cacheInvalidator'
import { handleApiError, ValidationError } from '@/utils/error'

export async function GET(): Promise<Response> {
  try {
    const hero = await getHero()
    return Response.json({ hero }, { status: 200 })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: Request): Promise<Response> {
  try {

    let body: { imageUrl: string }
    try {
      body = await request.json()
    } catch {
      throw new ValidationError('Invalid JSON in request body')
    }

    const { imageUrl } = body

    if (!imageUrl || imageUrl.trim() === '') {
      throw new ValidationError('Image URL is required')
    }

    await updateHeroImage(imageUrl.trim())
    await invalidateLandingCache()

    return Response.json(
      { message: 'Hero image updated successfully' },
      { status: 200 }
    )

  } catch (error) {
    return handleApiError(error)
  }
}