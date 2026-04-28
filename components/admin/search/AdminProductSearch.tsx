'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { adminSearchProductsAction } from '@/app/admin/(panel)/search/actions'
import { useDebounce } from '@/hooks/useDebounce'
import type { SearchApiResponse, SearchProductResult } from '@/types/search'
import AdminProductSearchItem from './AdminProductSearchItem'

const EMPTY_ADMIN_SEARCH_RESPONSE: SearchApiResponse = {
  query: '',
  source: 'meilisearch',
  total: 0,
  suggestions: [],
  products: [],
}

export default function AdminProductSearch() {
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<SearchApiResponse>(
    EMPTY_ADMIN_SEARCH_RESPONSE
  )

  const [isPending, startTransition] = useTransition()
  const debouncedQuery = useDebounce(query, 300)
  const trimmedQuery = query.trim()

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!searchRef.current) return

      if (!searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    const searchQuery = debouncedQuery.trim()

    if (searchQuery.length < 3) {
      setData(EMPTY_ADMIN_SEARCH_RESPONSE)
      setError(null)
      return
    }

    startTransition(async () => {
      try {
        setError(null)
        const result = await adminSearchProductsAction(searchQuery)
        setData(result)
      } catch (searchError) {
        setData(EMPTY_ADMIN_SEARCH_RESPONSE)
        setError(
          searchError instanceof Error
            ? searchError.message
            : 'Failed to search products'
        )
      }
    })
  }, [debouncedQuery])

  function openProduct(product: SearchProductResult) {
    setIsOpen(false)
    setQuery('')
    router.push(`/admin/products/${product.id}`)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <div className="flex items-center rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products by name, tag, or category..."
          className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
        />
      </div>

      {isOpen && trimmedQuery.length >= 3 ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-3 shadow-xl">
          {isPending ? (
            <p className="px-2 py-3 text-sm text-gray-500">Searching...</p>
          ) : null}

          {error ? (
            <p className="px-2 py-3 text-sm text-red-500">{error}</p>
          ) : null}

          {!isPending && !error && data.products.length > 0 ? (
            <div className="space-y-2">
              {data.products.map((product) => (
                <AdminProductSearchItem
                  key={product.id}
                  product={product}
                  onSelect={openProduct}
                />
              ))}
            </div>
          ) : null}

          {!isPending && !error && data.products.length === 0 ? (
            <p className="px-2 py-3 text-sm text-gray-500">
              No products found for “{data.query || trimmedQuery}”
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}