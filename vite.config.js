import { defineConfig } from "vite";
import react            from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Geliştirme sunucusu / Dev server
  server: {
    port: 3000,
    open: true,
  },

  // Build optimizasyonu / Build optimization
  build: {
    outDir:    "dist",
    sourcemap: false, // Üretimde false bırak / false in production
    rollupOptions: {
      output: {
        // Firebase SDK'yı ayrı chunk'a al (daha hızlı cache)
        // Split Firebase into its own chunk (better caching)
        manualChunks: {
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
        },
      },
    },
  },
});
