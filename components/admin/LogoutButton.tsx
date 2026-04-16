'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { logoutAction } from '@/app/admin/(auth)/logout/actions'

export default function LogoutButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logoutAction()
        router.push('/admin/login')
        router.refresh()
      } catch (error) {
        console.error('Logout failed:', error)
      }
    })
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
    >
      {isPending ? 'Logging out...' : 'Logout'}
    </button>
  )
}