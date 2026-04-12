import { getCategoryById } from '@/lib/db/admin/categories'
import CategoryForm from '@/components/admin/categories/CategoryForm'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params

  const category = await getCategoryById(id)

  if (!category) {
    notFound()
  }

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold font-montserrat text-gray-900">
          Edit Category
        </h1>
        <p className="text-gray-500 text-sm font-poppins mt-1">
          Update {category.name} details
        </p>
      </div>

      <CategoryForm category={category} />

    </div>
  )
}