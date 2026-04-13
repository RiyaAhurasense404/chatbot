'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createAdmin } from '@/lib/services/adminAdmins'

export default function AdminForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setIsSaving(true)

    try {
      await createAdmin(username.trim(), password)
      router.push('/admin/admins')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to create admin')
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-6 max-w-lg">

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
            placeholder="Min 8 characters"
            required
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 font-poppins text-gray-900"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 font-poppins">
            Confirm password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
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
            disabled={isSaving}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors font-poppins"
          >
            {isSaving ? 'Creating...' : 'Create admin'}
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