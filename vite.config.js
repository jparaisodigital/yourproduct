import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],

  input: {
    storefront: resolve(
      import.meta.dirname,
      'index.html',
    ),

    checkout: resolve(
      import.meta.dirname,
      'checkout/index.html',
    ),
  },
})