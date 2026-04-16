'use client'

import { useState, useTransition } from 'react'
import { createBannerAction, updateBannerAction} from '@/app/admin/(panel)/banners/actions'
import { Banner } from '@/types'
import { MediaType } from '@/types/media'

interface BannerFormProps {
  banner?: Banner
}

export default function BannerForm({ banner }: BannerFormProps) {
  const isEditing = !!banner

  const [text, setText] = useState(banner?.text ?? '')

  const [imageUrl, setImageUrl] = useState(banner?.image_url ?? '')
  const [previewUrl, setPreviewUrl] = useState(banner?.image_url ?? '')
  const [mediaType, setMediaType] = useState<MediaType>(banner?.media_type ?? 'image')

  const [backgroundImageUrl, setBackgroundImageUrl] = useState(
    banner?.background_image_url ?? ''
  )
  const [backgroundPreviewUrl, setBackgroundPreviewUrl] = useState(
    banner?.background_image_url ?? ''
  )
  const [backgroundMediaType, setBackgroundMediaType] = useState<MediaType>(
    banner?.background_media_type ?? 'image'
  )

  const [primaryFile, setPrimaryFile] = useState<File | undefined>()
  const [backgroundFile, setBackgroundFile] = useState<File | undefined>()

  const [displayOrder, setDisplayOrder] = useState(banner?.display_order ?? 1)
  const [error, setError] = useState('')

  const [isPending, startTransition] = useTransition()

  const handlePrimaryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPrimaryFile(file)
    setError('')

    const type: MediaType = file.type.startsWith('video/') ? 'video' : 'image'
    setMediaType(type)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setBackgroundFile(file)
    setError('')

    const type: MediaType = file.type.startsWith('video/') ? 'video' : 'image'
    setBackgroundMediaType(type)
    setBackgroundPreviewUrl(URL.createObjectURL(file))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    startTransition(async () => {
      try {
        if (isEditing && banner) {
          await updateBannerAction(
            {
              id: banner.id,
              text,
              imageUrl,
              mediaType,
              backgroundImageUrl,
              backgroundMediaType,
              displayOrder,
            },
            {
              primaryFile,
              backgroundFile,
            }
          )
        } else {
          await createBannerAction(
            {
              text,
              imageUrl,
              mediaType,
              backgroundImageUrl,
              backgroundMediaType,
              displayOrder,
            },
            {
              primaryFile,
              backgroundFile,
            }
          )
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save banner')
      }
    })
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
            rows={3}
            required
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 font-poppins text-gray-900"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 font-poppins">
            Primary media
          </label>

          {previewUrl && (
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
              {mediaType === 'video' ? (
                <video key={previewUrl} src={previewUrl} className="w-full h-full object-cover" controls muted playsInline />
              ) : (
                <img src={previewUrl} className="w-full h-full object-cover" />
              )}
            </div>
          )}

          <input
            type="file"
            accept="image/*,video/*"
            onChange={handlePrimaryUpload}
            disabled={isPending}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 font-poppins">
            Background media
          </label>

          {backgroundPreviewUrl && (
            <div className="w-full h-24 rounded-lg overflow-hidden bg-gray-100">
              {backgroundMediaType === 'video' ? (
                <video key={backgroundPreviewUrl} src={backgroundPreviewUrl} className="w-full h-full object-cover" controls muted playsInline />
              ) : (
                <img src={backgroundPreviewUrl} className="w-full h-full object-cover" />
              )}
            </div>
          )}

          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleBackgroundUpload}
            disabled={isPending}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Display order
          </label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            min={1}
            required
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-950 font-poppins outline-none focus:border-blue-500 w-32"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-500 text-white px-6 py-2.5 rounded-lg"
        >
          {isPending ? 'Saving...' : isEditing ? 'Update Banner' : 'Create Banner'}
        </button>
      </div>
    </form>
  )
}