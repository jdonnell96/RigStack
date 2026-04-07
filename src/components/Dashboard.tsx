import { useEffect, useMemo } from "react";
import { useRobodeckStore } from "../store/toolStore";
import { useHealthCheckPoller } from "../hooks/useToolStatus";
import { useDockerPoller } from "../hooks/useDockerStatus";
import { StageFilter } from "./StageFilter";
import { SearchBar } from "./SearchBar";
import { DockerStatus } from "./DockerStatus";
import { ToolTile } from "./ToolTile";
import { InstallDrawer } from "./InstallDrawer";
import { EmptyState } from "./EmptyState";

export function Dashboard() {
  const manifests = useRobodeckStore((s) => s.manifests);
  const search = useRobodeckStore((s) => s.search);
  const activeStage = useRobodeckStore((s) => s.activeStage);
  const platform = useRobodeckStore((s) => s.platform);
  const loading = useRobodeckStore((s) => s.loading);
  const statuses = useRobodeckStore((s) => s.statuses);
  const setToolStatus = useRobodeckStore((s) => s.setToolStatus);

  useHealthCheckPoller();
  useDockerPoller();

  // Initialize tool statuses on manifest load
  useEffect(() => {
    for (const m of manifests) {
      if (m.supported_os && !m.supported_os.includes(platform)) {
        if (statuses[m.id] !== "unsupported") {
          setToolStatus(m.id, "unsupported");
        }
      } else if (!statuses[m.id]) {
        setToolStatus(m.id, "not_installed");
      }
    }
  }, [manifests, platform, statuses, setToolStatus]);

  const filtered = useMemo(
    () =>
      manifests.filter((m) => {
        if (activeStage !== "all" && m.category !== activeStage) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            m.name.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q) ||
            m.tags.some((t) => t.toLowerCase().includes(q))
          );
        }
        return true;
      }),
    [manifests, activeStage, search]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-400 text-lg">Loading tools...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <aside className="w-56 border-r border-surface-overlay flex flex-col p-4 gap-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-xl font-bold tracking-tight">Robodeck</div>
        </div>
        <StageFilter />
        <div className="mt-auto">
          <DockerStatus />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-4 px-6 py-4 border-b border-surface-overlay">
          <SearchBar />
          <div className="text-sm text-gray-500">
            {filtered.length} tool{filtered.length !== 1 ? "s" : ""}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((m) => (
                <ToolTile key={m.id} manifest={m} />
              ))}
            </div>
          )}
        </div>
      </main>

      <InstallDrawer />
    </div>
  );
}
