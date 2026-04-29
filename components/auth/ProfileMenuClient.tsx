'use client'

import { useEffect, useRef, useState } from 'react'
import LogoutButton from './LogoutButton'
import {ProfileMenuClientProps} from '@/types/auth'


export default function ProfileMenuClient({
  displayName,
  email,
}: ProfileMenuClientProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current) return

      if (!menuRef.current.contains(event.target as Node)) {
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

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="text-white hover:text-blue-400 transition-colors"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z"
          />
        </svg>
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-full z-50 mt-3 w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Signed in as
          </p>

          <p className="mt-2 truncate text-sm font-semibold text-gray-900">
            {displayName}
          </p>

          {email ? (
            <p className="mt-1 truncate text-xs text-gray-500">
              {email}
            </p>
          ) : null}

          <div className="mt-4 border-t border-gray-100 pt-4">
            <LogoutButton className="w-full rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60" />
          </div>
        </div>
      ) : null}
    </div>
  )
}