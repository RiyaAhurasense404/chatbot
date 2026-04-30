import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import GuestCartPage from '@/components/cart/GuestCartPage'
import { getCart } from '@/lib/db/cart'
import CartItemRow from '@/components/cart/CartItemRow'
import ClearCartButton from '@/components/cart/ClearCartButton'

export default async function CartPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <GuestCartPage />
  }

  const cart = await getCart(user.id)

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your Cart
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Review your items before checkout.
            </p>
          </div>

          {cart.items.length > 0 ? <ClearCartButton /> : null}
        </div>

        {cart.items.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Add products to your cart and they will appear here.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>

            <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Cart Summary
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Total quantity</span>
                  <span className="font-semibold text-gray-900">
                    {cart.totalQuantity}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₹{cart.subtotal}
                  </span>
                </div>
              </div>

              {cart.hasUnavailableItems ? (
                <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  Some items are unavailable. Please remove or update them before checkout.
                </p>
              ) : null}

              {cart.hasPriceChanges ? (
                <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  Some prices changed. Latest prices will be used at checkout.
                </p>
              ) : null}

              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Continue to checkout
              </Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  )
}