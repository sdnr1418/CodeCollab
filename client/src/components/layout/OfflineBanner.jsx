import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

// A thin bar at the top when the internet drops. The app still opens offline (PWA),
// but rooms, chat and Run need the server, so we say so instead of failing silently.
function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (online) return null;
  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 bg-amber-500 px-3 py-1 text-xs font-medium text-gray-950">
      <WifiOff size={14} />
      You&apos;re offline. Changes, chat and Run will work again when you
      reconnect.
    </div>
  );
}

export default OfflineBanner;
