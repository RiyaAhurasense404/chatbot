import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getLandingProducts } from '@/lib/db/landingProducts'
import LandingProductCard from './LandingProductCard'

export default async function LandingProductsSection() {
  const [products, supabase] = await Promise.all([
    getLandingProducts(),
    createSupabaseServerClient(),
  ])

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (products.length === 0) {
    return null
  }

  return (
    <section className="bg-[#f5f0e8] px-6 py-16" id="products">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
            Shop Samatva
          </p>
          <h2 className="mt-3 text-4xl font-bold text-gray-900">
            Featured Products
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-500">
            Explore fresh products and add them to your cart instantly.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <LandingProductCard
              key={product.id}
              product={product}
              isLoggedIn={Boolean(user)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
