export function renderAdminSalesInventoryPage() {
  return `
    <section
      x-show="activePage === 'sales-inventory'"
      x-transition.opacity
      aria-labelledby="sales-inventory-page-title"
    >
      <div
        class="rounded-[1.75rem] border border-brand-gold/30 bg-brand-panel p-6 shadow-gold-soft sm:p-8"
      >
        <p
          class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold"
        >
          Product Inventory
        </p>

        <h1
          id="sales-inventory-page-title"
          class="mt-2 font-display text-4xl text-brand-cream sm:text-5xl"
        >
          Products & Inventory
        </h1>

        <p class="mt-3 text-sm leading-7 text-brand-muted">
          Product prices, availability, and stock from the database.
        </p>

        <div class="mt-6 flex flex-wrap gap-3">
          <div class="rounded-xl border border-brand-border bg-brand-black px-5 py-3">
            <p class="text-xs text-brand-muted">Total products</p>
            <strong
              class="mt-1 block text-2xl text-brand-cream"
              x-text="liveProductsLoading || liveProductsError ? '—' : liveProducts.length"
            ></strong>
          </div>

          <div class="rounded-xl border border-brand-border bg-brand-black px-5 py-3">
            <p class="text-xs text-brand-muted">Active products</p>
            <strong
              class="mt-1 block text-2xl text-brand-cream"
              x-text="liveProductsLoading || liveProductsError ? '—' : liveProducts.filter(product => product.is_active).length"
            ></strong>
          </div>
        </div>
      </div>

      <p
        x-show="liveProductsLoading"
        class="mt-6 text-sm text-brand-muted"
        role="status"
      >
        Loading products...
      </p>

      <p
        x-show="liveProductsError"
        x-text="liveProductsError"
        class="mt-6 rounded-xl border border-red-400/30 bg-brand-panel p-5 text-sm text-red-300"
        role="alert"
      ></p>

      <p
        x-show="!liveProductsLoading && !liveProductsError && liveProducts.length === 0"
        class="mt-6 rounded-xl border border-brand-border bg-brand-panel p-5 text-sm text-brand-muted"
      >
        No products found.
      </p>

      <p
        x-show="stockSaveError"
        x-text="stockSaveError"
        class="mt-4 text-sm text-red-300"
        role="alert"
      ></p>

      <p
        x-show="stockSaveMessage"
        x-text="stockSaveMessage"
        class="mt-4 text-sm text-brand-gold"
        role="status"
      ></p>

      <div
        x-show="!liveProductsLoading && !liveProductsError && liveProducts.length > 0"
        class="mt-6 grid gap-4 md:grid-cols-2"
      >
        <template x-for="product in liveProducts" :key="product.id">
          <article class="rounded-2xl border border-brand-border bg-brand-panel p-5">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-xs text-brand-gold" x-text="product.sku"></p>
                <h2
                  class="mt-1 text-lg font-semibold text-brand-cream"
                  x-text="product.name"
                ></h2>
              </div>

              <span
                class="rounded-full border border-brand-border px-3 py-1 text-xs text-brand-cream"
                x-text="product.is_active ? 'Active' : 'Inactive'"
              ></span>
            </div>

            <div class="mt-5 grid grid-cols-3 gap-3 border-t border-brand-border pt-4 text-sm">
              <div>
                <p class="text-xs text-brand-muted">Regular</p>
                <p
                  class="mt-1 font-semibold text-brand-cream"
                  x-text="formatMoney(product.regular_price)"
                ></p>
              </div>

              <div>
                <p class="text-xs text-brand-muted">Member</p>
                <p
                  class="mt-1 font-semibold text-brand-cream"
                  x-text="formatMoney(product.member_price)"
                ></p>
              </div>

              <div>
                <p class="text-xs text-brand-muted">Stock</p>
                <p
                  class="mt-1 font-semibold text-brand-cream"
                  x-text="product.stock_quantity"
                ></p>
              </div>
            </div>

            <div class="mt-5 flex flex-wrap items-end gap-3 border-t border-brand-border pt-4">
              <label class="text-xs text-brand-muted">
                Set stock
                <input
                  type="number"
                  min="0"
                  step="1"
                  x-model.number="stockDrafts[product.id]"
                  :disabled="savingProductId === product.id"
                  class="mt-1 block w-28 rounded-lg border border-brand-border bg-brand-black px-3 py-2 text-sm text-brand-cream"
                >
              </label>

              <button
                type="button"
                @click="saveProductStock(product)"
                :disabled="savingProductId === product.id"
                class="min-h-10 rounded-full bg-brand-gold px-5 text-sm font-semibold text-[#17130d] disabled:opacity-50"
                x-text="savingProductId === product.id ? 'Saving...' : 'Save Stock'"
              ></button>
            </div>
          </article>
        </template>
      </div>
    </section>
  `
}