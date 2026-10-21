import './style.css'
import logoImage from './assets/logoyourproduct.webp'

import { bindFadeLinks } from './lib/page-transition.js'

import {
  faqCategories,
  faqItems,
} from './config/faq-config.js'

const sections = faqCategories
  .filter(({ id }) => id !== 'all')
  .map(({ id, label }) => ({
    id,
    label,
    items: faqItems.filter(
      ({ category }) => category === id,
    ),
  }))
  .filter(({ items }) => items.length > 0)

document.querySelector('#faq-app').innerHTML = `
  <div class="min-h-screen bg-brand-black text-brand-cream">
    <header class="border-b border-brand-border bg-brand-panel">
  <div class="mx-auto flex w-[min(960px,90%)] items-center justify-between gap-4 py-4">
    <a
      href="/"
      data-fade-link
      class="flex min-w-0 items-center gap-3"
      aria-label="Return to YOUR PRODUCT"
    >
      <img
        src="${logoImage}"
        alt="YOUR PRODUCT logo"
        class="size-12 shrink-0 object-contain sm:size-14"
      >

      <span class="min-w-0">
        <span class="block truncate text-sm font-semibold uppercase tracking-[0.18em] text-brand-cream sm:text-base">
          YOUR PRODUCT
        </span>
      </span>
    </a>

    <a
      href="/"
      data-fade-link
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

      <span>Back to store</span>
    </a>
  </div>
</header>

    <main class="mx-auto w-[min(960px,90%)] py-14 sm:py-20">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
        Help
      </p>

      <h1 class="mt-3 font-display text-5xl text-brand-cream sm:text-6xl">
        Frequently asked questions
      </h1>

      <p class="mt-5 max-w-2xl text-sm leading-7 text-brand-muted">
        Answers about our fragrances, ordering, delivery, and reseller program.
      </p>

      <nav class="mt-8 flex flex-wrap gap-2" aria-label="FAQ categories">
        ${sections.map(({ id, label }) => `
          <a
            href="#${id}"
            class="rounded-full border border-brand-border px-4 py-2 text-sm text-brand-muted hover:border-brand-gold hover:text-brand-gold"
          >
            ${label}
          </a>
        `).join('')}
      </nav>

      ${sections.map(({ id, label, items }) => `
        <section
          id="${id}"
          class="scroll-mt-8 pt-12"
          aria-labelledby="${id}-title"
        >
          <h2
            id="${id}-title"
            class="font-display text-3xl text-brand-cream"
          >
            ${label}
          </h2>

          <div class="mt-5 space-y-3">
            ${items.map(({ question, answer }) => `
              <details class="rounded-2xl border border-brand-border bg-brand-panel px-5 py-4">
                <summary class="cursor-pointer font-semibold text-brand-cream marker:text-brand-gold">
                  ${question}
                </summary>

                <p class="mt-3 text-sm leading-7 text-brand-muted">
                  ${answer}
                </p>
              </details>
            `).join('')}
          </div>
        </section>
      `).join('')}
    </main>

    <footer class="border-t border-brand-border py-8 text-center text-xs text-brand-muted">
      <a
        href="/"
        data-fade-link
        class="hover:text-brand-gold"
      >
        YOUR PRODUCT · Back to store
      </a>
    </footer>
  </div>
`

bindFadeLinks('a[data-fade-link]')