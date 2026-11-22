import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PageLoader from "../components/ui/PageLoader";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";

// Code splitting (Step 24): these pages are downloaded only when someone opens them.
// The room page brings in Monaco, the editor, which is most of our JavaScript, so the
// landing, login and dashboard pages now load much faster.
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const RoomPage = lazy(() => import("../pages/RoomPage"));

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
