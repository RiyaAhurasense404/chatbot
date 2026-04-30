import Image from 'next/image'
import QuantityControl from './QuantityControl'
import type { CartItemResponse } from '@/types/cart'

interface CartItemRowProps {
  item: CartItemResponse
}

export default function CartItemRow({ item }: CartItemRowProps) {
  return (
    <div className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
        {item.productImage ? (
          <Image
            src={item.productImage}
            alt={item.productName}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            No image
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="truncate text-base font-semibold text-gray-900">
              {item.productName}
            </h3>

            {!item.isAvailable ? (
              <p className="mt-1 text-sm font-medium text-red-600">
                This item is currently unavailable.
              </p>
            ) : null}

            {item.hasPriceChanged ? (
              <p className="mt-1 text-sm text-amber-600">
                Price changed since you added this item.
              </p>
            ) : null}

            <p className="mt-2 text-sm text-gray-500">
              Stock: {item.stock}
            </p>
          </div>

          <div className="text-right">
            <p className="text-base font-semibold text-gray-900">
              ₹{item.itemSubtotal}
            </p>
            <p className="text-sm text-gray-500">
              ₹{item.latestFinalPrice} each
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <QuantityControl
            productId={item.productId}
            quantity={item.quantity}
          />
        </div>
      </div>
    </div>
  )
}