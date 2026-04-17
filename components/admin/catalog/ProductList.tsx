import Link from 'next/link'
import { Product } from '@/types'
import DeleteProductButton from './DeleteProductButton'
import ToggleProductButton from './ToggleProductButton'

interface ProductListProps {
  products: Product[]
  categoryId: string
}

export default function ProductList({ products, categoryId }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-400 text-sm font-poppins">No products yet. Add your first product.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-poppins uppercase">Name</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-poppins uppercase">Price</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-poppins uppercase">Stock</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-poppins uppercase">Active</th>
            <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 font-poppins uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <p className="text-sm font-medium text-gray-900 font-poppins">{product.name}</p>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-gray-500 font-poppins">
                  ₹{product.price}
                  {product.discount > 0 && (
                    <span className="ml-1 text-green-600">(-{product.discount}%)</span>
                  )}
                </p>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-gray-500 font-poppins">{product.stock}</p>
              </td>
              <td className="px-6 py-4">
                <ToggleProductButton
                  id={product.id}
                  isActive={product.is_active}
                  categoryId={categoryId}
                />
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/admin/catalog/${categoryId}/products/${product.id}/edit`}
                    className="text-blue-500 hover:text-blue-600 text-sm font-poppins"
                  >
                    Edit
                  </Link>
                  <DeleteProductButton
                    id={product.id}
                    name={product.name}
                    categoryId={categoryId}
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