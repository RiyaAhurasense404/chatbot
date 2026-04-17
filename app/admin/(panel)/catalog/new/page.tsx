import Link from 'next/link'
import CatalogCategoryForm from '@/components/admin/catalog/CatalogCategoryForm'

export default function NewCatalogCategoryPage() {
  return (
    <div>

      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/catalog"
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-gray-900">
            New Category
          </h1>
          <p className="text-gray-500 text-sm font-poppins mt-1">
            Add a new root category to your catalog
          </p>
        </div>
      </div>

      <CatalogCategoryForm
        parentId={null}
        returnPath="/admin/catalog"
      />

    </div>
  )
}