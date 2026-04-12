import LoginForm from '@/components/admin/LoginForm'

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="bg-white rounded-xl border border-gray-200 p-16 w-full max-w-xl">

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold font-montserrat text-gray-900">
            Samatva Admin
          </h1>
          <p className="text-gray-500 text-base mt-2 font-poppins">
            Sign in to manage your content
          </p>
        </div>

        <LoginForm />

      </div>
    </div>
  )
}