const pesoFormatter = new Intl.NumberFormat(
  'en-PH',
  {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  },
)

export function renderProductCard(product, options = {}) {
  const isAvailable =
    product.isActive &&
    Number(product.stockQuantity || 0) > 0

  const stockLabel = !product.isActive
    ? 'Coming soon'
    : isAvailable
      ? 'In stock'
      : 'Out of stock'

  const stockTextClass = isAvailable
    ? 'text-emerald-400'
    : 'text-red-400'

  const stockDotClass = isAvailable
    ? 'bg-emerald-400'
    : 'bg-red-400'

  const tierLabel = options.tierLabel || ''
  const tierPrice = Number(options.tierPrice || 0)

  const memberPriceMarkup = tierPrice > 0
    ? `
        <div
          class="mt-2 rounded-xl border border-brand-gold/25 bg-brand-gold/10 px-3 py-2"
        >
          <p
            class="text-[0.55rem] font-semibold uppercase tracking-[0.08em] text-brand-gold sm:text-[0.68rem] sm:tracking-[0.14em]"
          >
            ${tierLabel || 'Your reseller price'}
          </p>

          <p
            class="mt-1 font-semibold text-brand-gold"
          >
            ${pesoFormatter.format(tierPrice)} per bottle
          </p>

          <p
            class="mt-1 text-xs leading-5 text-brand-muted"
          >
            Retail ${pesoFormatter.format(product.regularPrice)}. Tier pricing is based on your approved package.
          </p>
        </div>
      `
    : `
        <div
          class="mt-2 rounded-xl border border-brand-gold/25 bg-brand-gold/10 px-3 py-2"
        >
          <p
            class="text-[0.55rem] font-semibold uppercase tracking-[0.08em] text-brand-gold sm:text-[0.68rem] sm:tracking-[0.14em]"
          >
            Reseller tiers
          </p>

          <p
            class="mt-1 text-xs leading-5 text-brand-muted"
          >
            From ₱245 to ₱175 per bottle, depending on approved package.
          </p>
        </div>
      `

  const pointsMarkup =
    product.isPointsQualified
      ? `
          <span
            class="inline-flex items-center gap-1.5 text-[0.58rem] text-brand-muted sm:text-xs"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              class="size-3 text-brand-gold sm:size-3.5"
              aria-hidden="true"
            >
              <path
                d="M10 2.5l2.02 4.1 4.53.66-3.28 3.2.78 4.52L10 12.85l-4.05 2.13.78-4.52-3.28-3.2 4.53-.66L10 2.5Z"
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linejoin="round"
              />
            </svg>

            ${product.pointsPerUnit} points
          </span>
        `
      : ''

  return `
    <article
      x-show="
        activeCategory === 'all' ||
        activeCategory === '${product.category}'
      "
      x-transition.opacity.duration.200ms
      class="group overflow-hidden rounded-[1.1rem] border border-brand-border bg-brand-panel shadow-[0_18px_50px_rgb(74_57_27_/_0.08)] transition duration-300 hover:border-brand-gold/50 hover:shadow-[0_24px_65px_rgb(183_138_50_/_0.14)] sm:rounded-[1.5rem]"
      data-product-card
      data-product-id="${product.id}"
      data-product-category="${product.category}"
    >
      <button
        type="button"
        class="group/image relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-brand-black text-left"
        data-action="quick-view"
        data-product-id="${product.id}"
        aria-label="View details for ${product.name}"
        @click="$store.productView.open('${product.id}')"
        ${product.isActive ? '' : 'disabled'}
      >
        <img
  src="${product.image}"
  alt="${product.name}"
  class="size-full object-contain object-center p-2 sm:p-3"
  loading="lazy"
>
      </button>

      <div class="p-4 sm:p-6">
        <div
          class="flex flex-wrap items-center justify-between gap-2"
        >
          <span
            class="text-[0.55rem] font-semibold uppercase tracking-[0.08em] text-brand-gold sm:text-[0.68rem] sm:tracking-[0.14em]"
          >
            ${product.collectionLabel}
          </span>

          ${pointsMarkup}
        </div>

        <div
          class="mt-3 flex items-center justify-between gap-3"
        >
          <h3
            class="min-w-0 truncate font-display text-xl leading-tight text-brand-cream sm:text-2xl"
          >
            ${product.name}
          </h3>

          <span
            class="${stockTextClass} inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[0.62rem] font-semibold sm:text-xs"
            aria-label="${stockLabel}"
          >
            <span
              class="${stockDotClass} ${
                isAvailable
                  ? 'stock-status-dot'
                  : ''
              } block size-1.5 shrink-0 rounded-full"
              aria-hidden="true"
            ></span>

            ${stockLabel}
          </span>
        </div>

        <div
          class="mt-4 border-t border-brand-border pt-4"
        >
          <div
            class="flex items-center justify-between gap-3"
          >
            <span
              class="text-[0.55rem] font-medium uppercase tracking-[0.08em] text-brand-muted sm:text-[0.68rem] sm:tracking-[0.16em]"
            >
              Regular price
            </span>

            <span
              class="shrink-0 text-sm font-semibold text-brand-cream sm:text-base"
            >
              ${pesoFormatter.format(
                product.regularPrice,
              )}
            </span>
          </div>

          ${memberPriceMarkup}
        </div>

        <div
          class="mt-4 flex items-center gap-2.5"
        >
          <button
            type="button"
            class="group/view hidden size-11 shrink-0 place-items-center rounded-full border border-brand-border bg-transparent text-brand-muted transition duration-200 hover:border-brand-gold hover:bg-brand-gold/10 hover:text-brand-gold active:scale-95 sm:grid"
            data-action="quick-view"
            data-product-id="${product.id}"
            aria-label="Quick view ${product.name}"
            title="Quick view"
            @click.prevent="$store.productView.open('${product.id}')"
            ${product.isActive ? '' : 'disabled'}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              class="size-[1.15rem] transition duration-200 group-hover/view:scale-110"
              aria-hidden="true"
            >
              <path
                d="M2.75 12s3.25-5.5 9.25-5.5 9.25 5.5 9.25 5.5-3.25 5.5-9.25 5.5S2.75 12 2.75 12Z"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <circle
                cx="12"
                cy="12"
                r="2.75"
                stroke="currentColor"
                stroke-width="1.6"
              />
            </svg>

            <span class="sr-only">
              Quick view
            </span>
          </button>

          <button
            type="button"
            class="inline-flex h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-gold px-3 text-[0.65rem] font-bold uppercase tracking-[0.05em] text-[#17130d] shadow-[0_8px_22px_rgb(183_138_50_/_0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-brand-gold-light active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:gap-2 sm:rounded-xl sm:px-4 sm:text-xs sm:tracking-[0.1em]"
            data-action="add-to-cart"
            data-product-id="${product.id}"
            @click.prevent="$addToCartWithAnimation('${product.id}', $event.currentTarget)"
            aria-live="polite"
            ${isAvailable ? '' : 'disabled'}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              class="size-3.5 shrink-0 sm:size-4"
              aria-hidden="true"
            >
              <path
                d="M3.5 4.5h2l1.65 9.1a2 2 0 0 0 1.97 1.65h7.96a2 2 0 0 0 1.95-1.55L20.5 7.5H6.05"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <circle
                cx="9.25"
                cy="19"
                r="1.25"
                fill="currentColor"
              />

              <circle
                cx="17.25"
                cy="19"
                r="1.25"
                fill="currentColor"
              />
            </svg>

            <span
              x-text="
                $store.cart.quantityFor(
                  '${product.id}'
                ) > 0
                  ? 'Added (' +
                    $store.cart.quantityFor(
                      '${product.id}'
                    ) +
                    ')'
                  : 'Add to cart'
              "
            >
              Add to cart
            </span>
          </button>
        </div>
      </div>
    </article>
  `
}