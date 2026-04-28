import type { SearchDropdownProps } from '@/types/search'
import NoSearchResults from './NoSearchResults'
import SearchHistoryList from './SearchHistory'
import SearchProductList from './SearchProductList'
import SearchSuggestionList from './SearchSuggestionItem'

export default function SearchDropdown({
  isOpen,
  showHistory,
  showSearchResults,
  history,
  data,
  isLoading,
  error,
  onHistorySelect,
  onHistoryRemove,
  onHistoryClear,
  onSuggestionSelect,
  onProductSelect,
}: SearchDropdownProps) {
  if (!isOpen || (!showHistory && !showSearchResults)) {
    return null
  }

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-[420px] overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#111111] shadow-2xl">
      {showHistory && (
        <SearchHistoryList
          history={history}
          onSelect={onHistorySelect}
          onRemove={onHistoryRemove}
          onClear={onHistoryClear}
        />
      )}

      {showSearchResults && (
        <div className="max-h-96 overflow-y-auto p-3">
          {isLoading && (
            <p className="px-2 py-3 text-sm text-white/50">
              Searching...
            </p>
          )}

          {error && (
            <p className="px-2 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          {!isLoading && !error && data && (
            <>
              <SearchSuggestionList
                suggestions={data.suggestions}
                onSelect={onSuggestionSelect}
              />

              <SearchProductList
                products={data.products}
                onSelect={onProductSelect}
              />

              {data.products.length === 0 &&
                data.suggestions.length === 0 && (
                  <NoSearchResults query={data.query} />
                )}
            </>
          )}
        </div>
      )}
    </div>
  )
}