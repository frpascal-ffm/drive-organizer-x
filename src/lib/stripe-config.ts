// Stripe product & price mapping for MietFleet
export const STRIPE_PRODUCTS = {
  professional: {
    product_id: "prod_UCzDJss1PNZuLo",
    price_id: "price_1TEZFKQRybdu3eeWM4BECP3L",
    name: "Professional",
    price: 29.99,
  },
} as const;

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
