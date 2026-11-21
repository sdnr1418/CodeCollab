import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Sends signed-out users to /login. Wraps every page that needs an account.
// While the app is still asking the server "who is logged in?", show a spinner instead.
function ProtectedRoute() {
  const { user, sessionChecked } = useSelector((state) => state.auth);

  if (!sessionChecked) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950 text-gray-500">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
