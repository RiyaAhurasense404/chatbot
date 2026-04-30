'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getGuestCartProductsAction } from '@/lib/actions/cartActions'
import {
  clearGuestCart,
  decrementGuestCartItem,
  getGuestCart,
  getGuestCartCount,
  incrementGuestCartItem,
  removeGuestCartItem,
} from '@/lib/utils/guestCart'
import type { GuestCart } from '@/types/cart'
import type { GuestCartProduct } from '@/types/guestCartProduct'

export default function GuestCartPage() {
  const [cart, setCart] = useState<GuestCart>({
    items: [],
    updatedAt: new Date().toISOString(),
  })
  const [productsById, setProductsById] = useState<Record<string, GuestCartProduct>>({})

  useEffect(() => {
    setCart(getGuestCart())

    function handleGuestCartUpdated() {
      setCart(getGuestCart())
    }

    window.addEventListener('guest-cart-updated', handleGuestCartUpdated)

    return () => {
      window.removeEventListener('guest-cart-updated', handleGuestCartUpdated)
    }
  }, [])

  useEffect(() => {
    const productIds = cart.items.map((item) => item.productId)

    if (productIds.length === 0) {
      setProductsById({})
      return
    }

    let isCurrent = true

    async function loadProducts() {
      try {
        const products = await getGuestCartProductsAction(productIds)

        if (!isCurrent) return

        setProductsById(
          Object.fromEntries(products.map((product) => [product.id, product]))
        )
      } catch (error) {
        console.error('Failed to load guest cart products:', error)
      }
    }

    void loadProducts()

    return () => {
      isCurrent = false
    }
  }, [cart.items])

  function dispatchCountUpdate() {
    window.dispatchEvent(
      new CustomEvent('cart-count-updated', {
        detail: { count: getGuestCartCount() },
      })
    )
  }

  function handleIncrement(productId: string) {
    const updatedCart = incrementGuestCartItem(productId)
    setCart(updatedCart)
    dispatchCountUpdate()
  }

  function handleDecrement(productId: string) {
    const updatedCart = decrementGuestCartItem(productId)
    setCart(updatedCart)
    dispatchCountUpdate()
  }

  function handleRemove(productId: string) {
    const updatedCart = removeGuestCartItem(productId)
    setCart(updatedCart)
    dispatchCountUpdate()
  }

  function handleClearCart() {
    const updatedCart = clearGuestCart()
    setCart(updatedCart)
    dispatchCountUpdate()
  }

  const totalQuantity = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  )

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your Cart
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              You are shopping as a guest. Login is required only at checkout.
            </p>
          </div>

          {cart.items.length > 0 ? (
            <button
              type="button"
              onClick={handleClearCart}
              className="text-sm font-semibold text-red-600 transition hover:text-red-700"
            >
              Clear cart
            </button>
          ) : null}
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
                <div
                  key={item.productId}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        {productsById[item.productId]?.name ?? 'Loading product...'}
                      </h3>

                      {productsById[item.productId] ? (
                        <>
                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            ₹{productsById[item.productId].finalPrice}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {productsById[item.productId].isActive
                              ? `Stock: ${productsById[item.productId].stock}`
                              : 'Currently unavailable'}
                          </p>
                        </>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(item.productId)}
                      className="text-sm font-semibold text-red-600 transition hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    {item.quantity <= 1 ? (
                      <button
                        type="button"
                        onClick={() => handleRemove(item.productId)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        aria-label="Remove item"
                      >
                        🗑
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDecrement(item.productId)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                    )}

                    <span className="min-w-8 text-center text-sm font-semibold text-gray-900">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleIncrement(item.productId)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Cart Summary
              </h2>

              <div className="mt-5 flex justify-between text-sm text-gray-600">
                <span>Total quantity</span>
                <span className="font-semibold text-gray-900">
                  {totalQuantity}
                </span>
              </div>

              <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                Login to validate product price, stock, and continue checkout.
              </p>

              <Link
                href="/login?next=/checkout"
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Login to checkout
              </Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  )
}