import Link from 'next/link'
import { getAllAdmins } from '@/lib/db/admin/admins'
import AdminList from '@/components/admin/admins/AdminList'

export default async function AdminsPage() {
  const admins = await getAllAdmins()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-gray-900">
            Admins
          </h1>
          <p className="text-gray-500 text-sm font-poppins mt-1">
            Manage admin users
          </p>
        </div>
        <Link
          href="/admin/admins/new"
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors font-poppins inline-flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Admin
        </Link>
      </div>

      <AdminList admins={admins} />

    </div>
  )
}