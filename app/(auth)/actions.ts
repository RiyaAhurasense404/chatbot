'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function signUpAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const username = String(formData.get('username') ?? '').trim()
  const fullName = String(formData.get('fullName') ?? '').trim()

  if (!email || !password) {
    redirect('/signup?error=missing_fields')
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/login?message=check_email')
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const next = String(formData.get('next') ?? '/')

  if (!email || !password) {
    redirect('/login?error=missing_fields')
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  redirect(next.startsWith('/') ? next : '/')
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient()

  await supabase.auth.signOut()

  redirect('/')
}

export async function forgotPasswordAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()

  if (!email) {
    redirect('/forgot-password?error=missing_email')
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
  })

  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/forgot-password?message=check_email')
}

export async function resetPasswordAction(formData: FormData) {
  const password = String(formData.get('password') ?? '')

  if (!password) {
    redirect('/reset-password?error=missing_password')
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/login?message=password_updated')
}