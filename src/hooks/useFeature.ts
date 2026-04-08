import { useRigstackStore } from "../store/toolStore";
import { canAccess, type Tier } from "../lib/tier";

export function useFeature(requiredTier: Tier): boolean {
  const userTier = useRigstackStore((s) => s.tier);
  return canAccess(userTier, requiredTier);
}
