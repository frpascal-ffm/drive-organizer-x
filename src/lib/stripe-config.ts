// Stripe product & price mapping for MietFleet
export const STRIPE_PRODUCTS = {
  free: {
    product_id: null,
    price_id: null,
    name: "Kostenlos",
    price: 0,
    maxVehicles: 1,
  },
  starter: {
    product_id: "prod_UD0amCC9RkB23b",
    price_id: "price_1TEaZFQRybdu3eeWUfSRKStn",
    name: "Starter",
    price: 29,
    maxVehicles: 5,
  },
  professional: {
    product_id: "prod_UD0aRApfRyr62B",
    price_id: "price_1TEaZcQRybdu3eeWhIBA0yfq",
    name: "Professional",
    price: 49,
    maxVehicles: 15,
  },
  business: {
    product_id: "prod_UD0be97S5v0JCy",
    price_id: "price_1TEaZzQRybdu3eeWNmOsqnNo",
    name: "Business",
    price: 69,
    maxVehicles: 30,
  },
} as const;

export type SubscriptionTier = keyof typeof STRIPE_PRODUCTS;

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | null;

export function isSubscriptionActive(status: SubscriptionStatus): boolean {
  return status === "active" || status === "trialing";
}

export function getTierByProductId(productId: string | null): SubscriptionTier {
  if (!productId) return "free";
  for (const [key, val] of Object.entries(STRIPE_PRODUCTS)) {
    if (val.product_id === productId) return key as SubscriptionTier;
  }
  return "free";
}
