'use client'

import { useEffect, useState } from 'react'
import { Banner, Category } from '@/types'
import BannerSlider from './BannerSlider'
import CategoriesSection from './CategoriesSection'
import ChatCTASection from './ChatCTASection'

interface LazySectionProps {
  sectionId: string
  fallbackClassName: string
  children: React.ReactNode
}

function LazySection({
  sectionId,
  fallbackClassName,
  children,
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = document.getElementById(sectionId)

    console.log(`[${sectionId}] mounted, attaching observer`)

    if (!element) {
      console.log(`[${sectionId}] element not found`)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log(
          `🔍 [${sectionId}] ratio:`,
          entry.intersectionRatio,
          'isIntersecting:',
          entry.isIntersecting
        )

        if (entry.isIntersecting) {
          console.log(`✅ [${sectionId}] visible → loading component`)
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      {
        root: null,
        rootMargin: ' 0px',
        threshold: 0.3,
      }
    )

    observer.observe(element)

    return () => {
      console.log(`🔴 [${sectionId}] observer disconnected`)
      observer.disconnect()
    }
  }, [sectionId])

  useEffect(() => {
    if (isVisible) {
      console.log(`🚀 [${sectionId}] component rendered`)
    }
  }, [isVisible, sectionId])

  return (
    <section id={sectionId} className={fallbackClassName}>
      {isVisible ? (
        children
      ) : (
        <div
          className={`w-full h-full rounded-md bg-gray-200 animate-pulse ${fallbackClassName}`}
        />
      )}
    </section>
  )
}

interface DynamicSectionsProps {
  banners: Banner[]
  categories: Category[]
}

export default function DynamicSections({
  banners,
  categories,
}: DynamicSectionsProps) {
  return (
    <>
      <LazySection
        sectionId="banner-section"
        fallbackClassName="min-h-[100px] md:min-h-[120px]"
      >
        <BannerSlider banners={banners} />
      </LazySection>

      <LazySection
        sectionId="categories-section"
        fallbackClassName="min-h-[320px] md:min-h-[500px]"
      >
        <CategoriesSection categories={categories} />
      </LazySection>

      <LazySection
        sectionId="chat-cta-section"
        fallbackClassName="min-h-[220px] md:min-h-[300px]"
      >
        <ChatCTASection />
      </LazySection>
    </>
  )
}