import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // In development, send API and socket requests to the Express server.
    // The browser only ever talks to localhost:5173, so cookies just work.
    proxy: {
      "/api": "http://localhost:5000",
      "/socket.io": { target: "http://localhost:5000", ws: true },
    },
  },
});
