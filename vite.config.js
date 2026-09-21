import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],

  build: {
    rollupOptions: {
      input: {
        storefront: resolve(
          import.meta.dirname,
          'index.html',
        ),

        checkout: resolve(
          import.meta.dirname,
          'checkout/index.html',
        ),

        login: resolve(
          import.meta.dirname,
          'login/index.html',
        ),

        register: resolve(
          import.meta.dirname,
          'register/index.html',
        ),

        dashboard: resolve(
          import.meta.dirname,
          'dashboard/index.html',
        ),

        admin: resolve(
          import.meta.dirname,
          'admin/index.html',
        ),
      },
    },
  },
})