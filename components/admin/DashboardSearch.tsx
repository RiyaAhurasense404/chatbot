'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'

export default function DashboardSearch({ defaultValue }: { defaultValue: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    startTransition(() => {
      if (value) {
        router.replace(`${pathname}?search=${encodeURIComponent(value)}`)
      } else {
        router.replace(pathname)
      }
    })
  }

  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        defaultValue={defaultValue}
        onChange={handleChange}
        placeholder="Search sections..."
        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 font-poppins text-gray-900 bg-white"
      />
    </div>
  )
}