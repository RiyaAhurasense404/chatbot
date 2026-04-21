'use server'

import { randomUUID } from 'crypto'
import { supabaseServer } from '@/lib/supabase'
import { DatabaseError } from '@/utils/error'
import {
  MediaType,
  UploadField,
  UploadMediaParams,
  UploadMediaResult,
} from '@/types/media'

const MEDIA_RULES: Record<MediaType, { maxSize: number; mimeTypes: Set<string> }> = {
  image: {
    maxSize: 5 * 1024 * 1024,
    mimeTypes: new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  },
  video: {
    maxSize: 50 * 1024 * 1024,
    mimeTypes: new Set(['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v']),
  },
}

function resolveMediaType(file: File): MediaType {
  if (MEDIA_RULES.image.mimeTypes.has(file.type)) {
    return 'image'
  }

  if (MEDIA_RULES.video.mimeTypes.has(file.type)) {
    return 'video'
  }

  throw new DatabaseError('Unsupported file type. Only image and video are allowed.')
}

function validateMediaFile(file: File, mediaType: MediaType): void {
  const rule = MEDIA_RULES[mediaType]

  if (file.size > rule.maxSize) {
    throw new DatabaseError(
      mediaType === 'image'
        ? 'Image must be under 5MB.'
        : 'Video must be under 50MB.'
    )
  }
}

function resolveFolder(source: UploadMediaParams['source'], field: UploadField): string {
  if (source === 'banners' && field === 'background') {
    return 'banners/background'
  }

  return source
}

function resolveExtension(file: File): string {
  const nameExtension = file.name.includes('.') ? file.name.split('.').pop() : ''
  const mimeExtension = file.type.split('/')[1] || ''
  const extension = nameExtension || mimeExtension

  return extension ? `.${extension.replace(/^x-/, '')}` : ''
}

function buildFilePath(
  source: UploadMediaParams['source'],
  field: UploadField,
  file: File
): string {
  const folder = resolveFolder(source, field)
  const extension = resolveExtension(file)

  return `${folder}/${Date.now()}-${randomUUID()}${extension}`
}

async function uploadToStorage(file: File, filePath: string) {
  const arrayBuffer = await file.arrayBuffer()

  const { data, error } = await supabaseServer.storage
    .from('landing-images')
    .upload(filePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    throw new DatabaseError(`Failed to upload media: ${error.message}`)
  }

  return data
}

function getPublicUrl(path: string): string {
  const { data } = supabaseServer.storage
    .from('landing-images')
    .getPublicUrl(path)

  return data.publicUrl
}

export async function uploadMedia({
  file,
  source,
  field = 'primary',
}: UploadMediaParams): Promise<UploadMediaResult> {
  if (!(file instanceof File) || file.size === 0) {
    throw new DatabaseError('Valid file is required.')
  }

  const mediaType = resolveMediaType(file)
  validateMediaFile(file, mediaType)

  const filePath = buildFilePath(source, field, file)
  const uploaded = await uploadToStorage(file, filePath)

  return {
    url: getPublicUrl(uploaded.path),
    mediaType,
    path: uploaded.path,
  }
}