'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCategory } from '@/lib/services/adminCategories'

interface DeleteCategoryButtonProps {
  id: string
  name: string
}

export default function DeleteCategoryButton({ id, name }: DeleteCategoryButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    setIsDeleting(true)

    try {
      await deleteCategory(id)
      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Failed to delete category')
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-500 hover:text-red-600 text-sm font-poppins disabled:opacity-50"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}