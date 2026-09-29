import bossImage from '../assets/boss.jpg'

export function renderBossSection() {
  return `
    <section
      id="be-your-own-boss"
      class="relative overflow-hidden border-t border-brand-border bg-brand-black py-14 sm:py-16 lg:py-16"
    >
      <div
        class="mx-auto grid w-[min(1120px,90%)] overflow-hidden rounded-[1.5rem] border border-brand-border bg-brand-panel shadow-panel lg:grid-cols-[0.9fr_1.1fr]"
      >
        <div
          class="relative min-h-[320px] overflow-hidden sm:min-h-[400px] lg:min-h-[500px]"
        >
          <img
            src="${bossImage}"
            alt="Build your own journey with Your Product"
            class="absolute inset-0 size-full object-cover transition duration-700 ease-out hover:scale-[1.03]"
            loading="lazy"
          >

          <div
            class="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent"
            aria-hidden="true"
          ></div>

        </div>

        <div
          class="relative flex items-center p-6 sm:p-8 lg:p-10"
        >
          <div
            class="pointer-events-none absolute -right-24 top-10 size-56 rounded-full bg-brand-gold/10 blur-3xl"
            aria-hidden="true"
          ></div>

          <div class="relative w-full">
            <p
              class="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-brand-gold"
            >
              Be Your Own Boss
            </p>

            <h2
              class="mt-3 max-w-xl font-display text-4xl leading-[1.05] text-brand-cream sm:text-5xl lg:text-[3.35rem]"
            >
              Build something
              <span class="block italic text-brand-gold">
                you can call your own.
              </span>
            </h2>

            <p
              class="mt-4 max-w-xl text-sm leading-6 text-brand-muted sm:text-base"
            >
              Start with a package, explore the perfume collection,
              and manage your member activity through one platform.
            </p>

            <div class="mt-6 border-y border-brand-border">
              <div
                class="grid grid-cols-[2rem_1fr] gap-3 py-3.5"
              >
                <span
                  class="font-display text-xl text-brand-gold/50"
                  aria-hidden="true"
                >
                  01
                </span>

                <div>
                  <h3
                    class="text-sm font-semibold text-brand-cream"
                  >
                    Choose a package
                  </h3>

                  <p
                    class="mt-1 text-xs leading-5 text-brand-muted"
                  >
                    Compare the available options and choose the
                    package that matches your goals.
                  </p>
                </div>
              </div>

              <div
                class="grid grid-cols-[2rem_1fr] gap-3 border-t border-brand-border py-3.5"
              >
                <span
                  class="font-display text-xl text-brand-gold/50"
                  aria-hidden="true"
                >
                  02
                </span>

                <div>
                  <h3
                    class="text-sm font-semibold text-brand-cream"
                  >
                    Know the products
                  </h3>

                  <p
                    class="mt-1 text-xs leading-5 text-brand-muted"
                  >
                    View perfume details, scent profiles, and product
                    information in one place.
                  </p>
                </div>
              </div>

              <div
                class="grid grid-cols-[2rem_1fr] gap-3 border-t border-brand-border py-3.5"
              >
                <span
                  class="font-display text-xl text-brand-gold/50"
                  aria-hidden="true"
                >
                  03
                </span>

                <div>
                  <h3
                    class="text-sm font-semibold text-brand-cream"
                  >
                    Track your progress
                  </h3>

                  <p
                    class="mt-1 text-xs leading-5 text-brand-muted"
                  >
                    Your dashboard will show your direct referrals,
                    points, income, and account activity.
                  </p>
                </div>
              </div>
            </div>

            <a
              href="#packages"
              class="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-brand-gold px-5 text-xs font-semibold uppercase tracking-[0.08em] text-[#17130d] transition duration-200 hover:-translate-y-0.5 hover:bg-brand-gold-light"
            >
              Explore Packages

              <span class="ml-2" aria-hidden="true">
                →
              </span>
            </a>

            <p
              class="mt-4 max-w-lg text-xs leading-5 text-brand-muted"
            >
              Package details and program mechanics remain subject to
              final client confirmation.
            </p>
          </div>
        </div>
      </div>
    </section>
  `
}