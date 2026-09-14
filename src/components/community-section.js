export function renderCommunitySection() {
    const communityValues = [
      {
        number: '01',
        title: 'Meet the Community',
        description:
          'Connect with people who share an interest in fragrances and Your Product.',
      },
      {
        number: '02',
        title: 'Know the Products',
        description:
          'Learn about the available perfumes, membership packages, and product information.',
      },
      {
        number: '03',
        title: 'Stay Connected',
        description:
          'Receive official information and future updates from the Your Product community.',
      },
    ]
  
    const valueCards = communityValues
      .map(
        (value) => `
          <article
            class="group border-t border-brand-border py-4 transition duration-300 hover:border-brand-gold"
          >
            <div class="flex items-start gap-4">
              <span
                class="font-display text-2xl leading-none text-brand-gold/30 transition group-hover:text-brand-gold"
                aria-hidden="true"
              >
                ${value.number}
              </span>
  
              <div>
                <h3
                  class="font-display text-xl leading-tight text-brand-cream"
                >
                  ${value.title}
                </h3>
  
                <p class="mt-1.5 text-sm leading-6 text-brand-muted">
                  ${value.description}
                </p>
              </div>
            </div>
          </article>
        `,
      )
      .join('')
  
    return `
      <section
        id="community"
        class="relative isolate overflow-hidden border-t border-brand-border bg-brand-charcoal py-14 sm:py-16 lg:py-16"
      >
        <div
          class="pointer-events-none absolute -left-40 bottom-0 size-80 rounded-full bg-brand-gold/10 blur-3xl"
          aria-hidden="true"
        ></div>
  
        <div
          class="relative mx-auto w-[min(1120px,90%)]"
        >
          <div
            class="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
          >
            <div
              class="relative overflow-hidden rounded-[1.5rem] border border-brand-gold/30 bg-brand-black p-6 shadow-gold-soft sm:p-8"
            >
              <div
                class="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-brand-gold/15 blur-3xl"
                aria-hidden="true"
              ></div>
  
              <div class="relative">
                <p
                  class="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-brand-gold"
                >
                  Our Community
                </p>
  
                <h2
                  class="mt-3 max-w-2xl font-display text-4xl leading-[1.05] text-brand-cream sm:text-5xl lg:text-[3.35rem]"
                >
                  Connect with our
                  <span class="block italic text-brand-gold">
                    fragrance community.
                  </span>
                </h2>
  
                <p
                  class="mt-4 max-w-xl text-sm leading-6 text-brand-muted sm:text-base"
                >
                  A space for members to discover perfumes, learn about
                  packages, and stay connected with Your Product.
                </p>
  
                <div class="mt-6 flex items-center gap-4">
                  <div
                    class="grid size-11 shrink-0 place-items-center rounded-xl border border-brand-gold/30 bg-brand-gold/10 text-brand-gold"
                  >
                    <svg
                      class="size-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.6"
                      aria-hidden="true"
                    >
                      <circle
                        cx="12"
                        cy="7"
                        r="3"
                      />
  
                      <circle
                        cx="5.5"
                        cy="10"
                        r="2"
                      />
  
                      <circle
                        cx="18.5"
                        cy="10"
                        r="2"
                      />
  
                      <path
                        d="M6.5 20a5.5 5.5 0 0 1 11 0"
                        stroke-linecap="round"
                      />
  
                      <path
                        d="M2.5 19a3.5 3.5 0 0 1 4-3.47"
                        stroke-linecap="round"
                      />
  
                      <path
                        d="M21.5 19a3.5 3.5 0 0 0-4-3.47"
                        stroke-linecap="round"
                      />
                    </svg>
                  </div>
  
                  <div>
                    <p
                      class="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-gold"
                    >
                      Member Community
                    </p>
  
                    <p class="mt-1 text-xs text-brand-muted">
                      Learn, connect, and explore together.
                    </p>
                  </div>
                </div>
              </div>
            </div>
  
            <div>
              <p
                class="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand-gold"
              >
                What Members Can Expect
              </p>
  
              <div class="mt-4">
                ${valueCards}
              </div>
  
              <a
                href="#signup"
                class="mt-4 inline-flex h-11 items-center justify-center rounded-xl border border-brand-gold px-5 text-xs font-semibold uppercase tracking-[0.08em] text-brand-gold transition duration-200 hover:bg-brand-gold hover:text-[#17130d]"
              >
                Join the Community
  
                <span class="ml-2" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          </div>
  
          <p
            class="mt-5 text-center text-xs leading-5 text-brand-muted"
          >
            Community activities and official program information remain
            subject to final client confirmation.
          </p>
        </div>
      </section>
    `
  }