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
          Sales Inventory
        </p>

        <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:max-w-md">
          <input
            type="date"
            x-model="salesDateFrom"
            aria-label="Filter sales from date"
            class="h-11 rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none focus:border-brand-gold"
          >

          <input
            type="date"
            x-model="salesDateTo"
            aria-label="Filter sales to date"
            class="h-11 rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none focus:border-brand-gold"
          >
        </div>

        <div class="mt-5 rounded-2xl border border-brand-border bg-brand-black p-5">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
                Selected Range Sales
              </p>

              <strong
                class="mt-2 block font-display text-3xl text-brand-cream"
                x-text="formatMoney(selectedRangeApprovedSales)"
              ></strong>
            </div>

            <p
              class="rounded-full border border-brand-border px-3 py-1.5 text-xs font-semibold text-brand-muted"
              x-text="salesChartData.length + ' day' + (salesChartData.length === 1 ? '' : 's')"
            ></p>
          </div>

          <div class="mt-6 flex h-44 items-end gap-2 overflow-x-auto border-b border-brand-border pb-3">
            <template x-for="day in salesChartData" :key="day.label">
              <div class="flex min-w-10 flex-1 flex-col items-center justify-end gap-2">
                <div class="group relative flex h-32 w-full items-end">
                  <div
                    class="relative flex w-full items-end justify-center rounded-t-lg bg-brand-gold/80 px-1 pb-1 transition hover:bg-brand-gold"
                    :style="'height: ' + Math.max(10, Math.round((Number(day.sales || 0) / salesChartMaxValue) * 100)) + '%'"
                    :title="day.label + ': ' + formatMoney(day.sales)"
                  >
                    <span
                      class="max-w-full truncate text-[0.58rem] font-bold leading-none text-[#17130d]"
                      x-text="Number(day.sales || 0) > 0 ? formatCompactMoney(day.sales) : '₱0'"
                    ></span>
                  </div>

                  <div class="pointer-events-none absolute -top-10 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-brand-border bg-brand-panel px-2.5 py-1.5 text-center text-[0.65rem] font-semibold text-brand-cream shadow-panel group-hover:block">
                    <span
                      class="block text-brand-muted"
                      x-text="day.label"
                    ></span>
                    <span
                      class="block text-brand-gold"
                      x-text="formatMoney(day.sales)"
                    ></span>
                  </div>
                </div>

                <span
                  class="text-[0.6rem] text-brand-muted"
                  x-text="day.label"
                ></span>
              </div>
            </template>
          </div>

          <p class="mt-3 text-xs leading-5 text-brand-muted">
            Chart uses approved, shipped, or delivered product orders within the selected date range.
          </p>
        </div>

        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <article class="rounded-xl border border-brand-border bg-brand-black px-5 py-4">
            <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
              Today
            </p>

            <strong
              class="mt-2 block font-display text-2xl text-brand-cream"
              x-text="formatMoney(dailyApprovedSales)"
            ></strong>
          </article>

          <article class="rounded-xl border border-brand-border bg-brand-black px-5 py-4">
            <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
              This Week
            </p>

            <strong
              class="mt-2 block font-display text-2xl text-brand-cream"
              x-text="formatMoney(weeklyApprovedSales)"
            ></strong>
          </article>

          <article class="rounded-xl border border-brand-border bg-brand-black px-5 py-4">
            <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
              This Month
            </p>

            <strong
              class="mt-2 block font-display text-2xl text-brand-cream"
              x-text="formatMoney(monthlyApprovedSales)"
            ></strong>
          </article>
        </div>

        <div class="mt-4 grid gap-3 sm:flex sm:flex-wrap">
          <button
            type="button"
            class="inline-flex min-h-10 items-center justify-center rounded-full bg-brand-gold px-5 text-sm font-semibold text-[#17130d] transition hover:bg-brand-gold-light"
            @click="openSalesExportConfirm('details')"
          >
            Export Sales Details
          </button>

          <button
            type="button"
            class="inline-flex min-h-10 items-center justify-center rounded-full border border-brand-border px-5 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
            @click="openSalesExportConfirm('summary')"
          >
            Export Sales Summary
          </button>
        </div>

        <p class="mt-3 text-xs leading-5 text-brand-muted">
          CSV reports open in Excel or Google Sheets. Sales are based on approved, shipped, or delivered product orders.
        </p>

        <div
          x-cloak
          x-show="salesExportConfirmOpen"
          x-transition.opacity
          class="fixed inset-0 z-[90] grid place-items-center bg-black/75 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sales-export-confirm-title"
          @keydown.escape.window="closeSalesExportConfirm()"
        >
          <button
            type="button"
            class="absolute inset-0 cursor-default"
            aria-label="Cancel sales export"
            @click="closeSalesExportConfirm()"
          ></button>

          <div class="relative z-10 w-full max-w-md rounded-2xl border border-brand-gold/35 bg-brand-panel p-6 shadow-gold-soft">
            <p class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold">
              Export CSV
            </p>

            <h2
              id="sales-export-confirm-title"
              class="mt-2 font-display text-3xl text-brand-cream"
              x-text="salesExportConfirmType === 'summary' ? 'Download sales summary?' : 'Download sales details?'"
            ></h2>

            <p class="mt-3 text-sm leading-6 text-brand-muted">
              This will download a CSV file that can be opened in Excel or Google Sheets.
            </p>

            <div class="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                class="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-border px-5 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
                @click="closeSalesExportConfirm()"
              >
                Cancel
              </button>

              <button
                type="button"
                class="premium-cta inline-flex min-h-11 items-center justify-center rounded-full bg-brand-gold px-5 text-sm font-semibold text-[#17130d]"
                @click="confirmSalesExport()"
              >
                Download CSV
              </button>
            </div>
          </div>
        </div>

        <!-- ===================== MEMBER SALES PERFORMANCE ===================== -->
        <section class="mt-8 rounded-2xl border border-brand-border bg-brand-panel p-5 sm:p-6">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold">
                Member Performance
              </p>

              <h2 class="mt-2 font-display text-2xl text-brand-cream sm:text-3xl">
                Member Sales Performance
              </h2>

              <p class="mt-2 max-w-2xl text-sm leading-6 text-brand-muted">
                Completed product sales from active members for the selected sales date range.
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <template
                x-for="tier in [
                  { value: 'all', label: 'All Members' },
                  { value: 'starter', label: 'Starter' },
                  { value: 'builder', label: 'Builder' },
                  { value: 'leader', label: 'Leader' },
                  { value: 'prestige', label: 'Prestige' }
                ]"
                :key="tier.value"
              >
                <button
                  type="button"
                  class="inline-flex min-h-9 items-center justify-center rounded-full border px-4 text-xs font-semibold transition"
                  :class="
                    memberSalesTierFilter === tier.value
                      ? 'border-brand-gold bg-brand-gold text-[#17130d]'
                      : 'border-brand-border text-brand-muted hover:border-brand-gold hover:text-brand-gold'
                  "
                  @click="memberSalesTierFilter = tier.value"
                  x-text="tier.label"
                ></button>
              </template>
            </div>
          </div>

          <div class="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <article class="rounded-xl border border-brand-border bg-brand-black px-5 py-4">
              <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
                Completed Sales
              </p>

              <strong
                class="mt-2 block font-display text-2xl text-brand-cream"
                x-text="formatMoney(completedMemberSalesTotal)"
              ></strong>
            </article>

            <article class="rounded-xl border border-brand-border bg-brand-black px-5 py-4">
              <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
                Completed Orders
              </p>

              <strong
                class="mt-2 block font-display text-2xl text-brand-cream"
                x-text="completedMemberSalesOrderCount"
              ></strong>
            </article>

            <article class="rounded-xl border border-brand-border bg-brand-black px-5 py-4">
              <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
                Active Buyers
              </p>

              <strong
                class="mt-2 block font-display text-2xl text-brand-cream"
                x-text="completedMemberSalesActiveBuyerCount"
              ></strong>
            </article>

            <article class="rounded-xl border border-brand-border bg-brand-black px-5 py-4">
              <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
                Average Order
              </p>

              <strong
                class="mt-2 block font-display text-2xl text-brand-cream"
                x-text="formatMoney(completedMemberSalesAverageOrder)"
              ></strong>
            </article>
          </div>

          <div class="mt-6 overflow-hidden rounded-xl border border-brand-border">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-brand-border text-left">
                <thead class="bg-brand-black">
                  <tr>
                    <th class="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
                      Rank
                    </th>
                    <th class="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
                      Member
                    </th>
                    <th class="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
                      Tier
                    </th>
                    <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
                      Completed Orders
                    </th>
                    <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
                      Units
                    </th>
                    <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
                      Total Sales
                    </th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-brand-border bg-brand-panel">
                  <template
                    x-for="(member, index) in memberSalesRanking"
                    :key="member.email"
                  >
                    <tr>
                      <td
                        class="whitespace-nowrap px-4 py-4 text-sm font-semibold text-brand-gold"
                        x-text="\`#\${index + 1}\`"
                      ></td>

                      <td class="px-4 py-4">
                        <p
                          class="text-sm font-semibold text-brand-cream"
                          x-text="member.name"
                        ></p>

                        <p
                          class="mt-1 text-xs text-brand-muted"
                          x-text="member.email"
                        ></p>
                      </td>

                      <td class="whitespace-nowrap px-4 py-4">
                        <span
                          class="inline-flex rounded-full border border-brand-border px-3 py-1 text-xs font-semibold capitalize text-brand-cream"
                          x-text="member.tier"
                        ></span>
                      </td>

                      <td
                        class="whitespace-nowrap px-4 py-4 text-right text-sm text-brand-cream"
                        x-text="member.completedOrders"
                      ></td>

                      <td
                        class="whitespace-nowrap px-4 py-4 text-right text-sm text-brand-cream"
                        x-text="member.units"
                      ></td>

                      <td
                        class="whitespace-nowrap px-4 py-4 text-right text-sm font-semibold text-brand-gold"
                        x-text="formatMoney(member.totalSales)"
                      ></td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>

            <div
              x-show="memberSalesRanking.length === 0"
              class="border-t border-brand-border bg-brand-black px-5 py-10 text-center"
            >
              <p class="text-sm font-semibold text-brand-cream">
                No completed member sales found.
              </p>

              <p class="mt-2 text-xs leading-5 text-brand-muted">
                Try another member tier or sales date range.
              </p>
            </div>
          </div>
        </section>

        
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

      <!-- ===================== INVENTORY SUMMARY ===================== -->
        <div class="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-xl border border-brand-border bg-brand-black px-5 py-3">
            <p class="text-xs text-brand-muted">Total inventory items</p>
            <strong
              class="mt-1 block text-2xl text-brand-cream"
              x-text="liveProductsLoading || liveProductsError ? '—' : liveProducts.length"
            ></strong>
          </div>

          <div class="rounded-xl border border-brand-border bg-brand-black px-5 py-3">
            <p class="text-xs text-brand-muted">Fragrance SKUs</p>
            <strong
              class="mt-1 block text-2xl text-brand-cream"
              x-text="liveProductsLoading || liveProductsError ? '—' : liveProducts.filter(product => product.id !== 'tester-kit').length"
            ></strong>
          </div>

          <div class="rounded-xl border border-brand-border bg-brand-black px-5 py-3">
            <p class="text-xs text-brand-muted">Tester kits</p>
            <strong
              class="mt-1 block text-2xl text-brand-cream"
              x-text="liveProductsLoading || liveProductsError ? '—' : liveProducts.filter(product => product.id === 'tester-kit').length"
            ></strong>
          </div>

          <div class="rounded-xl border border-brand-border bg-brand-black px-5 py-3">
            <p class="text-xs text-brand-muted">Active inventory items</p>
            <strong
              class="mt-1 block text-2xl text-brand-cream"
              x-text="liveProductsLoading || liveProductsError ? '—' : liveProducts.filter(product => product.is_active).length"
            ></strong>
          </div>
        </div>

      <div
        x-show="!liveProductsLoading && !liveProductsError && liveProducts.length > 0"
        class="mt-4 overflow-hidden rounded-[1.5rem] border border-brand-border bg-brand-panel"
      >
        <div class="hidden border-b border-brand-border bg-brand-black/40 px-4 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-brand-muted lg:grid lg:grid-cols-[minmax(14rem,1.25fr)_6rem_7rem_10rem_8rem_10rem] lg:items-center lg:gap-4">
          <span>Product</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Action</span>
          <span>Qty</span>
          <span class="text-right">Update</span>
        </div>

        <template x-for="product in liveProducts" :key="product.id">
          <article class="border-b border-brand-border p-5 last:border-b-0 lg:p-0">
            <div class="grid gap-4 lg:grid-cols-[minmax(14rem,1.25fr)_6rem_7rem_10rem_8rem_10rem] lg:items-center lg:gap-4 lg:px-4 lg:py-4">
              <div class="min-w-0">
                <div class="flex items-start justify-between gap-3 lg:block">
                  <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                      <span
                        class="inline-flex h-7 items-center text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold"
                        x-text="product.sku"
                      ></span>

                      <span
                        class="inline-flex rounded-full border border-brand-border px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.08em] text-brand-muted"
                        x-text="product.id === 'tester-kit' ? 'Tester Kit' : product.sku?.startsWith('M') ? 'Men' : product.sku?.startsWith('W') ? 'Women' : 'Product'"
                      ></span>
                    </div>

                    <h2
                      class="mt-1 min-w-0 truncate text-lg font-semibold text-brand-cream"
                      x-text="product.name"
                    ></h2>
                  </div>

                  <span
                    class="inline-flex h-8 shrink-0 items-center rounded-full border border-brand-border px-3 text-[0.65rem] font-semibold text-brand-cream lg:hidden"
                    x-text="'Stock ' + product.stock_quantity"
                  ></span>
                </div>
              </div>

              <span
                class="font-semibold text-brand-gold"
                x-text="formatMoney(product.regular_price)"
              ></span>

              <span
                class="hidden h-8 w-fit items-center rounded-full border border-brand-border px-3 text-[0.65rem] font-semibold text-brand-cream lg:inline-flex"
                x-text="'Stock ' + product.stock_quantity"
              ></span>

              <label class="text-xs text-brand-muted">
                <span class="lg:sr-only">Action</span>
                <select
                  x-model="stockAdjustmentModes[product.id]"
                  :disabled="savingProductId === product.id"
                  class="mt-1 block min-h-10 w-full rounded-lg border border-brand-border bg-brand-black px-3 py-2 text-sm text-brand-cream lg:mt-0"
                >
                  <option value="set">Set count</option>
                  <option value="add">Add stock</option>
                  <option value="deduct">Deduct stock</option>
                </select>
              </label>

              <label class="text-xs text-brand-muted">
                <span class="lg:sr-only">Quantity</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  x-model.number="stockDrafts[product.id]"
                  :disabled="savingProductId === product.id"
                  class="mt-1 block min-h-10 w-full rounded-lg border border-brand-border bg-brand-black px-3 py-2 text-sm text-brand-cream lg:mt-0"
                >
              </label>

              <button
                type="button"
                @click="saveProductStock(product)"
                :disabled="savingProductId === product.id"
                class="inline-flex min-h-10 w-full items-center justify-center rounded-full bg-brand-gold px-5 text-sm font-semibold text-[#17130d] disabled:opacity-50"
                x-text="
                  savingProductId === product.id
                    ? 'Saving...'
                    : stockAdjustmentModes[product.id] === 'add'
                      ? 'Add Stock'
                      : stockAdjustmentModes[product.id] === 'deduct'
                        ? 'Deduct Stock'
                        : 'Set Stock Count'
                "
              ></button>
            </div>

            <label class="mt-3 block text-xs text-brand-muted lg:px-4 lg:pb-4">
              Adjustment note
              <input
                type="text"
                x-model="stockAdjustmentNotes[product.id]"
                :disabled="savingProductId === product.id"
                placeholder="Example: restock, offsite sale, damaged item"
                class="mt-1 block min-h-10 w-full rounded-lg border border-brand-border bg-brand-black px-3 py-2 text-sm text-brand-cream placeholder:text-brand-muted"
              >
            </label>

            <p
              x-show="stockSaveProductId === product.id && stockSaveError"
              x-text="stockSaveError"
              class="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs leading-5 text-red-200"
              role="alert"
            ></p>

            <p
              x-show="stockSaveProductId === product.id && stockSaveMessage"
              x-text="stockSaveMessage"
              class="mt-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-xs leading-5 text-emerald-100"
              role="status"
            ></p>
          </article>
        </template>
      </div>

      <!-- ===================== RECENT STOCK CHANGES ===================== -->
      <div class="mt-8 rounded-2xl border border-brand-border bg-brand-panel p-5 sm:p-6">
        <h2 class="font-display text-2xl text-brand-cream">
          Recent stock changes
        </h2>
        <p class="mt-1 text-xs text-brand-muted">
          Latest 20 changes, newest first.
        </p>

        <!-- Date Filter -->
        <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:max-w-md">
          <input
            type="date"
            x-model="stockHistoryDateFrom"
            aria-label="Filter stock changes from date"
            class="h-11 rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none focus:border-brand-gold"
          >

          <input
            type="date"
            x-model="stockHistoryDateTo"
            aria-label="Filter stock changes to date"
            class="h-11 rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none focus:border-brand-gold"
          >
        </div>

        <!-- Result Count -->
        <p
          class="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted"
          x-show="!stockHistoryLoading && !stockHistoryError"
          x-text="\`Showing \${filteredStockHistory.length} stock \${filteredStockHistory.length === 1 ? 'change' : 'changes'}\`"
        ></p>

        <p
          x-show="stockHistoryLoading"
          class="mt-5 text-sm text-brand-muted"
        >
          Loading history...
        </p>

        <p
          x-show="stockHistoryError"
          x-text="stockHistoryError"
          class="mt-5 text-sm text-red-300"
          role="alert"
        ></p>

        <!-- Empty State -->
        <p
          x-show="!stockHistoryLoading && !stockHistoryError && filteredStockHistory.length === 0"
          class="mt-5 text-sm text-brand-muted"
        >
          No stock changes found for the selected date range.
        </p>

        <!-- Stock History List -->
        <div
          x-show="!stockHistoryLoading && !stockHistoryError && filteredStockHistory.length > 0"
          class="mt-5 space-y-3"
        >
          <template x-for="movement in filteredStockHistory" :key="movement.id">
            <div class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-border bg-brand-black p-4">
              <div>
                <p
                  class="font-semibold text-brand-cream"
                  x-text="(() => {
                    const product = liveProducts.find(product => product.id === movement.product_id) || {}
                    return product.name
                      ? \`\${product.sku || movement.product_id} · \${product.name}\`
                      : product.sku || movement.product_id
                  })()"
                ></p>
                <p
                  class="mt-1 text-xs text-brand-muted"
                  x-text="new Date(movement.created_at).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })"
                ></p>
              </div>
              <p
                class="text-sm font-semibold text-brand-gold"
                x-text="(() => {
                  const previousQuantity = Number(movement.previous_quantity || 0)
                  const newQuantity = Number(movement.new_quantity || 0)
                  const amount = Math.abs(newQuantity - previousQuantity)

                  if (newQuantity < previousQuantity) {
                    return 'Deducted: ' + amount + ' · New stock: ' + newQuantity
                  }

                  if (newQuantity > previousQuantity) {
                    return 'Added: ' + amount + ' · New stock: ' + newQuantity
                  }

                  return 'No change · Stock: ' + newQuantity
                })()"
              ></p>
            </div>
          </template>
        </div>
      </div>
    </section>
  `
}