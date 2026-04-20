'use client'

import { useState, useRef, useEffect } from 'react'
import {TagInputProps} from '../../../types'


export default function TagInput({
  initialTags,
  suggestions,
  onChange,
}: TagInputProps) {
  const [tags, setTags] = useState<string[]>(initialTags)
  const [input, setInput] = useState('')
  const [filtered, setFiltered] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const addTag = (value: string) => {
    const normalized = value.toLowerCase().trim()
    if (!normalized) return
    if (tags.includes(normalized)) {
      setInput('')
      setShowSuggestions(false)
      return
    }
    const updated = [...tags, normalized]
    setTags(updated)
    onChange(updated)
    setInput('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const removeTag = (tag: string) => {
    const updated = tags.filter((t) => t !== tag)
    setTags(updated)
    onChange(updated)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)

    if (value.trim()) {
      const matches = suggestions.filter(
        (s) =>
          s.toLowerCase().includes(value.toLowerCase()) &&
          !tags.includes(s.toLowerCase())
      )
      setFiltered(matches)
      setShowSuggestions(true)
    } else {
      setFiltered([])
      setShowSuggestions(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (input.trim()) addTag(input)
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">

      <div
        className="min-h-[44px] flex flex-wrap gap-2 border border-gray-300 rounded-lg px-3 py-2 cursor-text focus-within:border-blue-500 transition-colors"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-poppins px-2.5 py-1 rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeTag(tag)
              }}
              className="text-blue-400 hover:text-blue-600 transition-colors ml-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (input.trim() && filtered.length > 0) {
              setShowSuggestions(true)
            }
          }}
          placeholder={tags.length === 0 ? 'Type a tag and press Enter...' : ''}
          className="flex-1 min-w-[120px] outline-none text-sm font-poppins text-gray-900 bg-transparent placeholder:text-gray-400"
        />
      </div>

      {showSuggestions && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
          {filtered.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTag(suggestion)}
              className="w-full text-left px-4 py-2 text-sm font-poppins text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 font-poppins mt-1">
        Press Enter to add · Backspace to remove last tag
      </p>

    </div>
  )
}