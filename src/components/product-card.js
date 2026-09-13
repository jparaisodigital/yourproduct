const pesoFormatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  })
  
  export function renderProductCard(product) {
    const isAvailable = product.stockQuantity > 0
  
    const stockLabel = isAvailable
      ? 'Available'
      : 'Out of stock'
  
    const stockClass = isAvailable
      ? 'bg-emerald-700 text-white'
      : 'bg-red-800 text-white'
  
    const memberPriceMarkup = product.memberPrice
      ? `
        <div class="mt-1 flex items-center justify-between gap-3">
          <span class="text-xs uppercase tracking-[0.14em] text-brand-muted">
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
        <span class="text-xs text-brand-muted">
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
        class="group overflow-hidden rounded-3xl border border-brand-border bg-brand-panel transition duration-300 hover:-translate-y-1 hover:border-brand-gold/50"
        data-product-card
        data-product-id="${product.id}"
        data-product-category="${product.category}"
      >
        <div class="relative aspect-square overflow-hidden bg-brand-cream">
          <img
            src="${product.image}"
            alt="${product.name}"
            class="size-full object-contain p-8 transition duration-500 group-hover:scale-105"
            loading="lazy"
          >
  
          <span
            class="absolute left-4 top-4 rounded-full border border-brand-gold/30 bg-brand-black/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-gold"
          >
            ${product.collectionLabel}
          </span>
  
          <span
            class="${stockClass} absolute right-4 top-4 rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em]"
          >
            ${stockLabel}
          </span>
        </div>
  
        <div class="p-6">
          <div class="flex items-center justify-between gap-4">
            <span class="text-xs uppercase tracking-[0.18em] text-brand-gold">
              ${product.sku}
            </span>
  
            ${pointsMarkup}
          </div>
  
          <h3 class="mt-3 font-display text-2xl text-brand-cream">
            ${product.name}
          </h3>
  
          <p class="mt-2 min-h-12 text-sm leading-6 text-brand-muted">
            ${product.shortDescription}
          </p>
  
          <div class="mt-5 border-t border-brand-border pt-5">
            <div class="flex items-center justify-between gap-3">
              <span class="text-xs uppercase tracking-[0.14em] text-brand-muted">
                Regular price
              </span>
  
              <span class="font-semibold text-brand-cream">
                ${pesoFormatter.format(product.regularPrice)}
              </span>
            </div>
  
            ${memberPriceMarkup}
          </div>
  
          <div class="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              class="rounded-full border border-brand-border px-4 py-3 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
              data-action="quick-view"
              data-product-id="${product.id}"
            >
              Quick view
            </button>
  
            <button
              type="button"
              class="rounded-full bg-brand-gold px-4 py-3 text-sm font-semibold text-brand-black transition hover:-translate-y-0.5 hover:bg-brand-gold-light disabled:cursor-not-allowed disabled:opacity-50"
              data-action="add-to-cart"
              data-product-id="${product.id}"
              @click.prevent="$store.cart.add('${product.id}')"
              x-text="
                $store.cart.quantityFor('${product.id}') > 0
                  ? 'Added (' + $store.cart.quantityFor('${product.id}') + ')'
                  : 'Add to cart'
              "
              aria-live="polite"
              ${isAvailable ? '' : 'disabled'}
            >
              Add to cart
            </button>
          </div>
        </div>
      </article>
    `
  }