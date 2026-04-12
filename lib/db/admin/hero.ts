import { supabaseServer } from '@/lib/supabase'
import { DatabaseError } from '@/utils/error'

export async function getHero(): Promise<{ id: string; background_image_url: string }> {
  const { data, error } = await supabaseServer
    .from('hero_content')
    .select('id, background_image_url')
    .single()

  if (error) {
    throw new DatabaseError(`Failed to fetch hero: ${error.message}`)
  }

  return data
}

export async function updateHeroImage(imageUrl: string): Promise<void> {
  const { error } = await supabaseServer
    .from('hero_content')
    .update({ background_image_url: imageUrl })
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (error) {
    throw new DatabaseError(`Failed to update hero image: ${error.message}`)
  }
}