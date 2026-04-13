import { createClient } from '@supabase/supabase-js'
import { ConfigError } from '@/utils/error'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new ConfigError('NEXT_PUBLIC_SUPABASE_URL is missing from .env.local')
}

if (!supabaseServiceKey) {
  throw new ConfigError('SUPABASE_SERVICE_ROLE_KEY is missing from .env.local')
}

if (!supabaseAnonKey) {
  throw new ConfigError('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing from .env.local')
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  global: {
    fetch: fetch.bind(globalThis),
  },
})

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)