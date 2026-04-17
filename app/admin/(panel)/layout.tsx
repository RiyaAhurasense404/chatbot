import type { Metadata } from 'next'
import Link from 'next/link'
import LogoutButton from '@/components/admin/LogoutButton'

export const metadata: Metadata = {
  title: 'Samatva Admin',
  description: 'Admin panel for Samatva',
}

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-gray-100">

      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed top-0 left-0 h-full">

        <div className="px-6 py-6 border-b border-gray-200">
          <h1 className="text-xl font-bold font-montserrat text-gray-900">
            Samatva
          </h1>
          <p className="text-xs text-gray-500 font-poppins mt-0.5">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">

          <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm font-poppins text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>

          <Link href="/admin/hero" className="flex items-center gap-3 px-4 py-2.5 text-sm font-poppins text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Hero Image
          </Link>

          <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-2.5 text-sm font-poppins text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Categories
          </Link>

          <Link href="/admin/banners" className="flex items-center gap-3 px-4 py-2.5 text-sm font-poppins text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Banners
          </Link>

          <Link href="/admin/catalog" className="flex items-center gap-3 px-4 py-2.5 text-sm font-poppins text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Catalog
          </Link>

          <Link href="/admin/admins" className="flex items-center gap-3 px-4 py-2.5 text-sm font-poppins text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Admins
          </Link>

        </nav>

        <div className="px-4 py-4 border-t border-gray-200">
          <LogoutButton />
        </div>

      </aside>

      <main className="flex-1 ml-64 p-8">
        {children}
      </main>

    </div>
  )
}