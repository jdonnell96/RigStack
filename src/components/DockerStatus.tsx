import { useRigstackStore } from "../store/toolStore";

export function DockerStatus() {
  const dockerRunning = useRigstackStore((s) => s.dockerRunning);
  const systemInfo = useRigstackStore((s) => s.systemInfo);

  const prereqs = [
    { key: "python", label: "Python" },
    { key: "pip", label: "pip" },
    { key: "docker", label: "Docker" },
    { key: "npm", label: "npm" },
    { key: "git", label: "Git" },
  ];

  return (
    <div className="space-y-1.5">
      <div className="text-[10px] uppercase tracking-wider text-gray-600 px-2 mb-1">
        System
      </div>
      {prereqs.map(({ key, label }) => {
        const installed = systemInfo[key] ?? false;
        const isDocker = key === "docker";
        const running = isDocker ? dockerRunning : null;

        return (
          <div key={key} className="flex items-center gap-2 px-2 py-0.5">
            <div
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                !installed
                  ? "bg-status-red"
                  : isDocker && !running
                    ? "bg-status-amber"
                    : "bg-status-green"
              }`}
            />
            <span className="text-[11px] text-gray-400">{label}</span>
            <span
              className={`text-[10px] ml-auto ${
                !installed
                  ? "text-status-red"
                  : isDocker && !running
                    ? "text-status-amber"
                    : "text-gray-600"
              }`}
            >
              {!installed
                ? "missing"
                : isDocker && !running
                  ? "stopped"
                  : "ok"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
