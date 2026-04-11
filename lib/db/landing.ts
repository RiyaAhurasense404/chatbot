import { supabaseServer } from '@/lib/supabase'
import { LandingPageData } from '@/types'
import { DatabaseError } from '@/utils/error'

export async function getLandingPageDataFromDB(): Promise<LandingPageData> {
  const { data, error } = await supabaseServer
    .rpc('get_landing_page_data')

  if (error) {
    throw new DatabaseError(`Failed to fetch landing page data: ${error.message}`)
  }

  return data as LandingPageData
}