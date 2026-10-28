import './style.css'
import Alpine from 'alpinejs'
import logoImage from './assets/logoyourproduct.webp'
import { siteConfig } from './config/site-config.js'
import { renderFooter } from './components/footer.js'

import uniImageU1 from './assets/youuniversity/u1.webp'
import uniImageU2 from './assets/youuniversity/u2.webp'
import uniImageU3 from './assets/youuniversity/u3.webp'
import uniImageU4 from './assets/youuniversity/u4.webp'
import uniImageU5 from './assets/youuniversity/u5.webp'
import uniImageU6 from './assets/youuniversity/u6.webp'

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

      <section class="mt-10 space-y-5">
        <article class="overflow-hidden rounded-[1.6rem] border border-brand-gold/45 bg-brand-panel">
          <div class="flex flex-col gap-5 border-b border-brand-border px-5 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-7">
            <div>
              <p class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold">
                Album 01
              </p>

              <h2 class="mt-2 font-display text-3xl text-brand-cream sm:text-4xl">
                6 Ways to Earn
              </h2>

              <p class="mt-2 text-sm leading-6 text-brand-muted">
                Six learning materials designed to introduce the different ways
                members can earn and grow with YOUR PRODUCT.
              </p>
            </div>

            <div class="shrink-0 text-xs uppercase tracking-[0.16em] text-brand-muted">
              6 Materials
            </div>
          </div>

          <div class="space-y-3 p-3 sm:p-5">
            <div class="grid gap-3 lg:grid-cols-3">
              <button
                type="button"
                class="group overflow-hidden rounded-[1.2rem] border border-brand-border bg-brand-black transition hover:border-brand-gold/60"
                @click="openImage('${uniImageU1}')"
                aria-label="View 6 Ways to Earn material 1"
              >
                <img
                  src="${uniImageU1}"
                  alt="6 Ways to Earn material 1"
                  class="block h-auto w-full transition duration-500 ease-out group-hover:scale-[1.015]"
                  loading="eager"
                  decoding="async"
                >
              </button>

              <button
                type="button"
                class="group overflow-hidden rounded-[1.2rem] border border-brand-border bg-brand-black transition hover:border-brand-gold/60"
                @click="openImage('${uniImageU2}')"
                aria-label="View 6 Ways to Earn material 2"
              >
                <img
                  src="${uniImageU2}"
                  alt="6 Ways to Earn material 2"
                  class="block h-auto w-full transition duration-500 ease-out group-hover:scale-[1.015]"
                  loading="lazy"
                  decoding="async"
                >
              </button>

              <button
                type="button"
                class="group overflow-hidden rounded-[1.2rem] border border-brand-border bg-brand-black transition hover:border-brand-gold/60"
                @click="openImage('${uniImageU3}')"
                aria-label="View 6 Ways to Earn material 3"
              >
                <img
                  src="${uniImageU3}"
                  alt="6 Ways to Earn material 3"
                  class="block h-auto w-full transition duration-500 ease-out group-hover:scale-[1.015]"
                  loading="lazy"
                  decoding="async"
                >
              </button>
            </div>

            <div class="grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)] lg:items-start">
              <div class="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  class="group self-start overflow-hidden rounded-[1.2rem] border border-brand-border bg-brand-black transition hover:border-brand-gold/60"
                  @click="openImage('${uniImageU4}')"
                  aria-label="View 6 Ways to Earn material 4"
                >
                  <img
                    src="${uniImageU4}"
                    alt="6 Ways to Earn material 4"
                    class="block h-auto w-full transition duration-500 ease-out group-hover:scale-[1.015]"
                    loading="lazy"
                    decoding="async"
                  >
                </button>

                <button
                  type="button"
                  class="group self-start overflow-hidden rounded-[1.2rem] border border-brand-border bg-brand-black transition hover:border-brand-gold/60"
                  @click="openImage('${uniImageU5}')"
                  aria-label="View 6 Ways to Earn material 5"
                >
                  <img
                    src="${uniImageU5}"
                    alt="6 Ways to Earn material 5"
                    class="block h-auto w-full transition duration-500 ease-out group-hover:scale-[1.015]"
                    loading="lazy"
                    decoding="async"
                  >
                </button>

                <div class="hidden rounded-[1.2rem] border border-brand-border bg-brand-black/60 p-6 lg:col-span-2 lg:block">
                  <div class="flex items-end justify-between gap-6 border-b border-brand-border pb-5">
                    <div>
                      <p class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold">
                        Album Overview
                      </p>

                      <h3 class="mt-2 font-display text-2xl text-brand-cream">
                        Learn. Apply. Grow.
                      </h3>
                    </div>

                    <span class="text-[0.65rem] uppercase tracking-[0.18em] text-brand-muted">
                      6 Learning Materials
                    </span>
                  </div>

                  <p class="mt-5 max-w-2xl text-sm leading-6 text-brand-muted">
                    Explore the six ways members can earn, build confidence, and grow
                    their YOUR PRODUCT business through practical opportunities.
                  </p>

                  <div class="mt-6 grid grid-cols-3 gap-3">
                    <div class="rounded-xl border border-brand-border px-4 py-4">
                      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
                        Learn
                      </p>
                      <p class="mt-2 text-xs leading-5 text-brand-muted">
                        Understand each earning opportunity.
                      </p>
                    </div>

                    <div class="rounded-xl border border-brand-border px-4 py-4">
                      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
                        Apply
                      </p>
                      <p class="mt-2 text-xs leading-5 text-brand-muted">
                        See how each method works in practice.
                      </p>
                    </div>

                    <div class="rounded-xl border border-brand-border px-4 py-4">
                      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
                        Grow
                      </p>
                      <p class="mt-2 text-xs leading-5 text-brand-muted">
                        Build toward multiple income opportunities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                class="group self-start overflow-hidden rounded-[1.2rem] border border-brand-border bg-brand-black transition hover:border-brand-gold/60"
                @click="openImage('${uniImageU6}')"
                aria-label="View 6 Ways to Earn material 6"
              >
                <img
                  src="${uniImageU6}"
                  alt="6 Ways to Earn material 6"
                  class="block h-auto w-full transition duration-500 ease-out group-hover:scale-[1.015]"
                  loading="lazy"
                  decoding="async"
                >
              </button>
            </div>
          </div>
        </article>

        <div class="grid gap-5 lg:grid-cols-2">
          <article class="rounded-[1.6rem] border border-brand-border bg-brand-panel p-6 sm:p-7">
            <div class="flex items-start justify-between gap-5">
              <div>
                <p class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold">
                  Album 02
                </p>

                <h2 class="mt-2 font-display text-3xl text-brand-cream">
                  Packages
                </h2>

                <p class="mt-3 max-w-md text-sm leading-6 text-brand-muted">
                  Package guides, references, and downloadable member resources
                  will be organized here.
                </p>
              </div>

              <svg
                class="size-8 shrink-0 text-brand-gold"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.4"
                aria-hidden="true"
              >
                <path d="M3.5 7.5h6l2 2h9v9.5H3.5z" stroke-linejoin="round" />
                <path d="M3.5 7.5V5h6l2 2h9v2.5" stroke-linejoin="round" />
              </svg>
            </div>

            <div class="mt-8 border-t border-brand-border pt-5">
              <span class="text-xs font-semibold uppercase tracking-[0.16em] text-brand-muted">
                Materials coming soon
              </span>
            </div>
          </article>

          <article class="rounded-[1.6rem] border border-brand-border bg-brand-panel p-6 sm:p-7">
            <div class="flex items-start justify-between gap-5">
              <div>
                <p class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold">
                  Album 03
                </p>

                <h2 class="mt-2 font-display text-3xl text-brand-cream">
                  Business Learning
                </h2>

                <p class="mt-3 max-w-md text-sm leading-6 text-brand-muted">
                  Business presentations, training materials, and future
                  learning resources will live in this album.
                </p>
              </div>

              <svg
                class="size-8 shrink-0 text-brand-gold"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.4"
                aria-hidden="true"
              >
                <path d="M4 5.5h16v13H4z" stroke-linejoin="round" />
                <path d="M8 15v-4m4 4V8m4 7v-2" stroke-linecap="round" />
              </svg>
            </div>

            <div class="mt-8 border-t border-brand-border pt-5">
              <span class="text-xs font-semibold uppercase tracking-[0.16em] text-brand-muted">
                Materials coming soon
              </span>
            </div>
          </article>
        </div>
      </section>
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
