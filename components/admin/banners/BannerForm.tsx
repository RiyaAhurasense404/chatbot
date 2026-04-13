'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { uploadBannerImage, saveBanner, updateBanner } from '@/lib/services/adminBanners'
import { Banner } from '@/types'

interface BannerFormProps {
  banner?: Banner
}

export default function BannerForm({ banner }: BannerFormProps) {
  const router = useRouter()
  const isEditing = !!banner

  const [text, setText] = useState(banner?.text ?? '')
  const [imageUrl, setImageUrl] = useState(banner?.image_url ?? '')
  const [previewUrl, setPreviewUrl] = useState(banner?.image_url ?? '')
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(banner?.background_image_url ?? '')
  const [backgroundPreviewUrl, setBackgroundPreviewUrl] = useState(banner?.background_image_url ?? '')
  const [displayOrder, setDisplayOrder] = useState(banner?.display_order ?? 1)
  const [isUploading, setIsUploading] = useState(false)
  const [isBgUploading, setIsBgUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError('')

    try {
      const url = await uploadBannerImage(file)
      setImageUrl(url)
      setPreviewUrl(url)
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleBgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsBgUploading(true)
    setError('')

    try {
      const url = await uploadBannerImage(file)
      setBackgroundImageUrl(url)
      setBackgroundPreviewUrl(url)
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setIsBgUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      if (isEditing) {
        await updateBanner(banner.id, text, imageUrl, backgroundImageUrl, displayOrder)
      } else {
        await saveBanner(text, imageUrl, backgroundImageUrl, displayOrder)
      }
      router.push('/admin/banners')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save banner')
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-6">

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 font-poppins">
            Banner text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter banner text..."
            required
            rows={3}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 font-poppins text-gray-900 resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 font-poppins">
            Slider image (shown on left and right)
          </label>

          {previewUrl && (
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 mb-2">
              <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
            </div>
          )}

          <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
            <div className="text-center">
              <p className="text-sm text-gray-500 font-poppins">
                {isUploading ? 'Uploading...' : 'Click to upload slider image'}
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>

          <input
            type="text"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value)
              setPreviewUrl(e.target.value)
            }}
            placeholder="Or paste slider image URL"
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 font-poppins text-gray-900"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 font-poppins">
            Background image
          </label>

          {backgroundPreviewUrl && (
            <div className="w-full h-24 rounded-lg overflow-hidden bg-gray-100 mb-2">
              <img src={backgroundPreviewUrl} alt="bg preview" className="w-full h-full object-cover" />
            </div>
          )}

          <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
            <div className="text-center">
              <p className="text-sm text-gray-500 font-poppins">
                {isBgUploading ? 'Uploading...' : 'Click to upload background image'}
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleBgImageUpload}
              disabled={isBgUploading}
              className="hidden"
            />
          </label>

          <input
            type="text"
            value={backgroundImageUrl}
            onChange={(e) => {
              setBackgroundImageUrl(e.target.value)
              setBackgroundPreviewUrl(e.target.value)
            }}
            placeholder="Or paste background image URL"
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 font-poppins text-gray-900"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 font-poppins">
            Display order
          </label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            min={1}
            required
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 font-poppins text-gray-900 w-32"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-poppins">{error}</p>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSaving || isUploading || isBgUploading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors font-poppins"
          >
            {isSaving ? 'Saving...' : isEditing ? 'Update banner' : 'Add banner'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/banners')}
            className="text-gray-500 hover:text-gray-700 text-sm font-poppins"
          >
            Cancel
          </button>
        </div>

      </div>
    </form>
  )
}