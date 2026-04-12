import HeroPreview from '@/components/admin/hero/HeroPreview'
import HeroUploadForm from '@/components/admin/hero/HeroUploadForm'
import { getHero } from '@/lib/db/admin/hero'

export default async function AdminHeroPage() {
  const hero = await getHero()

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold font-montserrat text-gray-900">
          Hero Image
        </h1>
        <p className="text-gray-500 text-sm font-poppins mt-1">
          Update the landing page background image
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">

        <HeroPreview imageUrl={hero.background_image_url} />

        <HeroUploadForm currentImageUrl={hero.background_image_url} />

      </div>

    </div>
  )
}