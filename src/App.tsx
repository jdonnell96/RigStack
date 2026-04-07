import { useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { useRobodeckStore } from "./store/toolStore";
import { tauri } from "./lib/tauri";
import { fetchManifests } from "./lib/manifests";

export default function App() {
  const setPlatform = useRobodeckStore((s) => s.setPlatform);
  const setManifests = useRobodeckStore((s) => s.setManifests);
  const setLoading = useRobodeckStore((s) => s.setLoading);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const platform = await tauri.getPlatform();
        setPlatform(platform);
        const manifests = await fetchManifests();
        setManifests(manifests);
      } catch (err) {
        console.error("Failed to initialize:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [setPlatform, setManifests, setLoading]);

  return <Dashboard />;
}
