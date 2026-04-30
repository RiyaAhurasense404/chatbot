export type CheckoutValidationIssueCode =
  | 'cart_empty'
  | 'product_unavailable'
  | 'stock_changed'
  | 'price_changed'

export interface CheckoutValidationIssue {
  code: CheckoutValidationIssueCode
  productId?: string
  productName?: string
  message: string
}

export interface CheckoutValidatedItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  lineTotal: number
  stock: number
}

export interface CheckoutValidationResult {
  isValid: boolean
  cartId: string | null
  items: CheckoutValidatedItem[]
  subtotal: number
  totalQuantity: number
  issues: CheckoutValidationIssue[]
}