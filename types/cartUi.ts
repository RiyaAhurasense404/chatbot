import type { CartActionResult } from '@/types/cart'

export interface AddToCartButtonProps {
    productId: string
    quantity?: number
    isLoggedIn: boolean
    className?: string
    children?: React.ReactNode
    onCartUpdated?: (result: CartActionResult) => void
    disabled?: boolean
    disabledMessage?: string
}

export interface CartIconProps {
    isLoggedIn: boolean
    href?: string
    className?: string
}

export interface QuantityControlProps {
    productId: string
    quantity: number
    onUpdated?: (count?: number) => void
}