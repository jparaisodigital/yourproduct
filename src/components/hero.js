import heroImage from '../assets/hero-client.jpg'

export function renderHero(homeConfig, siteConfig) {
  const { hero, trustPoints } = homeConfig

  const trustPointItems = trustPoints
    .map(
      (item) => `
        <li
          class="flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-brand-muted"
        >
          <span
            class="size-1.5 shrink-0 rounded-full bg-brand-gold"
          ></span>

          ${item}
        </li>
      `,
    )
    .join('')

  return `
    <section
      id="home"
      class="relative isolate overflow-hidden bg-brand-black"
    >
      <div
        class="pointer-events-none absolute -left-40 top-10 size-96 rounded-full bg-brand-gold/10 blur-3xl"
        aria-hidden="true"
      ></div>

      <div
        class="pointer-events-none absolute -right-40 bottom-0 size-96 rounded-full bg-brand-bronze/10 blur-3xl"
        aria-hidden="true"
      ></div>

      <div
        class="relative mx-auto grid w-[min(1120px,90%)] items-center gap-12 py-12 lg:grid-cols-[1fr_0.72fr] lg:gap-16 lg:py-12 xl:py-14"
      >
        <div class="relative z-10">
          <p
            class="text-xs font-semibold uppercase tracking-[0.32em] text-brand-gold"
          >
            ${hero.eyebrow}
          </p>

          <h1
            class="mt-5 max-w-2xl font-display text-5xl font-semibold leading-[0.92] tracking-[-0.035em] text-brand-cream sm:text-6xl lg:text-[4.4rem] xl:text-[4.8rem]"
          >
            ${hero.title}

            <span class="block italic text-brand-gold">
              ${hero.highlightedText}
            </span>
          </h1>

          <p
            class="mt-6 max-w-lg text-base leading-7 text-brand-muted lg:text-[1.05rem]"
          >
            ${hero.description}
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="${hero.primaryAction.href}"
              class="inline-flex items-center justify-center rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-black transition duration-300 hover:-translate-y-1 hover:bg-brand-gold-light"
            >
              ${hero.primaryAction.label}

              <span class="ml-3" aria-hidden="true">
                →
              </span>
            </a>

            <a
              href="${hero.secondaryAction.href}"
              class="inline-flex items-center justify-center rounded-full border border-brand-border px-6 py-3 text-sm font-semibold text-brand-cream transition duration-300 hover:border-brand-gold hover:text-brand-gold"
            >
              ${hero.secondaryAction.label}
            </a>
          </div>

          <ul
            class="mt-9 grid gap-4 border-t border-brand-border pt-6 sm:grid-cols-3"
          >
            ${trustPointItems}
          </ul>
        </div>

        <figure
          class="relative mx-auto w-full max-w-[430px] lg:mr-0 lg:max-w-[390px] xl:max-w-[420px]"
        >
          <div
            class="absolute -inset-3 border border-brand-gold/20"
            aria-hidden="true"
          ></div>

          <div
            class="relative overflow-hidden border border-brand-border bg-brand-charcoal shadow-panel"
          >
            <img
              src="${heroImage}"
              alt="${siteConfig.brand.name} campaign"
              class="block h-auto max-h-[610px] w-full object-contain"
              fetchpriority="high"
            >
          </div>
        </figure>
      </div>
    </section>
  `
}