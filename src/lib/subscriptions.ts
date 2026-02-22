export const subscriptionTiers = {
  starter: {
    name: "Starter",
    price_id: "price_1SyIR4C1I7VBCNgyY9ke1fix",
    product_id: "prod_TwAmcHxDvuUW41",
    price: "£97",
  },
  growth: {
    name: "Growth",
    price_id: "price_1SyIRQC1I7VBCNgyf403lW2t",
    product_id: "prod_TwAmF92jyovoRP",
    price: "£197",
  },
  enterprise: {
    name: "Enterprise",
    price_id: "price_1SyIRiC1I7VBCNgyCAdW1iSV",
    product_id: "prod_TwAnVCMdieDSbv",
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
