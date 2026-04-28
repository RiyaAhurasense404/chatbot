import type { SearchSuggestionResult } from '@/types/search'

interface SearchSuggestionListProps {
  suggestions: SearchSuggestionResult[]
  onSelect: (suggestionText: string) => void
}

export default function SearchSuggestionList({
  suggestions,
  onSelect,
}: SearchSuggestionListProps) {
  if (suggestions.length === 0) {
    return null
  }

  return (
    <div className="mb-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">
        Suggestions
      </p>

      <div className="space-y-1">
        {suggestions.map((suggestion) => (
          <button
            key={`${suggestion.type}-${suggestion.text}`}
            type="button"
            onClick={() => onSelect(suggestion.text)}
            className="block w-full rounded-lg px-2 py-2 text-left text-sm text-white/80 hover:bg-white/5"
          >
            {suggestion.text}
          </button>
        ))}
      </div>
    </div>
  )
}