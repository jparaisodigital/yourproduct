import mindsetImage from '../assets/mindset.jpg'
import modernImage from '../assets/modern.jpg'
import productBlackImage from '../assets/product-black.jpg'
import productGoldImage from '../assets/product-gold.jpg'

export function renderVisionMissionSection() {
  return `
    <section
      id="vision-mission"
      class="relative overflow-hidden border-t border-brand-border bg-brand-charcoal py-14 sm:py-16 lg:py-16"
    >
      <div
        class="pointer-events-none absolute left-1/2 top-0 size-80 -translate-x-1/2 rounded-full bg-brand-gold/10 blur-3xl"
        aria-hidden="true"
      ></div>

      <div
        class="relative mx-auto w-[min(1120px,90%)]"
      >
        <div class="mx-auto max-w-3xl text-center">
          <p
            class="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-brand-gold"
          >
            Purpose and Direction
          </p>

          <h2
            class="mt-3 font-display text-4xl leading-[1.05] text-brand-cream sm:text-5xl lg:text-[3.35rem]"
          >
            Our Vision.
            <span class="italic text-brand-gold">
              Our Mission.
            </span>
          </h2>

          <p
            class="mx-auto mt-4 max-w-2xl text-sm leading-6 text-brand-muted sm:text-base"
          >
            Building a fragrance experience around personal choice,
            community, and opportunities for growth.
          </p>
        </div>

        <div
          class="mt-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch"
        >
          <div class="grid gap-4">
            <article
              class="relative overflow-hidden rounded-[1.4rem] border border-brand-gold/30 bg-brand-black p-5 shadow-gold-soft sm:p-6"
            >
              <span
                class="absolute right-5 top-3 font-display text-5xl leading-none text-brand-gold/10"
                aria-hidden="true"
              >
                V
              </span>

              <div class="relative">
                <p
                  class="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand-gold"
                >
                  Our Vision
                </p>

                <h3
                  class="mt-3 max-w-md font-display text-2xl leading-tight text-brand-cream"
                >
                  Confidence through personal choice.
                </h3>

                <p class="mt-3 text-sm leading-6 text-brand-muted">
                  To create a community where people can discover
                  fragrances that reflect who they are while exploring
                  paths toward their personal goals.
                </p>
              </div>
            </article>

            <article
              class="relative overflow-hidden rounded-[1.4rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
            >
              <span
                class="absolute right-5 top-3 font-display text-5xl leading-none text-brand-gold/10"
                aria-hidden="true"
              >
                M
              </span>

              <div class="relative">
                <p
                  class="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand-gold"
                >
                  Our Mission
                </p>

                <h3
                  class="mt-3 max-w-md font-display text-2xl leading-tight text-brand-cream"
                >
                  Fragrance and community together.
                </h3>

                <p class="mt-3 text-sm leading-6 text-brand-muted">
                  To provide distinctive perfume choices, accessible
                  packages, and a supportive experience for every
                  member.
                </p>
              </div>
            </article>
          </div>

          <div
            class="grid h-[460px] grid-cols-2 grid-rows-[1fr_1fr_0.72fr] gap-3 sm:h-[500px] lg:h-[520px]"
          >
            <figure
              class="group relative row-span-2 overflow-hidden rounded-[1.4rem] border border-brand-border"
            >
              <img
                src="${mindsetImage}"
                alt="Your Product community mindset"
                class="absolute inset-0 size-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                loading="lazy"
              >

              <div
                class="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
                aria-hidden="true"
              ></div>
            </figure>

            <figure
              class="group relative overflow-hidden rounded-[1.4rem] border border-brand-border"
            >
              <img
                src="${modernImage}"
                alt="Modern Your Product experience"
                class="absolute inset-0 size-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                loading="lazy"
              >

              <div
                class="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent"
                aria-hidden="true"
              ></div>
            </figure>

            <figure
              class="group relative overflow-hidden rounded-[1.4rem] border border-brand-border"
            >
              <img
                src="${productBlackImage}"
                alt="Your Product black fragrance presentation"
                class="absolute inset-0 size-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                loading="lazy"
              >

              <div
                class="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent"
                aria-hidden="true"
              ></div>
            </figure>

            <figure
              class="group relative col-span-2 overflow-hidden rounded-[1.4rem] border border-brand-gold/30"
            >
              <img
                src="${productGoldImage}"
                alt="Your Product gold fragrance presentation"
                class="absolute inset-0 size-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                loading="lazy"
              >

              <div
                class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent"
                aria-hidden="true"
              ></div>
            </figure>
          </div>
        </div>

        <p
          class="mt-5 text-center text-xs leading-5 text-brand-muted"
        >
          Vision and mission wording remains temporary pending the
          official content from Your Product.
        </p>
      </div>
    </section>
  `
}