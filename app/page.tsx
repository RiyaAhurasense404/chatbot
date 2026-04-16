import HeroSection from '@/components/landing/HeroSection'
import DynamicSections from '@/components/landing/DynamicSections'
import { getLandingPageData } from '@/lib/cache/landingCache'
import Navbar from '@/components/landing/Navbar'

export default async function LandingPage() {
  const data = await getLandingPageData()

  return (
    <main>
      <Navbar />
      <HeroSection backgroundImageUrl={data?.hero?.background_image_url ?? ''} backgroundMediaType={data?.hero?.background_media_type} />
      <DynamicSections
        banners={data.banners}
        categories={data.categories}
      />
    </main>
  )
}