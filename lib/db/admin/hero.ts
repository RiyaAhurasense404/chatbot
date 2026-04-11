import { supabaseServer } from '@/lib/supabase'
import { HeroContent } from '@/types'
import { DatabaseError } from '@/utils/error'

export async function getHeroContent(): Promise<HeroContent> {
  const { data, error } = await supabaseServer
    .from('hero_content')
    .select('background_image_url')
    .single()

  if (error) {
    throw new DatabaseError(`Failed to fetch hero content: ${error.message}`)
  }

  if (!data) {
    throw new DatabaseError('Hero content not found')
  }

  return data
}

