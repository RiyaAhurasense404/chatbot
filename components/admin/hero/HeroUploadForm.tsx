'use client'

import { useState, useTransition } from 'react'
import { updateHeroAction } from '@/app/admin/(panel)/hero/actions'
import { MediaType } from '@/types/media'

interface HeroUploadFormProps {
  currentImageUrl: string
  currentMediaType?: MediaType
}

export default function HeroUploadForm({
  currentImageUrl,
  currentMediaType = 'image',
}: HeroUploadFormProps) {
  const [imageUrl, setImageUrl] = useState(currentImageUrl)
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl)
  const [mediaType, setMediaType] = useState<MediaType>(currentMediaType)
  const [file, setFile] = useState<File | undefined>()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [isPending, startTransition] = useTransition()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setError('')
    setMessage('')

    const nextMediaType: MediaType = selectedFile.type.startsWith('video/')
      ? 'video'
      : 'image'

    setMediaType(nextMediaType)
    setPreviewUrl(URL.createObjectURL(selectedFile))
    setMessage('Media selected. Click Save changes to apply.')
  }

  const handleSave = () => {
    setError('')
    setMessage('')

    startTransition(async () => {
      try {
        await updateHeroAction(
          {
            backgroundImageUrl: imageUrl,
            backgroundMediaType: mediaType,
          },
          file
        )

        setMessage('Hero media updated successfully')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Save failed')
      }
    })
  }

  return (
    <div>
      {previewUrl && previewUrl !== currentImageUrl && (
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 font-poppins mb-3">
            New media preview
          </p>
          <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
            {mediaType === 'video' ? (
              <video
                src={previewUrl}
                className="w-full h-full object-cover"
                controls
                muted
              />
            ) : (
              <img
                src={previewUrl}
                alt="New hero preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      )}

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 font-poppins mb-3">
          Upload new media
        </p>
        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-gray-400 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <p className="text-sm text-gray-500 font-poppins">
              {isPending ? 'Uploading...' : 'Click to upload image or video'}
            </p>
            <p className="text-xs text-gray-400 font-poppins mt-1">
              Images up to 5MB, videos up to 50MB
            </p>
          </div>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            disabled={isPending}
            className="hidden"
          />
        </label>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 font-poppins mb-2">
          Or paste media URL
        </p>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => {
            setImageUrl(e.target.value)
            setPreviewUrl(e.target.value)
          }}
          placeholder="https://..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 font-poppins text-gray-900"
        />
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm font-poppins">{message}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-poppins">{error}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors font-poppins"
      >
        {isPending ? 'Saving...' : 'Save changes'}
      </button>
    </div>
  )
}