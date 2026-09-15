export const setupProducts = {
  starter: {
    name: "Starter Setup",
    price_id: "price_1TBvmXC1I7VBCNgyWmHFnU09",
    product_id: "prod_UAGJrIMjAcFReX",
    price: "£199",
  },
  growth: {
    name: "Growth Setup",
    price_id: "price_1TBvmYC1I7VBCNgyHi3xuWI8",
    product_id: "prod_UAGJ7uYv9DjHj1",
    price: "£299",
  },
  premium: {
    name: "Premium Setup",
    price_id: "price_1TBvmZC1I7VBCNgyCmBu3IsD",
    product_id: "prod_UAGJFglibseEYZ",
    price: "£399",
  },
} as const;

export const monthlySubscription = {
  name: "Advant Flow AI Monthly",
  price_id: "price_1TBvmaC1I7VBCNgyc0oPWI16",
  product_id: "prod_UAGJhyHd6sLLjF",
  price: "£49",
} as const;

// Legacy products kept for existing customers
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

export const webDesignProducts = {
  starter: {
    name: "Starter",
    price_id: "price_1UFrKmC1I7VBCNgyIeXz9k91",
    product_id: "prod_U2JyxjhRCMUU9A",
    price: "£797",
  },
  growth: {
    name: "Growth",
    price_id: "price_1UFrRuC1I7VBCNgyDeKwE3hi",
    product_id: "prod_U2Jyms2Qf8fZq9",
    price: "£1,497",
  },
  premium: {
    name: "Premium",
    price_id: "price_1UFrS6C1I7VBCNgyNQMs0Ijp",
    product_id: "prod_U2JzXngjkDd7xS",
    price: "£2,997",
  },
} as const;

export type SubscriptionTier = keyof typeof subscriptionTiers;
export type SetupTier = keyof typeof setupProducts;

export function getTierByProductId(productId: string): SubscriptionTier | null {
  for (const [key, tier] of Object.entries(subscriptionTiers)) {
    if (tier.product_id === productId) return key as SubscriptionTier;
  }
  return null;
}

export function getSetupTierByProductId(productId: string): SetupTier | null {
  for (const [key, tier] of Object.entries(setupProducts)) {
    if (tier.product_id === productId) return key as SetupTier;
  }
  return null;
}
