// One axios instance for every API call.
// baseURL '/api': in development Vite forwards it to the Express server (see vite.config.js).
// withCredentials: send the httpOnly login cookie with every request.
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
  timeout: 15000,
});

// Turn server errors into a normal Error with the server's message,
// so slices and toasts can just use error.message like they did with the mocks.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      (error.response
        ? `Request failed (${error.response.status})`
        : "Cannot reach the server. Is it running?");
    const wrapped = new Error(message);
    wrapped.status = error.response?.status;
    return Promise.reject(wrapped);
  },
);
