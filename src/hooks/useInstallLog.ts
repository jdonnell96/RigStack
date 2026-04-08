import { useEffect } from "react";
import { useRigstackStore } from "../store/toolStore";
import { tauri } from "../lib/tauri";

export function useInstallLog(toolId: string | null) {
  const appendLog = useRigstackStore((s) => s.appendInstallLog);
  const setStatus = useRigstackStore((s) => s.setToolStatus);

  useEffect(() => {
    if (!toolId) return;

    const unlisten = tauri.onInstallLog((event) => {
      if (event.tool_id !== toolId) return;
      if (event.line) {
        appendLog(toolId, event.line);
      }
      if (event.done) {
        setStatus(toolId, event.success ? "installed" : "error");
      }
    });
    return () => {
      unlisten.then((f) => f());
    };
  }, [toolId, appendLog, setStatus]);
}
