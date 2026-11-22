import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import PageLoader from "../components/ui/PageLoader";

// Sends signed-out users to /login. Wraps every page that needs an account.
// While the app is still asking the server "who is logged in?", show a spinner instead.
function ProtectedRoute() {
  const { user, sessionChecked } = useSelector((state) => state.auth);

  if (!sessionChecked) return <PageLoader />;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
