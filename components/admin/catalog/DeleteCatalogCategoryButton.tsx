'use client'

import { useTransition } from 'react'
import { deleteCatalogCategoryAction } from '@/app/admin/(panel)/catalog/actions'
import { DeleteCatalogCategoryButtonProps } from '../../../types'

export default function DeleteCatalogCategoryButton({
  id,
  name,
  returnPath,
}: DeleteCatalogCategoryButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all subcategories and products inside it.`)) return

    startTransition(async () => {
      await deleteCatalogCategoryAction(id, returnPath)
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