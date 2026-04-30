'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { clearCartAction } from '@/lib/actions/cartActions'

export default function ClearCartButton() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleClearCart() {
    startTransition(async () => {
      const result = await clearCartAction()

      if (typeof result.count === 'number') {
        window.dispatchEvent(
          new CustomEvent('cart-count-updated', {
            detail: { count: result.count },
          })
        )
      }

      if (result.success) {
        router.refresh()
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleClearCart}
      disabled={isPending}
      className="text-sm font-semibold text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? 'Clearing...' : 'Clear cart'}
    </button>
  )
}