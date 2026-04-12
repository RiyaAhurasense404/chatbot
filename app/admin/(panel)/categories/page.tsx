import Link from 'next/link'
import { getAllCategories } from '@/lib/db/admin/categories'
import CategoryList from '@/components/admin/categories/CategoryList'

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories()

  return (
    <div>

      {/* header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-gray-900">
            Categories
          </h1>
          <p className="text-gray-500 text-sm font-poppins mt-1">
            Manage your product categories
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors font-poppins inline-flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </Link>
      </div>

      {/* list */}
      <CategoryList categories={categories} />

    </div>
  )
}