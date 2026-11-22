import { Loader2 } from "lucide-react";

// Full-screen spinner: shown while a page's code downloads, or while we check who is logged in
function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-950 text-gray-500">
      <Loader2 size={24} className="animate-spin" />
    </div>
  );
}

export default PageLoader;
