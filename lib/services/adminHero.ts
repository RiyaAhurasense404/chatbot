export async function uploadHeroImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'hero')
  
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
  
  export async function saveHeroImage(imageUrl: string): Promise<void> {
    const response = await fetch('/api/admin/hero', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
    })
  
    const data = await response.json()
  
    if (!response.ok) {
      throw new Error(data.error || 'Save failed')
    }
  }