import Link from 'next/link'
import { Category } from '@/types'
import DeleteCategoryButton from './DeleteCategoryButton'

interface CategoryListProps {
  categories: Category[]
}

export default function CategoryList({ categories }: CategoryListProps) {

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500 font-poppins">No categories yet</p>
        <Link
          href="/admin/categories/new"
          className="text-blue-500 text-sm font-poppins mt-2 inline-block hover:underline"
        >
          Add your first category
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
              Name
            </th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-poppins uppercase">
              Size
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
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50 transition-colors">

              <td className="px-6 py-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </td>

              <td className="px-6 py-4">
                <p className="text-sm font-medium text-gray-900 font-poppins">
                  {category.name}
                </p>
              </td>

              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-poppins ${
                  category.size === 'large'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {category.size}
                </span>
              </td>

              <td className="px-6 py-4">
                <p className="text-sm text-gray-500 font-poppins">
                  {category.display_order}
                </p>
              </td>

              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/admin/categories/${category.id}`}
                    className="text-blue-500 hover:text-blue-600 text-sm font-poppins"
                  >
                    Edit
                  </Link>
                  <DeleteCategoryButton
                    id={category.id}
                    name={category.name}
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