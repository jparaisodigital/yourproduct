import bossImage from '../assets/boss.jpg'

export function renderBossSection() {
  return `
    <section
      id="be-your-own-boss"
      class="relative overflow-hidden border-t border-brand-border bg-brand-black py-20 sm:py-24 lg:py-28"
    >
      <div
        class="mx-auto grid w-[min(1180px,90%)] overflow-hidden rounded-[2rem] border border-brand-border bg-brand-panel lg:grid-cols-2"
      >
        <!-- Image -->
        <div class="relative min-h-[420px] overflow-hidden lg:min-h-[620px]">
          <img
            src="${bossImage}"
            alt="Be your own boss with Your Product"
            class="absolute inset-0 size-full object-cover transition duration-700 hover:scale-105"
            loading="lazy"
          >

          <div
            class="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent"
            aria-hidden="true"
          ></div>

          <div
            class="absolute inset-x-0 bottom-0 p-7 sm:p-9"
          >
            <p
              class="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold"
            >
              Your journey
            </p>

            <p
              class="mt-3 max-w-md font-display text-3xl leading-tight text-brand-cream sm:text-4xl"
            >
              Your pace. Your choices. Your future.
            </p>
          </div>
        </div>

        <!-- Content -->
        <div
          class="relative flex items-center px-7 py-14 sm:px-10 lg:px-14 lg:py-20"
        >
          <div
            class="pointer-events-none absolute -right-24 top-10 size-64 rounded-full bg-brand-gold/10 blur-3xl"
            aria-hidden="true"
          ></div>

          <div class="relative">
            <p
              class="text-xs font-semibold uppercase tracking-[0.32em] text-brand-gold"
            >
              Be Your Own Boss
            </p>

            <h2
              class="mt-5 max-w-xl font-display text-4xl leading-[1.05] text-brand-cream sm:text-5xl lg:text-6xl"
            >
              Begin something
              <span class="block italic text-brand-gold">
                you can call your own.
              </span>
            </h2>

            <p
              class="mt-7 max-w-xl text-base leading-8 text-brand-muted"
            >
              Your Product brings fragrance and community together,
              giving people a place to discover products, connect with
              others, and explore new possibilities.
            </p>

            <div class="mt-9 space-y-5">
              <div class="flex gap-4">
                <span
                  class="grid size-10 shrink-0 place-items-center rounded-full border border-brand-gold/30 bg-brand-gold/10 text-sm font-semibold text-brand-gold"
                >
                  01
                </span>

                <div>
                  <h3 class="font-semibold text-brand-cream">
                    Choose your beginning
                  </h3>

                  <p class="mt-1 text-sm leading-6 text-brand-muted">
                    Explore the available packages and find the path
                    that matches your goals.
                  </p>
                </div>
              </div>

              <div class="flex gap-4">
                <span
                  class="grid size-10 shrink-0 place-items-center rounded-full border border-brand-gold/30 bg-brand-gold/10 text-sm font-semibold text-brand-gold"
                >
                  02
                </span>

                <div>
                  <h3 class="font-semibold text-brand-cream">
                    Discover your collection
                  </h3>

                  <p class="mt-1 text-sm leading-6 text-brand-muted">
                    Get to know the signature fragrances created for
                    different personalities and moments.
                  </p>
                </div>
              </div>

              <div class="flex gap-4">
                <span
                  class="grid size-10 shrink-0 place-items-center rounded-full border border-brand-gold/30 bg-brand-gold/10 text-sm font-semibold text-brand-gold"
                >
                  03
                </span>

                <div>
                  <h3 class="font-semibold text-brand-cream">
                    Grow with the community
                  </h3>

                  <p class="mt-1 text-sm leading-6 text-brand-muted">
                    Connect, learn, and move forward with a community
                    built around shared possibilities.
                  </p>
                </div>
              </div>
            </div>

            <a
              href="#packages"
              class="mt-10 inline-flex items-center justify-center rounded-full bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-black transition duration-300 hover:-translate-y-1 hover:bg-brand-gold-light"
            >
              Explore Packages

              <span class="ml-3" aria-hidden="true">
                →
              </span>
            </a>

            <p class="mt-5 max-w-lg text-xs leading-5 text-brand-muted">
              Package details and program mechanics are subject to
              final confirmation from Your Product.
            </p>
          </div>
        </div>
      </div>
    </section>
  `
}