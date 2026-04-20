import { getAllTagsWithProducts } from '@/lib/db/admin/tags'
import DeleteTagButton from '@/components/admin/tags/DeleteTagButton'
import TagProductList from '@/components/admin/tags/TagProductList'

export default async function TagsPage() {
  const tags = await getAllTagsWithProducts()

  return (
    <div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-gray-900">
            Tags
          </h1>
          <p className="text-gray-500 text-sm font-poppins mt-1">
            Manage all product tags
          </p>
        </div>
      </div>

      {tags.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 font-poppins text-sm">No tags yet</p>
          <p className="text-gray-400 font-poppins text-xs mt-1">
            Tags are created automatically when added to products
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-poppins uppercase">
                  Tag name
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-poppins uppercase">
                  Used by
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
              {tags.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50 transition-colors">

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 font-poppins">
                      {tag.name}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <TagProductList
                      productCount={tag.product_count}
                      products={tag.products}
                    />
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500 font-poppins">
                      {new Date(tag.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <DeleteTagButton
                      id={tag.id}
                      name={tag.name}
                      productCount={tag.product_count}
                    />
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}