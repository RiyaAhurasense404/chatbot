import { supabaseServer } from '@/lib/supabase'
import { Banner } from '@/types'
import { DatabaseError } from '@/utils/error'

export async function getAllBanners(): Promise<Banner[]> {
  const { data, error } = await supabaseServer
    .from('banners')
    .select('id, text, image_url, background_image_url, display_order')
    .order('display_order', { ascending: true })

  if (error) {
    throw new DatabaseError(`Failed to fetch banners: ${error.message}`)
  }

  return data ?? []
}

export async function getBannerById(id: string): Promise<Banner | null> {
  const { data, error } = await supabaseServer
    .from('banners')
    .select('id, text, image_url, background_image_url, display_order')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new DatabaseError(`Failed to fetch banner: ${error.message}`)
  }

  return data
}

export async function createBanner(
  text: string,
  imageUrl: string,
  backgroundImageUrl: string,
  displayOrder: number
): Promise<void> {
  const { error } = await supabaseServer
    .from('banners')
    .insert({
      text,
      image_url: imageUrl,
      background_image_url: backgroundImageUrl,
      display_order: displayOrder,
    })

  if (error) {
    throw new DatabaseError(`Failed to create banner: ${error.message}`)
  }
}

export async function updateBanner(
  id: string,
  text: string,
  imageUrl: string,
  backgroundImageUrl: string,
  displayOrder: number
): Promise<void> {
  const { error } = await supabaseServer
    .from('banners')
    .update({
      text,
      image_url: imageUrl,
      background_image_url: backgroundImageUrl,
      display_order: displayOrder,
    })
    .eq('id', id)

  if (error) {
    throw new DatabaseError(`Failed to update banner: ${error.message}`)
  }
}

export async function deleteBanner(id: string): Promise<void> {
  const { error } = await supabaseServer
    .from('banners')
    .delete()
    .eq('id', id)

  if (error) {
    throw new DatabaseError(`Failed to delete banner: ${error.message}`)
  }
}