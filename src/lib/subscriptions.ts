export const subscriptionTiers = {
  starter: {
    name: "Starter",
    price_id: "price_1T3ZTBC1I7VBCNgyc9OdqvjU",
    product_id: "prod_U1ciiIHLO81wbn",
    price: "£97",
  },
  growth: {
    name: "Growth",
    price_id: "price_1T3ZTSC1I7VBCNgyjsKkfu7s",
    product_id: "prod_U1cixFmebtNyLz",
    price: "£197",
  },
  enterprise: {
    name: "Enterprise",
    price_id: "price_1T3ZToC1I7VBCNgyjKX7Rrvr",
    product_id: "prod_U1cjDP7mlFwf5D",
    price: "£497",
  },
} as const;

export type SubscriptionTier = keyof typeof subscriptionTiers;

export function getTierByProductId(productId: string): SubscriptionTier | null {
  for (const [key, tier] of Object.entries(subscriptionTiers)) {
    if (tier.product_id === productId) return key as SubscriptionTier;
  }
  return null;
}
