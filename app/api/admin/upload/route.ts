import { supabaseServer } from '@/lib/supabase'
import { handleApiError, ValidationError, DatabaseError } from '@/utils/error'

export async function POST(request: Request): Promise<Response> {
  try {

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = formData.get('folder') as string | null

    if (!file) {
      throw new ValidationError('No file provided')
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      throw new ValidationError('Only JPEG PNG and WebP images are allowed')
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      throw new ValidationError('File size must be less than 5MB')
    }

    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const fileName = folder
      ? `${folder}/${timestamp}.${extension}`
      : `${timestamp}.${extension}`

    // convert file to buffer
    const stream = file.stream()
    const chunks: Uint8Array[] = []
    const reader = stream.getReader()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }

    const buffer = Buffer.concat(chunks)

    // use buffer not bytes
    const { data, error } = await supabaseServer.storage
      .from('landing-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      throw new DatabaseError(`Failed to upload image: ${error.message}`)
    }

    const { data: urlData } = supabaseServer.storage
      .from('landing-images')
      .getPublicUrl(data.path)

    return Response.json(
      { url: urlData.publicUrl },
      { status: 201 }
    )

  } catch (error) {
    return handleApiError(error)
  }
}