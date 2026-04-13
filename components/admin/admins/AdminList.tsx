import Link from 'next/link'
import { Admin } from '@/types'
import DeleteAdminButton from './DeleteAdminButton'

interface AdminListProps {
  admins: Omit<Admin, 'password_hash'>[]
}

export default function AdminList({ admins }: AdminListProps) {

  if (admins.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500 font-poppins">No admins found</p>
        <Link
          href="/admin/admins/new"
          className="text-blue-500 text-sm font-poppins mt-2 inline-block hover:underline"
        >
          Add your first admin
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-poppins uppercase">
              Username
            </th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-poppins uppercase">
              Created at
            </th>
            <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 font-poppins uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {admins.map((admin) => (
            <tr key={admin.id} className="hover:bg-gray-50 transition-colors">

              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium font-poppins">
                      {admin.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 font-poppins">
                    {admin.username}
                  </p>
                </div>
              </td>

              <td className="px-6 py-4">
                <p className="text-sm text-gray-500 font-poppins">
                  {new Date(admin.created_at!).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </td>

              <td className="px-6 py-4 text-right">
                <DeleteAdminButton
                  id={admin.id}
                  username={admin.username}
                />
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}