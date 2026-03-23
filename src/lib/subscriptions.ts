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
    price_id: "price_1T4FKPC1I7VBCNgyjkPbY1or",
    product_id: "prod_U2JyxjhRCMUU9A",
    price: "£497",
  },
  growth: {
    name: "Growth",
    price_id: "price_1T4FKkC1I7VBCNgyGg2w0zVV",
    product_id: "prod_U2Jyms2Qf8fZq9",
    price: "£997",
  },
  premium: {
    name: "Premium",
    price_id: "price_1T4FL4C1I7VBCNgyUZG63Xn1",
    product_id: "prod_U2JzXngjkDd7xS",
    price: "£2,497",
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
