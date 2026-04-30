import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function getCurrentCustomer() {
    const supabase = await createSupabaseServerClient()

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()

    if (error) {
        console.error('Failed to get current customer:', error.message)
        return null
    }

    return user
}

export async function requireCustomerAuth() {
    const user = await getCurrentCustomer()

    if (!user) {
        redirect('/login')
    }

    return user
}

export async function requireCustomerAuthWithRedirect(nextPath: string) {
    const user = await getCurrentCustomer()

    if (!user) {
        const safeNextPath = nextPath.startsWith('/') ? nextPath : '/'
        redirect(`/login?next=${encodeURIComponent(safeNextPath)}`)
    }

    return user
}