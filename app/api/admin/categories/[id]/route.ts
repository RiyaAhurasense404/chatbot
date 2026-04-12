import { getCategoryById, updateCategory, deleteCategory } from '@/lib/db/admin/categories'
import { invalidateLandingCache } from '@/lib/admin/cacheInvalidator'
import { handleApiError, ValidationError } from '@/utils/error'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params

    if (!id) {
      throw new ValidationError('Category id is required')
    }

    const category = await getCategoryById(id)

    if (!category) {
      return Response.json(
        { error: 'Category not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    return Response.json({ category }, { status: 200 })

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
      throw new ValidationError('Category id is required')
    }

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

    const existing = await getCategoryById(id)
    if (!existing) {
      return Response.json(
        { error: 'Category not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    await updateCategory(
      id,
      name.trim(),
      imageUrl.trim(),
      displayOrder,
      size
    )

    await invalidateLandingCache()

    return Response.json(
      { message: 'Category updated successfully' },
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
      throw new ValidationError('Category id is required')
    }

    const existing = await getCategoryById(id)
    if (!existing) {
      return Response.json(
        { error: 'Category not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    await deleteCategory(id)
    await invalidateLandingCache()

    return Response.json(
      { message: 'Category deleted successfully' },
      { status: 200 }
    )

  } catch (error) {
    return handleApiError(error)
  }
}