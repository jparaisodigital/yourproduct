export function renderAdminSalesRecords() {
    return `
      <section
        x-show="activePage === 'sales-inventory'"
        x-transition.opacity
        class="mx-auto mt-8 w-full max-w-[1180px] px-5 pb-2 sm:px-7 lg:px-8"
        aria-labelledby="admin-sales-records-title"
      >
        <div
          class="rounded-[1.75rem] border border-brand-border bg-brand-panel p-5 sm:p-7"
        >
          <div
            class="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"
          >
            <div>
              <p
                class="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
              >
                Sales Monitoring
              </p>
  
              <h2
                id="admin-sales-records-title"
                class="mt-2 font-display text-3xl text-brand-cream sm:text-4xl"
              >
                Sales records
              </h2>
  
              <p
                class="mt-2 max-w-2xl text-sm leading-6 text-brand-muted"
              >
                Review order sales, product costs, and estimated
                gross profit from one record list.
              </p>
            </div>
  
            <div
              class="grid w-full gap-3 sm:grid-cols-3 xl:max-w-3xl"
            >
              <label class="grid gap-2">
                <span
                  class="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-brand-muted"
                >
                  Date
                </span>
  
                <select
                  x-model="salesDateFilter"
                  class="min-h-11 rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
                >
                  <option value="all">
                    All dates
                  </option>
  
                  <option value="today">
                    Today
                  </option>
  
                  <option value="7-days">
                    Last 7 days
                  </option>
  
                  <option value="30-days">
                    Last 30 days
                  </option>
                </select>
              </label>
  
              <label class="grid gap-2">
                <span
                  class="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-brand-muted"
                >
                  Order status
                </span>
  
                <select
                  x-model="salesStatusFilter"
                  class="min-h-11 rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
                >
                  <option value="all">
                    All statuses
                  </option>
  
                  <option value="pending-verification">
                    Pending Verification
                  </option>
  
                  <option value="processing">
                    Processing
                  </option>
  
                  <option value="shipped">
                    Shipped
                  </option>
  
                  <option value="delivered">
                    Delivered
                  </option>
  
                  <option value="rejected">
                    Rejected
                  </option>
  
                  <option value="cancelled">
                    Cancelled
                  </option>
  
                  <option value="refunded">
                    Refunded
                  </option>
                </select>
              </label>
  
              <label class="grid gap-2">
                <span
                  class="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-brand-muted"
                >
                  Customer type
                </span>
  
                <select
                  x-model="salesCustomerTypeFilter"
                  class="min-h-11 rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
                >
                  <option value="all">
                    All customers
                  </option>
  
                  <option value="regular">
                    Regular Customer
                  </option>
  
                  <option value="member">
                    Member
                  </option>
                </select>
              </label>
            </div>
          </div>
  
          <div
            class="mt-6 flex flex-col gap-2 border-y border-brand-border py-4 text-sm text-brand-muted sm:flex-row sm:items-center sm:justify-between"
          >
            <p>
              Showing
              <strong
                class="text-brand-cream"
                x-text="filteredSalesOrders.length"
              ></strong>
              order records
            </p>
  
            <p class="text-xs">
              Only approved active orders count toward sales and profit.
            </p>
          </div>
  
          <div
            x-show="filteredSalesOrders.length === 0"
            class="mt-6 rounded-2xl border border-dashed border-brand-border bg-brand-black px-5 py-12 text-center"
          >
            <p
              class="font-display text-2xl text-brand-cream"
            >
              No matching sales records
            </p>
  
            <p
              class="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted"
            >
              Try changing the date, status, or customer-type
              filter.
            </p>
          </div>
  
          <div
            x-show="filteredSalesOrders.length > 0"
            class="mt-6 grid gap-4"
          >
            <template
              x-for="order in filteredSalesOrders"
              :key="order.id"
            >
              <article
                class="rounded-2xl border border-brand-border bg-brand-black p-5"
              >
                <div
                  class="grid gap-5 xl:grid-cols-[1.35fr_0.8fr_0.8fr_0.8fr_0.8fr]"
                >
                  <div class="min-w-0">
                    <div
                      class="flex flex-wrap items-center gap-2"
                    >
                      <span
                        class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.1em]"
                        :class="orderStatusBadgeClass(order.status)"
                      >
                        <span
                          class="size-1.5 rounded-full"
                          :class="orderStatusDotClass(order.status)"
                        ></span>
  
                        <span
                          x-text="
                            orderStatusLabels[order.status] ||
                            order.status
                          "
                        ></span>
                      </span>
  
                      <span
                        class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-gold"
                        x-text="order.order_number"
                      ></span>
                    </div>
  
                    <h3
                      class="mt-3 truncate font-display text-2xl text-brand-cream"
                      x-text="order.customer_name"
                    ></h3>
  
                    <p
                      class="mt-1 truncate text-sm text-brand-muted"
                      x-text="order.customer_email"
                    ></p>
  
                    <div
                      class="mt-3 flex flex-wrap items-center gap-2"
                    >
                      <span
                        class="rounded-full border border-brand-border bg-brand-panel px-3 py-1 text-xs text-brand-muted"
                        x-text="
                          order.customer_type === 'member'
                            ? 'Member'
                            : 'Regular Customer'
                        "
                      ></span>
  
                      <span
                        class="text-xs text-brand-muted"
                        x-text="formatDate(order.submitted_at)"
                      ></span>
                    </div>
                  </div>
  
                  <div
                    class="border-t border-brand-border pt-4 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0"
                  >
                    <p
                      class="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-brand-muted"
                    >
                      Units
                    </p>
  
                    <p
                      class="mt-2 text-lg font-semibold text-brand-cream"
                      x-text="order.item_count"
                    ></p>
  
                    <p
                      class="mt-1 text-xs text-brand-muted"
                      x-text="
                        order.customer_type === 'member'
                          ? 'Member-price order'
                          : 'Regular-price order'
                      "
                    ></p>
                  </div>
  
                  <div
                    class="border-t border-brand-border pt-4 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0"
                  >
                    <p
                      class="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-brand-muted"
                    >
                      Product sales
                    </p>
  
                    <p
                      class="mt-2 text-lg font-semibold text-brand-gold"
                      x-text="
                        isRecognizedSalesOrder(order)
                          ? formatMoney(
                              orderProductSales(order),
                            )
                          : '—'
                      "
                    ></p>
  
                    <p
                      class="mt-1 text-xs text-brand-muted"
                      x-text="
                        isRecognizedSalesOrder(order)
                          ? 'Counted in sales'
                          : salesRecognitionLabel(order)
                      "
                    ></p>
                  </div>
  
                  <div
                    class="border-t border-brand-border pt-4 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0"
                  >
                    <p
                      class="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-brand-muted"
                    >
                      Product cost
                    </p>
  
                    <p
                      class="mt-2 text-lg font-semibold text-brand-cream"
                      x-text="
                        isRecognizedSalesOrder(order)
                          ? formatMoney(
                              orderProductCost(order),
                            )
                          : '—'
                      "
                    ></p>
  
                    <p class="mt-1 text-xs text-brand-muted">
                      Based on cost snapshot
                    </p>
                  </div>
  
                  <div
                    class="border-t border-brand-border pt-4 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0"
                  >
                    <p
                      class="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-brand-muted"
                    >
                      Est. gross profit
                    </p>
  
                    <p
                      class="mt-2 text-lg font-semibold"
                      :class="
                        orderEstimatedGrossProfit(order) >= 0
                          ? 'text-emerald-300'
                          : 'text-red-300'
                      "
                      x-text="
                        isRecognizedSalesOrder(order)
                          ? formatMoney(
                              orderEstimatedGrossProfit(
                                order,
                              ),
                            )
                          : '—'
                      "
                    ></p>
  
                    <p
                      class="mt-1 text-xs text-brand-muted"
                    >
                      Sales minus product cost
                    </p>
                  </div>
                </div>
              </article>
            </template>
          </div>
  
          <div
            class="mt-6 rounded-2xl border border-brand-gold/30 bg-brand-gold/10 px-5 py-4"
          >
            <p
              class="text-xs leading-5 text-brand-muted"
            >
              Estimated gross profit is based only on approved
              product sales minus the encoded product cost. It is
              not the business's final net income or accounting
              statement.
            </p>
          </div>
        </div>
      </section>
    `
  }