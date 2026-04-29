import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import ProfileMenuClient from './ProfileMenuClient'

export default async function ProfileMenu() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const displayName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email ??
    'User'

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-white hover:text-blue-400 transition-colors"
        aria-label="Login"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z"
          />
        </svg>
      </Link>
    )
  }

  return (
    <ProfileMenuClient
      displayName={displayName}
      email={user.email ?? null}
    />
  )
}