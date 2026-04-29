export interface GoogleLoginButtonProps {
    next?: string
}

export interface LoginPageProps {
    searchParams: Promise<{
        next?: string
        error?: string
        message?: string
    }>
}

export interface LogoutButtonProps {
    redirectTo?: string
    className?: string
}

export interface SignupPageProps {
    searchParams: Promise<{
        error?: string
        next?: string
    }>
}

export interface ProfileMenuClientProps {
    displayName: string
    email: string | null
}

export interface ForgotPasswordPageProps {
    searchParams: Promise<{
        error?: string
        message?: string
    }>
}

export interface ResetPasswordPageProps {
    searchParams: Promise<{
      error?: string
    }>
  }