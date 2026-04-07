import { useRobodeckStore } from "../store/toolStore";
import type { Stage } from "../types/tool";

const STAGES: { key: Stage | "all"; label: string }[] = [
  { key: "all", label: "All Tools" },
  { key: "capture", label: "Capture" },
  { key: "annotate", label: "Annotate" },
  { key: "train", label: "Train" },
  { key: "simulate", label: "Simulate" },
  { key: "infra", label: "Infrastructure" },
];

export function StageFilter() {
  const activeStage = useRobodeckStore((s) => s.activeStage);
  const setActiveStage = useRobodeckStore((s) => s.setActiveStage);

  return (
    <nav className="flex flex-col gap-1">
      {STAGES.map((s) => (
        <button
          key={s.key}
          onClick={() => setActiveStage(s.key)}
          className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
            activeStage === s.key
              ? "bg-accent/10 text-accent font-medium"
              : "text-gray-400 hover:text-gray-200 hover:bg-surface-overlay"
          }`}
        >
          {s.label}
        </button>
      ))}
    </nav>
  );
}
