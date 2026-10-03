export function renderAdminProductsPage() {
    return `
      <section
        x-show="activePage === 'products'"
        x-transition.opacity
        aria-labelledby="products-page-title"
      >
        <div class="rounded-[1.75rem] border border-brand-border bg-brand-panel p-6 sm:p-8">
          <p class="text-xs font-semibold uppercase tracking-widest text-brand-gold">
            Admin Management
          </p>
          <h1 id="products-page-title" class="mt-2 font-display text-4xl text-brand-cream">
            Products
          </h1>
          <p class="mt-3 text-sm text-brand-muted">
            Review product prices, stock, and storefront availability.
          </p>
        </div>

        <p x-show="liveProductsLoading" class="mt-6 text-sm text-brand-muted">
          Loading products...
        </p>

        <p
          x-show="liveProductsError"
          x-text="liveProductsError"
          class="mt-6 rounded-xl border border-red-400/30 bg-brand-panel p-5 text-sm text-red-300"
          role="alert"
        ></p>

        <p
          x-show="availabilitySaveError"
          x-text="availabilitySaveError"
          class="mt-4 text-sm text-red-300"
          role="alert"
        ></p>

        <p
          x-show="availabilitySaveMessage"
          x-text="availabilitySaveMessage"
          class="mt-4 text-sm text-brand-gold"
          role="status"
        ></p>

        <div
          x-show="!liveProductsLoading && !liveProductsError"
          class="mt-6 grid gap-4 md:grid-cols-2"
        >
          <template x-for="product in liveProducts" :key="product.id">
            <article class="rounded-2xl border border-brand-border bg-brand-panel p-5">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-xs text-brand-gold" x-text="product.sku"></p>
                  <h2 class="mt-1 font-semibold text-brand-cream" x-text="product.name"></h2>
                </div>
                <span
                  class="rounded-full border border-brand-border px-3 py-1 text-xs text-brand-cream"
                  x-text="product.is_active ? 'Active' : 'Inactive'"
                ></span>
              </div>

                <p class="mt-4 text-sm text-brand-muted">
                <template x-if="product.id === 'tester-kit'">
                  <span>
                    Fixed price:
                    <span
                      class="text-brand-cream"
                      x-text="formatMoney(product.regular_price)"
                    ></span>
                  </span>
                </template>

                <template x-if="product.id !== 'tester-kit'">
                  <span>
                    Regular:
                    <span
                      class="text-brand-cream"
                      x-text="formatMoney(product.regular_price)"
                    ></span>
                    · Reseller tiers:
                    <span class="text-brand-cream">₱245–₱175</span>
                  </span>
                </template>
              </p>
              <p class="mt-2 text-sm text-brand-muted">
                Stock:
                <span class="text-brand-cream" x-text="product.stock_quantity"></span>
              </p>

              <p
                x-show="!product.is_active && Number(product.stock_quantity) < 1"
                class="mt-3 text-xs text-brand-muted"
              >
                Set stock above zero in Sales & Inventory before activating.
              </p>

              <button
                type="button"
                class="mt-5 min-h-10 rounded-full border border-brand-gold px-5 text-sm font-semibold text-brand-gold disabled:cursor-not-allowed disabled:opacity-40"
                @click="toggleProductAvailability(product)"
                :disabled="savingAvailabilityProductId !== null || (!product.is_active && (Number(product.stock_quantity) < 1 || Number(product.regular_price) <= 0))"
                x-text="savingAvailabilityProductId === product.id ? 'Saving...' : product.is_active ? 'Deactivate' : 'Activate'"
              ></button>
            </article>
          </template>
        </div>
      </section>
    `
  }