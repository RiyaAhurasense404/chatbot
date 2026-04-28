import { NextRequest, NextResponse } from 'next/server'
import { searchProducts } from '@/lib/search/searchService'
import { SEARCH_CONFIG } from '@/lib/search/searchConfig'
import { sanitizeSearchQuery } from '@/lib/search/searchUtils'
import { checkSearchRateLimit } from '@/lib/search/searchRateLimit'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function getSearchIdentifier(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? 'unknown'
  }

  if (realIp) {
    return realIp
  }

  return 'unknown'
}

export async function GET(request: NextRequest) {
  try {
    const identifier = getSearchIdentifier(request)

    const rateLimit = await checkSearchRateLimit(identifier)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many search requests. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.resetInSeconds),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
          },
        }
      )
    }

    const { searchParams } = new URL(request.url)

    const query = sanitizeSearchQuery(searchParams.get('q') ?? '')

    if (query.length < SEARCH_CONFIG.MIN_QUERY_LENGTH) {
      return NextResponse.json(
        {
          query,
          source: 'meilisearch',
          total: 0,
          suggestions: [],
          products: [],
        },
        { status: 200 }
      )
    }

    if (query.length > SEARCH_CONFIG.MAX_QUERY_LENGTH) {
      return NextResponse.json(
        {
          error: `Search query cannot be longer than ${SEARCH_CONFIG.MAX_QUERY_LENGTH} characters`,
        },
        { status: 400 }
      )
    }

    const result = await searchProducts({
      mode: 'public',
      query,
      includeInactive: false,
      limit: SEARCH_CONFIG.PUBLIC_PRODUCT_LIMIT,
    })

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
    })
  } catch (error) {
    console.error('Search API error:', error)

    return NextResponse.json(
      {
        error: 'Something went wrong while searching',
      },
      { status: 500 }
    )
  }
}