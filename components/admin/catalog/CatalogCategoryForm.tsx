'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createCatalogCategoryAction, updateCatalogCategoryAction } from '@/app/admin/(panel)/catalog/actions'
import { CatalogCategoryFormProps } from '@/types'

export default function CatalogCategoryForm({
  category,
  parentId,
  returnPath,
}: CatalogCategoryFormProps) {
  const router = useRouter()
  const isEditing = !!category

  const [name, setName] = useState(category?.name ?? '')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    startTransition(async () => {
      try {
        if (isEditing && category) {
          await updateCatalogCategoryAction(returnPath, {
            id: category.id,
            name,
          })
        } else {
          await createCatalogCategoryAction(returnPath, {
            name,
            parentId: parentId ?? null,
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save category')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-6 max-w-lg">

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 font-poppins">
            Category name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rice"
            required
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 font-poppins text-gray-900"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-poppins">{error}</p>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors font-poppins"
          >
            {isPending ? 'Saving...' : isEditing ? 'Update category' : 'Add category'}
          </button>
          <button
            type="button"
            onClick={() => router.push(returnPath)}
            className="text-gray-500 hover:text-gray-700 text-sm font-poppins"
          >
            Cancel
          </button>
        </div>

      </div>
    </form>
  )
}