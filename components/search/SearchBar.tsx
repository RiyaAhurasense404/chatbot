'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'
import { useSearch } from '@/hooks/useSearch'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import SearchDropdown from './SearchDropdown'

export default function SearchBar() {
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const debouncedQuery = useDebounce(query, 300)
  const { data, isLoading, error } = useSearch(debouncedQuery)

  const {
    history,
    addSearchHistory,
    removeSearchHistory,
    clearSearchHistory,
  } = useSearchHistory()

  const trimmedQuery = query.trim()
  const showHistory = isOpen && trimmedQuery.length < 3 && history.length > 0
  const showSearchResults = isOpen && trimmedQuery.length >= 3

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

  function closeSearch() {
    setIsOpen(false)
    setQuery('')
  }

  function selectQuery(nextQuery: string, shouldSave = false) {
    if (shouldSave) {
      addSearchHistory(nextQuery)
    }

    setQuery(nextQuery)
    setIsOpen(true)
  }

  function selectProduct(productId: string, productName: string) {
    addSearchHistory(productName)
    closeSearch()
    router.push(`/products/${productId}`)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!trimmedQuery) return

    addSearchHistory(trimmedQuery)

    if (data?.products?.[0]) {
      closeSearch()
      router.push(`/products/${data.products[0].id}`)
    }
  }

  return (
    <div ref={searchRef} className="relative">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 h-11 bg-[#181818] px-1 py-0.5 rounded-md">
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search products..."
            className="bg-transparent text-white text-lg outline-none w-80 px-3 py-1.5 placeholder-[#505050]"
          />

          <button
            type="submit"
            className="flex items-center justify-center"
            aria-label="Search products"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-9 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
          </button>
        </div>
      </form>

      <SearchDropdown
        isOpen={isOpen}
        showHistory={showHistory}
        showSearchResults={showSearchResults}
        history={history}
        data={data}
        isLoading={isLoading}
        error={error}
        onHistorySelect={selectQuery}
        onHistoryRemove={removeSearchHistory}
        onHistoryClear={clearSearchHistory}
        onSuggestionSelect={(suggestionText) => selectQuery(suggestionText, true)}
        onProductSelect={selectProduct}
      />
    </div>
  )
}