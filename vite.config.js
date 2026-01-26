import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const isCompatBuild = mode === 'compat'

  return {
    build: {
      emptyOutDir: !isCompatBuild,
      lib: {
        entry: 'index.ts',
        name: 'validatorUtils',
        formats: isCompatBuild ? ['cjs', 'umd'] : ['es'],
        fileName: (format) => {
          if (format === 'es') return 'validator-utils.mjs'
          if (format === 'cjs') return 'validator-utils.cjs'
          return 'validator-utils.js'
        },
      },
      rollupOptions: {
        output: {
          exports: isCompatBuild ? 'named' : 'named',
          manualChunks: undefined,
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
    },
  }
})
