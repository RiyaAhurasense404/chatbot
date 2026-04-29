import GoogleLoginButton from '@/components/auth/GoogleLoginButton'
import Link from 'next/link'
import { loginAction } from '@/app/(auth)/actions'
import {LoginPageProps} from '@/types/auth'


export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const next = params.next ?? '/'

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Login
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Login to continue shopping .
        </p>

        {params.error ? (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {params.error === 'missing_fields'
              ? 'Please enter your email and password.'
              : 'Login failed. Please try again.'}
          </p>
        ) : null}

        {params.message ? (
          <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {params.message === 'check_email'
              ? 'Please check your email to confirm your account.'
              : params.message === 'password_updated'
                ? 'Password updated successfully. Please login again.'
                : 'Action completed successfully.'}
          </p>
        ) : null}

        <form action={loginAction} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next} />

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

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-gray-900 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <input
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-600 focus:border-gray-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Login
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <GoogleLoginButton next={next} />

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link
            href={`/signup?next=${encodeURIComponent(next)}`}
            className="font-semibold text-gray-900"
          >
            Create account
          </Link>
        </p>
      </div>
    </main>
  )
}