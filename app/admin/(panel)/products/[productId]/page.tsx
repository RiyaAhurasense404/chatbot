import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAdminProductDetailAction } from './actions'

interface AdminProductDetailPageProps {
  params: Promise<{
    productId: string
  }>
}

export default async function AdminProductDetailPage({
  params,
}: AdminProductDetailPageProps) {
  const { productId } = await params
  const product = await getAdminProductDetailAction(productId)

  if (!product) {
    notFound()
  }

  const discount = Number(product.discount ?? 0)
  const price = Number(product.price ?? 0)
  const finalPrice =
    discount > 0 ? price - (price * discount) / 100 : price

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href={
              product.category_id
                ? `/admin/catalog/${product.category_id}`
                : '/admin/catalog'
            }
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            ← Back to catalog
          </Link>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Full admin product details
          </p>
        </div>

        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            product.is_active
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {product.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {product.image_url ? (
            product.media_type === 'video' ? (
              <video
                src={product.image_url}
                controls
                className="h-[420px] w-full object-cover"
              />
            ) : (
              <div className="relative h-[420px] w-full">
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
            <div className="flex h-[420px] items-center justify-center bg-gray-50 text-sm text-gray-400">
              No product image
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Product Information
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <DetailCard label="Price" value={`₹${price.toFixed(2)}`} />
            <DetailCard
              label="Final Price"
              value={`₹${finalPrice.toFixed(2)}`}
            />
            <DetailCard label="Discount" value={`${discount}%`} />
            <DetailCard label="Stock" value={String(product.stock ?? 0)} />
            <DetailCard
              label="Media Type"
              value={product.media_type ?? 'N/A'}
            />
            <DetailCard
              label="Display Order"
              value={String(product.display_order ?? 0)}
            />
            <DetailCard
              label="Category ID"
              value={product.category_id ?? 'Uncategorized'}
            />
            <DetailCard
              label="Created At"
              value={
                product.created_at
                  ? new Date(product.created_at).toLocaleString()
                  : 'N/A'
              }
            />
          </div>

          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Product ID
            </p>
            <p className="mt-1 break-all text-sm text-gray-700">
              {product.id}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

function DetailCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  )
}