import { supabaseServer } from '@/lib/supabase'
import { HeroContent } from '@/types'
import { DatabaseError } from '@/utils/error'
import { UpdateHeroMediaParams } from '@/types/admin'

export async function getHero(): Promise<HeroContent> {
  const { data, error } = await supabaseServer
    .from('hero_content')
    .select('id, background_image_url, background_media_type')
    .single()

  if (error) {
    throw new DatabaseError(`Failed to fetch hero: ${error.message}`)
  }

  return data
}

export async function updateHeroMedia({
  backgroundImageUrl,
  backgroundMediaType,
}: UpdateHeroMediaParams): Promise<void> {
  const { error } = await supabaseServer
    .from('hero_content')
    .update({
      background_image_url: backgroundImageUrl,
      background_media_type: backgroundMediaType,
    })
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (error) {
    throw new DatabaseError(`Failed to update hero media: ${error.message}`)
  }
}