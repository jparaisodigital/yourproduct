export function renderCommunitySection() {
    const communityValues = [
      {
        number: '01',
        title: 'Connect',
        description:
          'Meet people who share an interest in fragrance, personal growth, and new possibilities.',
      },
      {
        number: '02',
        title: 'Discover',
        description:
          'Learn more about every scent, package, and opportunity available within Your Product.',
      },
      {
        number: '03',
        title: 'Move Forward',
        description:
          'Take your next step at your own pace with a community ready to grow together.',
      },
    ]
  
    const valueCards = communityValues
      .map(
        (value) => `
          <article
            class="group border-t border-brand-border py-7 transition duration-300 hover:border-brand-gold"
          >
            <div class="flex items-start gap-5">
              <span
                class="font-display text-3xl text-brand-gold/40 transition group-hover:text-brand-gold"
                aria-hidden="true"
              >
                ${value.number}
              </span>
  
              <div>
                <h3 class="font-display text-2xl text-brand-cream">
                  ${value.title}
                </h3>
  
                <p class="mt-3 text-sm leading-7 text-brand-muted">
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
        class="relative isolate overflow-hidden border-t border-brand-border bg-brand-charcoal py-20 sm:py-24 lg:py-28"
      >
        <div
          class="pointer-events-none absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-gold/10"
          aria-hidden="true"
        ></div>
  
        <div
          class="pointer-events-none absolute left-1/2 top-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-gold/10"
          aria-hidden="true"
        ></div>
  
        <div class="relative mx-auto w-[min(1180px,90%)]">
          <div
            class="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
          >
            <!-- Main community message -->
            <div
              class="relative overflow-hidden rounded-[2rem] border border-brand-gold/30 bg-brand-black px-7 py-14 sm:px-12 sm:py-16 lg:px-14 lg:py-20"
            >
              <div
                class="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-brand-gold/15 blur-3xl"
                aria-hidden="true"
              ></div>
  
              <div class="relative">
                <p
                  class="text-xs font-semibold uppercase tracking-[0.32em] text-brand-gold"
                >
                  Our Community
                </p>
  
                <h2
                  class="mt-6 max-w-3xl font-display text-4xl leading-[1.05] text-brand-cream sm:text-5xl lg:text-6xl"
                >
                  Different beginnings.
                  <span class="block italic text-brand-gold">
                    One shared community.
                  </span>
                </h2>
  
                <p
                  class="mt-7 max-w-2xl text-base leading-8 text-brand-muted"
                >
                  Your Product is a place to connect, discover signature
                  fragrances, and explore possibilities together.
                </p>
  
                <!-- Member symbols -->
                <div class="mt-10 flex items-center">
                  <span
                    class="grid size-12 place-items-center rounded-full border-2 border-brand-black bg-brand-gold font-semibold text-brand-black"
                    aria-hidden="true"
                  >
                    Y
                  </span>
  
                  <span
                    class="-ml-3 grid size-12 place-items-center rounded-full border-2 border-brand-black bg-brand-bronze font-semibold text-brand-cream"
                    aria-hidden="true"
                  >
                    O
                  </span>
  
                  <span
                    class="-ml-3 grid size-12 place-items-center rounded-full border-2 border-brand-black bg-brand-cream font-semibold text-brand-black"
                    aria-hidden="true"
                  >
                    U
                  </span>
  
                  <span
                    class="-ml-3 grid size-12 place-items-center rounded-full border-2 border-brand-black bg-brand-panel font-semibold text-brand-gold"
                    aria-hidden="true"
                  >
                    +
                  </span>
  
                  <p
                    class="ml-5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted"
                  >
                    Connect and grow together
                  </p>
                </div>
              </div>
            </div>
  
            <!-- Community values -->
            <div>
              <p
                class="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold"
              >
                Shared Possibilities
              </p>
  
              <p
                class="mt-5 max-w-lg text-sm leading-7 text-brand-muted"
              >
                Every journey begins differently. Our goal is to create
                a welcoming space where members can learn, connect, and
                take their next step.
              </p>
  
              <div class="mt-8">
                ${valueCards}
              </div>
  
              <a
                href="#signup"
                class="mt-4 inline-flex items-center rounded-full border border-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-gold transition duration-300 hover:bg-brand-gold hover:text-brand-black"
              >
                Join the Community
  
                <span class="ml-3" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          </div>
  
          <p
            class="mt-8 text-center text-xs leading-5 text-brand-muted"
          >
            Community information and official program wording remain
            subject to final client confirmation.
          </p>
        </div>
      </section>
    `
  }