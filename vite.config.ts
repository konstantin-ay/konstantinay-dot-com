import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      srcDirectory: 'src',
      prerender: {
        enabled: true,
        crawlLinks: true,
        autoSubfolderIndex: true,
        failOnError: true,
        // crawlLinks follows every <a href>, including the link to the CV.
        // Prerendering a binary asset decodes it as a UTF-8 string and writes
        // it back, corrupting the PDF (every non-UTF-8 byte becomes U+FFFD).
        // Only prerender real HTML routes — never paths with a file extension.
        filter: ({ path }) => !/\.[a-z0-9]+$/i.test(path),
      },
    }),
    viteReact(),
    nitro(),
  ],
})
