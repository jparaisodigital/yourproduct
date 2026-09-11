import './style.css'
import Alpine from 'alpinejs'
import { siteConfig } from './config/site-config.js'

window.Alpine = Alpine

document.title = `${siteConfig.brand.name} | Premium Fragrances`

document.querySelector('#app').innerHTML = `
  <main class="grid min-h-screen place-items-center bg-brand-black px-6 py-16 text-center text-brand-cream">
    <section
      class="w-full max-w-3xl rounded-3xl border border-brand-border bg-brand-charcoal p-8 shadow-gold-soft sm:p-14"
      x-data="{ count: 0 }"
    >
      <p class="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
        ${siteConfig.brand.name}
      </p>

      <h1 class="mt-6 font-display text-5xl font-semibold leading-none sm:text-7xl">
        Luxury fragrance,
        <span class="italic text-brand-gold">thoughtfully presented.</span>
      </h1>

      <p class="mx-auto mt-6 max-w-xl text-sm uppercase tracking-[0.2em] text-brand-gold-light">
        ${siteConfig.brand.tagline}
      </p>

      <p class="mx-auto mt-6 max-w-lg text-base leading-7 text-brand-muted">
        ${siteConfig.brand.shortDescription}
      </p>

      <button
        type="button"
        class="mt-9 rounded-full bg-brand-gold px-7 py-3 font-semibold text-brand-black transition duration-300 hover:-translate-y-1 hover:bg-brand-gold-light"
        @click="count++"
      >
        Alpine Test:
        <span x-text="count">0</span>
      </button>
    </section>
  </main>
`

Alpine.start()