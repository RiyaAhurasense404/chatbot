'use client'
import { useState, useEffect } from 'react'
import { Banner } from '@/types'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

interface BannerSliderProps {
  banners: Banner[]
}

export default function BannerSlider({ banners }: BannerSliderProps) {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % banners.length)
        setAnimating(false)
      }, 700)
    }, 4000)
    return () => clearInterval(interval)
  }, [banners.length])

  const banner = banners[current]

  return (
    <section className="relative w-full py-5 overflow-hidden">
      {banner.background_media_type === 'video' ? (
        <video
          key={banner.background_image_url}
          src={banner.background_image_url}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${banner.background_image_url})` }}
        />
      )}

      <div className="absolute inset-0 bg-black/75" />

      <div
        className={`relative z-10 flex items-center justify-between px-16 transition-all duration-700 ease-in-out ${
          animating
            ? 'opacity-0 -translate-x-16'
            : 'opacity-100 translate-x-0'
        }`}
      >
        <div className="w-48 h-48 flex-shrink-0">
          {banner.media_type === 'video' ? (
            <video
              key={banner.image_url}
              src={banner.image_url}
              className="w-full h-full object-contain drop-shadow-lg"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={banner.image_url}
              alt="banner left"
              className="w-full h-full object-contain drop-shadow-lg"
            />
          )}
        </div>

        <p className={`${poppins.className} text-white text-center text-4xl font-semibold max-w-5xl px-8 leading-relaxed`}>
          {banner.text}
        </p>

        <div className="w-48 h-48 flex-shrink-0" style={{ transform: 'scaleX(-1)' }}>
          {banner.media_type === 'video' ? (
            <video
              key={`${banner.image_url}-right`}
              src={banner.image_url}
              className="w-full h-full object-contain drop-shadow-lg"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={banner.image_url}
              alt="banner right"
              className="w-full h-full object-contain drop-shadow-lg"
            />
          )}
        </div>
      </div>
    </section>
  )
}