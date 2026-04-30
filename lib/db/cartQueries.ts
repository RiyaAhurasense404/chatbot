import { supabaseServer } from "@/lib/supabase";
import type { Cart, CartItem, CartProductSnapshot } from "@/types/cart";
import type { CartItemWithProductRow, ProductForCartRow } from "@/types/cartDb";
import { calculateFinalPrice } from "./cartUtils";

export async function fetchProductForCart(
  productId: string
): Promise<CartProductSnapshot> {
  const { data, error } = await supabaseServer
    .from("products")
    .select(
      `
      id,
      name,
      price,
      discount,
      image_url,
      media_type,
      stock,
      is_active
    `
    )
    .eq("id", productId)
    .single();

  if (error || !data) {
    throw new Error("This product does not exist.");
  }

  const product = data as unknown as ProductForCartRow;
  const price = Number(product.price ?? 0);
  const discount = Number(product.discount ?? 0);
  const stock = Number(product.stock ?? 0);

  return {
    id: product.id,
    name: product.name,
    price,
    discount,
    finalPrice: calculateFinalPrice(price, discount),
    stock,
    isActive: product.is_active === true,
    imageUrl: product.image_url,
    mediaType: product.media_type,
  };
}

export async function getActiveCart(userId: string): Promise<Cart | null> {
  const { data, error } = await supabaseServer
    .from("carts")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch active cart: ${error.message}`);
  }

  return (data ?? null) as Cart | null;
}

export async function getOrCreateActiveCart(userId: string): Promise<Cart> {
  const existingCart = await getActiveCart(userId);

  if (existingCart) {
    return existingCart;
  }

  const { data, error } = await supabaseServer
    .from("carts")
    .insert({
      user_id: userId,
      status: "active",
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create cart: ${error.message}`);
  }

  return data as Cart;
}

export async function fetchCartItems(
  cartId: string
): Promise<CartItemWithProductRow[]> {
  const { data, error } = await supabaseServer
    .from("cart_items")
    .select(
      `
      id,
      cart_id,
      product_id,
      quantity,
      price_at_add_time,
      product_name_snapshot,
      product_image_snapshot,
      created_at,
      updated_at,
      products (
        id,
        name,
        price,
        discount,
        image_url,
        media_type,
        stock,
        is_active
      )
    `
    )
    .eq("cart_id", cartId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch cart items: ${error.message}`);
  }

  return (data ?? []) as unknown as CartItemWithProductRow[];
}

export async function getExistingCartItem(params: {
  cartId: string;
  productId: string;
}): Promise<CartItem | null> {
  const { data, error } = await supabaseServer
    .from("cart_items")
    .select("*")
    .eq("cart_id", params.cartId)
    .eq("product_id", params.productId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch cart item: ${error.message}`);
  }

  return (data ?? null) as CartItem | null;
}
