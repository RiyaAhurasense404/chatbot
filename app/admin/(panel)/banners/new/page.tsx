import BannerForm from '@/components/admin/banners/BannerForm'

export default function NewBannerPage() {
  return (
    <div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold font-montserrat text-gray-900">
          Add Banner
        </h1>
        <p className="text-gray-500 text-sm font-poppins mt-1">
          Add a new slider banner
        </p>
      </div>

      <BannerForm />

    </div>
  )
}