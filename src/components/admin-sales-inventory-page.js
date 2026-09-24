import {
  renderAdminPackageSuppliesSection,
} from './admin-package-supplies-section.js'

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
        <div
          class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold"
            >
              Command Center
            </p>

            <h1
              id="sales-inventory-page-title"
              class="mt-2 font-display text-4xl text-brand-cream sm:text-5xl"
            >
              Sales & Inventory
            </h1>

            <p
              class="mt-3 max-w-2xl text-sm leading-7 text-brand-muted"
            >
              Monitor approved sales, units sold, available stocks,
              and confirmed product cost data.
            </p>
          </div>

          <div
            class="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3"
          >
            <div class="flex items-center gap-2">
              <span
                class="size-2 rounded-full bg-emerald-400"
                aria-hidden="true"
              ></span>

              <strong class="text-sm text-emerald-200">
                Inventory Preview
              </strong>
            </div>

            <p class="mt-1 text-xs text-emerald-100/70">
              Backend connection will be added through Supabase.
            </p>
          </div>
        </div>
      </div>

      <div
        class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <article
          class="rounded-[1.4rem] border border-brand-gold/40 bg-brand-panel p-5 shadow-gold-soft"
        >
          <p
            class="text-[0.65rem] uppercase tracking-[0.13em] text-brand-muted"
          >
            Approved Sales
          </p>

          <strong
            class="mt-3 block font-display text-3xl text-brand-gold"
            x-text="formatMoney(approvedSalesTotal)"
          ></strong>

          <p class="mt-2 text-xs text-brand-muted">
            Approved product orders
          </p>
        </article>

        <article
          class="rounded-[1.4rem] border border-brand-border bg-brand-panel p-5 shadow-panel"
        >
          <p
            class="text-[0.65rem] uppercase tracking-[0.13em] text-brand-muted"
          >
            Estimated Product Cost
          </p>

          <strong
            class="mt-3 block font-display text-3xl"
            :class="
              approvedProductCost === null
                ? 'text-brand-muted'
                : 'text-brand-cream'
            "
            x-text="formatOptionalMoney(approvedProductCost)"
          ></strong>

          <p
            class="mt-2 text-xs text-brand-muted"
            x-text="
              approvedProductCost === null
                ? 'Awaiting confirmed company cost'
                : 'Based on saved order costs'
            "
          ></p>
        </article>

        <article
          class="rounded-[1.4rem] border border-emerald-500/30 bg-brand-panel p-5 shadow-panel"
        >
          <p
            class="text-[0.65rem] uppercase tracking-[0.13em] text-brand-muted"
          >
            Estimated Gross Profit
          </p>

          <strong
            class="mt-3 block font-display text-3xl"
            :class="
              estimatedGrossProfit === null
                ? 'text-brand-muted'
                : 'text-emerald-300'
            "
            x-text="formatOptionalMoney(estimatedGrossProfit)"
          ></strong>

          <p
            class="mt-2 text-xs text-brand-muted"
            x-text="
              estimatedGrossProfit === null
                ? 'Unavailable until cost is confirmed'
                : 'Sales minus product cost'
            "
          ></p>
        </article>

        <article
          class="rounded-[1.4rem] border border-brand-border bg-brand-panel p-5 shadow-panel"
        >
          <p
            class="text-[0.65rem] uppercase tracking-[0.13em] text-brand-muted"
          >
            Monthly Sales
          </p>

          <strong
            class="mt-3 block font-display text-3xl text-brand-cream"
            x-text="formatMoney(monthlyApprovedSales)"
          ></strong>

          <p class="mt-2 text-xs text-brand-muted">
            Current calendar month
          </p>
        </article>
      </div>

      <div
        class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <article
          class="rounded-[1.25rem] border border-brand-border bg-brand-panel p-5"
        >
          <p
            class="text-[0.65rem] uppercase tracking-[0.13em] text-brand-muted"
          >
            Available Units
          </p>

          <strong
            class="mt-2 block font-display text-3xl text-brand-cream"
            x-text="availableStockUnits"
          ></strong>
        </article>

        <article
          class="rounded-[1.25rem] border border-brand-border bg-brand-panel p-5"
        >
          <p
            class="text-[0.65rem] uppercase tracking-[0.13em] text-brand-muted"
          >
            Units Sold
          </p>

          <strong
            class="mt-2 block font-display text-3xl text-brand-cream"
            x-text="approvedUnitsSold"
          ></strong>
        </article>

        <article
          class="rounded-[1.25rem] border border-amber-500/30 bg-brand-panel p-5"
        >
          <p
            class="text-[0.65rem] uppercase tracking-[0.13em] text-brand-muted"
          >
            Low Stock
          </p>

          <strong
            class="mt-2 block font-display text-3xl text-amber-300"
            x-text="lowStockProductCount"
          ></strong>
        </article>

        <article
          class="rounded-[1.25rem] border border-red-500/30 bg-brand-panel p-5"
        >
          <p
            class="text-[0.65rem] uppercase tracking-[0.13em] text-brand-muted"
          >
            Out of Stock
          </p>

          <strong
            class="mt-2 block font-display text-3xl text-red-300"
            x-text="outOfStockProductCount"
          ></strong>
        </article>
      </div>

      <div
        class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel p-4 shadow-panel sm:p-5"
      >
        <div
          class="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem]"
        >
          <label class="relative block">
            <span class="sr-only">
              Search inventory products
            </span>

            <svg
              class="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="6"></circle>

              <path
                d="m16 16 4 4"
                stroke-linecap="round"
              ></path>
            </svg>

            <input
              type="search"
              x-model.debounce.250ms="inventorySearch"
              placeholder="Search product, SKU, or collection"
              class="min-h-12 w-full rounded-xl border border-brand-border bg-brand-black pl-11 pr-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
            >
          </label>

          <label class="block">
            <span class="sr-only">
              Filter products by stock status
            </span>

            <select
              x-model="inventoryStatusFilter"
              class="min-h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
            >
              <option value="all">
                All stock statuses
              </option>

              <option value="in-stock">
                In Stock
              </option>

              <option value="low-stock">
                Low Stock
              </option>

              <option value="out-of-stock">
                Out of Stock
              </option>
            </select>
          </label>
        </div>

        <div
          class="mt-4 flex items-center justify-between gap-4 border-t border-brand-border pt-4"
        >
          <p class="text-xs text-brand-muted">
            Showing

            <strong
              class="text-brand-cream"
              x-text="filteredInventoryProducts.length"
            ></strong>

            product<span
              x-show="filteredInventoryProducts.length !== 1"
            >s</span>
          </p>

          <button
            x-show="
              inventorySearch ||
              inventoryStatusFilter !== 'all'
            "
            type="button"
            class="text-xs font-semibold text-brand-gold transition hover:text-brand-gold-light"
            @click="
              inventorySearch = '';
              inventoryStatusFilter = 'all'
            "
          >
            Clear filters
          </button>
        </div>
      </div>

      <div class="mt-6 space-y-4">
        <template
          x-for="product in filteredInventoryProducts"
          :key="product.id"
        >
          <article
            class="rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel transition hover:border-brand-gold/50 sm:p-6"
          >
            <div
              class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.9fr)] lg:items-center"
            >
              <div class="flex min-w-0 items-center gap-4">
                <div
                  class="grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-brand-border bg-brand-cream"
                >
                  <img
                    :src="product.image"
                    :alt="product.name"
                    class="size-full object-contain p-2"
                  >
                </div>

                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <span
                      class="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-brand-gold"
                      x-text="product.sku"
                    ></span>

                    <span
                      class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.08em]"
                      :class="
                        inventoryStatusBadgeClass(
                          inventoryStatus(product)
                        )
                      "
                    >
                      <span
                        class="size-1.5 rounded-full"
                        :class="
                          inventoryStatusDotClass(
                            inventoryStatus(product)
                          )
                        "
                        aria-hidden="true"
                      ></span>

                      <span
                        x-text="
                          inventoryStatusLabel(
                            inventoryStatus(product)
                          )
                        "
                      ></span>
                    </span>
                  </div>

                  <h2
                    class="mt-2 truncate font-display text-2xl text-brand-cream sm:text-3xl"
                    x-text="product.name"
                  ></h2>

                  <p
                    class="mt-1 truncate text-xs text-brand-muted"
                    x-text="product.collectionLabel"
                  ></p>

                  <div class="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      class="inline-flex min-h-9 items-center justify-center rounded-full bg-brand-gold px-4 text-xs font-semibold text-[#17130d] transition hover:bg-brand-gold-light"
                      @click="
                        openInventoryAdjustment(
                          product.id,
                          'restock'
                        )
                      "
                    >
                      Add Restock
                    </button>

                    <button
                      type="button"
                      class="inline-flex min-h-9 items-center justify-center rounded-full border border-brand-border px-4 text-xs font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
                      @click="
                        openInventoryAdjustment(
                          product.id,
                          'add'
                        )
                      "
                    >
                      Adjust Stock
                    </button>
                  </div>
                </div>
              </div>

              <div
                class="grid grid-cols-2 gap-4 border-t border-brand-border pt-5 sm:grid-cols-3 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0"
              >
                <div>
                  <p
                    class="text-[0.6rem] uppercase tracking-[0.12em] text-brand-muted"
                  >
                    Current Stock
                  </p>

                  <strong
                    class="mt-1 block text-sm text-brand-cream"
                    x-text="product.stockQuantity"
                  ></strong>
                </div>

                <div>
                  <p
                    class="text-[0.6rem] uppercase tracking-[0.12em] text-brand-muted"
                  >
                    Units Sold
                  </p>

                  <strong
                    class="mt-1 block text-sm text-brand-cream"
                    x-text="unitsSoldForProduct(product.id)"
                  ></strong>
                </div>

                <div>
                  <p
                    class="text-[0.6rem] uppercase tracking-[0.12em] text-brand-muted"
                  >
                    Low Stock At
                  </p>

                  <strong
                    class="mt-1 block text-sm text-brand-cream"
                    x-text="product.lowStockThreshold"
                  ></strong>
                </div>

                <div>
                  <p
                    class="text-[0.6rem] uppercase tracking-[0.12em] text-brand-muted"
                  >
                    Regular Price
                  </p>

                  <strong
                    class="mt-1 block text-sm text-brand-gold"
                    x-text="formatMoney(product.regularPrice)"
                  ></strong>
                </div>

                <div>
                  <p
                    class="text-[0.6rem] uppercase tracking-[0.12em] text-brand-muted"
                  >
                    Reseller Price
                  </p>

                  <strong
                    class="mt-1 block text-sm text-brand-gold"
                    x-text="formatMoney(product.memberPrice)"
                  ></strong>
                </div>

                <div>
                  <p
                    class="text-[0.6rem] uppercase tracking-[0.12em] text-brand-muted"
                  >
                    Product Cost
                  </p>

                  <strong
                    class="mt-1 block text-sm text-brand-cream"
                    x-text="
                      formatOptionalMoney(product.costPrice)
                    "
                  ></strong>
                </div>
              </div>
            </div>
          </article>
        </template>

        <div
          x-show="filteredInventoryProducts.length === 0"
          class="rounded-[1.5rem] border border-dashed border-brand-border bg-brand-panel px-6 py-14 text-center"
        >
          <h2 class="font-display text-2xl text-brand-cream">
            No inventory products found
          </h2>

          <p class="mt-2 text-sm text-brand-muted">
            Try a different search term or stock filter.
          </p>
        </div>
      </div>

      ${renderAdminPackageSuppliesSection()}
    </section>
  `
}