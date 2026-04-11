import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/landing/Navbar'
import NavbarWrapper from '@/components/landing/NavbarWrapper'
import HeroSection from '@/components/landing/HeroSection'
import { getLandingPageData } from '@/lib/cache/landingCache'

const BannerSlider = dynamic(
  () => import('@/components/landing/BannerSlider')
)

const CategoriesSection = dynamic(
  () => import('@/components/landing/CategoriesSection')
)

const ChatCTASection = dynamic(
  () => import('@/components/landing/ChatCTASection')
)

export default async function LandingPage() {
  const data = await getLandingPageData()

  return (
    <main>

      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>

      <div className="h-16" />

      <HeroSection backgroundImageUrl={data.hero.background_image_url} />

      <Suspense fallback={
        <div className="w-full h-24 bg-black animate-pulse" />
      }>
        <BannerSlider banners={data.banners} />
      </Suspense>

      <Suspense fallback={
        <div className="w-full h-96 bg-[#f5f0e8] animate-pulse" />
      }>
        <CategoriesSection categories={data.categories} />
      </Suspense>

      <Suspense fallback={
        <div className="w-full h-64 bg-black animate-pulse" />
      }>
        <ChatCTASection />
      </Suspense>

    </main>
  )
}