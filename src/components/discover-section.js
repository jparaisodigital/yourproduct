export function renderDiscoverSection() {
    return `
      <section
        id="discover"
        class="relative isolate overflow-hidden border-t border-brand-border bg-brand-charcoal py-20 sm:py-24 lg:py-28"
      >
        <!-- Background decorations -->
        <div
          class="pointer-events-none absolute -left-40 top-10 size-96 rounded-full bg-brand-gold/10 blur-3xl"
          aria-hidden="true"
        ></div>
  
        <div
          class="pointer-events-none absolute -right-40 bottom-0 size-96 rounded-full bg-brand-bronze/10 blur-3xl"
          aria-hidden="true"
        ></div>
  
        <div
          class="relative mx-auto grid w-[min(1180px,90%)] gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
        >
          <!-- Section content -->
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-[0.32em] text-brand-gold"
            >
              Discover Your Product
            </p>
  
            <h2
              class="mt-5 max-w-xl font-display text-4xl leading-[1.05] text-brand-cream sm:text-5xl lg:text-6xl"
            >
              More than a scent.
              <span class="block italic text-brand-gold">
                A future you can shape.
              </span>
            </h2>
  
            <p
              class="mt-6 max-w-xl text-base leading-8 text-brand-muted"
            >
              Explore a fragrance community built around personal choice,
              meaningful connections, and new possibilities.
            </p>
  
            <p
              class="mt-4 max-w-xl text-sm leading-7 text-brand-muted"
            >
              Choose from signature scents for men and women, discover the
              available packages, and find the path that fits your beginning.
            </p>
  
            <div class="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#shop"
                class="inline-flex items-center justify-center rounded-full bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-black transition duration-300 hover:-translate-y-1 hover:bg-brand-gold-light"
              >
                Discover the Collection
  
                <span class="ml-3" aria-hidden="true">
                  →
                </span>
              </a>
  
              <a
                href="#membership"
                class="inline-flex items-center justify-center rounded-full border border-brand-border px-7 py-3.5 text-sm font-semibold text-brand-cream transition duration-300 hover:border-brand-gold hover:text-brand-gold"
              >
                Explore Packages
              </a>
            </div>
          </div>
  
          <!-- Discover cards -->
          <div class="grid gap-4 sm:grid-cols-2">
            <!-- Main feature card -->
            <article
              class="relative min-h-72 overflow-hidden rounded-3xl border border-brand-gold/30 bg-brand-black p-7 sm:row-span-2 sm:min-h-full"
            >
              <div
                class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(210,170,85,0.18),transparent_55%)]"
                aria-hidden="true"
              ></div>
  
              <div class="relative flex h-full flex-col justify-between">
                <div
                  class="grid size-14 place-items-center rounded-2xl border border-brand-gold/30 bg-brand-gold/10 text-brand-gold"
                >
                  <svg
                    class="size-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.4"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 3h6m-5 0v3m4-3v3m-6 2.5A2.5 2.5 0 0 1 10.5 6h3A2.5 2.5 0 0 1 16 8.5V10a3 3 0 0 1 2 2.83V19a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6.17A3 3 0 0 1 8 10V8.5Z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 14.5c1.8 1.1 4.2 1.1 6 0"
                    />
                  </svg>
                </div>
  
                <div class="mt-12">
                  <p
                    class="font-display text-7xl leading-none text-brand-gold sm:text-8xl"
                  >
                    20
                  </p>
  
                  <h3 class="mt-4 font-display text-3xl text-brand-cream">
                    Signature Choices
                  </h3>
  
                  <p class="mt-3 text-sm leading-7 text-brand-muted">
                    A shared collection featuring ten fragrances for men
                    and ten fragrances for women.
                  </p>
                </div>
              </div>
            </article>
  
            <!-- Men collection -->
            <article
              class="group rounded-3xl border border-brand-border bg-brand-panel p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-gold/50"
            >
              <div class="flex items-start justify-between gap-4">
                <span
                  class="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold"
                >
                  Your Men
                </span>
  
                <span
                  class="font-display text-4xl text-brand-gold/40"
                  aria-hidden="true"
                >
                  10
                </span>
              </div>
  
              <h3 class="mt-8 font-display text-2xl text-brand-cream">
                Scents with character.
              </h3>
  
              <p class="mt-3 text-sm leading-6 text-brand-muted">
                Explore scent profiles created for different styles,
                moods, and everyday moments.
              </p>
  
              <a
                href="#shop"
                class="mt-6 inline-flex items-center text-sm font-semibold text-brand-gold"
              >
                View men's collection
                <span
                  class="ml-2 transition group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </a>
            </article>
  
            <!-- Women collection -->
            <article
              class="group rounded-3xl border border-brand-border bg-brand-panel p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-gold/50"
            >
              <div class="flex items-start justify-between gap-4">
                <span
                  class="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold"
                >
                  Your Women
                </span>
  
                <span
                  class="font-display text-4xl text-brand-gold/40"
                  aria-hidden="true"
                >
                  10
                </span>
              </div>
  
              <h3 class="mt-8 font-display text-2xl text-brand-cream">
                Fragrance made personal.
              </h3>
  
              <p class="mt-3 text-sm leading-6 text-brand-muted">
                Discover expressive scents with distinct profiles,
                character, and memorable impressions.
              </p>
  
              <a
                href="#shop"
                class="mt-6 inline-flex items-center text-sm font-semibold text-brand-gold"
              >
                View women's collection
                <span
                  class="ml-2 transition group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </a>
            </article>
          </div>
        </div>
      </section>
    `
  }