'use client'

import { useTransition } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { getAuthCallbackUrl } from '@/lib/utils/siteUrl'
import type { GoogleLoginButtonProps } from '@/types/auth'

export default function GoogleLoginButton({
  next = '/',
}: GoogleLoginButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleGoogleLogin() {
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient()

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getAuthCallbackUrl(next),
        },
      })

      if (error) {
        console.error('Google login error:', error.message)
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={isPending}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? 'Redirecting...' : 'Continue with Google'}
    </button>
  )
}
