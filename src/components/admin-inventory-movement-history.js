export function renderAdminInventoryMovementHistory() {
    return `
      <section
        x-show="activePage === 'sales-inventory'"
        x-transition.opacity
        class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
        aria-labelledby="inventory-movement-history-title"
      >
        <div
          class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
            >
              Inventory Records
            </p>
  
            <h2
              id="inventory-movement-history-title"
              class="mt-2 font-display text-3xl text-brand-cream"
            >
              Stock movement history
            </h2>
  
            <p
              class="mt-2 max-w-2xl text-sm leading-6 text-brand-muted"
            >
              Review restocks, manual adjustments, order
              deductions, and returned stocks.
            </p>
          </div>
  
          <div class="w-full sm:w-52">
            <label class="block">
              <span class="sr-only">
                Filter stock movement history
              </span>
  
              <select
                x-model="inventoryMovementFilter"
                class="min-h-11 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
              >
                <option value="all">
                  All movements
                </option>
  
                <option value="restock">
                  Restocks
                </option>
  
                <option value="add">
                  Added adjustments
                </option>
  
                <option value="remove">
                  Removed adjustments
                </option>
  
                <option value="order-sale">
                  Approved orders
                </option>
  
                <option value="cancellation-return">
                  Returned stocks
                </option>
              </select>
            </label>
          </div>
        </div>
  
        <div
          class="mt-5 flex items-center justify-between gap-4 border-y border-brand-border py-4"
        >
          <p class="text-xs text-brand-muted">
            Showing
  
            <strong
              class="text-brand-cream"
              x-text="filteredInventoryMovements.length"
            ></strong>
  
            movement<span
              x-show="filteredInventoryMovements.length !== 1"
            >s</span>
          </p>
  
          <button
            x-show="inventoryMovementFilter !== 'all'"
            type="button"
            class="text-xs font-semibold text-brand-gold transition hover:text-brand-gold-light"
            @click="inventoryMovementFilter = 'all'"
          >
            Clear filter
          </button>
        </div>
  
        <div
          x-show="filteredInventoryMovements.length > 0"
          class="mt-5 space-y-3"
        >
          <template
            x-for="movement in filteredInventoryMovements"
            :key="movement.id"
          >
            <article
              class="rounded-2xl border border-brand-border bg-brand-black p-4 sm:p-5"
            >
              <div
                class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <span
                      class="inline-flex items-center rounded-full border px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.08em]"
                      :class="
                        inventoryMovementBadgeClass(
                          movement.type
                        )
                      "
                      x-text="
                        inventoryMovementTypeLabel(
                          movement.type
                        )
                      "
                    ></span>
  
                    <span
                      class="text-[0.62rem] uppercase tracking-[0.1em] text-brand-muted"
                      x-text="formatDate(movement.created_at)"
                    ></span>
                  </div>
  
                  <h3
                    class="mt-3 truncate font-display text-2xl text-brand-cream"
                    x-text="movement.product_name"
                  ></h3>
  
                  <p
                    class="mt-1 text-sm leading-6 text-brand-muted"
                    x-text="movement.reason"
                  ></p>
                </div>
  
                <div
                  class="grid grid-cols-3 gap-3 border-t border-brand-border pt-4 lg:min-w-72 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0"
                >
                  <div>
                    <p
                      class="text-[0.58rem] uppercase tracking-[0.1em] text-brand-muted"
                    >
                      Change
                    </p>
  
                    <strong
                      class="mt-1 block text-sm"
                      :class="
                        movement.quantity > 0
                          ? 'text-emerald-300'
                          : 'text-red-300'
                      "
                      x-text="
                        movement.quantity > 0
                          ? '+' + movement.quantity
                          : movement.quantity
                      "
                    ></strong>
                  </div>
  
                  <div>
                    <p
                      class="text-[0.58rem] uppercase tracking-[0.1em] text-brand-muted"
                    >
                      Before
                    </p>
  
                    <strong
                      class="mt-1 block text-sm text-brand-cream"
                      x-text="movement.previous_stock"
                    ></strong>
                  </div>
  
                  <div>
                    <p
                      class="text-[0.58rem] uppercase tracking-[0.1em] text-brand-muted"
                    >
                      After
                    </p>
  
                    <strong
                      class="mt-1 block text-sm text-brand-gold"
                      x-text="movement.new_stock"
                    ></strong>
                  </div>
                </div>
              </div>
            </article>
          </template>
        </div>
  
        <div
          x-show="filteredInventoryMovements.length === 0"
          class="mt-5 rounded-2xl border border-dashed border-brand-border bg-brand-black px-5 py-10 text-center"
        >
          <h3
            class="font-display text-2xl text-brand-cream"
          >
            No stock movements yet
          </h3>
  
          <p
            class="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted"
          >
            Add a restock or manual stock adjustment to
            create the first inventory record.
          </p>
        </div>
  
        <div
          class="mt-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4"
        >
          <p class="text-xs leading-5 text-amber-100/80">
            Preview records reset after refreshing the page.
            Supabase will permanently store the movement history
            and admin information later.
          </p>
        </div>
      </section>
    `
  }