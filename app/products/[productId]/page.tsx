import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/db/admin/products'

interface ProductPageProps {
  params: Promise<{
    productId: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params

  const product = await getProductById(productId)

  if (!product || !product.is_active) {
    notFound()
  }

  const finalPrice =
    product.discount && product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price

  const hasDiscount = product.discount && product.discount > 0

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 rounded-3xl bg-white p-5 shadow-sm md:grid-cols-2 md:p-8">
          <div className="overflow-hidden rounded-2xl bg-gray-100">
            {product.image_url ? (
              product.media_type === 'video' ? (
                <video
                  src={product.image_url}
                  controls
                  className="h-full min-h-[320px] w-full object-cover"
                />
              ) : (
                <div className="relative min-h-[320px] w-full md:min-h-[500px]">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              )
            ) : (
              <div className="flex min-h-[320px] items-center justify-center text-sm text-gray-400 md:min-h-[500px]">
                No product image
              </div>
            )}
          </div>

          <section className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-gray-400">
              Samatva Product
            </p>

            <h1 className="text-3xl font-semibold text-gray-900 md:text-5xl">
              {product.name}
            </h1>

            <div className="mt-6 flex items-end gap-3">
              <p className="text-3xl font-bold text-gray-900">
                ₹{finalPrice.toFixed(2)}
              </p>

              {hasDiscount && (
                <>
                  <p className="pb-1 text-lg text-gray-400 line-through">
                    ₹{product.price.toFixed(2)}
                  </p>

                  <span className="mb-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Stock
                </p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {product.stock > 0
                    ? `${product.stock} available`
                    : 'Out of stock'}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Status
                </p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {product.stock > 0 ? 'Available' : 'Unavailable'}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f8f5ef] p-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Product Details
              </h2>

              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <div className="flex justify-between gap-4">
                  <span>Product ID</span>
                  <span className="text-right text-gray-900">
                    {product.id}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span>Category ID</span>
                  <span className="text-right text-gray-900">
                    {product.category_id}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span>Display Order</span>
                  <span className="text-right text-gray-900">
                    {product.display_order}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}