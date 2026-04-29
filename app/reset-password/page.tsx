import Link from 'next/link'
import { resetPasswordAction } from '@/app/(auth)/actions'
import type { ResetPasswordPageProps } from '@/types/auth'

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Reset password
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter your new password below.
        </p>

        {params.error ? (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {params.error === 'missing_password'
              ? 'Please enter a new password.'
              : params.error === 'recovery_session_missing' ||
                  params.error === 'Auth session missing!'
                ? 'Your password reset session is missing or expired. Please request a new reset link.'
                : 'Could not update your password. Please try again.'}
          </p>
        ) : null}

        <form action={resetPasswordAction} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              New password
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-600 focus:border-gray-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Update password
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