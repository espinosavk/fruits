import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

// Ejected from @lovable.dev/vite-tanstack-config so the project deploys
// to Vercel cleanly (the wrapper bundled @cloudflare/vite-plugin).
// TanStack Start's default Node-server preset is Vercel-compatible.
export default defineConfig({
  plugins: [
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart({
      // Custom server entry — matches src/server.ts error-page wrapper.
      server: { entry: "server" },
      // Prerender every reachable route to static HTML at build time so
      // Vercel can serve dist/client as a pure static site. All "live"
      // bits (date, time, weather) are client-side, so static is fine.
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
    }),
    viteReact(),
  ],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
});
