import { useEffect } from "react";
import { useRigstackStore } from "../store/toolStore";
import { tauri } from "../lib/tauri";

export function useDockerPoller() {
  const setDockerRunning = useRigstackStore((s) => s.setDockerRunning);

  useEffect(() => {
    async function check() {
      try {
        const running = await tauri.dockerRunning();
        setDockerRunning(running);
      } catch {
        setDockerRunning(false);
      }
    }

    check();
    const id = setInterval(check, 10000);
    return () => clearInterval(id);
  }, [setDockerRunning]);
}
