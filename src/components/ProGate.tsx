import { useFeature } from "../hooks/useFeature";
import type { Tier } from "../lib/tier";
import type { ReactNode } from "react";

interface ProGateProps {
  feature: string;
  requiredTier: Tier;
  children: ReactNode;
}

export function ProGate({ feature, requiredTier, children }: ProGateProps) {
  const hasAccess = useFeature(requiredTier);

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="bg-surface-raised border border-surface-overlay rounded-xl p-6 text-center">
      <p className="text-sm text-gray-400 mb-2">
        <span className="font-medium text-gray-200">{feature}</span> requires the{" "}
        <span className="text-accent">{requiredTier}</span> plan.
      </p>
      <a
        href="https://robodeck.dev/pricing"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-accent hover:underline"
      >
        Learn more about upgrading
      </a>
    </div>
  );
}
