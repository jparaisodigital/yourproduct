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
        <div class="mt-1.5 flex items-center justify-between gap-3">
          <span
            class="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-brand-muted"
          >
            Member price
          </span>

          <span class="font-semibold text-brand-gold">
            ${pesoFormatter.format(product.memberPrice)}
          </span>
        </div>
      `
    : ''

  const pointsMarkup = product.isPointsQualified
    ? `
        <span
          class="inline-flex items-center gap-1.5 text-xs text-brand-muted"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            class="size-3.5 text-brand-gold"
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
      class="group overflow-hidden rounded-[1.5rem] border border-brand-border bg-brand-panel shadow-[0_18px_50px_rgb(74_57_27_/_0.08)] transition duration-300 hover:-translate-y-1 hover:border-brand-gold/50 hover:shadow-[0_24px_65px_rgb(183_138_50_/_0.14)]"
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
          class="size-full object-contain p-8 transition duration-500 ease-out group-hover/image:scale-[1.04]"
          loading="lazy"
        >

        <span
          class="pointer-events-none absolute left-4 top-4 rounded-full border border-brand-gold/30 bg-brand-black/90 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand-gold backdrop-blur-sm"
        >
          ${product.collectionLabel}
        </span>
      </button>

      <div class="p-5 sm:p-6">
        <div class="flex items-center justify-between gap-4">
          <span
            class="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
          >
            ${product.sku}
          </span>

          ${pointsMarkup}
        </div>

        <h3
          class="mt-3 font-display text-2xl leading-tight text-brand-cream"
        >
          ${product.name}
        </h3>

        <p
          class="mt-2 min-h-12 text-sm leading-6 text-brand-muted"
        >
          ${product.shortDescription}
        </p>

        <div class="mt-5 border-t border-brand-border pt-4">
          <div class="flex items-center justify-between gap-3">
            <span
              class="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-brand-muted"
            >
              Regular price
            </span>

            <span class="font-semibold text-brand-cream">
              ${pesoFormatter.format(product.regularPrice)}
            </span>
          </div>

          ${memberPriceMarkup}
        </div>

        <div
          class="${stockTextClass} mt-4 inline-flex items-center gap-2 text-xs font-semibold"
          aria-label="${stockLabel}"
        >
          <span
            class="${stockDotClass} ${
              isAvailable ? 'stock-status-dot' : ''
            } block size-1.5 shrink-0 rounded-full"
            aria-hidden="true"
          ></span>

          ${stockLabel}
        </div>

        <div class="mt-4 flex items-center gap-2.5">
          <button
            type="button"
            class="group/view grid size-11 shrink-0 place-items-center rounded-full border border-brand-border bg-transparent text-brand-muted transition duration-200 hover:border-brand-gold hover:bg-brand-gold/10 hover:text-brand-gold active:scale-95"
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
            class="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-gold px-4 text-xs font-bold uppercase tracking-[0.1em] text-[#17130d] shadow-[0_8px_22px_rgb(183_138_50_/_0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-brand-gold-light active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            data-action="add-to-cart"
            data-product-id="${product.id}"
            @click.prevent="$addToCartWithAnimation('${product.id}', $event.currentTarget)"
            aria-live="polite"
            ${isAvailable ? '' : 'disabled'}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              class="size-4 shrink-0"
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
                  ? 'Added (' + $store.cart.quantityFor('${product.id}') + ')'
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