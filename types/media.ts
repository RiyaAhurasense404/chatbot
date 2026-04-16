export type MediaType = 'image' | 'video'
export type UploadSource = 'categories' | 'banners' | 'hero'
export type UploadField = 'primary' | 'background'

export interface UploadMediaParams {
  file: File
  source: UploadSource
  field?: UploadField
}

export interface UploadMediaResult {
  url: string
  mediaType: MediaType
  path: string
}