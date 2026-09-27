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

        faq: resolve(
          import.meta.dirname,
          'faq/index.html',
        ),

        terms: resolve(
          import.meta.dirname,
          'terms/index.html',
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

        forgotPassword: resolve(
          import.meta.dirname,
          'forgot-password/index.html',
        ),

        resetPassword: resolve(
          import.meta.dirname,
          'reset-password/index.html',
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