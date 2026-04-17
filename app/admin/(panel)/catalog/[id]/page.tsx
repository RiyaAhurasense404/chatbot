import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCatalogCategoryById, getSubCategories, getCategoryBreadcrumb, hasSubCategories } from '@/lib/db/admin/catalog'
import { getProductsByCategory } from '@/lib/db/admin/products'
import DeleteCatalogCategoryButton from '@/components/admin/catalog/DeleteCatalogCategoryButton'
import ProductList from '@/components/admin/catalog/ProductList'

export default async function CatalogCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [category, subcategories, breadcrumb, hasChildren] = await Promise.all([
    getCatalogCategoryById(id),
    getSubCategories(id),
    getCategoryBreadcrumb(id),
    hasSubCategories(id),
  ])

  if (!category) notFound()

  const products = hasChildren ? [] : await getProductsByCategory(id)

  return (
    <div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Link
          href="/admin/catalog"
          className="text-gray-400 hover:text-blue-500 text-sm font-poppins transition-colors"
        >
          Catalog
        </Link>
        {breadcrumb.map((crumb, index) => (
          <div key={crumb.id} className="flex items-center gap-2">
            <span className="text-gray-300">/</span>
            {index === breadcrumb.length - 1 ? (
              <span className="text-gray-900 text-sm font-poppins font-medium">
                {crumb.name}
              </span>
            ) : (
              <Link
                href={`/admin/catalog/${crumb.id}`}
                className="text-gray-400 hover:text-blue-500 text-sm font-poppins transition-colors"
              >
                {crumb.name}
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-gray-900">
            {category.name}
          </h1>
          <p className="text-gray-500 text-sm font-poppins mt-1">
            {hasChildren
              ? `${subcategories.length} subcategories`
              : `${products.length} products`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/admin/catalog/${id}/edit`}
            className="border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors font-poppins"
          >
            Edit
          </Link>
          <DeleteCatalogCategoryButton
            id={id}
            name={category.name}
            returnPath={category.parent_id
              ? `/admin/catalog/${category.parent_id}`
              : '/admin/catalog'
            }
          />
          {products.length === 0 && (
            <Link
              href={`/admin/catalog/${id}/new`}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors font-poppins inline-flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Subcategory
            </Link>
          )}
          {!hasChildren && (
            <Link
              href={`/admin/catalog/${id}/products/new`}
              className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors font-poppins inline-flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </Link>
          )}
        </div>
      </div>

      {subcategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base font-semibold font-montserrat text-gray-900 mb-4">
            Subcategories
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-poppins uppercase">
                    Name
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-poppins uppercase">
                    Created
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 font-poppins uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subcategories.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">

                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/catalog/${sub.id}`}
                        className="text-sm font-medium text-gray-900 font-poppins hover:text-blue-500 transition-colors inline-flex items-center gap-2"
                      >
                        {sub.name}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500 font-poppins">
                        {new Date(sub.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/catalog/${sub.id}/edit`}
                          className="text-blue-500 hover:text-blue-600 text-sm font-poppins"
                        >
                          Edit
                        </Link>
                        <DeleteCatalogCategoryButton
                          id={sub.id}
                          name={sub.name}
                          returnPath={`/admin/catalog/${id}`}
                        />
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!hasChildren && (
        <div>
          <h2 className="text-base font-semibold font-montserrat text-gray-900 mb-4">
            Products
          </h2>
          <ProductList products={products} categoryId={id} />
        </div>
      )}

    </div>
  )
}