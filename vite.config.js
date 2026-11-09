import { defineConfig } from 'vite';

export default defineConfig({
  // Rutas relativas para que el build funcione sin problemas de forma local y offline
  base: './',
  server: {
    port: 5173,
    open: false
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
