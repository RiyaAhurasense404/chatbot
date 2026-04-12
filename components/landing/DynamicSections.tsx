'use client'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Banner, Category } from '@/types'

const BannerSlider = dynamic(() => import('./BannerSlider'), { ssr: false })
const CategoriesSection = dynamic(() => import('./CategoriesSection'), { ssr: false })
const ChatCTASection = dynamic(() => import('./ChatCTASection'), { ssr: false })

function LazySection({ children, fallbackHeight }: { children: React.ReactNode, fallbackHeight: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    console.log('📍 Section position from top:', rect.top)

    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log('🔍 Intersection ratio:', entry.intersectionRatio, 'isIntersecting:', entry.isIntersecting)
        if (entry.isIntersecting) {
          console.log('👁 Section visible — loading now')
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px', threshold: 0 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ minHeight: fallbackHeight }}>
      {visible ? children : (
        <div
          style={{ height: fallbackHeight }}
          className="w-full bg-gray-200 animate-pulse"
        />
      )}
    </div>
  )
}

interface DynamicSectionsProps {
  banners: Banner[]
  categories: Category[]
}

export default function DynamicSections({ banners, categories }: DynamicSectionsProps) {
  return (
    <>
      <LazySection fallbackHeight="96px">
        <BannerSlider banners={banners} />
      </LazySection>

      <LazySection fallbackHeight="500px">
        <CategoriesSection categories={categories} />
      </LazySection>

      <LazySection fallbackHeight="300px">
        <ChatCTASection />
      </LazySection>
    </>
  )
}