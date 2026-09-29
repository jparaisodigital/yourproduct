import './style.css'
import Alpine from 'alpinejs'
import logoImage from './assets/logoyourproduct.png'
import { siteConfig } from './config/site-config.js'
import {
  bindFadeLinks,
} from './lib/page-transition.js'

import uniImage1 from './assets/youuniversity/1.jpg'
import uniImage2 from './assets/youuniversity/2.jpg'
import uniImage3 from './assets/youuniversity/3.jpg'

window.Alpine = Alpine

const images = [
  { src: uniImage1, alt: 'YOUR PRODUCT University session 1' },
  { src: uniImage2, alt: 'YOUR PRODUCT University session 2' },
  { src: uniImage3, alt: 'YOUR PRODUCT University session 3' },
]

document.title = `University | ${siteConfig.brand.name}`

document.querySelector('#university-app').innerHTML = `
  <div
    x-data="{
      activeImage: null,
      openImage(src) { this.activeImage = src },
      closeImage() { this.activeImage = null },
    }"
    @keydown.escape.window="closeImage()"
    class="min-h-screen bg-brand-black text-brand-cream"
  >
    <header class="border-b border-brand-border bg-brand-panel">
      <div class="mx-auto flex w-[min(1120px,90%)] items-center justify-between gap-4 py-4">
        <a href="/" class="flex min-w-0 items-center gap-3" aria-label="Return to ${siteConfig.brand.name}">
          <img src="${logoImage}" alt="${siteConfig.brand.name} logo" class="size-12 shrink-0 object-contain sm:size-14">
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
          href="/"
          class="premium-outline inline-flex h-10 items-center justify-center rounded-full border border-brand-border px-5 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
        >
          Back to store
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

      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        ${images.map(({ src, alt }) => `
          <button
            type="button"
            class="group relative aspect-[3/4] overflow-hidden rounded-[1.4rem] border border-brand-border bg-brand-panel text-left transition hover:border-brand-gold/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            @click="openImage('${src}')"
            aria-label="View larger: ${alt}"
          >
            <img
              src="${src}"
              alt="${alt}"
              class="size-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
              loading="lazy"
            >
            <span
              class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100"
              aria-hidden="true"
            ></span>
            <span
              class="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
            >
              View
            </span>
          </button>
        `).join('')}
      </div>

      <p class="mt-10 text-center text-xs leading-5 text-brand-muted">
        Program details remain subject to final company confirmation.
      </p>
    </main>

    <footer class="border-t border-brand-border bg-brand-panel">
      <div class="mx-auto grid w-[min(1120px,90%)] gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        <div>
          <a href="/" class="flex items-center gap-3">
            <img src="${logoImage}" alt="" class="size-11 object-contain">
            <span>
              <strong class="block text-sm uppercase tracking-[0.16em] text-brand-cream">
                ${siteConfig.brand.name}
              </strong>
              <span class="mt-0.5 block text-[0.6rem] uppercase tracking-[0.12em] text-brand-muted">
                ${siteConfig.brand.tagline}
              </span>
            </span>
          </a>
          <p class="mt-4 max-w-xs text-sm leading-6 text-brand-muted">
            Discover premium fragrances, meaningful connections, and
            new possibilities with ${siteConfig.brand.name}.
          </p>
        </div>

        <div>
          <h2 class="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
            Explore
          </h2>
          <nav class="mt-5 flex flex-col items-start gap-3" aria-label="Footer explore">
            <a href="/#shop" class="text-sm text-brand-muted transition hover:text-brand-gold">Perfumes</a>
            <a href="/#packages" class="text-sm text-brand-muted transition hover:text-brand-gold">Packages</a>
            <a href="/#ways-to-earn" class="text-sm text-brand-muted transition hover:text-brand-gold">Ways to Earn</a>
            <a href="/university/" class="text-sm text-brand-gold">YOUR PRODUCT University</a>
          </nav>
        </div>

        <div>
          <h2 class="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
            Member Access
          </h2>
          <nav class="mt-5 flex flex-col items-start gap-3" aria-label="Footer member access">
            <a href="/faq/" class="text-sm text-brand-muted transition hover:text-brand-gold">Frequently Asked Questions</a>
            <a href="/terms/" class="text-sm text-brand-muted transition hover:text-brand-gold">Terms &amp; Conditions</a>
            <a href="/login/" class="text-sm text-brand-muted transition hover:text-brand-gold">Member Login</a>
            <a href="/register/" class="text-sm text-brand-muted transition hover:text-brand-gold">Create Account</a>
          </nav>
        </div>
      </div>

      <div class="border-t border-brand-border">
        <div class="mx-auto flex w-[min(1120px,90%)] flex-col gap-3 py-6 text-xs text-brand-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© ${new Date().getFullYear()} ${siteConfig.brand.name}. All rights reserved.</p>
          <p>Membership benefits are subject to confirmed company mechanics.</p>
        </div>
      </div>
    </footer>

    <div
      x-show="activeImage"
      x-transition.opacity
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      x-cloak
      @click.self="closeImage()"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <button
        type="button"
        class="absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-white/20 bg-black/40 text-white transition hover:border-brand-gold hover:text-brand-gold"
        @click="closeImage()"
        aria-label="Close image"
      >
        ✕
      </button>
      <img
        :src="activeImage"
        alt="University session preview"
        class="max-h-[88vh] max-w-full rounded-2xl object-contain shadow-2xl"
      >
    </div>
  </div>
`

Alpine.start()
bindFadeLinks('a[href="/"]')