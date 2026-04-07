import { useRobodeckStore } from "../store/toolStore";
import { useInstallLog } from "../hooks/useInstallLog";
import { useEffect, useRef } from "react";

export function InstallDrawer() {
  const activeInstall = useRobodeckStore((s) => s.activeInstall);
  const logs = useRobodeckStore((s) =>
    activeInstall ? s.installLogs[activeInstall] ?? [] : []
  );
  const setActiveInstall = useRobodeckStore((s) => s.setActiveInstall);
  const status = useRobodeckStore((s) =>
    activeInstall ? s.statuses[activeInstall] : null
  );
  const logEndRef = useRef<HTMLDivElement>(null);

  useInstallLog(activeInstall);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  if (!activeInstall) return null;

  const isDone = status !== "installing";

  return (
    <div className="fixed bottom-0 right-0 w-[480px] h-80 bg-surface-raised border-l border-t border-surface-overlay rounded-tl-xl shadow-2xl flex flex-col z-40">
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-overlay">
        <span className="text-sm font-medium">
          {isDone ? "Install Complete" : "Installing..."}
        </span>
        <button
          onClick={() => setActiveInstall(null)}
          className="text-gray-500 hover:text-gray-300 text-lg leading-none"
        >
          ×
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-gray-400 space-y-0.5">
        {logs.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
