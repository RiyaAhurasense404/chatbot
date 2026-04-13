'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteAdmin } from '@/lib/services/adminAdmins'

interface DeleteAdminButtonProps {
  id: string
  username: string
}

export default function DeleteAdminButton({ id, username }: DeleteAdminButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete admin "${username}"?`)) return

    setIsDeleting(true)

    try {
      await deleteAdmin(id)
      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Failed to delete admin')
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