import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, '../src/index.ts'),
      name: 'CIHotspot',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'hotspot.esm.js';
        if (format === 'cjs') return 'hotspot.cjs.js';
        return 'hotspot.min.js';
      },
    },
    outDir: resolve(__dirname, '../dist'),
    emptyOutDir: false,
    sourcemap: true,
    minify: 'esbuild',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        exports: 'named',
      },
    },
  },
});
