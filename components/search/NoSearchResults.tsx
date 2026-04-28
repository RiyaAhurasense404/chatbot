interface SearchEmptyStateProps {
    query: string
  }
  
  export default function SearchEmptyState({ query }: SearchEmptyStateProps) {
    return (
      <p className="px-2 py-3 text-sm text-white/50">
        No results found for “{query}”
      </p>
    )
  }