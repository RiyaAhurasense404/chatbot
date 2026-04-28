interface SearchHistoryListProps {
    history: string[]
    onSelect: (historyText: string) => void
    onRemove: (historyText: string) => void
    onClear: () => void
  }
  
  export default function SearchHistoryList({
    history,
    onSelect,
    onRemove,
    onClear,
  }: SearchHistoryListProps) {
    if (history.length === 0) {
      return null
    }
  
    return (
      <div className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
            Recent searches
          </p>
  
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-white/40 hover:text-white"
          >
            Clear
          </button>
        </div>
  
        <div className="space-y-1">
          {history.map((historyItem) => (
            <div
              key={historyItem}
              className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-white/5"
            >
              <button
                type="button"
                onClick={() => onSelect(historyItem)}
                className="text-left text-sm text-white/80"
              >
                {historyItem}
              </button>
  
              <button
                type="button"
                onClick={() => onRemove(historyItem)}
                className="text-xs text-white/40 hover:text-white"
                aria-label={`Remove ${historyItem}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }