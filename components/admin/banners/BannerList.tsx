import Link from 'next/link'
import { Banner } from '@/types'
import DeleteBannerButton from './DeleteBannerButton'

interface BannerListProps {
  banners: Banner[]
}

export default function BannerList({ banners }: BannerListProps) {

  if (banners.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500 font-poppins">No banners yet</p>
        <Link
          href="/admin/banners/new"
          className="text-blue-500 text-sm font-poppins mt-2 inline-block hover:underline"
        >
          Add your first banner
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
              Image
            </th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-poppins uppercase">
              Text
            </th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-poppins uppercase">
              Order
            </th>
            <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 font-poppins uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {banners.map((banner) => (
            <tr key={banner.id} className="hover:bg-gray-50 transition-colors">

              <td className="px-6 py-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={banner.image_url}
                    alt="banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              </td>

              <td className="px-6 py-4 max-w-xs">
                <p className="text-sm text-gray-900 font-poppins truncate">
                  {banner.text}
                </p>
              </td>

              <td className="px-6 py-4">
                <p className="text-sm text-gray-500 font-poppins">
                  {banner.display_order}
                </p>
              </td>

              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/admin/banners/${banner.id}`}
                    className="text-blue-500 hover:text-blue-600 text-sm font-poppins"
                  >
                    Edit
                  </Link>
                  <DeleteBannerButton
                    id={banner.id}
                  />
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}