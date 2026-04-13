import { getBannerById } from '@/lib/db/admin/banners'
import BannerForm from '@/components/admin/banners/BannerForm'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditBannerPage({ params }: PageProps) {
  const { id } = await params

  const banner = await getBannerById(id)

  if (!banner) {
    notFound()
  }

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold font-montserrat text-gray-900">
          Edit Banner
        </h1>
        <p className="text-gray-500 text-sm font-poppins mt-1">
          Update banner details
        </p>
      </div>

      <BannerForm banner={banner} />

    </div>
  )
}