import { supabaseServer } from '@/lib/supabase'
import { Banner } from '@/types'
import { DatabaseError } from '@/utils/error'

export async function getBanners(): Promise<Banner[]> {
  const { data, error } = await supabaseServer
    .from('banners')
    .select('id, text, image_url, background_image_url, display_order')
    .order('display_order', { ascending: true })

  if (error) {
    throw new DatabaseError(`Failed to fetch banners: ${error.message}`)
  }

  return data ?? []
}