import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      {
        // y-monaco imports Monaco by an old path that newer Monaco versions no longer
        // expose. Point it at the new one, so the editor and y-monaco share one Monaco.
        find: /^monaco-editor\/esm\/vs\/editor\/editor\.api(\.js)?$/,
        replacement: "monaco-editor/editor/editor.api",
      },
    ],
  },
  server: {
    // In development, send API and socket requests to the Express server.
    // The browser only ever talks to localhost:5173, so cookies just work.
    proxy: {
      "/api": "http://localhost:5000",
      "/socket.io": { target: "http://localhost:5000", ws: true },
    },
  },
});