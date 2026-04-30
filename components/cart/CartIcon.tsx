'use client'

import Link from 'next/link'
import { memo, useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { getCartCountAction } from '@/lib/actions/cartActions'
import { getGuestCartCount } from '@/lib/utils/guestCart'
import type { CartIconProps } from '@/types/cartUi'

function CartIcon({
  isLoggedIn,
  href = '/cart',
  className,
}: CartIconProps) {
  const [count, setCount] = useState(0)
  const [isPending, startTransition] = useTransition()

  const requestIdRef = useRef(0)

  const updateCount = useCallback((nextCount: number) => {
    setCount((currentCount) => {
      if (currentCount === nextCount) {
        return currentCount
      }

      return nextCount
    })
  }, [])

  const loadCartCount = useCallback(() => {
    if (!isLoggedIn) {
      updateCount(getGuestCartCount())
      return
    }

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    startTransition(async () => {
      const result = await getCartCountAction()

      if (requestIdRef.current !== requestId) {
        return
      }

      updateCount(result.count ?? 0)
    })
  }, [isLoggedIn, updateCount])

  useEffect(() => {
    loadCartCount()

    function handleGuestCartUpdated() {
      if (!isLoggedIn) {
        updateCount(getGuestCartCount())
      }
    }

    function handleCartCountUpdated(event: Event) {
      const customEvent = event as CustomEvent<{ count?: number }>

      if (typeof customEvent.detail?.count === 'number') {
        updateCount(customEvent.detail.count)
        return
      }

      loadCartCount()
    }

    window.addEventListener('guest-cart-updated', handleGuestCartUpdated)
    window.addEventListener('cart-count-updated', handleCartCountUpdated)

    return () => {
      window.removeEventListener('guest-cart-updated', handleGuestCartUpdated)
      window.removeEventListener('cart-count-updated', handleCartCountUpdated)
    }
  }, [isLoggedIn, loadCartCount, updateCount])

  return (
    <Link
      href={href}
      className={
        className ??
        'relative inline-flex items-center justify-center text-white transition hover:text-blue-400'
      }
      aria-label={`Cart with ${count} items`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM9 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
        />
      </svg>

      {count > 0 ? (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold leading-none text-white">
          {count > 99 ? '99+' : count}
        </span>
      ) : null}

      {isPending ? (
        <span className="sr-only">Loading cart count</span>
      ) : null}
    </Link>
  )
}

export default memo(CartIcon)