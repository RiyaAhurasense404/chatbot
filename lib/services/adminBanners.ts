import { Banner } from '@/types'

export async function uploadBannerImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', 'banners')

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

export async function saveBanner(
  text: string,
  imageUrl: string,
  backgroundImageUrl: string,
  displayOrder: number
): Promise<void> {
  const response = await fetch('/api/admin/banners', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, imageUrl, backgroundImageUrl, displayOrder }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create banner')
  }
}

export async function updateBanner(
  id: string,
  text: string,
  imageUrl: string,
  backgroundImageUrl: string,
  displayOrder: number
): Promise<void> {
  const response = await fetch(`/api/admin/banners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, imageUrl, backgroundImageUrl, displayOrder }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update banner')
  }
}

export async function deleteBanner(id: string): Promise<void> {
  const response = await fetch(`/api/admin/banners/${id}`, {
    method: 'DELETE',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete banner')
  }
}