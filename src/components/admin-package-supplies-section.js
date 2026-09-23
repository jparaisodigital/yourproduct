export function renderAdminPackageSuppliesSection() {
    return `
      <section
        class="mt-8 rounded-[1.75rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
        aria-labelledby="package-supplies-title"
      >
        <div
          class="flex flex-col gap-4 border-b border-brand-border pb-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
            >
              Package Inventory
            </p>
  
            <h2
              id="package-supplies-title"
              class="mt-2 font-display text-3xl text-brand-cream"
            >
              Package Supplies
            </h2>
  
            <p
              class="mt-2 max-w-2xl text-sm leading-6 text-brand-muted"
            >
              Track the fixed supplies included in membership
              packages separately from perfume products.
            </p>
          </div>
  
          <div
            class="rounded-full border border-brand-border bg-brand-black px-4 py-2 text-xs text-brand-muted"
          >
            <strong
              class="text-brand-cream"
              x-text="packageSupplies.length"
            ></strong>
  
            tracked supplies
          </div>
        </div>
  
        <div
          class="mt-5 grid gap-4 md:grid-cols-2"
        >
          <template
            x-for="supply in packageSupplies"
            :key="supply.id"
          >
            <article
              class="rounded-2xl border border-brand-border bg-brand-black p-5 transition hover:border-brand-gold/50"
            >
              <div
                class="flex items-start justify-between gap-4"
              >
                <div class="flex min-w-0 items-center gap-3">
                  <div
                    class="grid size-11 shrink-0 place-items-center rounded-xl border border-brand-gold/30 bg-brand-gold/10 text-brand-gold"
                    aria-hidden="true"
                  >
                    <svg
                      class="size-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.7"
                    >
                      <path
                        d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z"
                        stroke-linejoin="round"
                      ></path>
  
                      <path
                        d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12v9"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </div>
  
                  <div class="min-w-0">
                    <p
                      class="text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-brand-gold"
                      x-text="supply.sku"
                    ></p>
  
                    <h3
                      class="mt-1 truncate font-display text-2xl text-brand-cream"
                      x-text="supply.name"
                    ></h3>
  
                    <p
                      class="mt-1 text-xs text-brand-muted"
                      x-text="
                        supply.category ===
                        'packaging-supply'
                          ? 'Packaging Supply'
                          : 'Package Equipment'
                      "
                    ></p>
                  </div>
                </div>
  
                <span
                  class="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.08em]"
                  :class="
                    inventoryStatusBadgeClass(
                      inventoryStatus(supply)
                    )
                  "
                >
                  <span
                    class="size-1.5 rounded-full"
                    :class="
                      inventoryStatusDotClass(
                        inventoryStatus(supply)
                      )
                    "
                    aria-hidden="true"
                  ></span>
  
                  <span
                    x-text="
                      inventoryStatusLabel(
                        inventoryStatus(supply)
                      )
                    "
                  ></span>
                </span>
              </div>
  
              <div
                class="mt-5 grid grid-cols-3 gap-3 border-t border-brand-border pt-4"
              >
                <div>
                  <p
                    class="text-[0.58rem] uppercase tracking-[0.11em] text-brand-muted"
                  >
                    Current Stock
                  </p>
  
                  <strong
                    class="mt-1 block text-lg text-brand-cream"
                    x-text="supply.stockQuantity"
                  ></strong>
                </div>
  
                <div>
                  <p
                    class="text-[0.58rem] uppercase tracking-[0.11em] text-brand-muted"
                  >
                    Unit
                  </p>
  
                  <strong
                    class="mt-1 block text-sm capitalize text-brand-cream"
                    x-text="supply.unitLabel"
                  ></strong>
                </div>
  
                <div>
                  <p
                    class="text-[0.58rem] uppercase tracking-[0.11em] text-brand-muted"
                  >
                    Low Stock At
                  </p>
  
                  <strong
                    class="mt-1 block text-sm text-brand-cream"
                    x-text="supply.lowStockThreshold"
                  ></strong>
                </div>
              </div>
  
              <div
                class="mt-5 flex flex-wrap gap-2 border-t border-brand-border pt-4"
              >
                <button
                  type="button"
                  class="inline-flex min-h-9 items-center justify-center rounded-full bg-brand-gold px-4 text-xs font-semibold text-[#17130d] transition hover:bg-brand-gold-light"
                  @click="
                    openInventoryAdjustment(
                      supply.id,
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
                      supply.id,
                      'add'
                    )
                  "
                >
                  Adjust Stock
                </button>
              </div>
  
              <p
                x-show="supply.costPerUnit === null"
                class="mt-4 rounded-xl border border-brand-border bg-brand-panel px-3 py-2 text-xs text-brand-muted"
              >
                Supply cost is not encoded yet.
              </p>
            </article>
          </template>
        </div>
  
        <div
          x-show="packageSupplies.length === 0"
          class="mt-5 rounded-2xl border border-dashed border-brand-border bg-brand-black px-6 py-12 text-center"
        >
          <h3 class="font-display text-2xl text-brand-cream">
            No package supplies configured
          </h3>
  
          <p class="mt-2 text-sm text-brand-muted">
            Add package supply records before processing
            package fulfillment.
          </p>
        </div>
  
        <div
          class="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3"
        >
          <p class="text-xs leading-5 text-amber-100/80">
            Preview stock quantities are temporary. Actual supply
            quantities will be stored through Supabase later.
          </p>
        </div>
      </section>
    `
  }