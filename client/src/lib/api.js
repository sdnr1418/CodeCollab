// One axios instance for every API call.
// baseURL '/api': in development Vite forwards it to the Express server (see vite.config.js).
// withCredentials: send the httpOnly login cookie with every request.
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
  timeout: 15000,
});

// CSRF (Step 24): every change (POST, PATCH, DELETE) must carry a token from GET /api/csrf-token.
// We fetch it once, keep it in memory, and send it in the "x-csrf-token" header.
let csrfToken = null;
const SAFE_METHODS = ["get", "head", "options"];

async function getCsrfToken() {
  if (!csrfToken) {
    const { data } = await api.get("/csrf-token");
    csrfToken = data.csrfToken;
  }
  return csrfToken;
}

api.interceptors.request.use(async (config) => {
  if (!SAFE_METHODS.includes(config.method)) {
    config.headers["x-csrf-token"] = await getCsrfToken();
  }
  return config;
});

// The token is tied to the login cookie, so it changes when you log in or out
const AUTH_CHANGES = ["/auth/login", "/auth/register", "/auth/logout"];

// Turn server errors into a normal Error with the server's message,
// so slices and toasts can just use error.message like they did with the mocks.
api.interceptors.response.use(
  (response) => {
    if (AUTH_CHANGES.includes(response.config.url)) csrfToken = null;
    return response;
  },
  (error) => {
    const { config, response } = error;
    // Token no longer valid (for example, your login expired): get a fresh one and try once more
    if (
      response?.status === 403 &&
      /CSRF/.test(response.data?.message) &&
      !config.csrfRetried
    ) {
      csrfToken = null;
      return api({ ...config, csrfRetried: true });
    }

    const message =
      response?.data?.message ??
      (response
        ? `Request failed (${response.status})`
        : "Cannot reach the server. Is it running?");
    const wrapped = new Error(message);
    wrapped.status = response?.status;
    return Promise.reject(wrapped);
  },
);
