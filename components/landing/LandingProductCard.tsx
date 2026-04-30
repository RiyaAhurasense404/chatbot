import Image from 'next/image'
import AddToCartButton from '@/components/cart/AddToCartButton'
import type { LandingProductCardProps } from '@/types/landingProducts'

function getFinalPrice(price: number, discount: number | null): number {
  if (!discount || discount <= 0) return price

  return Number((price - (price * discount) / 100).toFixed(2))
}

export default function LandingProductCard({
  product,
  isLoggedIn,
}: LandingProductCardProps) {
  const finalPrice = getFinalPrice(product.price, product.discount)
  const isOutOfStock = Number(product.stock ?? 0) <= 0

  return (
    <article className="group overflow-hidden rounded-3xl border border-[#e7ddcc] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden bg-[#f5f0e8]">
        {product.image_url ? (
          product.media_type === 'video' ? (
            <video
              src={product.image_url}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              muted
              loop
              playsInline
              autoPlay
            />
          ) : (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            No image
          </div>
        )}

        {product.categoryName ? (
          <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {product.categoryName}
          </span>
        ) : null}
      </div>

      <div className="p-5">
        <h3 className="line-clamp-1 text-lg font-bold text-gray-900">
          {product.name}
        </h3>

        {product.description ? (
          <p className="mt-2 line-clamp-2 text-sm text-gray-500">
            {product.description}
          </p>
        ) : null}

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-gray-900">
              ₹{finalPrice}
            </p>

            {product.discount && product.discount > 0 ? (
              <p className="mt-1 text-sm text-gray-400 line-through">
                ₹{product.price}
              </p>
            ) : null}
          </div>

          <p
            className={
              isOutOfStock
                ? 'text-sm font-semibold text-red-600'
                : 'text-sm text-gray-500'
            }
          >
            {isOutOfStock ? 'Out of stock' : `Stock: ${product.stock}`}
          </p>
        </div>

        <div className="mt-5">
          <AddToCartButton
            productId={product.id}
            isLoggedIn={isLoggedIn}
            className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>
    </article>
  )
}