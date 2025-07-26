import { defineConfig } from "vite"

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/GestioneSpese/' : '/',
  server: {
    port: 5173,
    open: true, // Apri browser automaticamente
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
  },
  css: {
    postcss: false, // Disabilita PostCSS per evitare conflitti
  },
  define: {
    // Variabili ambiente per il client
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || "1.0.0"),
  },
})
