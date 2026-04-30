export interface GuestCartProduct {
    id: string
    name: string
    price: number
    discount: number | null
    finalPrice: number
    imageUrl: string | null
    mediaType: string | null
    stock: number
    isActive: boolean
  }

  export type GuestCartProductRow = {
    id: string
    name: string
    price: number
    discount: number | null
    image_url: string | null
    media_type: string | null
    stock: number | null
    is_active: boolean
  }