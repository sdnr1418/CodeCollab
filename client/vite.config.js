import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // PWA (Step 24): makes CodeCollab installable, and keeps the app's files in a cache
    // so it opens fast and still shows up without internet (it then says you're offline).
    VitePWA({
      registerType: "autoUpdate", // a new version installs itself on the next visit
      includeAssets: ["favicon.svg", "apple-touch-icon-180x180.png"],
      manifest: {
        name: "CodeCollab",
        short_name: "CodeCollab",
        description: "Write code together, in real time.",
        theme_color: "#030712", // gray-950, the app's background
        background_color: "#030712",
        display: "standalone",
        start_url: "/dashboard",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Files saved for offline use when the app is first opened
        globPatterns: ["**/*.{js,css,html,svg,png,ttf}"],
        // Monaco's helpers for CSS, HTML and JSON files: we never open those, so don't save them.
        // The TypeScript helper (for JavaScript files) is saved the first time it's used instead.
        globIgnores: [
          "**/css.worker-*",
          "**/html.worker-*",
          "**/json.worker-*",
          "**/ts.worker-*",
        ],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // the editor bundle is about 4 MB
        // Any page address (like /room/k3x-92q) opens the app; the API and sockets never come from the cache
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api/, /^\/socket\.io/],
        runtimeCaching: [
          {
            urlPattern: /\/assets\/ts\.worker-.*\.js$/,
            handler: "CacheFirst",
            options: { cacheName: "monaco-workers" },
          },
        ],
      },
    }),
  ],
  build: {
    // The editor (Monaco) is big by nature. It's split off and only loaded in rooms,
    // so don't warn about it on every build.
    chunkSizeWarningLimit: 3000,
  },
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
