import CategoryForm from '@/components/admin/categories/CategoryForm'

export default function NewCategoryPage() {
  return (
    <div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold font-montserrat text-gray-900">
          Add Category
        </h1>
        <p className="text-gray-500 text-sm font-poppins mt-1">
          Add a new product category
        </p>
      </div>

      <CategoryForm />

    </div>
  )
}