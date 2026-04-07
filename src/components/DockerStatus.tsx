import { useRobodeckStore } from "../store/toolStore";

export function DockerStatus() {
  const running = useRobodeckStore((s) => s.dockerRunning);

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-overlay">
      <div
        className={`w-2 h-2 rounded-full ${
          running ? "bg-status-green" : "bg-status-red"
        }`}
      />
      <span className="text-xs text-gray-400">
        Docker {running ? "Running" : "Not Running"}
      </span>
    </div>
  );
}
