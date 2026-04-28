import type { SearchProductResult } from '@/types/search'

interface SearchProductItemProps {
  product: SearchProductResult
  onSelect: (productId: string, productName: string) => void
}

export default function SearchProductItem({
  product,
  onSelect,
}: SearchProductItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product.id, product.name)}
      className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-white/5"
    >
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-12 w-12 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-xs text-white/40">
          No image
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">
          {product.name}
        </p>

        <p className="truncate text-xs text-white/50">
          {product.categoryName ?? 'Uncategorized'}
        </p>

        <div className="mt-1 flex items-center gap-2">
          <p className="text-sm font-semibold text-white">
            ₹{product.finalPrice}
          </p>

          {product.discount > 0 && (
            <p className="text-xs text-white/40 line-through">
              ₹{product.price}
            </p>
          )}
        </div>
      </div>
    </button>
  )
}