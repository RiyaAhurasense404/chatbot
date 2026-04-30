'use client'

import { useState, useTransition } from 'react'
import { addToCartAction } from '@/lib/actions/cartActions'
import { addGuestCartItem, getGuestCartCount } from '@/lib/utils/guestCart'
import type { AddToCartButtonProps } from '@/types/cartUi'
import type { CartActionResult } from '@/types/cart'

export default function AddToCartButton({
  productId,
  quantity = 1,
  isLoggedIn,
  className,
  children = 'Add to Cart',
  onCartUpdated,
}: AddToCartButtonProps) {
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleAddToCart() {
    setMessage(null)

    startTransition(async () => {
      try {
        if (!isLoggedIn) {
          addGuestCartItem({
            productId,
            quantity,
          })

          const count = getGuestCartCount()

          const result: CartActionResult = {
            success: true,
            message: 'Product added to cart.',
            count,
          }

          setMessage(result.message)
          onCartUpdated?.(result)

          window.dispatchEvent(
            new CustomEvent('cart-count-updated', {
              detail: {
                count,
              },
            })
          )

          return
        }

        const result = await addToCartAction({
          productId,
          quantity,
        })

        setMessage(result.message)
        onCartUpdated?.(result)

        if (result.success && typeof result.count === 'number') {
          window.dispatchEvent(
            new CustomEvent('cart-count-updated', {
              detail: {
                count: result.count,
              },
            })
          )
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to add product to cart.'

        setMessage(errorMessage)
      }
    })
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isPending}
        className={
          className ??
          'rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60'
        }
      >
        {isPending ? 'Adding...' : children}
      </button>

      {message ? (
        <p className="mt-2 text-xs text-gray-600">
          {message}
        </p>
      ) : null}
    </div>
  )
}