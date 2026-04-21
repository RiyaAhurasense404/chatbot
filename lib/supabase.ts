import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabaseServer: SupabaseClient | null = null
let _supabaseClient: SupabaseClient | null = null

const url = process.env.NEXT_PUBLIC_SUPABASE_URL

export function getSupabaseServer(): SupabaseClient {
  if (_supabaseServer) return _supabaseServer

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing from .env.local')
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing from .env.local')

  _supabaseServer = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      fetch: fetch.bind(globalThis),
    },
  })

  return _supabaseServer
}

export function getSupabaseClient(): SupabaseClient {
  if (_supabaseClient) return _supabaseClient

  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing from .env.local')
  if (!key) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing from .env.local')

  _supabaseClient = createClient(url, key)
  return _supabaseClient
}

export const supabaseServer = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getSupabaseServer() as any)[prop]
  }
})

export const supabaseClient = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getSupabaseClient() as any)[prop]
  }
})