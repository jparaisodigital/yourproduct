import mindsetImage from '../assets/mindset.jpg'
import modernImage from '../assets/modern.jpg'
import productBlackImage from '../assets/product-black.jpg'
import productGoldImage from '../assets/product-gold.jpg'

export function renderVisionMissionSection() {
  return `
    <section
      id="vision-mission"
      class="relative overflow-hidden border-t border-brand-border bg-brand-charcoal py-20 sm:py-24 lg:py-28"
    >
      <div
        class="pointer-events-none absolute left-1/2 top-0 size-[30rem] -translate-x-1/2 rounded-full bg-brand-gold/5 blur-3xl"
        aria-hidden="true"
      ></div>

      <div class="relative mx-auto w-[min(1180px,90%)]">
        <!-- Section heading -->
        <div class="mx-auto max-w-3xl text-center">
          <p
            class="text-xs font-semibold uppercase tracking-[0.32em] text-brand-gold"
          >
            Purpose and Direction
          </p>

          <h2
            class="mt-5 font-display text-4xl leading-tight text-brand-cream sm:text-5xl lg:text-6xl"
          >
            Our Vision.
            <span class="italic text-brand-gold">
              Our Mission.
            </span>
          </h2>

          <p
            class="mx-auto mt-6 max-w-2xl text-base leading-8 text-brand-muted"
          >
            A fragrance experience shaped by personal identity,
            meaningful connections, and opportunities for growth.
          </p>
        </div>

        <div
          class="mt-14 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch"
        >
          <!-- Vision and mission cards -->
          <div class="grid gap-5">
            <article
              class="relative overflow-hidden rounded-3xl border border-brand-gold/30 bg-brand-black p-7 sm:p-9"
            >
              <span
                class="absolute right-5 top-2 font-display text-8xl text-brand-gold/10"
                aria-hidden="true"
              >
                V
              </span>

              <div class="relative">
                <p
                  class="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold"
                >
                  Our Vision
                </p>

                <h3
                  class="mt-5 max-w-md font-display text-3xl leading-tight text-brand-cream sm:text-4xl"
                >
                  A future inspired by confidence and possibility.
                </h3>

                <p class="mt-5 text-sm leading-7 text-brand-muted">
                  To create a community where people can discover
                  fragrances that reflect who they are while exploring
                  meaningful paths toward their personal goals.
                </p>
              </div>
            </article>

            <article
              class="relative overflow-hidden rounded-3xl border border-brand-border bg-brand-panel p-7 sm:p-9"
            >
              <span
                class="absolute right-5 top-2 font-display text-8xl text-brand-gold/10"
                aria-hidden="true"
              >
                M
              </span>

              <div class="relative">
                <p
                  class="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold"
                >
                  Our Mission
                </p>

                <h3
                  class="mt-5 max-w-md font-display text-3xl leading-tight text-brand-cream sm:text-4xl"
                >
                  Bringing fragrance and community together.
                </h3>

                <p class="mt-5 text-sm leading-7 text-brand-muted">
                  To present distinctive scent choices, welcoming
                  packages, and a supportive community experience
                  designed to help every member begin with purpose.
                </p>
              </div>
            </article>
          </div>

          <!-- Four-picture gallery -->
          <div class="grid min-h-[620px] grid-cols-2 gap-4">
            <figure
              class="group relative row-span-2 overflow-hidden rounded-3xl border border-brand-border"
            >
              <img
                src="${mindsetImage}"
                alt="Your Product community mindset"
                class="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              >

              <div
                class="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent"
                aria-hidden="true"
              ></div>
            </figure>

            <figure
              class="group relative overflow-hidden rounded-3xl border border-brand-border"
            >
              <img
                src="${modernImage}"
                alt="Modern Your Product experience"
                class="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              >

              <div
                class="absolute inset-0 bg-gradient-to-t from-brand-black/60 to-transparent"
                aria-hidden="true"
              ></div>
            </figure>

            <figure
              class="group relative overflow-hidden rounded-3xl border border-brand-border"
            >
              <img
                src="${productBlackImage}"
                alt="Your Product black fragrance presentation"
                class="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              >

              <div
                class="absolute inset-0 bg-gradient-to-t from-brand-black/60 to-transparent"
                aria-hidden="true"
              ></div>
            </figure>

            <figure
              class="group relative col-span-2 min-h-52 overflow-hidden rounded-3xl border border-brand-gold/30"
            >
              <img
                src="${productGoldImage}"
                alt="Your Product gold fragrance presentation"
                class="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              >

              <div
                class="absolute inset-0 bg-gradient-to-r from-brand-black/80 via-brand-black/20 to-transparent"
                aria-hidden="true"
              ></div>

              <figcaption
                class="absolute bottom-6 left-6 max-w-xs"
              >
                <p
                  class="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold"
                >
                  Your Product
                </p>

                <p
                  class="mt-2 font-display text-2xl text-brand-cream"
                >
                  Scents that create opportunities.
                </p>
              </figcaption>
            </figure>
          </div>
        </div>

        <p
          class="mt-8 text-center text-xs leading-5 text-brand-muted"
        >
          Vision and mission wording is temporary pending the official
          content from Your Product.
        </p>
      </div>
    </section>
  `
}