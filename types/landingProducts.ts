export interface LandingProduct {
  id: string
  name: string
  description: string | null
  price: number
  discount: number | null
  image_url: string | null
  media_type: string | null
  stock: number | null
  is_active: boolean
  category_id: string | null
  categoryName: string | null
}

export type LandingProductRow = {
    id: string
    name: string
    description: string | null
    price: number
    discount: number | null
    image_url: string | null
    media_type: string | null
    stock: number | null
    is_active: boolean
    category_id: string | null
    categories: { name: string | null } | { name: string | null }[] | null
  }

 export interface LandingProductCardProps {
    product: LandingProduct
    isLoggedIn: boolean
  }