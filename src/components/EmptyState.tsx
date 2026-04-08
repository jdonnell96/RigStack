import { useRigstackStore } from "../store/toolStore";

export function EmptyState() {
  const manifests = useRigstackStore((s) => s.manifests);
  const search = useRigstackStore((s) => s.search);

  if (manifests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p className="text-lg mb-2">No tools available</p>
        <p className="text-sm">Connect to the internet to browse the tool catalog.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
      <p className="text-lg mb-2">No results for "{search}"</p>
      <p className="text-sm">Try a different search term or filter.</p>
    </div>
  );
}
