import type { ToolStatus } from "../types/tool";

const LED_COLORS: Record<ToolStatus, string> = {
  not_installed: "bg-status-gray",
  installing: "bg-status-blue animate-pulse",
  installed: "bg-status-gray",
  starting: "bg-status-amber animate-pulse",
  running: "bg-status-green animate-pulse",
  stopping: "bg-status-amber animate-pulse",
  error: "bg-status-red",
  unsupported: "bg-gray-700",
};

interface StatusLedProps {
  status: ToolStatus;
}

export function StatusLed({ status }: StatusLedProps) {
  return (
    <div className={`w-2.5 h-2.5 rounded-full ${LED_COLORS[status]}`} title={status} />
  );
}
