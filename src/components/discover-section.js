export function renderDiscoverSection() {
  return `
    <section
      id="discover"
      class="relative isolate overflow-hidden border-t border-brand-border bg-brand-charcoal py-14 sm:py-16 lg:py-16"
    >
      <div
        class="pointer-events-none absolute -left-40 top-10 size-80 rounded-full bg-brand-gold/10 blur-3xl"
        aria-hidden="true"
      ></div>

      <div
        class="pointer-events-none absolute -right-40 bottom-0 size-80 rounded-full bg-brand-bronze/10 blur-3xl"
        aria-hidden="true"
      ></div>

      <div
        class="relative mx-auto grid w-[min(1120px,90%)] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center"
      >
        <div>
          <p
            class="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-brand-gold"
          >
            Discover Your Product
          </p>

          <h2
            class="mt-3 max-w-xl font-display text-4xl leading-[1.05] text-brand-cream sm:text-5xl lg:text-[3.35rem]"
          >
            Twenty scents.

            <span class="block italic text-brand-gold">
              Two collections.
            </span>
          </h2>

          <p
            class="mt-4 max-w-lg text-sm leading-6 text-brand-muted sm:text-base"
          >
            Browse ten fragrances for men and ten fragrances for women,
            each with its own scent profile and character.
          </p>

          <div class="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <a
              href="#shop"
              class="inline-flex h-11 items-center justify-center rounded-xl bg-brand-gold px-5 text-xs font-semibold uppercase tracking-[0.08em] text-[#17130d] transition duration-200 hover:-translate-y-0.5 hover:bg-brand-gold-light"
              @click="activeCategory = 'all'"
            >
              View Perfumes
            </a>

            <a
              href="#packages"
              class="inline-flex h-11 items-center justify-center rounded-xl border border-brand-border px-5 text-xs font-semibold uppercase tracking-[0.08em] text-brand-cream transition duration-200 hover:border-brand-gold hover:text-brand-gold"
            >
              Compare Packages
            </a>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <article
            class="relative min-h-64 overflow-hidden rounded-[1.5rem] border border-brand-gold/30 bg-brand-black p-6 shadow-gold-soft sm:row-span-2 sm:min-h-full"
          >
            <div
              class="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-brand-gold/15 blur-3xl"
              aria-hidden="true"
            ></div>

            <div
              class="pointer-events-none absolute bottom-6 right-6 font-display text-[8rem] leading-none text-brand-gold/[0.025]"
              aria-hidden="true"
            >
              20
            </div>

            <div class="relative flex h-full flex-col justify-between">
              <div
                class="grid size-11 place-items-center rounded-xl border border-brand-gold/30 bg-brand-gold/10 text-brand-gold"
              >
                <svg
                  class="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  aria-hidden="true"
                >
                  <path
                    d="M9 3h6"
                    stroke-linecap="round"
                  />

                  <path
                    d="M10 3v3"
                    stroke-linecap="round"
                  />

                  <path
                    d="M14 3v3"
                    stroke-linecap="round"
                  />

                  <path
                    d="M8 10V8.5A2.5 2.5 0 0 1 10.5 6h3A2.5 2.5 0 0 1 16 8.5V10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />

                  <path
                    d="M8 10h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"
                    stroke-linejoin="round"
                  />

                  <path
                    d="M9 15c1.8 1 4.2 1 6 0"
                    stroke-linecap="round"
                  />
                </svg>
              </div>

              <div class="mt-8">
                <p
                  class="font-display text-6xl leading-none text-brand-gold"
                >
                  20
                </p>

                <h3
                  class="mt-2 font-display text-2xl leading-tight text-brand-cream"
                >
                  Perfume Selections
                </h3>

                <p class="mt-2 text-sm leading-6 text-brand-muted">
                  One shared collection with fragrances for both men
                  and women.
                </p>

                <div
                  class="mt-5 grid grid-cols-2 border-t border-brand-border pt-4"
                >
                  <div>
                    <p
                      class="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-brand-muted"
                    >
                      For Him
                    </p>

                    <p
                      class="mt-1 font-display text-2xl text-brand-cream"
                    >
                      10
                    </p>
                  </div>

                  <div class="border-l border-brand-border pl-4">
                    <p
                      class="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-brand-muted"
                    >
                      For Her
                    </p>

                    <p
                      class="mt-1 font-display text-2xl text-brand-cream"
                    >
                      10
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article
            class="group relative overflow-hidden rounded-[1.4rem] border border-brand-border bg-brand-panel p-5 shadow-panel transition duration-300 hover:-translate-y-1 hover:border-brand-gold/50"
          >
            <div
              class="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full border border-brand-gold/10"
              aria-hidden="true"
            ></div>

            <div
              class="pointer-events-none absolute -right-4 bottom-0 font-display text-[7rem] leading-none text-brand-gold/[0.035]"
              aria-hidden="true"
            >
              10
            </div>

            <div class="relative z-10">
              <div class="flex items-start justify-between gap-4">
                <span
                  class="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
                >
                  Men's Collection
                </span>

                <span
                  class="font-display text-3xl leading-none text-brand-gold/40"
                  aria-hidden="true"
                >
                  10
                </span>
              </div>

              <h3
                class="mt-4 font-display text-2xl leading-tight text-brand-cream"
              >
                Fragrances for men
              </h3>

              <p class="mt-2 max-w-xs text-sm leading-6 text-brand-muted">
                Browse scents created for different styles, moods,
                and occasions.
              </p>

              <a
                href="#shop"
                class="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-brand-gold transition group-hover:text-brand-gold-light"
                @click="activeCategory = 'men'"
              >
                View collection

                <svg
                  class="size-4 transition-transform duration-200 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14"
                    stroke-linecap="round"
                  />

                  <path
                    d="m14 7 5 5-5 5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a>
            </div>
          </article>

          <article
            class="group relative overflow-hidden rounded-[1.4rem] border border-brand-border bg-brand-panel p-5 shadow-panel transition duration-300 hover:-translate-y-1 hover:border-brand-gold/50"
          >
            <div
              class="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full border border-brand-gold/10"
              aria-hidden="true"
            ></div>

            <div
              class="pointer-events-none absolute -right-4 bottom-0 font-display text-[7rem] leading-none text-brand-gold/[0.035]"
              aria-hidden="true"
            >
              10
            </div>

            <div class="relative z-10">
              <div class="flex items-start justify-between gap-4">
                <span
                  class="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
                >
                  Women's Collection
                </span>

                <span
                  class="font-display text-3xl leading-none text-brand-gold/40"
                  aria-hidden="true"
                >
                  10
                </span>
              </div>

              <h3
                class="mt-4 font-display text-2xl leading-tight text-brand-cream"
              >
                Fragrances for women
              </h3>

              <p class="mt-2 max-w-xs text-sm leading-6 text-brand-muted">
                Explore distinct fragrances with personal and
                memorable scent profiles.
              </p>

              <a
                href="#shop"
                class="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-brand-gold transition group-hover:text-brand-gold-light"
                @click="activeCategory = 'women'"
              >
                View collection

                <svg
                  class="size-4 transition-transform duration-200 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14"
                    stroke-linecap="round"
                  />

                  <path
                    d="m14 7 5 5-5 5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  `
}