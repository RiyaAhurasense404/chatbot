import { NextRequest, NextResponse } from 'next/server'
import { reindexProductsSearch } from '@/lib/search/reindexProducts'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const result = await reindexProductsSearch()

    return NextResponse.json(
      {
        success: true,
        message: 'Search index reindexed successfully',
        ...result,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Search reindex cron error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reindex search',
      },
      { status: 500 }
    )
  }
}