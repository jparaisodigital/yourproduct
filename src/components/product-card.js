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

  const isAdminPreview =
    options.isAdminPreview === true
  const imageLoadingAttribute = 'eager'
  const imageFetchPriorityAttribute = 'auto'

  const addToCartAttributes =
    isAdminPreview
      ? 'disabled aria-disabled="true"'
      : `
          data-action="add-to-cart"
          data-product-id="${product.id}"
          @click.prevent="$addToCartWithAnimation('${product.id}', $event.currentTarget)"
        `

  const addToCartDisabledAttribute =
    isAdminPreview || !isAvailable
      ? 'disabled'
      : ''

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
  const fixedDisplayPrice =
    product.fixedPrice && tierPrice > 0
      ? Number(product.memberPrice || product.regularPrice || 0)
      : Number(product.regularPrice || 0)

  const hasTierPrice =
    tierPrice > 0 &&
    !product.fixedPrice

  const mobileCollectionLabel = product.fixedPrice
    ? 'Premium Tester Kit'
    : product.collectionLabel

  const mobileProductName = product.fixedPrice
    ? 'Tester Kit'
    : product.name

  const mobileProductCode = product.fixedPrice
    ? ''
    : product.sku || ''

  const mobilePriceInfoPopupClass =
    Number(options.productIndex || 0) % 2 === 0
      ? 'absolute left-0 top-full z-30 mt-2 w-40 rounded-xl'
      : 'absolute right-0 top-full z-30 mt-2 w-40 rounded-xl'

  const priceMarkup = hasTierPrice
    ? `
        <div class="sm:hidden">
          <div class="flex items-center justify-between gap-3">
            <div class="relative min-w-0">
              <div class="inline-flex items-center gap-1.5">
                <span class="text-sm font-medium text-brand-muted line-through">
                  ${pesoFormatter.format(product.regularPrice)}
                </span>

                <button
                  type="button"
                  class="inline-flex size-5 items-center justify-center rounded-full border border-brand-gold/45 text-[0.65rem] font-bold text-brand-gold transition active:scale-95"
                  aria-label="Show retail price note"
                  @click.stop="openPriceInfo('tier')"
                >
                  i
                </button>
              </div>

              <div
                x-show="activePriceInfo === 'tier'"
                x-transition.opacity
                class="${mobilePriceInfoPopupClass} border border-brand-gold/45 bg-brand-black px-3 py-3 text-[0.68rem] leading-5 text-brand-cream shadow-panel"
              >
                Retail price ${pesoFormatter.format(product.regularPrice)}. Tier pricing is based on your approved package.
              </div>
            </div>

            <p class="shrink-0 text-right font-display text-2xl leading-none text-brand-gold">
              ${pesoFormatter.format(tierPrice)}
            </p>
          </div>
        </div>

        <div class="hidden sm:block">
          <div class="flex items-end justify-between gap-3">
            <div>
              <p
                class="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-gold"
              >
                ${tierLabel || 'Your reseller price'}
              </p>

              <p
                class="mt-1 text-xs font-medium text-brand-muted line-through"
              >
                ${pesoFormatter.format(product.regularPrice)}
              </p>
            </div>

            <p
              class="shrink-0 text-right font-display text-3xl leading-none text-brand-gold"
            >
              ${pesoFormatter.format(tierPrice)}
            </p>
          </div>

          <p
            class="mt-2 text-xs leading-5 text-brand-muted"
          >
            Retail ${pesoFormatter.format(product.regularPrice)}. Tier pricing is based on your approved package.
          </p>
        </div>
      `
    : product.fixedPrice
      ? `
          <div class="sm:hidden">
            <div class="flex items-center justify-between gap-3">
              <div class="relative min-w-0">
                <button
                  type="button"
                  class="inline-flex size-5 items-center justify-center rounded-full border border-brand-gold/45 text-[0.65rem] font-bold text-brand-gold transition active:scale-95"
                  aria-label="Show tester kit price note"
                  @click.stop="openPriceInfo('fixed')"
                >
                  i
                </button>

                <div
                  x-show="activePriceInfo === 'fixed'"
                  x-transition.opacity
                  class="${mobilePriceInfoPopupClass} border border-brand-gold/45 bg-brand-black px-3 py-3 text-[0.68rem] leading-5 text-brand-cream shadow-panel"
                >
                  Retail price ${pesoFormatter.format(product.regularPrice)}. Active members pay ${pesoFormatter.format(product.memberPrice)}.
                </div>
              </div>

              <p class="shrink-0 text-right font-display text-2xl leading-none text-brand-gold">
                ${pesoFormatter.format(fixedDisplayPrice)}
              </p>
            </div>
          </div>

          <div class="hidden sm:block">
            <div class="flex items-end justify-between gap-3">
              <div>
                <p
                  class="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-gold"
                >
                  Tester Kit Price
                </p>

                <p
                  class="mt-1 text-xs font-medium text-brand-muted"
                >
                  20 pcs 5ml assorted scents
                </p>
              </div>

              <p
                class="shrink-0 text-right font-display text-3xl leading-none text-brand-gold"
              >
                ${pesoFormatter.format(fixedDisplayPrice)}
              </p>
            </div>

            <p
              class="mt-2 text-xs leading-5 text-brand-muted"
            >
              Retail ${pesoFormatter.format(product.regularPrice)}. Active members pay ${pesoFormatter.format(product.memberPrice)} regardless of package tier.
            </p>
          </div>
        `
      : `
          <div
            class="flex items-end justify-between gap-3"
          >
            <div>
              <p
                class="text-[0.55rem] font-medium uppercase tracking-[0.08em] text-brand-muted sm:text-[0.68rem] sm:tracking-[0.16em]"
              >
                Regular price
              </p>
            </div>

            <p
              class="shrink-0 text-right font-display text-2xl leading-none text-brand-cream sm:text-3xl"
            >
              ${pesoFormatter.format(product.regularPrice)}
            </p>
          </div>

          <div
            class="mt-3 rounded-xl border border-brand-gold/25 bg-brand-gold/10 px-3 py-2"
          >
            <p
              class="text-[0.55rem] font-semibold uppercase tracking-[0.08em] text-brand-gold sm:text-[0.68rem] sm:tracking-[0.14em]"
            >
              Reseller tiers
            </p>

            <p
              class="mt-1 text-xs leading-5 text-brand-muted"
            >
              From PHP 245 to PHP 175 per bottle, depending on approved package.
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
      x-data="{
        activePriceInfo: null,
        priceInfoTimer: null,
        openPriceInfo(type) {
          this.activePriceInfo = this.activePriceInfo === type ? null : type

          if (this.priceInfoTimer) {
            clearTimeout(this.priceInfoTimer)
          }

          if (this.activePriceInfo) {
            this.$dispatch('price-info-open', {
              productId: '${product.id}',
            })

            this.priceInfoTimer = setTimeout(() => {
              this.activePriceInfo = null
            }, 5000)
          }
        },
        closePriceInfo() {
          this.activePriceInfo = null

          if (this.priceInfoTimer) {
            clearTimeout(this.priceInfoTimer)
          }
        },
      }"
      @click.outside="closePriceInfo()"
      @price-info-open.window="if ($event.detail.productId !== '${product.id}') closePriceInfo()"
      x-show="
        activeCategory === 'all' ||
        activeCategory === '${product.category}'
      "
      class="group relative flex h-full flex-col overflow-visible rounded-[1.1rem] border border-brand-border bg-brand-panel opacity-100 sm:overflow-hidden sm:rounded-[1.5rem] md:transition md:duration-300 md:hover:border-brand-gold/35 md:hover:bg-brand-charcoal"
      data-product-card
      data-product-id="${product.id}"
      data-product-category="${product.category}"
    >
      <button
  type="button"
  class="relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-brand-charcoal text-left"
  data-action="quick-view"
  data-product-id="${product.id}"
  aria-label="View details for ${product.name}"
  @click="$store.productView.open('${product.id}')"
  ${product.isActive ? '' : 'disabled'}
>
        <img
          src="${product.image}"
          alt="${product.name}"
          class="relative z-10 size-full opacity-100 object-contain object-center p-2 sm:p-3"
          loading="${imageLoadingAttribute}"
          decoding="async"
          fetchpriority="${imageFetchPriorityAttribute}"
        >
      </button>

      <div class="flex flex-1 flex-col p-4 sm:p-6">
        <div
  class="grid gap-1.5 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-2"
>
  <span
    class="text-[0.55rem] font-semibold uppercase tracking-[0.08em] text-brand-gold sm:hidden"
  >
    ${mobileCollectionLabel}
  </span>

  <span
    class="hidden text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-gold sm:inline"
  >
    ${product.collectionLabel}
  </span>

  ${pointsMarkup}
</div>

        <div
          class="mt-3 flex items-center justify-between gap-3"
        >
          <h3
            class="min-w-0 font-display text-xl leading-tight text-brand-cream sm:truncate sm:text-2xl"
          >
            <span class="sm:hidden">
              ${mobileProductName}
            </span>

            <span class="hidden sm:inline">
              ${product.name}
            </span>
          </h3>

          <span
            class="${stockTextClass} ${isAvailable ? 'hidden' : 'inline-flex'} shrink-0 items-center gap-1.5 whitespace-nowrap text-[0.62rem] font-semibold sm:text-xs"
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
          class="mt-4 border-t border-brand-border pt-4 sm:min-h-[6.25rem]"
        >
          ${priceMarkup}
        </div>

        <div
          class="mt-3 flex items-center gap-2.5 sm:mt-auto sm:pt-4"
        >
          <button
            type="button"
            class="group/view hidden size-11 shrink-0 place-items-center rounded-full border border-brand-border bg-brand-black/30 text-brand-muted transition duration-200 hover:border-brand-gold hover:text-brand-gold active:scale-95 sm:grid"
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
            ${addToCartAttributes}
            aria-live="polite"
            ${addToCartDisabledAttribute}
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
                ${isAdminPreview}
                  ? 'Admin Preview'
                  : $store.cart.quantityFor(
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
              ${isAdminPreview ? 'Admin Preview' : 'Add to cart'}
            </span>
          </button>
        </div>
      </div>
    </article>
  `
}
