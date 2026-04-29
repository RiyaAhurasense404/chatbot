import Link from 'next/link'
import { forgotPasswordAction } from '@/app/(auth)/actions'
import type { ForgotPasswordPageProps } from '@/types/auth'


export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const params = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Forgot password
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter your email and we&apos;ll send you a password reset link.
        </p>

        {params.error ? (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {params.error === 'missing_email'
              ? 'Please enter your email address.'
              : params.error === 'email rate limit exceeded'
                ? 'Too many reset requests. Please wait a few minutes before trying again.'
                : 'Could not send reset email. Please try again.'}
          </p>
        ) : null}

        {params.message ? (
          <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {params.message === 'check_email'
              ? 'Please check your email for the reset link.'
              : 'Request completed successfully.'}
          </p>
        ) : null}

        <form action={forgotPasswordAction} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-600 focus:border-gray-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Send reset link
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Remember your password?{' '}
          <Link href="/login" className="font-semibold text-gray-900">
            Login
          </Link>
        </p>
      </div>
    </main>
  )
}