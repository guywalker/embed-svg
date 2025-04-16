import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    browser: {
      provider: 'playwright',
      enabled: true,
      instances: [
        { browser: 'chromium' },
      ],
    },
  },
  build: {
    emptyOutDir: true,
    copyPublicDir: false,
    minify: true,
    lib: {
      entry: ['src/components/embed-svg.ts', 'src/components/embed-svg.node.ts'],
      name: 'EmbedSVG',
      // the proper extensions will be added
      fileName: (_format, entryName) => `${entryName}.js`,
      formats: ['es'],
    },
  }
})