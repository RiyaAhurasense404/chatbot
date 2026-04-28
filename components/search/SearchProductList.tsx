import type { SearchProductResult } from '@/types/search'
import SearchProductItem from './SearchProductItem'

interface SearchProductListProps {
  products: SearchProductResult[]
  onSelect: (productId: string, productName: string) => void
}

export default function SearchProductList({
  products,
  onSelect,
}: SearchProductListProps) {
  if (products.length === 0) {
    return null
  }

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">
        Products
      </p>

      <div className="space-y-2">
        {products.map((product) => (
          <SearchProductItem
            key={product.id}
            product={product}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}