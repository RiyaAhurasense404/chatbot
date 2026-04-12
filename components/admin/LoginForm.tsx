'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAdmin } from '@/lib/services/admin'

export default function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await loginAdmin(username, password)

    if (!result.success) {
      setError(result.error || 'Login failed')
      setIsLoading(false)
      return
    }

    router.push('/admin')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-poppins">{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-base font-medium text-gray-700 font-poppins">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          required
          className="border border-gray-300 text-gray-900 rounded-lg px-4 py-3 text-base outline-none focus:border-blue-500 font-poppins"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-base font-medium text-gray-700 font-poppins">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
          className="border border-gray-300 text-gray-900 rounded-lg px-4 py-3 text-base outline-none focus:border-blue-500 font-poppins"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white text-base font-medium py-3 rounded-lg transition-colors font-poppins mt-2"
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>

    </form>
  )
}