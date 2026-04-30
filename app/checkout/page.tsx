import Image from 'next/image'
import Link from 'next/link'
import { requireCustomerAuthWithRedirect } from '@/lib/auth/customer'
import { validateCartForCheckout } from '@/lib/db/cartCheckout'

const PAYMENT_QR_IMAGE_PATH = '/payment-qr.png'

export default async function CheckoutPage() {
  const user = await requireCustomerAuthWithRedirect('/checkout')
  const validation = await validateCartForCheckout(user.id)

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-10">
      <section className="mx-auto max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Checkout
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Review your cart before payment.
          </p>
        </div>

        {!validation.isValid ? (
          <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Cart needs attention
            </h2>

            <div className="mt-4 space-y-3">
              {validation.issues.map((issue, index) => (
                <p
                  key={`${issue.code}-${issue.productId ?? index}`}
                  className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {issue.message}
                </p>
              ))}
            </div>

            <Link
              href="/cart"
              className="mt-6 inline-flex rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Go back to cart
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">
                Payment
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Scan the QR code to complete your payment. After paying, click the confirmation button below.
              </p>

              <div className="mt-6 flex items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <Image
                    src={PAYMENT_QR_IMAGE_PATH}
                    alt="Payment QR code"
                    width={260}
                    height={260}
                    priority
                    className="h-auto w-[260px] rounded-xl"
                  />
                </div>
              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                I have paid
              </button>

              <p className="mt-3 text-center text-xs text-gray-500">
                Payment will be submitted for manual verification.
              </p>
            </div>

            <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-5 space-y-4">
                {validation.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between gap-4 border-b border-gray-100 pb-3 text-sm last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {item.productName}
                      </p>
                      <p className="mt-1 text-gray-500">
                        Qty: {item.quantity} × ₹{item.unitPrice}
                      </p>
                    </div>

                    <p className="font-semibold text-gray-900">
                      ₹{item.lineTotal}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total quantity</span>
                  <span className="font-semibold text-gray-900">
                    {validation.totalQuantity}
                  </span>
                </div>

                <div className="mt-3 flex justify-between text-base font-bold text-gray-900">
                  <span>Subtotal</span>
                  <span>₹{validation.subtotal}</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  )
}