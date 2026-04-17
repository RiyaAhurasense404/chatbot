'use client'

import { useTransition } from 'react'
import { deleteProductAction } from '@/app/admin/(panel)/catalog/actions'
import { DeleteProductButtonProps } from '../../../types'


export default function DeleteProductButton({
  id,
  name,
  categoryId,
}: DeleteProductButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    startTransition(async () => {
      await deleteProductAction(id, categoryId)
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-500 hover:text-red-600 text-sm font-poppins disabled:opacity-50"
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  )
}