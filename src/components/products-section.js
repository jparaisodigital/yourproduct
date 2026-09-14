import { renderProductCard } from './product-card.js'

export function renderProductsSection(
  products,
  categories,
) {
  const activeProducts = products.filter(
    (product) => product.isActive,
  )

  const categoryButtons = categories
    .map(
      (category) => `
        <button
          type="button"
          class="rounded-full border px-4 py-2 text-xs font-semibold transition sm:px-5 sm:py-2.5 sm:text-sm"
          :class="
            activeCategory === '${category.id}'
              ? 'border-brand-gold bg-brand-gold text-brand-black'
              : 'border-brand-border text-brand-muted hover:border-brand-gold hover:text-brand-gold'
          "
          @click="activeCategory = '${category.id}'"
          :aria-pressed="
            activeCategory === '${category.id}'
          "
        >
          ${category.label}
        </button>
      `,
    )
    .join('')

  const productCards = activeProducts
    .map((product) => renderProductCard(product))
    .join('')

  return `
    <section
      id="shop"
      x-data="{ activeCategory: 'all' }"
      class="border-t border-brand-border bg-brand-black py-16 sm:py-24"
    >
      <div class="mx-auto w-[min(1180px,90%)]">
        <div
          class="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end lg:gap-8"
        >
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold sm:tracking-[0.32em]"
            >
              The Signature Collection
            </p>

            <h2
              class="mt-4 max-w-2xl font-display text-4xl leading-tight text-brand-cream sm:mt-5 sm:text-5xl"
            >
              Find your signature scent.
            </h2>
          </div>

          <p
            class="max-w-xl text-sm leading-7 text-brand-muted sm:text-base lg:justify-self-end"
          >
            Explore fragrances created for different moods,
            personalities, and everyday moments.
          </p>
        </div>

        <div
          class="mt-8 flex flex-wrap gap-2 sm:mt-10 sm:gap-3"
          aria-label="Filter products by collection"
        >
          ${categoryButtons}
        </div>

        <div
          class="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
          data-products-grid
        >
          ${productCards}
        </div>

        <p
          class="mt-8 text-xs leading-6 text-brand-muted"
        >
          Product names, prices, stock, and descriptions are
          temporary placeholders pending final client
          confirmation.
        </p>
      </div>
    </section>
  `
}