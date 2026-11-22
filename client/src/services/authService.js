// Phase 2: talks to the Express API. The login token lives in an httpOnly cookie
// that the browser sends by itself, so the React app never sees or stores it.
import { api } from "../lib/api";

export async function login(email, password, remember) {
  const { data } = await api.post("/auth/login", { email, password, remember });
  return data; // { user }
}

export async function register(name, email, password) {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data; // { user }
}

export async function logout() {
  await api.post("/auth/logout");
}

// Who is logged in right now? Returns null if nobody (no cookie, or it expired).
export async function getCurrentUser() {
  try {
    const { data } = await api.get("/auth/me");
    return data.user;
  } catch (error) {
    if (error.status === 401) return null;
    throw error;
  }
}
