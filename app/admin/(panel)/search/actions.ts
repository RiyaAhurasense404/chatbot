'use server'
import { requireAdminSession } from '@/lib/admin/session'
import { searchProducts } from '@/lib/search/searchService'
import { SEARCH_CONFIG } from '@/lib/search/searchConfig'
import type { SearchApiResponse } from '@/types/search'

export async function adminSearchProductsAction(
  query: string
): Promise<SearchApiResponse> {
    await requireAdminSession()

  return searchProducts({
    mode: 'admin',
    query,
    includeInactive: true,
    limit: SEARCH_CONFIG.ADMIN_PRODUCT_LIMIT,
  })
}