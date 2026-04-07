interface ConfirmDialogProps {
  title: string;
  command: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ title, command, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-surface-raised border border-surface-overlay rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-2">This will run:</p>
          <code className="block bg-surface p-3 rounded-lg text-sm text-green-400 font-mono break-all">
            {command}
          </code>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm bg-surface-overlay hover:bg-surface-overlay/80 text-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm bg-accent hover:bg-accent-hover text-white font-medium transition-colors"
          >
            Run Command
          </button>
        </div>
      </div>
    </div>
  );
}
