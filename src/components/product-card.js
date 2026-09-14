const pesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 0,
})

export function renderProductCard(product) {
  const isAvailable = product.stockQuantity > 0

  const stockLabel = isAvailable
    ? 'In stock'
    : 'Out of stock'

  const stockTextClass = isAvailable
    ? 'text-emerald-700'
    : 'text-red-700'

  const stockDotClass = isAvailable
  ? 'bg-emerald-600'
  : 'bg-red-600'

  const memberPriceMarkup = product.memberPrice
    ? `
        <div
          class="mt-2 grid gap-0.5 sm:mt-1.5 sm:flex sm:items-center sm:justify-between sm:gap-3"
        >
          <span
            class="text-[0.55rem] font-medium uppercase tracking-[0.06em] text-brand-muted sm:text-[0.68rem] sm:tracking-[0.16em]"
          >
            Member price
          </span>

          <span
            class="text-sm font-semibold text-brand-gold sm:text-base"
          >
            ${pesoFormatter.format(product.memberPrice)}
          </span>
        </div>
      `
    : ''

  const pointsMarkup = product.isPointsQualified
    ? `
        <span
          class="inline-flex items-center gap-1 text-[0.58rem] text-brand-muted sm:gap-1.5 sm:text-xs"
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
      class="group overflow-hidden rounded-[1.1rem] border border-brand-border bg-brand-panel shadow-[0_18px_50px_rgb(74_57_27_/_0.08)] transition duration-300 hover:-translate-y-1 hover:border-brand-gold/50 hover:shadow-[0_24px_65px_rgb(183_138_50_/_0.14)] sm:rounded-[1.5rem]"
      data-product-card
      data-product-id="${product.id}"
      data-product-category="${product.category}"
    >
      <button
        type="button"
        class="group/image relative block aspect-square w-full cursor-zoom-in overflow-hidden bg-brand-cream text-left"
        data-action="quick-view"
        data-product-id="${product.id}"
        aria-label="View details for ${product.name}"
        @click="$store.productView.open('${product.id}')"
      >
        <img
          src="${product.image}"
          alt="${product.name}"
          class="size-full object-contain p-4 transition duration-500 ease-out group-hover/image:scale-[1.04] sm:p-8"
          loading="lazy"
        >
      </button>

      <div class="p-3 sm:p-6">
        <div
          class="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
        >
          <span
            class="text-[0.5rem] font-semibold uppercase tracking-[0.05em] text-brand-gold sm:text-[0.68rem] sm:tracking-[0.12em]"
          >
            ${product.collectionLabel}
          </span>

          ${pointsMarkup}
        </div>

        <h3
          class="mt-2 line-clamp-2 min-h-[2.5rem] font-display text-lg leading-[1.1] text-brand-cream sm:mt-3 sm:min-h-0 sm:text-2xl sm:leading-tight"
        >
          ${product.name}
        </h3>

        <p
          class="mt-2 hidden min-h-12 text-sm leading-6 text-brand-muted sm:block"
        >
          ${product.shortDescription}
        </p>

        <div
          class="mt-3 border-t border-brand-border pt-3 sm:mt-5 sm:pt-4"
        >
          <div
            class="grid gap-0.5 sm:flex sm:items-center sm:justify-between sm:gap-3"
          >
            <div
              class="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start sm:gap-3"
            >
              <span
                class="text-[0.55rem] font-medium uppercase tracking-[0.06em] text-brand-muted sm:text-[0.68rem] sm:tracking-[0.16em]"
              >
                Regular price
              </span>

              <span
  class="${stockTextClass} inline-flex items-center gap-1.5 whitespace-nowrap text-[0.58rem] font-semibold normal-case sm:text-xs"
  aria-label="${stockLabel}"
>
  <span
    class="${stockDotClass} ${
      isAvailable ? 'stock-status-dot' : ''
    } block size-1.5 shrink-0 rounded-full"
    aria-hidden="true"
  ></span>

  ${stockLabel}
</span>
            </div>

            <span
              class="text-sm font-semibold text-brand-cream sm:text-base"
            >
              ${pesoFormatter.format(product.regularPrice)}
            </span>
          </div>

          ${memberPriceMarkup}
        </div>

        <div
          class="mt-3 flex items-center gap-1.5 sm:mt-4 sm:gap-2.5"
        >
          <button
            type="button"
            class="group/view hidden size-11 shrink-0 place-items-center rounded-full border border-brand-border bg-transparent text-brand-muted transition duration-200 hover:border-brand-gold hover:bg-brand-gold/10 hover:text-brand-gold active:scale-95 sm:grid"
            data-action="quick-view"
            data-product-id="${product.id}"
            aria-label="Quick view ${product.name}"
            title="Quick view"
            @click.prevent="$store.productView.open('${product.id}')"
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
            class="inline-flex h-9 min-w-0 flex-1 items-center justify-center gap-1 rounded-lg bg-brand-gold px-2 text-[0.62rem] font-bold uppercase tracking-[0.04em] text-[#17130d] shadow-[0_8px_22px_rgb(183_138_50_/_0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-brand-gold-light active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:gap-2 sm:rounded-xl sm:px-4 sm:text-xs sm:tracking-[0.1em]"
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
                $store.cart.quantityFor('${product.id}') > 0
                  ? 'Added (' +
                    $store.cart.quantityFor('${product.id}') +
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