import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/pair": "http://127.0.0.1:5000",
      "/upload": "http://127.0.0.1:5000",
      "/inventory": "http://127.0.0.1:5000",
      "/uploads": "http://127.0.0.1:5000"
    }
  }
});

