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
      entry: ['src/components/inline-svg.ts', 'src/components/inline-svg.node.ts'],
      name: 'InlineSVG',
      // the proper extensions will be added
      fileName: (_format, entryName) => `${entryName}.js`,
      formats: ['es'],
    },
    // rollupOptions: {
    //   input: ['src/components/inline-svg.ts', 'src/components/inline-svg.node.ts'],
    //   output: {
    //     // preserveModules: false,
    //   }
    // }
  }
})