import { useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { useRobodeckStore } from "./store/toolStore";
import { tauri } from "./lib/tauri";
import { fetchManifests } from "./lib/manifests";

export default function App() {
  const setPlatform = useRobodeckStore((s) => s.setPlatform);
  const setManifests = useRobodeckStore((s) => s.setManifests);
  const setLoading = useRobodeckStore((s) => s.setLoading);
  const setSystemInfo = useRobodeckStore((s) => s.setSystemInfo);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const [platform, manifests, sysInfo] = await Promise.all([
          tauri.getPlatform(),
          fetchManifests(),
          tauri.getSystemInfo(),
        ]);
        setPlatform(platform);
        setManifests(manifests);
        setSystemInfo(sysInfo);
      } catch (err) {
        console.error("Failed to initialize:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [setPlatform, setManifests, setLoading, setSystemInfo]);

  return <Dashboard />;
}
