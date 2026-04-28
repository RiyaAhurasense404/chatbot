import type { SearchProductResult } from '@/types/search'

interface AdminProductSearchItemProps {
  product: SearchProductResult
  onSelect: (product: SearchProductResult) => void
}

export default function AdminProductSearchItem({
  product,
  onSelect,
}: AdminProductSearchItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
    >
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-14 w-14 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
          No image
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-gray-900">
            {product.name}
          </p>

          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
              product.isActive
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {product.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        <p className="mt-1 truncate text-xs text-gray-500">
          {product.categoryName ?? 'Uncategorized'}
        </p>

        <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
          <span>₹{product.finalPrice}</span>
          <span>Stock: {product.stock ?? 0}</span>
        </div>
      </div>
    </button>
  )
}