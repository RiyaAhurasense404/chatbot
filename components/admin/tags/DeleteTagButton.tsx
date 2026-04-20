'use client'

import { useTransition } from 'react'
import { deleteTagAction } from '@/app/admin/(panel)/tags/actions'
import { DeleteTagButtonProps } from '../../../types'


export default function DeleteTagButton({
  id,
  name,
  productCount,
}: DeleteTagButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    const message = productCount > 0
      ? `"${name}" is used by ${productCount} product${productCount > 1 ? 's' : ''}. Deleting it will remove it from all products. Are you sure?`
      : `Are you sure you want to delete the tag "${name}"?`

    if (!confirm(message)) return

    startTransition(async () => {
      await deleteTagAction(id)
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