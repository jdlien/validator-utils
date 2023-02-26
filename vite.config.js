import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'index.ts',
      name: 'validatorUtils',
      fileName: 'validatorUtils',
    },
    rollupOptions: {
      input: 'index.ts',
      output: {
        entryFileNames: 'validator-utils.js',
        manualChunks: undefined,
        // sourcemap: true,
      },
    },
  },
  ts: {
    declaration: true,
    declarationDir: 'dist',
    declarationMap: true,
  },
  test: {
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    threads: false, // suppresses errors from canvas when starting tests
  }
})
