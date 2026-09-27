import './style.css'

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
      <div class="mx-auto flex w-[min(960px,90%)] items-center justify-between gap-4 py-5">
        <a
          href="/"
          class="font-display text-2xl font-semibold text-brand-gold"
        >YOUR PRODUCT</a>

        <a
          href="/"
          class="text-sm text-brand-muted hover:text-brand-gold"
        >Back to store</a>
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
          >${label}</a>
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
          >${label}</h2>

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
      <a href="/" class="hover:text-brand-gold">
        YOUR PRODUCT · Back to store
      </a>
    </footer>
  </div>
`