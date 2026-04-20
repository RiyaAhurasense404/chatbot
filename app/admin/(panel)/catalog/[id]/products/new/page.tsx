import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCatalogCategoryById } from '@/lib/db/admin/catalog'
import ProductForm from '@/components/admin/catalog/ProductForm'
import { getAllTagNames } from '@/lib/db/admin/tags'

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [category, allTagNames] = await Promise.all([
    getCatalogCategoryById(id),
    getAllTagNames(),
  ])

  if (!category) notFound()

  return (
    <div>

      <div className="flex items-center gap-3 mb-8">
        <Link
          href={`/admin/catalog/${id}`}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-gray-900">
            Add Product
          </h1>
          <p className="text-gray-500 text-sm font-poppins mt-1">
            Adding to <span className="font-medium text-gray-700">{category.name}</span>
          </p>
        </div>
      </div>

      <ProductForm
        categoryId={id}
        returnPath={`/admin/catalog/${id}`}
        allTagNames={allTagNames}
      />

    </div>
  )
}