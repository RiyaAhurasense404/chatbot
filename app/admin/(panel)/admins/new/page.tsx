import AdminForm from '@/components/admin/admins/AdminForm'

export default function NewAdminPage() {
  return (
    <div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold font-montserrat text-gray-900">
          Add Admin
        </h1>
        <p className="text-gray-500 text-sm font-poppins mt-1">
          Create a new admin user
        </p>
      </div>

      <AdminForm />

    </div>
  )
}