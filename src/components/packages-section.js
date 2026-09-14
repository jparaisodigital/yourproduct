const pesoFormatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  })
  
  function renderPackageCard(packageItem, index) {
    const priceMarkup =
      packageItem.price !== null
        ? `
          <div class="mt-7">
            <span class="text-xs uppercase tracking-[0.18em] text-brand-muted">
              Package Price
            </span>
  
            <p class="mt-2 font-display text-4xl text-brand-gold">
              ${pesoFormatter.format(packageItem.price)}
            </p>
          </div>
        `
        : `
          <div class="mt-7">
            <span class="text-xs uppercase tracking-[0.18em] text-brand-muted">
              Package Price
            </span>
  
            <p class="mt-2 font-display text-2xl text-brand-gold">
              Details Coming Soon
            </p>
          </div>
        `
  
    const inclusionsMarkup =
      packageItem.inclusions.length > 0
        ? `
          <ul class="mt-6 space-y-3">
            ${packageItem.inclusions
              .map(
                (inclusion) => `
                  <li class="flex gap-3 text-sm leading-6 text-brand-muted">
                    <span
                      class="mt-2 size-1.5 shrink-0 rounded-full bg-brand-gold"
                      aria-hidden="true"
                    ></span>
  
                    <span>${inclusion}</span>
                  </li>
                `,
              )
              .join('')}
          </ul>
        `
        : `
          <div
            class="mt-6 rounded-2xl border border-brand-border bg-brand-black/40 p-4"
          >
            <p class="text-sm leading-6 text-brand-muted">
              Official package inclusions are pending final confirmation
              from Your Product.
            </p>
          </div>
        `
  
    const featuredBadge = packageItem.isFeatured
      ? `
        <span
          class="absolute right-5 top-5 rounded-full bg-brand-gold px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brand-black"
        >
          Featured
        </span>
      `
      : ''
  
    const cardClass = packageItem.isFeatured
      ? 'border-brand-gold/60 bg-brand-panel shadow-[0_20px_80px_rgba(210,170,85,0.12)]'
      : 'border-brand-border bg-brand-panel'
  
    return `
      <article
        class="${cardClass} group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 transition duration-300 hover:-translate-y-2 hover:border-brand-gold/60 sm:p-7"
      >
        <div
          class="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-brand-gold/10 blur-3xl"
          aria-hidden="true"
        ></div>
  
        ${featuredBadge}
  
        <div class="relative flex h-full flex-col">
          <span
            class="font-display text-6xl leading-none text-brand-gold/15"
            aria-hidden="true"
          >
            0${index + 1}
          </span>
  
          <p
            class="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold"
          >
            ${packageItem.shortLabel}
          </p>
  
          <h3 class="mt-3 font-display text-3xl text-brand-cream">
            ${packageItem.name}
          </h3>
  
          <p class="mt-4 min-h-20 text-sm leading-7 text-brand-muted">
            ${packageItem.description}
          </p>
  
          ${priceMarkup}
  
          ${inclusionsMarkup}
  
          <div class="mt-auto pt-8">
            <a
              href="#signup"
              class="${
                packageItem.isFeatured
                  ? 'bg-brand-gold text-brand-black hover:bg-brand-gold-light'
                  : 'border border-brand-border text-brand-cream hover:border-brand-gold hover:text-brand-gold'
              } inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-sm font-semibold transition"
            >
              Explore ${packageItem.shortLabel}
  
              <span class="ml-2" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>
      </article>
    `
  }
  
  export function renderPackagesSection(packages) {
    const activePackages = packages.filter(
      (packageItem) => packageItem.isActive,
    )
  
    const packageCards = activePackages
      .map((packageItem, index) =>
        renderPackageCard(packageItem, index),
      )
      .join('')
  
    return `
      <section
        id="packages"
        class="relative overflow-hidden border-t border-brand-border bg-brand-black py-20 sm:py-24 lg:py-28"
      >
        <div
          class="pointer-events-none absolute -left-40 top-1/3 size-96 rounded-full bg-brand-gold/10 blur-3xl"
          aria-hidden="true"
        ></div>
  
        <div
          class="pointer-events-none absolute -right-40 bottom-0 size-96 rounded-full bg-brand-bronze/10 blur-3xl"
          aria-hidden="true"
        ></div>
  
        <div class="relative mx-auto w-[min(1280px,90%)]">
          <div
            class="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end"
          >
            <div>
              <p
                class="text-xs font-semibold uppercase tracking-[0.32em] text-brand-gold"
              >
                Explore Packages
              </p>
  
              <h2
                class="mt-5 max-w-2xl font-display text-4xl leading-tight text-brand-cream sm:text-5xl lg:text-6xl"
              >
                Choose the beginning
                <span class="block italic text-brand-gold">
                  that feels right for you.
                </span>
              </h2>
            </div>
  
            <p
              class="max-w-xl text-sm leading-7 text-brand-muted sm:text-base lg:justify-self-end"
            >
              Discover four available paths designed for different
              beginnings, goals, and possibilities.
            </p>
          </div>
  
          <div
            class="mt-12 grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4"
          >
            ${packageCards}
          </div>
  
          <p
            class="mt-8 text-center text-xs leading-5 text-brand-muted"
          >
            Package prices, inclusions, qualifications, and benefits
            remain subject to official client confirmation.
          </p>
        </div>
      </section>
    `
  }