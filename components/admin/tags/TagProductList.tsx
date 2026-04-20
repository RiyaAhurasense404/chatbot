'use client'

import { useState } from 'react'
import Link from 'next/link'
import {TagProductListProps} from '../../../types'

export default function TagProductList({
  productCount,
  products,
}: TagProductListProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (productCount === 0) {
    return (
      <span className="text-sm text-gray-400 font-poppins">
        0 products
      </span>
    )
  }

  return (
    <div>
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="text-sm text-blue-500 hover:text-blue-600 font-poppins inline-flex items-center gap-1"
      >
        {productCount} product{productCount > 1 ? 's' : ''}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-2 ml-2 flex flex-col gap-1 border-l-2 border-gray-100 pl-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/admin/catalog/${product.category_id}/products/${product.id}/edit`}
              className="text-xs text-gray-600 hover:text-blue-500 font-poppins transition-colors inline-flex items-center gap-1"
            >
              <span>•</span>
              {product.name}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}