'use server'

import { requireAdminSession } from '@/lib/admin/session'
import { getProductById } from '@/lib/db/admin/products'

export async function getAdminProductDetailAction(productId: string) {
  await requireAdminSession()

  return getProductById(productId)
}