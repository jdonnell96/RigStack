export type Tier = "free" | "team" | "vendor";

export async function initTier(): Promise<Tier> {
  // v0.1: always free. Private backend integration deferred.
  return "free";
}

export function canAccess(userTier: Tier, requiredTier: Tier): boolean {
  const hierarchy: Tier[] = ["free", "team", "vendor"];
  return hierarchy.indexOf(userTier) >= hierarchy.indexOf(requiredTier);
}
