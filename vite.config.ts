import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'https://localhost:7179',
        changeOrigin: true,
        secure: false,
      },
      '/watchtowerhub': { // Updated proxy path
        target: 'https://localhost:7179',
        changeOrigin: true,
        secure: false,
        ws: true, // Enable WebSocket proxying
      }
    }
  },
  plugins: [dyadComponentTagger(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));