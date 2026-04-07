import { useRobodeckStore } from "../store/toolStore";

export function SearchBar() {
  const search = useRobodeckStore((s) => s.search);
  const setSearch = useRobodeckStore((s) => s.setSearch);

  return (
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search tools..."
      className="flex-1 bg-surface-overlay border border-surface-overlay focus:border-accent/50 rounded-lg px-4 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none transition-colors"
    />
  );
}
