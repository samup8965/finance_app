import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://finance-app-steel-seven.vercel.app", // Your backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
