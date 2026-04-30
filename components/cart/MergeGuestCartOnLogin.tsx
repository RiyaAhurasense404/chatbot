'use client'

import { useEffect, useRef } from 'react'
import { mergeGuestCartAction } from '@/lib/actions/cartActions'
import { clearGuestCart, getGuestCart } from '@/lib/utils/guestCart'

interface MergeGuestCartOnLoginProps {
  isLoggedIn: boolean
}

export default function MergeGuestCartOnLogin({
  isLoggedIn,
}: MergeGuestCartOnLoginProps) {
  const hasAttemptedMergeRef = useRef(false)

  useEffect(() => {
    if (!isLoggedIn || hasAttemptedMergeRef.current) {
      return
    }

    const guestCart = getGuestCart()

    if (guestCart.items.length === 0) {
      return
    }

    hasAttemptedMergeRef.current = true

    async function mergeCart() {
      const result = await mergeGuestCartAction(guestCart.items)

      if (!result.success) {
        console.error('Failed to merge guest cart:', result.message)
        hasAttemptedMergeRef.current = false
        return
      }

      clearGuestCart()

      window.dispatchEvent(
        new CustomEvent('cart-count-updated', {
          detail: { count: result.count ?? 0 },
        })
      )
    }

    void mergeCart()
  }, [isLoggedIn])

  return null
}