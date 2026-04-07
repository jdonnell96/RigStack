import { useRobodeckStore } from "../store/toolStore";
import { tauri } from "../lib/tauri";
import type { ToolManifest, ToolStatus } from "../types/tool";
import { StatusLed } from "./StatusLed";
import { ConfirmDialog } from "./ConfirmDialog";
import { useState } from "react";

interface ToolTileProps {
  manifest: ToolManifest;
}

const STATUS_LABELS: Record<ToolStatus, string> = {
  not_installed: "Not Installed",
  installing: "Installing...",
  installed: "Stopped",
  starting: "Starting...",
  running: "Running",
  stopping: "Stopping...",
  error: "Error",
  unsupported: "Not Available",
};

export function ToolTile({ manifest }: ToolTileProps) {
  const status = useRobodeckStore((s) => s.statuses[manifest.id]) ?? "not_installed";
  const platform = useRobodeckStore((s) => s.platform);
  const setStatus = useRobodeckStore((s) => s.setToolStatus);
  const setPid = useRobodeckStore((s) => s.setPid);
  const setActiveInstall = useRobodeckStore((s) => s.setActiveInstall);
  const [confirmCmd, setConfirmCmd] = useState<string | null>(null);

  function getInstallCmd(): string {
    if (platform === "windows" && manifest.install_cmd_win) return manifest.install_cmd_win;
    if (platform === "linux" && manifest.install_cmd_linux) return manifest.install_cmd_linux;
    return manifest.install_cmd;
  }

  function getLaunchCmd(): string {
    if (platform === "windows" && manifest.launch_cmd_win) return manifest.launch_cmd_win;
    return manifest.launch_cmd;
  }

  function handleInstall() {
    setConfirmCmd(getInstallCmd());
  }

  async function executeInstall(cmd: string) {
    setConfirmCmd(null);
    setStatus(manifest.id, "installing");
    setActiveInstall(manifest.id);
    try {
      await tauri.runInstall(cmd, manifest.id);
    } catch {
      setStatus(manifest.id, "error");
    }
  }

  async function handleLaunch() {
    setStatus(manifest.id, "starting");
    try {
      if (manifest.launch_type === "url" && manifest.open_url) {
        window.open(manifest.open_url, "_blank");
        setStatus(manifest.id, "running");
      } else {
        const pid = await tauri.spawnProcess(getLaunchCmd());
        setPid(manifest.id, pid);
      }
    } catch {
      setStatus(manifest.id, "error");
    }
  }

  async function handleStop() {
    setStatus(manifest.id, "stopping");
    try {
      const stopCmd = platform === "windows" ? manifest.stop_cmd_win : manifest.stop_cmd;
      if (stopCmd) {
        await tauri.spawnProcess(stopCmd);
      }
      setStatus(manifest.id, "installed");
    } catch {
      setStatus(manifest.id, "error");
    }
  }

  function handleOpen() {
    if (manifest.open_url) window.open(manifest.open_url, "_blank");
  }

  return (
    <>
      <div className="bg-surface-raised rounded-xl p-4 border border-surface-overlay hover:border-accent/30 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-overlay flex items-center justify-center text-lg font-bold text-accent">
              {manifest.name[0]}
            </div>
            <div>
              <h3 className="font-semibold text-sm">{manifest.name}</h3>
              <span className="text-xs text-gray-500">{manifest.version}</span>
            </div>
          </div>
          <StatusLed status={status} />
        </div>

        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{manifest.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{STATUS_LABELS[status]}</span>
          <div className="flex gap-2">
            {status === "not_installed" && (
              <ActionButton label="Install" onClick={handleInstall} />
            )}
            {status === "installed" && (
              <ActionButton label="Launch" onClick={handleLaunch} variant="primary" />
            )}
            {status === "running" && (
              <>
                {manifest.open_url && (
                  <ActionButton label="Open UI" onClick={handleOpen} variant="primary" />
                )}
                <ActionButton label="Stop" onClick={handleStop} variant="danger" />
              </>
            )}
            {status === "error" && (
              <ActionButton label="Retry" onClick={handleInstall} />
            )}
            {(status === "installing" || status === "starting" || status === "stopping") && (
              <ActionButton label={STATUS_LABELS[status]} onClick={() => {}} disabled />
            )}
            {status === "unsupported" && (
              <span className="text-xs text-gray-600">Not available on {platform}</span>
            )}
          </div>
        </div>

        {manifest.docs_url && (
          <a
            href={manifest.docs_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent hover:underline mt-2 block"
          >
            Docs
          </a>
        )}
      </div>

      {confirmCmd && (
        <ConfirmDialog
          title={`Install ${manifest.name}?`}
          command={confirmCmd}
          onConfirm={() => executeInstall(confirmCmd)}
          onCancel={() => setConfirmCmd(null)}
        />
      )}
    </>
  );
}

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  variant?: "default" | "primary" | "danger";
  disabled?: boolean;
}

function ActionButton({ label, onClick, variant = "default", disabled = false }: ActionButtonProps) {
  const styles = {
    default: "bg-surface-overlay hover:bg-surface-overlay/80 text-gray-300",
    primary: "bg-accent hover:bg-accent-hover text-white",
    danger: "bg-status-red/20 hover:bg-status-red/30 text-status-red",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]}`}
    >
      {label}
    </button>
  );
}
