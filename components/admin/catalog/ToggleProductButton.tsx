'use client'

import { useTransition } from 'react'
import { toggleProductActiveAction } from '@/app/admin/(panel)/catalog/actions'
import { ToggleProductButtonProps } from '../../../types'

export default function ToggleProductButton({
  id,
  isActive,
  categoryId,
}: ToggleProductButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(async () => {
      await toggleProductActiveAction(id, !isActive, categoryId)
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
        isActive ? 'bg-blue-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isActive ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}