import { defineConfig } from 'vite'

// Dev:  `npm run dev` → Webflow loads http://localhost:5173/src/index.js (see README)
// Prod: `npm run build` → dist/main.js (committed, served via jsDelivr @tag)
export default defineConfig({
  server: {
    port: 5173,
    cors: true,
  },
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'DambaSite',
      formats: ['iife'],
      fileName: () => 'main.js',
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: true,
  },
})
