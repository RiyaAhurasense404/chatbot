'use client'

import { useCallback, useEffect, useState } from 'react'

const SEARCH_HISTORY_KEY = 'samatva_search_history'
const MAX_HISTORY_ITEMS = 8

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    try {
      const storedHistory = window.localStorage.getItem(SEARCH_HISTORY_KEY)

      if (!storedHistory) {
        return
      }

      const parsedHistory = JSON.parse(storedHistory)

      if (Array.isArray(parsedHistory)) {
        setHistory(
          parsedHistory.filter(
            (item): item is string => typeof item === 'string'
          )
        )
      }
    } catch (error) {
      console.error('Failed to load search history:', error)
    }
  }, [])

  const saveHistory = useCallback((nextHistory: string[]) => {
    setHistory(nextHistory)
    window.localStorage.setItem(
      SEARCH_HISTORY_KEY,
      JSON.stringify(nextHistory)
    )
  }, [])

  const addSearchHistory = useCallback(
    (query: string) => {
      const normalizedQuery = query.trim()

      if (!normalizedQuery) {
        return
      }

      const nextHistory = [
        normalizedQuery,
        ...history.filter(
          (item) => item.toLowerCase() !== normalizedQuery.toLowerCase()
        ),
      ].slice(0, MAX_HISTORY_ITEMS)

      saveHistory(nextHistory)
    },
    [history, saveHistory]
  )

  const removeSearchHistory = useCallback(
    (query: string) => {
      const nextHistory = history.filter(
        (item) => item.toLowerCase() !== query.toLowerCase()
      )

      saveHistory(nextHistory)
    },
    [history, saveHistory]
  )

  const clearSearchHistory = useCallback(() => {
    saveHistory([])
  }, [saveHistory])

  return {
    history,
    addSearchHistory,
    removeSearchHistory,
    clearSearchHistory,
  }
}