import { getCart } from "@/lib/db/cart";
import type { CartItemResponse } from "@/types/cart";
import type {
  CheckoutValidatedItem,
  CheckoutValidationIssue,
  CheckoutValidationResult,
} from "@/types/cartCheckout";

function buildCheckoutItem(item: CartItemResponse): CheckoutValidatedItem {
  const unitPrice = Number(item.latestFinalPrice ?? 0);
  const lineTotal = Number((unitPrice * item.quantity).toFixed(2));

  return {
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    unitPrice,
    lineTotal,
    stock: item.stock,
  };
}

export async function validateCartForCheckout(
  userId: string
): Promise<CheckoutValidationResult> {
  const cart = await getCart(userId);
  const issues: CheckoutValidationIssue[] = [];

  if (!cart.cartId || cart.items.length === 0) {
    return {
      isValid: false,
      cartId: cart.cartId,
      items: [],
      subtotal: 0,
      totalQuantity: 0,
      issues: [
        {
          code: "cart_empty",
          message: "Your cart is empty.",
        },
      ],
    };
  }

  for (const item of cart.items) {
    if (!item.isActive) {
      issues.push({
        code: "product_unavailable",
        productId: item.productId,
        productName: item.productName,
        message: `${item.productName} is currently unavailable.`,
      });
      continue;
    }

    if (item.stock < item.quantity) {
      issues.push({
        code: "stock_changed",
        productId: item.productId,
        productName: item.productName,
        message: `Only ${item.stock} units of ${item.productName} are available.`,
      });
    }

    if (item.hasPriceChanged) {
      issues.push({
        code: "price_changed",
        productId: item.productId,
        productName: item.productName,
        message: `Price changed for ${item.productName}. Latest price will be used at checkout.`,
      });
    }
  }

  const validItems = cart.items
    .filter((item) => item.isActive && item.stock >= item.quantity)
    .map(buildCheckoutItem);

  const subtotal = Number(
    validItems.reduce((total, item) => total + item.lineTotal, 0).toFixed(2)
  );

  const totalQuantity = validItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const blockingIssues = issues.filter(
    (issue) => issue.code !== "price_changed"
  );

  return {
    isValid: blockingIssues.length === 0,
    cartId: cart.cartId,
    items: validItems,
    subtotal,
    totalQuantity,
    issues,
  };
}
