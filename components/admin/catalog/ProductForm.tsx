'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createProductAction, updateProductAction } from '@/app/admin/(panel)/catalog/actions'
import { Product } from '@/types'
import { MediaType } from '../../../types/media'
import {ProductFormProps} from '../../../types/index'


export default function ProductForm({
  categoryId,
  product,
  returnPath,
}: ProductFormProps) {
  const router = useRouter()
  const isEditing = !!product

  const [name, setName] = useState(product?.name ?? '')
  const [price, setPrice] = useState(product?.price ?? 0)
  const [discount, setDiscount] = useState(product?.discount ?? 0)
  const [stock, setStock] = useState(product?.stock ?? 0)
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? '')
  const [previewUrl, setPreviewUrl] = useState(product?.image_url ?? '')
  const [mediaType, setMediaType] = useState<MediaType>(product?.media_type ?? 'image')
  const [displayOrder, setDisplayOrder] = useState(product?.display_order ?? 1)
  const [file, setFile] = useState<File | undefined>()
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setError('')

    const nextMediaType: MediaType = selectedFile.type.startsWith('video/')
      ? 'video'
      : 'image'

    setMediaType(nextMediaType)
    setPreviewUrl(URL.createObjectURL(selectedFile))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    startTransition(async () => {
      try {
        if (isEditing && product) {
          await updateProductAction(
            returnPath,
            {
              id: product.id,
              categoryId,
              name,
              price,
              discount,
              stock,
              imageUrl,
              mediaType,
              displayOrder,
            },
            file
          )
        } else {
          await createProductAction(
            returnPath,
            {
              categoryId,
              name,
              price,
              discount,
              stock,
              imageUrl,
              mediaType,
              displayOrder,
            },
            file
          )
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save product')
      }
    })
  }

  const discountedPrice = discount > 0
    ? (price - (price * discount / 100)).toFixed(2)
    : null

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-6 max-w-2xl">

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 font-poppins">
            Product name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Organic Basmati Rice 1kg"
            required
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 font-poppins text-gray-900"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-medium text-gray-700 font-poppins">
              Price (₹)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min={0}
              step={0.01}
              required
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 font-poppins text-gray-900"
            />
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-medium text-gray-700 font-poppins">
              Discount (%)
            </label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              min={0}
              max={100}
              step={0.01}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 font-poppins text-gray-900"
            />
          </div>
        </div>

        {discountedPrice && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm font-poppins">
              Final price after {discount}% discount: <strong>₹{discountedPrice}</strong>
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 font-poppins">
            Stock quantity
          </label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            min={0}
            required
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 font-poppins text-gray-900 w-40"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 font-poppins">
            Product image or video
          </label>

          {previewUrl && (
            <div className="w-40 h-40 rounded-lg overflow-hidden bg-gray-100 mb-2">
              {mediaType === 'video' ? (
                <video
                  key={previewUrl}
                  src={previewUrl}
                  className="w-full h-full object-cover"
                  controls
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}

          <label className="flex items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p className="text-sm text-gray-500 font-poppins">
                {isPending ? 'Saving...' : 'Click to upload image or video'}
              </p>
              <p className="text-xs text-gray-400 font-poppins mt-1">
                Images up to 5MB · Videos up to 50MB
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

          <input
            type="text"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value)
              setPreviewUrl(e.target.value)
            }}
            placeholder="Or paste media URL"
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
            disabled={isPending}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors font-poppins"
          >
            {isPending ? 'Saving...' : isEditing ? 'Update product' : 'Add product'}
          </button>
          <button
            type="button"
            onClick={() => router.push(returnPath)}
            className="text-gray-500 hover:text-gray-700 text-sm font-poppins"
          >
            Cancel
          </button>
        </div>

      </div>
    </form>
  )
}