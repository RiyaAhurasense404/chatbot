import Link from 'next/link'
import { signUpAction } from '@/app/(auth)/actions'
import GoogleLoginButton from '@/components/auth/GoogleLoginButton'
import type { SignupPageProps } from '@/types/auth'


export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams
  const next = params.next ?? '/'

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Create account
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Create your Samatva account.
        </p>

        {params.error ? (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {params.error}
          </p>
        ) : null}

        <form action={signUpAction} className="mt-6 space-y-4">
          <input
            type="hidden"
            name="next"
            value={next}
          />

          <div>
            <label className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              name="username"
              type="text"
              placeholder="riya"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-600 focus:border-gray-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Full name
            </label>
            <input
              name="fullName"
              type="text"
              placeholder="Riya Singh"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-600 focus:border-gray-500"
            />
          </div>

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
            <label className="text-sm font-medium text-gray-700">
              Password
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
            Create account
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <GoogleLoginButton next={next} />

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-gray-900">
            Login
          </Link>
        </p>
      </div>
    </main>
  )
}