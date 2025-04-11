import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts']
  },
  build: {
    emptyOutDir: true,
    copyPublicDir: false,
    minify: true,
    lib: {
      entry: 'src/components/inline-svg.ts',
      name: 'InlineSVG',
      // the proper extensions will be added
      fileName: 'inline-svg',
      formats: ['es'],
    },
  }
})