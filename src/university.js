import './style.css'
import Alpine from 'alpinejs'
import logoImage from './assets/logoyourproduct.webp'
import { siteConfig } from './config/site-config.js'
import { renderFooter } from './components/footer.js'

import uniImage1 from './assets/youuniversity/1.webp'
import uniImage2 from './assets/youuniversity/2.webp'
import uniImage3 from './assets/youuniversity/3.webp'

const universityParams = new URLSearchParams(window.location.search)
const fromDashboard = universityParams.get('from') === 'dashboard'
const backHref = fromDashboard ? '/dashboard/' : '/'
const backLabel = fromDashboard ? 'Back to Dashboard' : 'Back to store'

window.Alpine = Alpine

document.title = `University | ${siteConfig.brand.name}`

document.querySelector('#university-app').innerHTML = `
  <div
    x-data="{
      activeImage: null,
      openImage(src) { this.activeImage = src },
      closeImage() { this.activeImage = null },
    }"
    x-effect="document.body.style.overflow = activeImage ? 'hidden' : ''"
    @keydown.escape.window="closeImage()"
    class="min-h-screen bg-brand-black text-brand-cream"
  >
    <header class="border-b border-brand-border bg-brand-panel">
      <div class="mx-auto flex w-[min(1120px,90%)] items-center justify-between gap-4 py-4">
        <a href="/" class="flex min-w-0 items-center gap-3" aria-label="Return to ${siteConfig.brand.name}">
          <img
            src="${logoImage}"
            alt="${siteConfig.brand.name} logo"
            class="size-12 shrink-0 object-contain sm:size-14"
          >
          <span class="min-w-0">
            <span class="block truncate text-sm font-semibold uppercase tracking-[0.18em] text-brand-cream sm:text-base">
              ${siteConfig.brand.name}
            </span>
            <span class="mt-0.5 hidden text-[0.6rem] uppercase tracking-[0.12em] text-brand-muted sm:block">
              ${siteConfig.brand.tagline}
            </span>
          </span>
        </a>

        <a
  href="${backHref}"
  class="premium-outline inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-brand-border px-3.5 text-xs font-semibold text-brand-cream transition hover:border-brand-gold hover:bg-brand-gold/5 hover:text-brand-gold sm:px-5 sm:text-sm"
>
  <svg
    class="size-4 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    aria-hidden="true"
  >
    <path d="M4 10h16" stroke-linecap="round" />
    <path
      d="M5 10l1.2-5h11.6L19 10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M6 10v9h12v-9"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9 19v-5h6v5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <span>${backLabel}</span>
</a>
      </div>
    </header>

    <main class="mx-auto w-[min(1120px,90%)] py-14 sm:py-20">
      <p class="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
        Learning &amp; Growth
      </p>

      <h1 class="mt-3 font-display text-5xl text-brand-cream sm:text-6xl">
        YOUR PRODUCT University
      </h1>

      <p class="mt-5 max-w-2xl text-sm leading-7 text-brand-muted sm:text-base">
        A space for members to learn, grow, and build confidence with
        the brand. More sessions and materials will be added as the
        program develops.
      </p>

      <div class="mt-10 grid gap-4">
        <!-- Image 1 (full width) -->
        <button
          type="button"
          class="group relative overflow-hidden rounded-[1.4rem] border border-brand-border bg-brand-panel p-2 text-left transition hover:border-brand-gold/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
          @click="openImage('${uniImage1}')"
          aria-label="View larger: YOUR PRODUCT University session 1"
        >
          <img
            src="${uniImage1}"
            alt="YOUR PRODUCT University session 1"
            class="h-auto w-full rounded-[1rem] object-contain transition duration-500 ease-out group-hover:scale-[1.01]"
            loading="eager"
            decoding="async"
          >
        </button>

        <!-- Image 2 & 3 -->
        <div class="grid gap-4 md:grid-cols-2">
          <button
            type="button"
            class="group relative overflow-hidden rounded-[1.4rem] border border-brand-border bg-brand-panel p-2 text-left transition hover:border-brand-gold/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            @click="openImage('${uniImage2}')"
            aria-label="View larger: YOUR PRODUCT University session 2"
          >
            <img
              src="${uniImage2}"
              alt="YOUR PRODUCT University session 2"
              class="h-auto w-full rounded-[1rem] object-contain transition duration-500 ease-out group-hover:scale-[1.01]"
              loading="lazy"
              decoding="async"
            >
          </button>

          <button
            type="button"
            class="group relative overflow-hidden rounded-[1.4rem] border border-brand-border bg-brand-panel p-2 text-left transition hover:border-brand-gold/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            @click="openImage('${uniImage3}')"
            aria-label="View larger: YOUR PRODUCT University session 3"
          >
            <img
              src="${uniImage3}"
              alt="YOUR PRODUCT University session 3"
              class="h-auto w-full rounded-[1rem] object-contain transition duration-500 ease-out group-hover:scale-[1.01]"
              loading="lazy"
              decoding="async"
            >
          </button>
        </div>
      </div>

      <p class="mt-10 text-center text-xs leading-5 text-brand-muted">
        Program details remain subject to final company confirmation.
      </p>
    </main>

    ${renderFooter(siteConfig)}

    <!-- Full-screen lightbox -->
    <div
      x-cloak
      x-show="activeImage"
      x-transition.opacity
      class="fixed inset-0 z-[9999] flex h-dvh w-screen items-center justify-center bg-black/90 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      @click.self="closeImage()"
    >
      <div
        class="relative flex max-h-[90dvh] max-w-[92vw] items-center justify-center"
        @click.stop
      >
        <img
          :src="activeImage"
          alt="University session preview"
          class="block max-h-[90dvh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
        >

        <button
          type="button"
          class="absolute right-3 top-3 z-20 grid size-10 place-items-center rounded-full border border-white/25 bg-black/70 text-white backdrop-blur-sm transition hover:border-brand-gold hover:text-brand-gold"
          @click="closeImage()"
          aria-label="Close image"
        >
          <svg
            class="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6 6 18" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </div>
  </div>
`

Alpine.start()