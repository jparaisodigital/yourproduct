export function renderAdminInventoryAdjustmentDrawer() {
    return `
      <div
        x-show="inventoryAdjustmentOpen"
        x-transition.opacity
        class="fixed inset-0 z-40 bg-black/65 backdrop-blur-[2px]"
        aria-hidden="true"
        @click="closeInventoryAdjustment()"
      ></div>
  
      <aside
        x-show="inventoryAdjustmentOpen"
        x-transition:enter="transition duration-300 ease-out"
        x-transition:enter-start="translate-x-full"
        x-transition:enter-end="translate-x-0"
        x-transition:leave="transition duration-200 ease-in"
        x-transition:leave-start="translate-x-0"
        x-transition:leave-end="translate-x-full"
        class="fixed inset-y-0 right-0 z-50 w-full max-w-xl overflow-y-auto border-l border-brand-border bg-brand-panel shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inventory-adjustment-title"
      >
        <template x-if="selectedInventoryProduct">
          <div>
            <header
              class="sticky top-0 z-10 flex min-h-20 items-center justify-between gap-4 border-b border-brand-border bg-brand-panel/95 px-5 backdrop-blur-xl sm:px-7"
            >
              <div class="min-w-0">
                <p
                  class="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-brand-gold"
                >
                  Inventory Management
                </p>
  
                <h2
                  id="inventory-adjustment-title"
                  class="mt-1 truncate font-display text-2xl text-brand-cream"
                  x-text="selectedInventoryProduct.name"
                ></h2>
              </div>
  
              <button
                type="button"
                class="grid size-10 shrink-0 place-items-center rounded-full border border-brand-border text-brand-muted transition hover:border-brand-gold hover:text-brand-gold"
                aria-label="Close inventory adjustment"
                @click="closeInventoryAdjustment()"
              >
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6l12 12M18 6 6 18"
                    stroke-linecap="round"
                  ></path>
                </svg>
              </button>
            </header>
  
            <div class="space-y-6 px-5 py-6 sm:px-7">
              <section
                class="rounded-[1.5rem] border border-brand-border bg-brand-black p-5"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-brand-border bg-brand-cream"
                  >
                    <img
                      :src="selectedInventoryProduct.image"
                      :alt="selectedInventoryProduct.name"
                      class="size-full object-contain p-2"
                    >
                  </div>
  
                  <div class="min-w-0">
                    <p
                      class="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-brand-gold"
                      x-text="selectedInventoryProduct.sku"
                    ></p>
  
                    <h3
                      class="mt-1 truncate font-display text-2xl text-brand-cream"
                      x-text="selectedInventoryProduct.name"
                    ></h3>
  
                    <p
                      class="mt-1 truncate text-xs text-brand-muted"
                      x-text="selectedInventoryProduct.collectionLabel"
                    ></p>
                  </div>
                </div>
  
                <div
                  class="mt-5 grid grid-cols-2 gap-4 border-t border-brand-border pt-5"
                >
                  <div>
                    <p
                      class="text-[0.6rem] uppercase tracking-[0.12em] text-brand-muted"
                    >
                      Current Stock
                    </p>
  
                    <strong
                      class="mt-1 block font-display text-3xl text-brand-cream"
                      x-text="selectedInventoryProduct.stockQuantity"
                    ></strong>
                  </div>
  
                  <div>
                    <p
                      class="text-[0.6rem] uppercase tracking-[0.12em] text-brand-muted"
                    >
                      Low Stock At
                    </p>
  
                    <strong
                      class="mt-1 block font-display text-3xl text-brand-cream"
                      x-text="selectedInventoryProduct.lowStockThreshold"
                    ></strong>
                  </div>
                </div>
              </section>
  
              <form
                class="rounded-[1.5rem] border border-brand-border bg-brand-black p-5"
                @submit.prevent="saveInventoryAdjustment()"
              >
                <div>
                  <label
                    for="inventory-adjustment-type"
                    class="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-muted"
                  >
                    Transaction Type
                  </label>
  
                  <select
                    id="inventory-adjustment-type"
                    x-model="inventoryAdjustmentType"
                    class="mt-2 min-h-12 w-full rounded-xl border border-brand-border bg-brand-panel px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
                  >
                    <option value="restock">
                      Add Restock
                    </option>
  
                    <option value="add">
                      Add Manual Adjustment
                    </option>
  
                    <option value="remove">
                      Remove Manual Adjustment
                    </option>
                  </select>
                </div>
  
                <div class="mt-5">
                  <label
                    for="inventory-adjustment-quantity"
                    class="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-muted"
                  >
                    Quantity
                  </label>
  
                  <input
                    id="inventory-adjustment-quantity"
                    type="number"
                    min="1"
                    step="1"
                    inputmode="numeric"
                    x-model="inventoryAdjustmentQuantity"
                    placeholder="Enter quantity"
                    class="mt-2 min-h-12 w-full rounded-xl border border-brand-border bg-brand-panel px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                  >
                </div>
  
                <div class="mt-5">
                  <label
                    for="inventory-adjustment-reason"
                    class="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-muted"
                  >
                    Reason or Note
                  </label>
  
                  <textarea
                    id="inventory-adjustment-reason"
                    rows="4"
                    x-model="inventoryAdjustmentReason"
                    placeholder="Example: New stocks received from supplier"
                    class="mt-2 w-full resize-none rounded-xl border border-brand-border bg-brand-panel px-4 py-3 text-sm leading-6 text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                  ></textarea>
                </div>
  
                <div
                  class="mt-5 rounded-2xl border border-brand-border bg-brand-panel p-4"
                >
                  <div
                    class="flex items-center justify-between gap-4"
                  >
                    <span class="text-sm text-brand-muted">
                      Stock after adjustment
                    </span>
  
                    <strong
                      class="font-display text-2xl"
                      :class="
                        projectedInventoryStock < 0
                          ? 'text-red-300'
                          : 'text-brand-gold'
                      "
                      x-text="projectedInventoryStock"
                    ></strong>
                  </div>
                </div>
  
                <p
                  x-show="inventoryAdjustmentError"
                  x-text="inventoryAdjustmentError"
                  class="mt-4 text-xs leading-5 text-red-300"
                  role="alert"
                ></p>
  
                <div class="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    class="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-border px-5 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
                    @click="closeInventoryAdjustment()"
                  >
                    Cancel
                  </button>
  
                  <button
                    type="submit"
                    class="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-gold px-5 text-sm font-semibold text-[#17130d] transition hover:bg-brand-gold-light"
                  >
                    Save Stock Update
                  </button>
                </div>
              </form>
  
              <div
                class="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4"
              >
                <p class="text-xs leading-6 text-amber-100/80">
                  This frontend preview keeps changes only until the
                  page is refreshed. Permanent inventory records will
                  be saved after Supabase is connected.
                </p>
              </div>
            </div>
          </div>
        </template>
      </aside>
  
      <div
        x-show="inventoryFeedback"
        x-transition
        class="fixed bottom-5 right-5 z-[70] max-w-sm rounded-2xl border border-emerald-500/30 bg-emerald-950 px-5 py-4 text-sm text-emerald-100 shadow-2xl"
        role="status"
      >
        <div class="flex items-start gap-3">
          <span
            class="mt-1 size-2 shrink-0 rounded-full bg-emerald-400"
            aria-hidden="true"
          ></span>
  
          <span x-text="inventoryFeedback"></span>
        </div>
      </div>
    `
  }