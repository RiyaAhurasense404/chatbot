import HeroSection from '@/components/landing/HeroSection'
import DynamicSections from '@/components/landing/DynamicSections'
import { getLandingPageData } from '@/lib/cache/landingCache'
import Navbar from '@/components/landing/Navbar'

export default async function LandingPage() {
  console.log('🚀 LandingPage — server render started')
  const data = await getLandingPageData()
  console.log('📦 Data fetched from cache:', Object.keys(data))
  console.log('🎨 Rendering page...')

  return (
    <main>
        <Navbar />
      
      <HeroSection backgroundImageUrl={data.hero.background_image_url} />
      <DynamicSections
        banners={data.banners}
        categories={data.categories}
      />
    </main>
  )
}