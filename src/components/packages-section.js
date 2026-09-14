const pesoFormatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  })
  
  function renderPackageCard(packageItem, index) {
    const priceMarkup =
      packageItem.price !== null
        ? `
            <div class="mt-5">
              <span
                class="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-brand-muted"
              >
                Package price
              </span>
  
              <p
                class="mt-1 font-display text-3xl leading-tight text-brand-gold"
              >
                ${pesoFormatter.format(packageItem.price)}
              </p>
            </div>
          `
        : `
            <div class="mt-5">
              <span
                class="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-brand-muted"
              >
                Package price
              </span>
  
              <p
                class="mt-1 font-display text-xl leading-tight text-brand-gold"
              >
                Details coming soon
              </p>
            </div>
          `
  
    const inclusionsMarkup =
      packageItem.inclusions.length > 0
        ? `
            <ul class="mt-4 space-y-2">
              ${packageItem.inclusions
                .map(
                  (inclusion) => `
                    <li
                      class="flex gap-2.5 text-sm leading-5 text-brand-muted"
                    >
                      <span
                        class="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-gold"
                        aria-hidden="true"
                      ></span>
  
                      <span>
                        ${inclusion}
                      </span>
                    </li>
                  `,
                )
                .join('')}
            </ul>
          `
        : `
            <div
              class="mt-4 rounded-xl border border-brand-border bg-brand-black/40 p-3.5"
            >
              <p class="text-xs leading-5 text-brand-muted">
                Official inclusions will be added after final client
                confirmation.
              </p>
            </div>
          `
  
    const featuredLabel = packageItem.isFeatured
      ? `
          <span
            class="absolute right-5 top-5 inline-flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-brand-gold"
          >
            <span
              class="size-1.5 rounded-full bg-brand-gold"
              aria-hidden="true"
            ></span>
  
            Featured
          </span>
        `
      : ''
  
    const cardClass = packageItem.isFeatured
      ? 'border-brand-gold/60 bg-brand-panel shadow-gold-soft'
      : 'border-brand-border bg-brand-panel shadow-panel'
  
    const buttonClass = packageItem.isFeatured
      ? 'bg-brand-gold text-[#17130d] hover:bg-brand-gold-light'
      : 'border border-brand-border text-brand-cream hover:border-brand-gold hover:bg-brand-gold/5 hover:text-brand-gold'
  
    return `
      <article
        class="${cardClass} group relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-gold/60 sm:p-6"
      >
        <div
          class="pointer-events-none absolute -right-16 -top-16 size-36 rounded-full bg-brand-gold/10 blur-3xl"
          aria-hidden="true"
        ></div>
  
        ${featuredLabel}
  
        <div class="relative flex h-full flex-col">
          <span
            class="font-display text-4xl leading-none text-brand-gold/15"
            aria-hidden="true"
          >
            ${String(index + 1).padStart(2, '0')}
          </span>
  
          <p
            class="mt-4 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand-gold"
          >
            ${packageItem.shortLabel}
          </p>
  
          <h3
            class="mt-2 font-display text-2xl leading-tight text-brand-cream"
          >
            ${packageItem.name}
          </h3>
  
          <p
            class="mt-3 text-sm leading-6 text-brand-muted xl:min-h-[4.5rem]"
          >
            ${packageItem.description}
          </p>
  
          ${priceMarkup}
  
          ${inclusionsMarkup}
  
          <div class="mt-auto pt-5">
            <a
              href="#signup"
              class="${buttonClass} inline-flex h-11 w-full items-center justify-center rounded-xl px-4 text-xs font-semibold uppercase tracking-[0.08em] transition duration-200 active:scale-[0.98]"
            >
              Explore ${packageItem.shortLabel}
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
        class="relative overflow-hidden border-t border-brand-border bg-brand-black py-14 sm:py-16 lg:py-16"
      >
        <div
          class="pointer-events-none absolute -left-40 top-1/3 size-80 rounded-full bg-brand-gold/10 blur-3xl"
          aria-hidden="true"
        ></div>
  
        <div
          class="pointer-events-none absolute -right-40 bottom-0 size-80 rounded-full bg-brand-bronze/10 blur-3xl"
          aria-hidden="true"
        ></div>
  
        <div class="relative mx-auto w-[min(1240px,90%)]">
          <div
            class="grid gap-4 lg:grid-cols-[1fr_0.7fr] lg:items-end"
          >
            <div>
              <p
                class="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-brand-gold"
              >
                Explore Packages
              </p>
  
              <h2
                class="mt-3 max-w-2xl font-display text-4xl leading-[1.05] text-brand-cream sm:text-5xl lg:text-[3.35rem]"
              >
                Choose your
                <span class="italic text-brand-gold">
                  package.
                </span>
              </h2>
            </div>
  
            <p
              class="max-w-lg text-sm leading-6 text-brand-muted sm:text-base lg:justify-self-end"
            >
              Compare the four membership options and choose the package
              that best matches your goals.
            </p>
          </div>
  
          <div
            class="mt-8 grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            ${packageCards}
          </div>
  
          <p
            class="mt-5 text-center text-xs leading-5 text-brand-muted"
          >
            Package prices, inclusions, qualifications, and benefits
            remain subject to official client confirmation.
          </p>
        </div>
      </section>
    `
  }