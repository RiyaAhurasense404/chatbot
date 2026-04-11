import { supabaseServer } from '@/lib/supabase'
import { DatabaseError } from '@/utils/error'

export async function getLatestUpdatedAt(): Promise<string> {
  const { data, error } = await supabaseServer
    .rpc('get_latest_updated_at')

  if (error) {
    throw new DatabaseError(`Failed to fetch latest updated_at: ${error.message}`)
  }

  return data
}