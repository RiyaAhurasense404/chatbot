import { Category } from '@/types'

export async function uploadCategoryImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', 'categories')

  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Upload failed')
  }

  return data.url
}

export async function saveCategory(
  name: string,
  imageUrl: string,
  displayOrder: number,
  size: 'large' | 'small'
): Promise<void> {
  const response = await fetch('/api/admin/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, imageUrl, displayOrder, size }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create category')
  }
}

export async function updateCategory(
  id: string,
  name: string,
  imageUrl: string,
  displayOrder: number,
  size: 'large' | 'small'
): Promise<void> {
  const response = await fetch(`/api/admin/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, imageUrl, displayOrder, size }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update category')
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const response = await fetch(`/api/admin/categories/${id}`, {
    method: 'DELETE',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete category')
  }
}