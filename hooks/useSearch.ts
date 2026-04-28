'use client'

import { useEffect, useRef, useState } from 'react'
import type { SearchApiResponse } from '@/types/search'

type UseSearchState = {
  data: SearchApiResponse | null
  isLoading: boolean
  error: string | null
}

const EMPTY_SEARCH_RESPONSE: SearchApiResponse = {
  query: '',
  source: 'meilisearch',
  total: 0,
  suggestions: [],
  products: [],
}

export function useSearch(query: string) {
  const [state, setState] = useState<UseSearchState>({
    data: EMPTY_SEARCH_RESPONSE,
    isLoading: false,
    error: null,
  })

  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const normalizedQuery = query.trim()

    if (normalizedQuery.length < 3) {
      abortControllerRef.current?.abort()

      setState({
        data: EMPTY_SEARCH_RESPONSE,
        isLoading: false,
        error: null,
      })

      return
    }

    abortControllerRef.current?.abort()

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    async function fetchSearchResults() {
      try {
        setState((previousState) => ({
          ...previousState,
          isLoading: true,
          error: null,
        }))

        const response = await fetch(
          `/api/search?q=${encodeURIComponent(normalizedQuery)}`,
          {
            method: 'GET',
            signal: abortController.signal,
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch search results')
        }

        const data = (await response.json()) as SearchApiResponse

        setState({
          data,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setState({
          data: EMPTY_SEARCH_RESPONSE,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Something went wrong while searching',
        })
      }
    }

    fetchSearchResults()

    return () => {
      abortController.abort()
    }
  }, [query])

  return state
}