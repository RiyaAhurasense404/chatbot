'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { LogoutButtonProps } from '@/types/auth'

export default function LogoutButton({
  redirectTo = '/',
  className,
}: LogoutButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleLogout() {
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Logout error:', error.message)
        return
      }

      window.localStorage.removeItem('samatva_guest_cart')
      router.push(redirectTo)
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className={
        className ??
        'rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60'
      }
    >
      {isPending ? 'Logging out...' : 'Logout'}
    </button>
  )
}