import { useEffect } from "react";
import { useRobodeckStore } from "../store/toolStore";
import { tauri } from "../lib/tauri";

export function useDockerPoller() {
  const setDockerRunning = useRobodeckStore((s) => s.setDockerRunning);

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
