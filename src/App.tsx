import { useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { useRigstackStore } from "./store/toolStore";
import { tauri } from "./lib/tauri";
import { fetchManifests } from "./lib/manifests";

export default function App() {
  const setPlatform = useRigstackStore((s) => s.setPlatform);
  const setManifests = useRigstackStore((s) => s.setManifests);
  const setLoading = useRigstackStore((s) => s.setLoading);
  const setSystemInfo = useRigstackStore((s) => s.setSystemInfo);

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
