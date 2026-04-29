export function getSiteUrl() {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.NEXT_PUBLIC_VERCEL_URL ??
      'http://localhost:3000'
  
    const normalizedUrl = siteUrl.startsWith('http')
      ? siteUrl
      : `https://${siteUrl}`
  
    return normalizedUrl.endsWith('/')
      ? normalizedUrl.slice(0, -1)
      : normalizedUrl
  }
  
  export function getAuthCallbackUrl(next = '/') {
    const safeNext = next.startsWith('/') ? next : '/'
  
    return `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(safeNext)}`
  }