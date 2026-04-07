import { useRobodeckStore } from "../store/toolStore";
import { useInstallLog } from "../hooks/useInstallLog";
import { useEffect, useRef } from "react";

export function InstallDrawer() {
  const activeInstall = useRobodeckStore((s) => s.activeInstall);
  const manifests = useRobodeckStore((s) => s.manifests);
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

  const tool = manifests.find((m) => m.id === activeInstall);
  const toolName = tool?.name ?? activeInstall;
  const isInstalling = status === "installing";
  const isError = status === "error";
  const isInstalled = status === "installed";

  return (
    <div className="fixed bottom-0 right-0 w-[520px] h-96 bg-surface-raised border-l border-t border-surface-overlay rounded-tl-xl shadow-2xl flex flex-col z-40">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-overlay">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-white">{toolName}</span>
          {isInstalling && (
            <span className="text-[10px] uppercase tracking-wider text-status-blue bg-status-blue/10 px-2 py-0.5 rounded-full animate-pulse">
              Installing
            </span>
          )}
          {isError && (
            <span className="text-[10px] uppercase tracking-wider text-status-red bg-status-red/10 px-2 py-0.5 rounded-full">
              Failed
            </span>
          )}
          {isInstalled && (
            <span className="text-[10px] uppercase tracking-wider text-status-green bg-status-green/10 px-2 py-0.5 rounded-full">
              Complete
            </span>
          )}
        </div>
        <button
          onClick={() => setActiveInstall(null)}
          className="text-gray-500 hover:text-gray-300 text-lg leading-none px-1"
        >
          x
        </button>
      </div>

      {/* Log output */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-5 space-y-0">
        {logs.length === 0 && isInstalling && (
          <div className="text-gray-600 italic">Waiting for output...</div>
        )}
        {logs.length === 0 && !isInstalling && (
          <div className="text-gray-600 italic">No log output for this tool.</div>
        )}
        {logs.map((line, i) => (
          <div
            key={i}
            className={
              line.startsWith("[ERROR]") || line.startsWith("[FAILED]")
                ? "text-status-red"
                : line.startsWith("[OK]")
                  ? "text-status-green"
                  : line.startsWith("$")
                    ? "text-accent"
                    : "text-gray-400"
            }
          >
            {line}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      {/* Progress bar */}
      {isInstalling && (
        <div className="h-0.5 bg-surface-overlay">
          <div className="h-full bg-status-blue animate-pulse w-full" />
        </div>
      )}
    </div>
  );
}
