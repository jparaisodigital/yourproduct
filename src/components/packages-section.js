import starterPackagePoster from '../assets/products/starter1.webp'
import builderPackagePoster from '../assets/products/builder5.webp'
import leaderPackagePoster from '../assets/products/leader10.webp'
import prestigePackagePoster from '../assets/products/prestige50.webp'

const packagePosterById = {
  starter: starterPackagePoster,
  builder: builderPackagePoster,
  leader: leaderPackagePoster,
  prestige: prestigePackagePoster,
}

const pesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 0,
})

function renderPackageCard(
  packageItem,
  index,
  options = {},
) {
  const isAdminPreview =
    options.isAdminPreview === true
  const packagePoster = packagePosterById[packageItem.id] || ''

  const priceMarkup =
    packageItem.price !== null
      ? `
          <div class="mt-4 sm:mt-5 lg:mt-3">
            <span
              class="text-[0.6rem] font-medium uppercase tracking-[0.12em] text-brand-muted sm:text-[0.65rem] sm:tracking-[0.16em]"
            >
              Package price
            </span>

            <p
              class="mt-1 font-display text-2xl leading-tight text-brand-gold sm:text-3xl lg:text-2xl"
            >
              ${pesoFormatter.format(packageItem.price)}
            </p>
          </div>
        `
      : `
          <div class="mt-4 sm:mt-5 lg:mt-3">
            <span
              class="text-[0.6rem] font-medium uppercase tracking-[0.12em] text-brand-muted sm:text-[0.65rem] sm:tracking-[0.16em]"
            >
              Package price
            </span>

            <p
              class="mt-1 font-display text-lg leading-tight text-brand-gold sm:text-xl"
            >
              Details coming soon
            </p>
          </div>
        `

  const discountMarkup = packageItem.discountLabel
    ? `
        <span
          class="mt-2 inline-flex w-fit rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-brand-gold"
        >
          ${packageItem.discountLabel}
        </span>
      `
    : ''

  const pointsRewardMarkup =
    packageItem.pointsReward
      ? `
          <p
            class="mt-2 inline-flex rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-brand-gold"
          >
            Earn ${packageItem.pointsReward.toLocaleString()} points after approval
          </p>
        `
      : ''

  const packagePosterMarkup = packagePoster
    ? `
        <button
          type="button"
          class="mt-4 block w-full overflow-hidden rounded-2xl border border-brand-border bg-brand-black/70 p-2 transition hover:border-brand-gold/60 sm:mt-5 lg:mt-4"
          aria-label="Open ${packageItem.name} package image"
          @click="
            packagePreviewImage = '${packagePoster}'
            packagePreviewTitle = '${packageItem.name}'
            packagePreviewOpen = true
          "
        >
          <img
            src="${packagePoster}"
            alt="${packageItem.name} package details"
            class="mx-auto max-h-80 w-full rounded-xl object-contain sm:max-h-96 lg:max-h-80"
            loading="lazy"
          >
        </button>
      `
    : ''

  // NOTE: inclusionsMarkup and optionsMarkup are currently unused
  // (replaced by the poster image). Kept for easy rollback.
  const inclusionsMarkup =
    packageItem.inclusions.length > 0
      ? `
          <ul class="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2 lg:mt-3 lg:space-y-1">
            ${packageItem.inclusions
              .map(
                (inclusion) => `
                  <li
                    class="flex gap-2 text-xs leading-5 text-brand-muted sm:gap-2.5 sm:text-sm lg:text-xs lg:leading-5"
                  >
                    <span
                      class="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-gold"
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
            class="mt-3 rounded-xl border border-brand-border bg-brand-black/40 p-3 sm:mt-4 sm:p-3.5"
          >
            <p class="text-xs leading-5 text-brand-muted">
              Official inclusions will be added after final client
              confirmation.
            </p>
          </div>
        `

  const optionsMarkup =
    packageItem.options?.length > 0
      ? `
          <div class="mt-3 grid gap-2">
            ${packageItem.options
              .map(
                (option) => `
                  <div
                    class="rounded-xl border border-brand-gold/25 bg-brand-gold/10 px-3 py-2"
                  >
                    <p
                      class="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-brand-gold"
                    >
                      ${option.label}
                    </p>

                    <p
                      class="mt-1 text-xs font-semibold text-brand-cream"
                    >
                      ${option.title}
                    </p>

                    <p
                      class="mt-1 text-xs leading-5 text-brand-muted"
                    >
                      ${option.description}
                    </p>
                  </div>
                `,
              )
              .join('')}
          </div>
        `
      : ''

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

  const packageCtaHref =
    isAdminPreview
      ? '#packages'
      : `/login/?package=${encodeURIComponent(packageItem.id)}`

  const packageCtaLabel =
    isAdminPreview
      ? 'Admin Preview Only'
      : `Choose ${packageItem.shortLabel}`

  const packageCtaAttributes =
    isAdminPreview
      ? 'aria-disabled="true" tabindex="-1"'
      : `
          data-package-cta="${packageItem.id}"
          data-package-name="${packageItem.name}"
          data-package-price="${pesoFormatter.format(packageItem.price)}"
          data-package-description="${packageItem.description}"
          data-package-inclusions="${packageItem.inclusions.join(' | ')}"
        `

  const packageCtaClass =
    isAdminPreview
      ? 'border border-brand-border text-brand-muted opacity-70 cursor-not-allowed'
      : buttonClass

  return `
    <article
      class="${cardClass} package-scroll-card group relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-gold/60 sm:p-6 lg:p-5"
      data-package-card
      data-package-index="${index}"
    >
      <div
        class="pointer-events-none absolute -right-16 -top-16 size-36 rounded-full bg-brand-gold/10 blur-3xl"
        aria-hidden="true"
      ></div>

      ${featuredLabel}

      <div class="relative flex h-full flex-col">
        <span
          class="font-display text-4xl leading-none text-brand-gold/15 lg:text-3xl"
          aria-hidden="true"
        >
          ${String(index + 1).padStart(2, '0')}
        </span>

        <p
          class="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-gold sm:mt-4 sm:text-[0.68rem] sm:tracking-[0.22em] lg:mt-3"
        >
          ${packageItem.shortLabel}
        </p>

        <h3
          class="mt-1.5 font-display text-2xl leading-tight text-brand-cream sm:mt-2 lg:text-[1.35rem]"
        >
          ${packageItem.name}
        </h3>

        <p
          class="mt-2 text-xs leading-5 text-brand-muted sm:mt-3 sm:text-sm sm:leading-6 lg:mt-2 lg:min-h-[2.5rem] lg:text-xs lg:leading-5"
        >
          ${packageItem.description}
        </p>

        ${priceMarkup}
        ${discountMarkup}
        ${pointsRewardMarkup}
        ${packagePosterMarkup}

        <div class="mt-auto pt-4 sm:pt-5 lg:pt-3">
          <a
            href="${packageCtaHref}"
            ${packageCtaAttributes}
            class="${packageCtaClass} inline-flex h-10 w-full items-center justify-center rounded-xl px-4 text-[0.68rem] font-semibold uppercase tracking-[0.07em] transition duration-200 active:scale-[0.98] sm:h-11 sm:text-xs sm:tracking-[0.08em] lg:h-10"
          >
            ${packageCtaLabel}
          </a>
        </div>
      </div>
    </article>
  `
}

export function renderPackagesSection(
  packages,
  options = {},
) {
  const activePackages = packages.filter(
    (packageItem) => packageItem.isActive,
  )

  const packageCards = activePackages
    .map((packageItem, index) =>
      renderPackageCard(
        packageItem,
        index,
        options,
      ),
    )
    .join('')

  return `
    <section
      id="packages"
      x-data="{
        packagePreviewOpen: false,
        packagePreviewImage: '',
        packagePreviewTitle: ''
      }"
      x-effect="document.documentElement.classList.toggle('overflow-hidden', packagePreviewOpen)"
      class="scroll-mt-24 relative overflow-clip border-t border-brand-border bg-brand-black py-14 sm:py-16 lg:py-8"
      @keydown.escape.window="packagePreviewOpen = false"
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
              class="mt-3 max-w-2xl font-display text-4xl leading-[1.05] text-brand-cream sm:text-5xl lg:mt-2 lg:text-[2.75rem]"
            >
              Choose your

              <span class="italic text-brand-gold">
                package.
              </span>
            </h2>
          </div>

          <p
            class="max-w-lg text-sm leading-6 text-brand-muted sm:text-base lg:justify-self-end lg:text-sm"
          >
            Explore the four membership options and choose the package
            that best matches your goals.
          </p>
        </div>

        <div
          class="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-5 xl:grid-cols-4"
          aria-label="Membership packages"
        >
          ${packageCards}
        </div>

        <p
          class="mt-5 text-center text-xs leading-5 text-brand-muted lg:mt-3"
        >
          Select a package to create your account. Package payment and
          verification will be completed through your customer portal.
        </p>

        <template x-teleport="body">
          <div
            x-cloak
            x-show="packagePreviewOpen"
            x-transition.opacity.duration.200ms
            class="fixed inset-0 z-[100] grid h-dvh w-screen place-items-center overflow-y-auto overscroll-contain bg-black/80 px-4 py-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Package image preview"
          >
            <button
              type="button"
              class="absolute inset-0 cursor-default"
              aria-label="Close package preview"
              @click="packagePreviewOpen = false"
            ></button>

            <div class="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-brand-gold/40 bg-brand-black p-3 shadow-2xl">
              <button
                type="button"
                class="absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full border border-white/15 bg-black/80 text-xl leading-none text-white shadow-lg transition hover:border-brand-gold hover:text-brand-gold"
                aria-label="Close package preview"
                @click="packagePreviewOpen = false"
              >
                <span aria-hidden="true">&times;</span>
              </button>

              <img
                :src="packagePreviewImage"
                :alt="packagePreviewTitle + ' enlarged package details'"
                class="max-h-[88dvh] w-full rounded-xl object-contain"
              >
            </div>
          </div>
        </template>
      </div>
    </section>
  `
}
