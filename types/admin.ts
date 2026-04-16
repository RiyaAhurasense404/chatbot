import { MediaType } from './media'

export interface SaveCategoryParams {
  name: string
  imageUrl: string
  mediaType: MediaType
  displayOrder: number
  size: 'large' | 'small'
}

export interface UpdateCategoryParams extends SaveCategoryParams {
  id: string
}

export interface SaveBannerParams {
  text: string
  imageUrl: string
  mediaType: MediaType
  backgroundImageUrl: string
  backgroundMediaType: MediaType
  displayOrder: number
}

export interface UpdateBannerParams extends SaveBannerParams {
  id: string
}

export interface UpdateHeroMediaParams {
  backgroundImageUrl: string
  backgroundMediaType: MediaType
}