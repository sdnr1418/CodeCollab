import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { checkSession } from "./features/auth/authSlice";

function App() {
  const dispatch = useDispatch();

  // On every page load, ask the server whether the login cookie is still valid
  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
