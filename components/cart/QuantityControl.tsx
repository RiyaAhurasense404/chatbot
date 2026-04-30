'use client'

import { useTransition } from 'react'
import {
  decrementCartItemAction,
  incrementCartItemAction,
  removeCartItemAction,
} from '@/lib/actions/cartActions'
import { QuantityControlProps } from '@/types/cartUi'



export default function QuantityControl({
  productId,
  quantity,
  onUpdated,
}: QuantityControlProps) {
  const [isPending, startTransition] = useTransition()

  function dispatchCountUpdate(count?: number) {
    if (typeof count !== 'number') return

    window.dispatchEvent(
      new CustomEvent('cart-count-updated', {
        detail: { count },
      })
    )

    onUpdated?.(count)
  }

  function handleIncrement() {
    startTransition(async () => {
      const result = await incrementCartItemAction(productId)
      dispatchCountUpdate(result.count)
    })
  }

  function handleDecrement() {
    startTransition(async () => {
      const result = await decrementCartItemAction(productId)
      dispatchCountUpdate(result.count)
    })
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await removeCartItemAction(productId)
      dispatchCountUpdate(result.count)
    })
  }

  return (
    <div className="flex items-center gap-2">
      {quantity <= 1 ? (
        <button
          type="button"
          onClick={handleRemove}
          disabled={isPending}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Remove item"
        >
          🗑
        </button>
      ) : (
        <button
          type="button"
          onClick={handleDecrement}
          disabled={isPending}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Decrease quantity"
        >
          -
        </button>
      )}

      <span className="min-w-8 text-center text-sm font-semibold text-gray-900">
        {quantity}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={isPending}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}