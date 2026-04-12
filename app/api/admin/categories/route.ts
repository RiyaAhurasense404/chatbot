import { getAllCategories, createCategory } from '@/lib/db/admin/categories'
import { invalidateLandingCache } from '@/lib/admin/cacheInvalidator'
import { handleApiError, ValidationError } from '@/utils/error'

export async function GET(): Promise<Response> {
  try {
    const categories = await getAllCategories()
    return Response.json({ categories }, { status: 200 })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request): Promise<Response> {
  try {

    let body: {
      name: string
      imageUrl: string
      displayOrder: number
      size: 'large' | 'small'
    }

    try {
      body = await request.json()
    } catch {
      throw new ValidationError('Invalid JSON in request body')
    }

    const { name, imageUrl, displayOrder, size } = body

    if (!name || name.trim() === '') {
      throw new ValidationError('Category name is required')
    }

    if (!imageUrl || imageUrl.trim() === '') {
      throw new ValidationError('Image URL is required')
    }

    if (!displayOrder || isNaN(displayOrder)) {
      throw new ValidationError('Display order is required')
    }

    if (!size || !['large', 'small'].includes(size)) {
      throw new ValidationError('Size must be large or small')
    }

    await createCategory(
      name.trim(),
      imageUrl.trim(),
      displayOrder,
      size
    )

    await invalidateLandingCache()

    return Response.json(
      { message: 'Category created successfully' },
      { status: 201 }
    )

  } catch (error) {
    return handleApiError(error)
  }
}