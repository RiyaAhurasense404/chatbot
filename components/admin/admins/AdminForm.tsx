'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createAdminAction, updateAdminAction} from '@/app/admin/(panel)/admins/actions'
import { Admin } from '@/types'

interface AdminFormProps {
  admin?: Admin
}

export default function AdminForm({ admin }: AdminFormProps) {
  const router = useRouter()
  const isEditing = !!admin

  const [username, setUsername] = useState(admin?.username ?? '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    startTransition(async () => {
      try {
        if (isEditing && admin) {
          await updateAdminAction({
            id: admin.id,
            username,
            password,
          })
        } else {
          await createAdminAction({
            username,
            password,
          })
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save admin')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 font-poppins">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 font-poppins text-gray-900"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 font-poppins">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={
              isEditing ? 'Leave blank to keep current password' : 'Enter password'
            }
            required={!isEditing}
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
            {isPending ? 'Saving...' : isEditing ? 'Update admin' : 'Add admin'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin/admins')}
            className="text-gray-500 hover:text-gray-700 text-sm font-poppins"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}