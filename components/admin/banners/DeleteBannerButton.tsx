'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteBannerAction } from '@/app/admin/(panel)/banners/actions'

interface DeleteBannerButtonProps {
  id: string
}

export default function DeleteBannerButton({ id }: DeleteBannerButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this banner?')) return

    setIsDeleting(true)

    try {
      await deleteBannerAction(id)
      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Failed to delete banner')
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