import heroImage from '../assets/hero-client.jpg'

export function renderHero(homeConfig, siteConfig) {
  const { hero, trustPoints } = homeConfig

  const trustPointItems = trustPoints
    .map(
      (item) => `
        <li class="flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-brand-muted">
          <span class="size-1.5 shrink-0 rounded-full bg-brand-gold"></span>
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

      <div class="relative mx-auto grid w-[min(1180px,90%)] items-center gap-14 py-12 lg:grid-cols-[1fr_0.85fr] lg:py-14">
        <div class="relative z-10">
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
            ${hero.eyebrow}
          </p>

          <h1 class="mt-6 max-w-3xl font-display text-6xl font-semibold leading-[0.88] tracking-[-0.04em] text-brand-cream sm:text-7xl lg:text-[5.7rem]">
            ${hero.title}

            <span class="block italic text-brand-gold">
              ${hero.highlightedText}
            </span>
          </h1>

          <p class="mt-7 max-w-xl text-base leading-7 text-brand-muted sm:text-lg">
            ${hero.description}
          </p>

          <div class="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="${hero.primaryAction.href}"
              class="inline-flex items-center justify-center rounded-full bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-black transition duration-300 hover:-translate-y-1 hover:bg-brand-gold-light"
            >
              ${hero.primaryAction.label}
              <span class="ml-3" aria-hidden="true">→</span>
            </a>

            <a
              href="${hero.secondaryAction.href}"
              class="inline-flex items-center justify-center rounded-full border border-brand-border px-7 py-3.5 text-sm font-semibold text-brand-cream transition duration-300 hover:border-brand-gold hover:text-brand-gold"
            >
              ${hero.secondaryAction.label}
            </a>
          </div>

          <ul class="mt-11 grid gap-4 border-t border-brand-border pt-6 sm:grid-cols-3">
            ${trustPointItems}
          </ul>
        </div>

        <figure class="relative mx-auto w-full max-w-[480px] lg:mr-0">
          <div
            class="absolute -inset-3 border border-brand-gold/20"
            aria-hidden="true"
          ></div>

          <div class="relative overflow-hidden border border-brand-border bg-brand-charcoal shadow-panel">
            <img
              src="${heroImage}"
              alt="${siteConfig.brand.name} campaign"
              class="h-auto w-full"
              fetchpriority="high"
            >
          </div>
        </figure>
      </div>
    </section>
  `
}