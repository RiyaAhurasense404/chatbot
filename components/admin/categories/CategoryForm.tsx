'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { uploadCategoryImage, saveCategory, updateCategory } from '@/lib/services/adminCategories'
import { Category } from '@/types'

interface CategoryFormProps {
  category?: Category
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  const isEditing = !!category

  const [name, setName] = useState(category?.name ?? '')
  const [imageUrl, setImageUrl] = useState(category?.image_url ?? '')
  const [previewUrl, setPreviewUrl] = useState(category?.image_url ?? '')
  const [displayOrder, setDisplayOrder] = useState(category?.display_order ?? 1)
  const [size, setSize] = useState<'large' | 'small'>(category?.size ?? 'small')
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError('')

    try {
      const url = await uploadCategoryImage(file)
      setImageUrl(url)
      setPreviewUrl(url)
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      if (isEditing) {
        await updateCategory(category.id, name, imageUrl, displayOrder, size)
      } else {
        await saveCategory(name, imageUrl, displayOrder, size)
      }
      router.push('/admin/categories')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save category')
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-6">

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 font-poppins">
            Category name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rice"
            required
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 font-poppins text-gray-900"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 font-poppins">
            Category image
          </label>

          {previewUrl && (
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 mb-2">
              <img
                src={previewUrl}
                alt="preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <label className="flex items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p className="text-sm text-gray-500 font-poppins">
                {isUploading ? 'Uploading...' : 'Click to upload'}
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
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
            placeholder="Or paste image URL"
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 font-poppins text-gray-900"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 font-poppins">
            Card size
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="large"
                checked={size === 'large'}
                onChange={() => setSize('large')}
                className="accent-blue-500"
              />
              <span className="text-sm font-poppins text-gray-700">Large</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="small"
                checked={size === 'small'}
                onChange={() => setSize('small')}
                className="accent-blue-500"
              />
              <span className="text-sm font-poppins text-gray-700">Small</span>
            </label>
          </div>
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
            disabled={isSaving || isUploading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors font-poppins"
          >
            {isSaving ? 'Saving...' : isEditing ? 'Update category' : 'Add category'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/categories')}
            className="text-gray-500 hover:text-gray-700 text-sm font-poppins"
          >
            Cancel
          </button>
        </div>

      </div>
    </form>
  )
}