import './style.css'

import Alpine from 'alpinejs'

import logoImage from './assets/logoyourproduct.png'

import {
  siteConfig,
} from './config/site-config.js'

import {
  packages,
} from './config/packages-config.js'

import {
  products,
} from './config/products-config.js'

import {
  renderAdminSalesInventoryPage,
} from './components/admin-sales-inventory-page.js'

import {
  renderAdminInventoryAdjustmentDrawer,
} from './components/admin-inventory-adjustment-drawer.js'

import {
  renderAdminInventoryMovementHistory,
} from './components/admin-inventory-movement-history.js'

import {
  membershipApplications,
  membershipStatusLabels,
  paymentMethodLabels,
} from './config/admin-preview-data.js'

import {
  customerOrders,
  orderStatusLabels,
  fulfillmentTypeLabels,
  orderPaymentMethodLabels,
} from './config/admin-orders-preview-data.js'

const adminMembershipApplications =
membershipApplications.map((application) => {
  const selectedPackage =
  packages.find(
    (packageItem) =>
      packageItem.id === application.package_id,
  ) || null
  
  return {
    ...application,
    package: selectedPackage,
  }
})

const adminCustomerOrders = customerOrders.map(
  (order) => ({
    ...order,
    
    items: order.items.map((item) => ({
      ...item,
    })),
  }),
)

const adminInventoryProducts = products.map(
  (product) => ({
    ...product,
  }),
)

const adminPesoFormatter = new Intl.NumberFormat(
  'en-PH',
  {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  },
)

const adminDateFormatter = new Intl.DateTimeFormat(
  'en-PH',
  {
    dateStyle: 'medium',
    timeStyle: 'short',
  },
)

window.Alpine = Alpine

const adminNavigationItems = [
  {
    id: 'overview',
    label: 'Overview',
  },
  {
    id: 'memberships',
    label: 'Membership Applications',
  },
  {
    id: 'orders',
    label: 'Orders',
  },
  {
    id: 'sales-inventory',
    label: 'Sales & Inventory',
  },
  {
    id: 'customers',
    label: 'Customers',
  },
  {
    id: 'products',
    label: 'Products',
  },
]

const adminPageTitles = {
  overview: 'Overview',
  memberships: 'Membership Applications',
  orders: 'Orders',
'sales-inventory': 'Sales & Inventory',
  customers: 'Customers',
  products: 'Products',
}

const navigationMarkup = adminNavigationItems
.map(
  (item) => `
      <button
        type="button"
        class="flex min-h-12 w-full items-center justify-between rounded-xl px-4 text-left text-sm font-semibold transition"
        :class="
          activePage === '${item.id}'
            ? 'bg-brand-gold text-[#17130d]'
            : 'text-brand-muted hover:bg-brand-gold/10 hover:text-brand-gold'
        "
        @click="openPage('${item.id}')"
      >
        <span>${item.label}</span>
    
        <span
          x-show="activePage === '${item.id}'"
          class="size-1.5 rounded-full bg-[#17130d]"
          aria-hidden="true"
        ></span>
      </button>
    `,
)
.join('')

function renderAdminSidebar() {
  return `
    <div class="flex h-full flex-col">
      <div
        class="flex min-h-24 items-center border-b border-brand-border px-5"
      >
        <a
          href="/admin/"
          class="flex min-w-0 items-center gap-3"
          aria-label="${siteConfig.brand.name} admin dashboard"
        >
          <img
            src="${logoImage}"
            alt="${siteConfig.brand.name}"
            class="size-12 shrink-0 object-contain"
          >
    
          <span class="min-w-0">
            <strong
              class="block truncate text-sm uppercase tracking-[0.14em] text-brand-cream"
            >
              ${siteConfig.brand.name}
            </strong>
    
            <span
              class="mt-1 block text-[0.6rem] uppercase tracking-[0.16em] text-brand-gold"
            >
              Admin Portal
            </span>
          </span>
        </a>
      </div>
    
      <nav
        class="flex-1 overflow-y-auto px-4 py-7"
        aria-label="Admin dashboard navigation"
      >
        <p
          class="mb-4 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-brand-muted"
        >
          Management
        </p>
    
        <div class="space-y-2">
          ${navigationMarkup}
        </div>
      </nav>
    
      <div class="border-t border-brand-border p-4">
        <div
          class="rounded-2xl border border-brand-border bg-brand-black px-4 py-4"
        >
          <p
            class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand-gold"
          >
            Administrator
          </p>
    
          <p class="mt-2 text-sm font-semibold text-brand-cream">
            Admin Preview
          </p>
    
          <p class="mt-1 text-xs text-brand-muted">
            Frontend interface only
          </p>
        </div>
      </div>
    </div>
  `
}

function renderMembershipApplicationsPage() {
  return `
      <section
        x-show="activePage === 'memberships'"
        x-transition.opacity
        aria-labelledby="memberships-page-title"
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
                Membership Management
              </p>
  
              <h1
                id="memberships-page-title"
                class="mt-2 font-display text-4xl text-brand-cream sm:text-5xl"
              >
                Membership applications
              </h1>
  
              <p
                class="mt-3 max-w-2xl text-sm leading-7 text-brand-muted"
              >
                Review package selections, customer information,
                payment details, and cancellation requests from one
                organized queue.
              </p>
            </div>
  
            <div
              class="grid w-full grid-cols-2 gap-3 sm:w-auto"
            >
              <div
                class="rounded-2xl border border-brand-border bg-brand-black px-4 py-3"
              >
                <p
                  class="text-[0.6rem] uppercase tracking-[0.12em] text-brand-muted"
                >
                  For Review
                </p>
  
                <strong
                  class="mt-1 block font-display text-2xl text-brand-cream"
                  x-text="pendingVerificationCount"
                ></strong>
              </div>
  
              <div
                class="rounded-2xl border border-brand-border bg-brand-black px-4 py-3"
              >
                <p
                  class="text-[0.6rem] uppercase tracking-[0.12em] text-brand-muted"
                >
                  Cancellations
                </p>
  
                <strong
                  class="mt-1 block font-display text-2xl text-brand-cream"
                  x-text="cancellationRequestCount"
                ></strong>
              </div>
            </div>
          </div>
        </div>
  
        <div
          class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel p-4 shadow-panel sm:p-5"
        >
          <div
            class="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem]"
          >
            <label class="relative block">
              <span class="sr-only">
                Search applications
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
                x-model.debounce.250ms="applicationSearch"
                placeholder="Search customer, reference, or package"
                class="min-h-12 w-full rounded-xl border border-brand-border bg-brand-black pl-11 pr-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
              >
            </label>
  
            <label class="block">
              <span class="sr-only">
                Filter by status
              </span>
  
              <select
                x-model="applicationStatusFilter"
                class="min-h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
              >
                <option value="all">
                  All statuses
                </option>
  
                <option value="pending-verification">
                  Pending Verification
                </option>
  
                <option value="cancellation-requested">
                  Cancellation Requested
                </option>
  
                <option value="awaiting-payment">
  Awaiting Payment
</option>
    
<option value="approved">
  Approved
</option>
    
<option value="rejected">
  Rejected
</option>
    
<option value="cancelled">
  Cancelled
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
                x-text="filteredApplications.length"
              ></strong>
  
              application<span
                x-show="filteredApplications.length !== 1"
              >s</span>
            </p>
  
            <button
              x-show="
                applicationSearch ||
                applicationStatusFilter !== 'all'
              "
              type="button"
              class="text-xs font-semibold text-brand-gold transition hover:text-brand-gold-light"
              @click="
                applicationSearch = '';
                applicationStatusFilter = 'all'
              "
            >
              Clear filters
            </button>
          </div>
        </div>
  
        <div class="mt-6 space-y-4">
          <template
            x-for="application in filteredApplications"
            :key="application.id"
          >
            <article
              class="rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel transition hover:border-brand-gold/50 sm:p-6"
            >
              <div
                class="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(15rem,0.65fr)_auto] lg:items-center"
              >
                <div class="min-w-0">
                  <div
                    class="flex flex-wrap items-center gap-3"
                  >
                    <span
                      class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.08em]"
                      :class="applicationStatusBadgeClass(application.status)"
                    >
                      <span
  class="size-1.5 rounded-full"
  :class="
    applicationStatusDotClass(
      application.status,
    )
  "
  aria-hidden="true"
></span>
  
                      <span
                        x-text="
                          applicationStatusLabels[
                            application.status
                          ] || application.status
                        "
                      ></span>
                    </span>
  
                    <span
                      class="text-[0.65rem] uppercase tracking-[0.12em] text-brand-muted"
                      x-text="application.id"
                    ></span>
                  </div>
  
                  <h2
                    class="mt-3 truncate font-display text-2xl text-brand-cream sm:text-3xl"
                    x-text="application.customer_name"
                  ></h2>
  
                  <p
                    class="mt-1 truncate text-sm text-brand-muted"
                    x-text="application.customer_email"
                  ></p>
                </div>
  
                <div
                  class="grid grid-cols-2 gap-4 border-y border-brand-border py-4 lg:border-y-0 lg:border-l lg:py-0 lg:pl-6"
                >
                  <div>
                    <p
                      class="text-[0.62rem] uppercase tracking-[0.12em] text-brand-muted"
                    >
                      Package
                    </p>
  
                    <strong
                      class="mt-1 block text-sm text-brand-cream"
                      x-text="
                        application.package?.name ||
                        'Unknown package'
                      "
                    ></strong>
                  </div>
  
                  <div>
                    <p
                      class="text-[0.62rem] uppercase tracking-[0.12em] text-brand-muted"
                    >
                      Amount
                    </p>
  
                    <strong
                      class="mt-1 block text-sm text-brand-gold"
                      x-text="formatMoney(application.amount)"
                    ></strong>
                  </div>
  
                  <div class="col-span-2">
                    <p
                      class="text-[0.62rem] uppercase tracking-[0.12em] text-brand-muted"
                    >
                      Submitted
                    </p>
  
                    <p
                      class="mt-1 text-xs text-brand-muted"
                      x-text="
                        formatDate(application.submitted_at)
                      "
                    ></p>
                  </div>
                </div>
  
                <button
                  type="button"
                  class="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-brand-border px-5 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold lg:w-auto"
                  @click="
                    openApplicationDetails(application.id)
                  "
                >
                  Review Details
                </button>
              </div>
            </article>
          </template>
  
          <div
            x-show="filteredApplications.length === 0"
            class="rounded-[1.5rem] border border-dashed border-brand-border bg-brand-panel px-6 py-14 text-center"
          >
            <h2
              class="font-display text-2xl text-brand-cream"
            >
              No applications found
            </h2>
  
            <p
              class="mt-2 text-sm leading-6 text-brand-muted"
            >
              Try a different search term or status filter.
            </p>
          </div>
        </div>
      </section>
    `
}

function renderOrdersPage() {
  return `
      <section
        x-show="activePage === 'orders'"
        x-transition.opacity
        aria-labelledby="orders-page-title"
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
                Order Management
              </p>
  
              <h1
                id="orders-page-title"
                class="mt-2 font-display text-4xl text-brand-cream sm:text-5xl"
              >
                Customer orders
              </h1>
  
              <p
                class="mt-3 max-w-2xl text-sm leading-7 text-brand-muted"
              >
                Review regular perfume orders, payment details,
                delivery information, and fulfillment status.
              </p>
            </div>
  
            <div
              class="grid w-full grid-cols-2 gap-3 sm:w-auto"
            >
              <div
                class="rounded-2xl border border-brand-border bg-brand-black px-4 py-3"
              >
                <p
                  class="text-[0.6rem] uppercase tracking-[0.12em] text-brand-muted"
                >
                  Pending Review
                </p>
  
                <strong
                  class="mt-1 block font-display text-2xl text-brand-cream"
                  x-text="pendingOrderCount"
                ></strong>
              </div>
  
              <div
                class="rounded-2xl border border-brand-border bg-brand-black px-4 py-3"
              >
                <p
                  class="text-[0.6rem] uppercase tracking-[0.12em] text-brand-muted"
                >
                  Total Orders
                </p>
  
                <strong
                  class="mt-1 block font-display text-2xl text-brand-cream"
                  x-text="orders.length"
                ></strong>
              </div>
            </div>
          </div>
        </div>
  
        <div
          class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel p-4 shadow-panel sm:p-5"
        >
          <div
            class="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem]"
          >
            <label class="relative block">
              <span class="sr-only">
                Search customer orders
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
                x-model.debounce.250ms="orderSearch"
                placeholder="Search order, customer, reference, or product"
                class="min-h-12 w-full rounded-xl border border-brand-border bg-brand-black pl-11 pr-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
              >
            </label>
  
            <label class="block">
              <span class="sr-only">
                Filter orders by status
              </span>
  
              <select
                x-model="orderStatusFilter"
                class="min-h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
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
                x-text="filteredOrders.length"
              ></strong>
  
              order<span
                x-show="filteredOrders.length !== 1"
              >s</span>
            </p>
  
            <button
              x-show="
                orderSearch ||
                orderStatusFilter !== 'all'
              "
              type="button"
              class="text-xs font-semibold text-brand-gold transition hover:text-brand-gold-light"
              @click="
                orderSearch = '';
                orderStatusFilter = 'all'
              "
            >
              Clear filters
            </button>
          </div>
        </div>
  
        <div class="mt-6 space-y-4">
          <template
            x-for="order in filteredOrders"
            :key="order.id"
          >
            <article
              class="rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel transition hover:border-brand-gold/50 sm:p-6"
            >
              <div
                class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.8fr)_auto] lg:items-center"
              >
                <div class="min-w-0">
                  <div
                    class="flex flex-wrap items-center gap-3"
                  >
                    <span
                      class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.08em]"
                      :class="
                        orderStatusBadgeClass(order.status)
                      "
                    >
                      <span
                        class="size-1.5 rounded-full"
                        :class="
                          orderStatusDotClass(order.status)
                        "
                        aria-hidden="true"
                      ></span>
  
                      <span
                        x-text="
                          orderStatusLabels[order.status] ||
                          order.status
                        "
                      ></span>
                    </span>
  
                    <span
                      class="text-[0.65rem] uppercase tracking-[0.12em] text-brand-muted"
                      x-text="order.order_number"
                    ></span>
                  </div>
  
                  <h2
                    class="mt-3 truncate font-display text-2xl text-brand-cream sm:text-3xl"
                    x-text="order.customer_name"
                  ></h2>
  
                  <p
                    class="mt-1 truncate text-sm text-brand-muted"
                    x-text="order.customer_email"
                  ></p>
                </div>
  
                <div
                  class="grid grid-cols-2 gap-4 border-y border-brand-border py-4 lg:border-y-0 lg:border-l lg:py-0 lg:pl-6"
                >
                  <div>
                    <p
                      class="text-[0.62rem] uppercase tracking-[0.12em] text-brand-muted"
                    >
                      Items
                    </p>
  
                    <strong
                      class="mt-1 block text-sm text-brand-cream"
                      x-text="order.item_count"
                    ></strong>
                  </div>
  
                  <div>
                    <p
                      class="text-[0.62rem] uppercase tracking-[0.12em] text-brand-muted"
                    >
                      Total
                    </p>
  
                    <strong
                      class="mt-1 block text-sm text-brand-gold"
                      x-text="
                        formatMoney(order.total_amount)
                      "
                    ></strong>
                  </div>
  
                  <div>
                    <p
                      class="text-[0.62rem] uppercase tracking-[0.12em] text-brand-muted"
                    >
                      Region
                    </p>
  
                    <p
                      class="mt-1 text-xs font-semibold text-brand-cream"
                      x-text="order.delivery_region"
                    ></p>
                  </div>
  
                  <div>
                    <p
                      class="text-[0.62rem] uppercase tracking-[0.12em] text-brand-muted"
                    >
                      Submitted
                    </p>
  
                    <p
                      class="mt-1 text-xs text-brand-muted"
                      x-text="
                        formatDate(order.submitted_at)
                      "
                    ></p>
                  </div>
                </div>
  
                <button
                  type="button"
                  class="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-brand-border px-5 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold lg:w-auto"
                  @click="openOrderDetails(order.id)"
                >
                  Review Order
                </button>
              </div>
            </article>
          </template>
  
          <div
            x-show="filteredOrders.length === 0"
            class="rounded-[1.5rem] border border-dashed border-brand-border bg-brand-panel px-6 py-14 text-center"
          >
            <h2
              class="font-display text-2xl text-brand-cream"
            >
              No customer orders found
            </h2>
  
            <p
              class="mt-2 text-sm leading-6 text-brand-muted"
            >
              Try a different search term or status filter.
            </p>
          </div>
        </div>
      </section>
    `
}

function renderOrderDetailsDrawer() {
  return `
      <div
        x-show="orderDetailsOpen"
        x-transition.opacity
        class="fixed inset-0 z-40 bg-black/65 backdrop-blur-[2px]"
        aria-hidden="true"
        @click="closeOrderDetails()"
      ></div>
  
      <aside
        x-show="orderDetailsOpen"
        x-transition:enter="transition duration-300 ease-out"
        x-transition:enter-start="translate-x-full"
        x-transition:enter-end="translate-x-0"
        x-transition:leave="transition duration-200 ease-in"
        x-transition:leave-start="translate-x-0"
        x-transition:leave-end="translate-x-full"
        class="fixed inset-y-0 right-0 z-50 w-full max-w-2xl overflow-y-auto border-l border-brand-border bg-brand-panel shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-drawer-title"
      >
        <template x-if="selectedOrder">
          <div>
            <div
              class="sticky top-0 z-10 flex min-h-20 items-center justify-between gap-4 border-b border-brand-border bg-brand-panel/95 px-5 backdrop-blur-xl sm:px-7"
            >
              <div class="min-w-0">
                <p
                  class="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-brand-gold"
                >
                  Order Review
                </p>
  
                <h2
                  id="order-drawer-title"
                  class="mt-1 truncate font-display text-2xl text-brand-cream"
                  x-text="selectedOrder.order_number"
                ></h2>
              </div>
  
              <button
                type="button"
                class="grid size-10 shrink-0 place-items-center rounded-full border border-brand-border text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
                aria-label="Close order details"
                @click="closeOrderDetails()"
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
                    d="m6 6 12 12M18 6 6 18"
                    stroke-linecap="round"
                  ></path>
                </svg>
              </button>
            </div>
  
            <div class="space-y-5 p-5 sm:p-7">
              <section
                class="rounded-2xl border border-brand-border bg-brand-black p-5"
              >
                <div
                  class="flex flex-wrap items-start justify-between gap-4"
                >
                  <div>
                    <p
                      class="text-[0.62rem] uppercase tracking-[0.14em] text-brand-muted"
                    >
                      Order Status
                    </p>
  
                    <span
                      class="mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.08em]"
                      :class="
                        orderStatusBadgeClass(
                          selectedOrder.status,
                        )
                      "
                    >
                      <span
                        class="size-1.5 rounded-full"
                        :class="
                          orderStatusDotClass(
                            selectedOrder.status,
                          )
                        "
                        aria-hidden="true"
                      ></span>
  
                      <span
                        x-text="
                          orderStatusLabels[
                            selectedOrder.status
                          ] || selectedOrder.status
                        "
                      ></span>
                    </span>
                  </div>
  
                  <div class="text-right">
                    <p
                      class="text-[0.62rem] uppercase tracking-[0.14em] text-brand-muted"
                    >
                      Order Total
                    </p>
  
                    <strong
                      class="mt-2 block font-display text-3xl text-brand-gold"
                      x-text="
                        formatMoney(
                          selectedOrder.total_amount,
                        )
                      "
                    ></strong>
                  </div>
                </div>
  
                <p
                  class="mt-5 border-t border-brand-border pt-4 text-xs text-brand-muted"
                  x-text="
                    'Submitted ' +
                    formatDate(selectedOrder.submitted_at)
                  "
                ></p>
              </section>
  
              <section
                class="rounded-2xl border border-brand-border bg-brand-black p-5"
              >
                <p
                  class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand-gold"
                >
                  Customer Information
                </p>
  
                <dl
                  class="mt-4 grid gap-4 sm:grid-cols-2"
                >
                  <div>
                    <dt class="text-xs text-brand-muted">
                      Full name
                    </dt>
  
                    <dd
                      class="mt-1 text-sm font-semibold text-brand-cream"
                      x-text="selectedOrder.customer_name"
                    ></dd>
                  </div>
  
                  <div>
                    <dt class="text-xs text-brand-muted">
                      Mobile number
                    </dt>
  
                    <dd
                      class="mt-1 text-sm font-semibold text-brand-cream"
                      x-text="selectedOrder.customer_mobile"
                    ></dd>
                  </div>
  
                  <div class="sm:col-span-2">
                    <dt class="text-xs text-brand-muted">
                      Email address
                    </dt>
  
                    <dd
                      class="mt-1 break-all text-sm font-semibold text-brand-cream"
                      x-text="selectedOrder.customer_email"
                    ></dd>
                  </div>
                </dl>
              </section>
  
              <section
                class="rounded-2xl border border-brand-border bg-brand-black p-5"
              >
                <p
                  class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand-gold"
                >
                  Order Items
                </p>
  
                <div class="mt-4 space-y-3">
                  <template
                    x-for="item in selectedOrder.items"
                    :key="item.id"
                  >
                    <article
                      class="rounded-xl border border-brand-border bg-brand-panel p-4"
                    >
                      <div
                        class="flex items-start justify-between gap-4"
                      >
                        <div class="min-w-0">
                          <p
                            class="truncate text-sm font-semibold text-brand-cream"
                            x-text="item.product_name"
                          ></p>
  
                          <p
                            class="mt-1 text-xs text-brand-muted"
                            x-text="item.product_category"
                          ></p>
  
                          <p
                            class="mt-2 text-xs text-brand-muted"
                            x-text="
                              formatMoney(item.unit_price) +
                              ' × ' +
                              item.quantity
                            "
                          ></p>
                        </div>
  
                        <strong
                          class="shrink-0 text-sm text-brand-gold"
                          x-text="
                            formatMoney(item.line_total)
                          "
                        ></strong>
                      </div>
                    </article>
                  </template>
                </div>
  
                <dl
                  class="mt-5 space-y-3 border-t border-brand-border pt-5"
                >
                  <div
                    class="flex items-center justify-between gap-4"
                  >
                    <dt class="text-sm text-brand-muted">
                      Subtotal
                    </dt>
  
                    <dd
                      class="text-sm font-semibold text-brand-cream"
                      x-text="
                        formatMoney(selectedOrder.subtotal)
                      "
                    ></dd>
                  </div>
  
                  <div
                    class="flex items-center justify-between gap-4"
                  >
                    <dt class="text-sm text-brand-muted">
                      Delivery
                    </dt>
  
                    <dd
                      class="text-sm font-semibold text-brand-cream"
                      x-text="
                        selectedOrder.delivery_fee === 0
                          ? 'Free'
                          : formatMoney(
                              selectedOrder.delivery_fee,
                            )
                      "
                    ></dd>
                  </div>
  
                  <div
                    class="flex items-center justify-between gap-4 border-t border-brand-border pt-3"
                  >
                    <dt
                      class="text-sm font-semibold text-brand-cream"
                    >
                      Total
                    </dt>
  
                    <dd
                      class="font-display text-2xl text-brand-gold"
                      x-text="
                        formatMoney(
                          selectedOrder.total_amount,
                        )
                      "
                    ></dd>
                  </div>
                </dl>
              </section>
  
              <section
                class="rounded-2xl border border-brand-border bg-brand-black p-5"
              >
                <p
                  class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand-gold"
                >
                  Delivery Information
                </p>
  
                <dl
                  class="mt-4 grid gap-4 sm:grid-cols-2"
                >
                  <div>
                    <dt class="text-xs text-brand-muted">
                      Fulfillment
                    </dt>
  
                    <dd
                      class="mt-1 text-sm font-semibold text-brand-cream"
                      x-text="
                        fulfillmentTypeLabels[
                          selectedOrder.fulfillment_type
                        ] ||
                        selectedOrder.fulfillment_type
                      "
                    ></dd>
                  </div>
  
                  <div>
                    <dt class="text-xs text-brand-muted">
                      Region
                    </dt>
  
                    <dd
                      class="mt-1 text-sm font-semibold text-brand-cream"
                      x-text="selectedOrder.delivery_region"
                    ></dd>
                  </div>
  
                  <div class="sm:col-span-2">
                    <dt class="text-xs text-brand-muted">
                      Recipient
                    </dt>
  
                    <dd
                      class="mt-1 text-sm font-semibold text-brand-cream"
                      x-text="selectedOrder.recipient_name"
                    ></dd>
                  </div>
  
                  <div class="sm:col-span-2">
                    <dt class="text-xs text-brand-muted">
                      Delivery address
                    </dt>
  
                    <dd
                      class="mt-1 text-sm leading-6 text-brand-cream"
                      x-text="selectedOrder.delivery_address"
                    ></dd>
                  </div>
  
                  <div class="sm:col-span-2">
                    <dt class="text-xs text-brand-muted">
                      Delivery note
                    </dt>
  
                    <dd
                      class="mt-1 text-sm leading-6 text-brand-cream"
                      x-text="
                        selectedOrder.delivery_note ||
                        'No delivery note provided.'
                      "
                    ></dd>
                  </div>
                </dl>
              </section>
  
              <section
                class="rounded-2xl border border-brand-border bg-brand-black p-5"
              >
                <p
                  class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand-gold"
                >
                  Payment Information
                </p>
  
                <dl
                  class="mt-4 grid gap-4 sm:grid-cols-2"
                >
                  <div>
                    <dt class="text-xs text-brand-muted">
                      Payment method
                    </dt>
  
                    <dd
                      class="mt-1 text-sm font-semibold text-brand-cream"
                      x-text="
                        orderPaymentMethodLabels[
                          selectedOrder.payment_method
                        ] ||
                        selectedOrder.payment_method
                      "
                    ></dd>
                  </div>
  
                  <div>
                    <dt class="text-xs text-brand-muted">
                      Provider
                    </dt>
  
                    <dd
                      class="mt-1 text-sm font-semibold text-brand-cream"
                      x-text="
                        selectedOrder.payment_provider ||
                        'Not provided'
                      "
                    ></dd>
                  </div>
  
                  <div>
                    <dt class="text-xs text-brand-muted">
                      Sender name
                    </dt>
  
                    <dd
                      class="mt-1 text-sm font-semibold text-brand-cream"
                      x-text="selectedOrder.sender_name"
                    ></dd>
                  </div>
  
                  <div>
                    <dt class="text-xs text-brand-muted">
                      Reference number
                    </dt>
  
                    <dd
                      class="mt-1 break-all text-sm font-semibold text-brand-cream"
                      x-text="
                        selectedOrder.reference_number
                      "
                    ></dd>
                  </div>
                </dl>
              </section>
  
              <section
                class="rounded-2xl border border-brand-border bg-brand-black p-5"
              >
                <p
                  class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand-gold"
                >
                  Payment Proof
                </p>
  
                <div
                  x-show="selectedOrder.payment_proof_url"
                  class="mt-4 overflow-hidden rounded-xl border border-brand-border bg-brand-panel"
                >
                  <img
                    :src="selectedOrder.payment_proof_url"
                    alt="Submitted order payment proof"
                    class="max-h-80 w-full object-contain"
                  >
                </div>
  
                <div
                  x-show="!selectedOrder.payment_proof_url"
                  class="mt-4 rounded-xl border border-dashed border-brand-border bg-brand-panel px-5 py-8 text-center"
                >
                  <p
                    class="text-sm font-semibold text-brand-cream"
                  >
                    Preview image not connected yet
                  </p>
  
                  <p
                    class="mt-2 break-all text-xs leading-5 text-brand-muted"
                    x-text="
                      selectedOrder
                        .payment_proof_file_name ||
                      'No file name available'
                    "
                  ></p>
                </div>
              </section>
  
              <section
  class="rounded-2xl border border-brand-border bg-brand-black p-5"
  aria-labelledby="order-review-actions-title"
>
  <p
    class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand-gold"
  >
    Admin Review
  </p>
  
  <h3
    id="order-review-actions-title"
    class="mt-2 font-display text-2xl text-brand-cream"
  >
    Update order status
  </h3>
  
  <p
    class="mt-2 text-xs leading-5 text-brand-muted"
  >
    Review the order and payment details before
    choosing the next valid status.
  </p>
  
  <div
    x-show="!orderReviewPanelOpen"
    x-transition.opacity
    class="mt-5"
  >
    <div
      x-show="selectedOrder.status === 'pending'"
      class="grid gap-3 sm:grid-cols-2"
    >
      <button
        type="button"
        class="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-500"
        @click="openOrderReview('approve')"
      >
        Approve Payment
      </button>
  
      <button
        type="button"
        class="inline-flex min-h-11 items-center justify-center rounded-full border border-red-400/40 px-5 text-sm font-semibold text-red-300 transition hover:border-red-300 hover:bg-red-400/10 hover:text-red-200"
        @click="openOrderReview('reject')"
      >
        Reject Order
      </button>
    </div>
  
    <button
      x-show="selectedOrder.status === 'processing'"
      type="button"
      class="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand-gold px-5 text-sm font-semibold text-[#17130d] transition hover:brightness-110"
      @click="openOrderReview('ship')"
    >
      Mark as Shipped
    </button>
  
    <button
      x-show="selectedOrder.status === 'shipped'"
      type="button"
      class="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-500"
      @click="openOrderReview('deliver')"
    >
      Mark as Delivered
    </button>
  
    <div
      x-show="selectedOrder.status === 'delivered'"
      class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3"
    >
      <p class="text-sm font-semibold text-emerald-200">
        Order completed
      </p>
  
      <p class="mt-1 text-xs leading-5 text-emerald-100/80">
        This order has been marked as delivered.
      </p>
    </div>
  
    <div
      x-show="selectedOrder.status === 'rejected'"
      class="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3"
    >
      <p class="text-sm font-semibold text-red-200">
        Order rejected
      </p>
  
      <p class="mt-1 text-xs leading-5 text-red-100/80">
        No additional order action is available.
      </p>
    </div>
  </div>
  
  <div
    x-show="orderReviewPanelOpen"
    x-transition
    class="mt-5 rounded-2xl border border-brand-border bg-brand-panel p-4"
  >
    <p
      class="text-sm font-semibold text-brand-cream"
      x-text="
        orderReviewAction === 'approve'
          ? 'Approve payment and process order'
          : orderReviewAction === 'reject'
            ? 'Reject this order'
            : orderReviewAction === 'ship'
              ? 'Mark order as shipped'
              : 'Mark order as delivered'
      "
    ></p>
  
    <p
      class="mt-2 text-xs leading-5 text-brand-muted"
      x-text="
        orderReviewAction === 'approve'
          ? 'The payment will be accepted and the order will move to processing.'
          : orderReviewAction === 'reject'
            ? 'The order will be rejected after confirmation.'
            : orderReviewAction === 'ship'
              ? 'Confirm that the package has been handed over for delivery.'
              : 'Confirm that the customer has received the order.'
      "
    ></p>
  
    <label
      for="order-review-note"
      class="mt-4 block text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted"
    >
      Admin note
    </label>
  
    <textarea
      id="order-review-note"
      x-model.trim="orderReviewNote"
      rows="3"
      maxlength="300"
      placeholder="Add a short note for this status update"
      class="mt-2 w-full resize-none rounded-xl border border-brand-border bg-brand-black px-4 py-3 text-sm leading-6 text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
    ></textarea>
  
    <p
      x-show="orderReviewError"
      x-text="orderReviewError"
      class="mt-2 text-xs leading-5 text-red-300"
      role="alert"
    ></p>
  
    <div class="mt-4 grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        class="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-border px-4 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
        @click="closeOrderReview()"
      >
        Keep Current Status
      </button>
  
      <button
        type="button"
        class="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold transition"
        :class="
          orderReviewAction === 'reject'
            ? 'bg-red-700 text-white hover:bg-red-600'
            : 'bg-brand-gold text-[#17130d] hover:brightness-110'
        "
        @click="submitOrderReview()"
        x-text="
          orderReviewAction === 'approve'
            ? 'Confirm Approval'
            : orderReviewAction === 'reject'
              ? 'Confirm Rejection'
              : orderReviewAction === 'ship'
                ? 'Confirm Shipment'
                : 'Confirm Delivery'
        "
      ></button>
    </div>
  </div>
  
  <div
    x-show="selectedOrder.admin_note"
    class="mt-5 border-t border-brand-border pt-5"
  >
    <p
      class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted"
    >
      Latest Admin Note
    </p>
  
    <p
      class="mt-2 text-sm leading-6 text-brand-cream"
      x-text="selectedOrder.admin_note"
    ></p>
  
    <p
      x-show="selectedOrder.reviewed_at"
      class="mt-2 text-xs text-brand-muted"
      x-text="
        'Updated ' +
        formatDate(selectedOrder.reviewed_at)
      "
    ></p>
  </div>
</section>
            </div>
          </div>
        </template>
      </aside>
    `
}

function renderApplicationDetailsDrawer() {
  return `
      <div
        x-show="applicationDetailsOpen"
        x-transition.opacity
        class="fixed inset-0 z-40 bg-black/65 backdrop-blur-[2px]"
        aria-hidden="true"
        @click="closeApplicationDetails()"
      ></div>
  
      <aside
        x-show="applicationDetailsOpen"
        x-transition:enter="transition duration-300 ease-out"
        x-transition:enter-start="translate-x-full"
        x-transition:enter-end="translate-x-0"
        x-transition:leave="transition duration-200 ease-in"
        x-transition:leave-start="translate-x-0"
        x-transition:leave-end="translate-x-full"
        class="fixed inset-y-0 right-0 z-50 w-full max-w-xl overflow-y-auto border-l border-brand-border bg-brand-panel shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-drawer-title"
      >
        <template x-if="selectedApplication">
          <div>
            <div
              class="sticky top-0 z-10 flex min-h-20 items-center justify-between gap-4 border-b border-brand-border bg-brand-panel/95 px-5 backdrop-blur-xl sm:px-7"
            >
              <div class="min-w-0">
                <p
                  class="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-brand-gold"
                >
                  Application Review
                </p>
  
                <h2
                  id="application-drawer-title"
                  class="mt-1 truncate font-display text-2xl text-brand-cream"
                  x-text="selectedApplication.customer_name"
                ></h2>
              </div>
  
              <button
                type="button"
                class="grid size-10 shrink-0 place-items-center rounded-full border border-brand-border text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
                aria-label="Close application details"
                @click="closeApplicationDetails()"
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
                    d="m6 6 12 12M18 6 6 18"
                    stroke-linecap="round"
                  ></path>
                </svg>
              </button>
            </div>
  
            <div class="space-y-5 p-5 sm:p-7">
              <section
                class="rounded-2xl border border-brand-border bg-brand-black p-5"
              >
                <div
                  class="flex flex-wrap items-start justify-between gap-4"
                >
                  <div>
                    <p
                      class="text-[0.62rem] uppercase tracking-[0.14em] text-brand-muted"
                    >
                      Selected Package
                    </p>
  
                    <h3
                      class="mt-2 font-display text-3xl text-brand-cream"
                      x-text="
                        selectedApplication.package?.name ||
                        'Unknown package'
                      "
                    ></h3>
                  </div>
  
                  <strong
                    class="font-display text-3xl text-brand-gold"
                    x-text="
                      formatMoney(
                        selectedApplication.amount,
                      )
                    "
                  ></strong>
                </div>
  
                <div
                  class="mt-5 border-t border-brand-border pt-5"
                >
                  <span
  class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.08em]"
  :class="
    applicationStatusBadgeClass(
      selectedApplication.status,
    )
  "
>
  <span
    class="size-1.5 rounded-full"
    :class="
      applicationStatusDotClass(
        selectedApplication.status,
      )
    "
    aria-hidden="true"
  ></span>
  
                    <span
                      x-text="
                        applicationStatusLabels[
                          selectedApplication.status
                        ] || selectedApplication.status
                      "
                    ></span>
                  </span>
                </div>
              </section>
  
              <section
                class="rounded-2xl border border-brand-border bg-brand-black p-5"
              >
                <p
                  class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand-gold"
                >
                  Customer Information
                </p>
  
                <dl
                  class="mt-4 grid gap-4 sm:grid-cols-2"
                >
                  <div>
                    <dt class="text-xs text-brand-muted">
                      Full name
                    </dt>
  
                    <dd
                      class="mt-1 text-sm font-semibold text-brand-cream"
                      x-text="
                        selectedApplication.customer_name
                      "
                    ></dd>
                  </div>
  
                  <div>
                    <dt class="text-xs text-brand-muted">
                      Mobile number
                    </dt>
  
                    <dd
                      class="mt-1 text-sm font-semibold text-brand-cream"
                      x-text="
                        selectedApplication.customer_mobile
                      "
                    ></dd>
                  </div>
  
                  <div class="sm:col-span-2">
                    <dt class="text-xs text-brand-muted">
                      Email address
                    </dt>
  
                    <dd
                      class="mt-1 break-all text-sm font-semibold text-brand-cream"
                      x-text="
                        selectedApplication.customer_email
                      "
                    ></dd>
                  </div>
                </dl>
              </section>
  
              <section
                class="rounded-2xl border border-brand-border bg-brand-black p-5"
              >
                <p
                  class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand-gold"
                >
                  Payment Information
                </p>
  
                <dl
                  class="mt-4 grid gap-4 sm:grid-cols-2"
                >
                  <div>
                    <dt class="text-xs text-brand-muted">
                      Payment method
                    </dt>
  
                    <dd
                      class="mt-1 text-sm font-semibold text-brand-cream"
                      x-text="
                        paymentMethodLabels[
                          selectedApplication.payment_method
                        ] ||
                        selectedApplication.payment_method
                      "
                    ></dd>
                  </div>
  
                  <div>
                    <dt class="text-xs text-brand-muted">
                      Provider
                    </dt>
  
                    <dd
                      class="mt-1 text-sm font-semibold text-brand-cream"
                      x-text="
                        selectedApplication.payment_provider ||
                        'Not provided'
                      "
                    ></dd>
                  </div>
  
                  <div>
                    <dt class="text-xs text-brand-muted">
                      Sender name
                    </dt>
  
                    <dd
                      class="mt-1 text-sm font-semibold text-brand-cream"
                      x-text="
                        selectedApplication.sender_name
                      "
                    ></dd>
                  </div>
  
                  <div>
                    <dt class="text-xs text-brand-muted">
                      Reference number
                    </dt>
  
                    <dd
                      class="mt-1 break-all text-sm font-semibold text-brand-cream"
                      x-text="
                        selectedApplication.reference_number
                      "
                    ></dd>
                  </div>
                </dl>
              </section>
  
              <section
                class="rounded-2xl border border-brand-border bg-brand-black p-5"
              >
                <p
                  class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand-gold"
                >
                  Payment Proof
                </p>
  
                <div
                  x-show="
                    selectedApplication.payment_proof_url
                  "
                  class="mt-4 overflow-hidden rounded-xl border border-brand-border bg-brand-panel"
                >
                  <img
                    :src="
                      selectedApplication.payment_proof_url
                    "
                    alt="Submitted payment proof"
                    class="max-h-80 w-full object-contain"
                  >
                </div>
  
                <div
                  x-show="
                    !selectedApplication.payment_proof_url
                  "
                  class="mt-4 rounded-xl border border-dashed border-brand-border bg-brand-panel px-5 py-8 text-center"
                >
                  <p
                    class="text-sm font-semibold text-brand-cream"
                  >
                    Preview image not connected yet
                  </p>
  
                  <p
                    class="mt-2 break-all text-xs leading-5 text-brand-muted"
                    x-text="
                      selectedApplication
                        .payment_proof_file_name ||
                      'No file name available'
                    "
                  ></p>
                </div>
              </section>
  
              <section
                x-show="
                  selectedApplication.status ===
                  'cancellation-requested'
                "
                class="rounded-2xl border border-red-400/30 bg-red-400/5 p-5"
              >
                <p
                  class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-red-300"
                >
                  Cancellation Request
                </p>
  
                <p
                  class="mt-3 text-sm leading-6 text-brand-cream"
                  x-text="
                    selectedApplication.cancellation_reason ||
                    'No reason provided.'
                  "
                ></p>
  
                <p
                  class="mt-3 text-xs leading-5 text-brand-muted"
                >
                  Any applicable refund must be reviewed and
                  processed manually by the administrator.
                </p>
              </section>
  
              <section
  class="rounded-2xl border border-brand-border bg-brand-black p-5"
>
  <p
    class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand-gold"
  >
    Admin Review
  </p>
    
  <div
    x-show="
      selectedApplication.status ===
      'pending-verification'
    "
    class="mt-4 grid gap-3 sm:grid-cols-2"
  >
    <button
      type="button"
      class="inline-flex min-h-11 items-center justify-center rounded-full border border-red-400/40 px-5 text-sm font-semibold text-red-300 transition hover:border-red-300 hover:bg-red-400/10"
      @click="openReviewPanel('reject-payment')"
    >
      Reject Payment
    </button>
    
    <button
      type="button"
      class="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-500"
      @click="openReviewPanel('approve-membership')"
    >
      Approve Membership
    </button>
  </div>
    
  <div
    x-show="
      selectedApplication.status ===
      'cancellation-requested'
    "
    class="mt-4 grid gap-3 sm:grid-cols-2"
  >
    <button
      type="button"
      class="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-border px-5 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
      @click="
        openReviewPanel('decline-cancellation')
      "
    >
      Decline Cancellation
    </button>
    
    <button
      type="button"
      class="inline-flex min-h-11 items-center justify-center rounded-full bg-red-700 px-5 text-sm font-semibold text-white transition hover:bg-red-600"
      @click="
        openReviewPanel('approve-cancellation')
      "
    >
      Approve Cancellation
    </button>
  </div>
    
  <div
    x-show="
      selectedApplication.status === 'approved' ||
      selectedApplication.status === 'rejected' ||
      selectedApplication.status === 'cancelled'
    "
    class="mt-4 rounded-xl border border-brand-border bg-brand-panel p-4"
  >
    <p
      class="text-sm font-semibold text-brand-cream"
      x-text="
        applicationStatusLabels[
          selectedApplication.status
        ] || selectedApplication.status
      "
    ></p>
    
    <p
      class="mt-2 text-xs leading-5 text-brand-muted"
    >
      This application has already been reviewed in the
      current frontend preview session.
    </p>
    
    <div
      x-show="selectedApplication.admin_note"
      class="mt-4 border-t border-brand-border pt-4"
    >
      <p
        class="text-[0.62rem] uppercase tracking-[0.12em] text-brand-muted"
      >
        Admin Note
      </p>
    
      <p
        class="mt-2 text-sm leading-6 text-brand-cream"
        x-text="selectedApplication.admin_note"
      ></p>
    
      <p
        class="mt-3 text-xs text-brand-muted"
        x-text="
          selectedApplication.reviewed_at
            ? formatDate(
                selectedApplication.reviewed_at,
              )
            : ''
        "
      ></p>
    </div>
  </div>
    
  <form
    x-show="reviewPanelOpen"
    x-transition
    class="mt-5 rounded-2xl border border-brand-gold/30 bg-brand-panel p-4"
    @submit.prevent="confirmReviewAction()"
  >
    <h3
      class="font-display text-2xl text-brand-cream"
      x-text="reviewActionTitle"
    ></h3>
    
    <p
      class="mt-2 text-xs leading-5 text-brand-muted"
      x-text="reviewActionDescription"
    ></p>
    
    <label
      for="admin-review-note"
      class="mt-4 block text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-brand-muted"
    >
      Admin Note
    </label>
    
    <textarea
      id="admin-review-note"
      x-model="reviewNote"
      rows="4"
      maxlength="500"
      placeholder="Enter the reason or review note"
      class="mt-2 w-full resize-none rounded-xl border border-brand-border bg-brand-black px-4 py-3 text-sm leading-6 text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
    ></textarea>
    
    <p
      x-show="reviewError"
      x-text="reviewError"
      class="mt-2 text-xs leading-5 text-red-300"
      role="alert"
    ></p>
    
    <div class="mt-4 grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        class="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-border px-4 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
        @click="closeReviewPanel()"
      >
        Go Back
      </button>
    
      <button
        type="submit"
        class="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold text-white transition"
        :class="
          reviewAction === 'approve-membership'
            ? 'bg-emerald-600 hover:bg-emerald-500'
            : reviewAction ===
                'decline-cancellation'
              ? 'bg-brand-gold text-[#17130d] hover:bg-brand-gold-light'
              : 'bg-red-700 hover:bg-red-600'
        "
      >
        Confirm Action
      </button>
    </div>
  </form>
</section>
            </div>
          </div>
        </template>
      </aside>
    `
}

Alpine.data('adminDashboard', () => ({
  applications: adminMembershipApplications,
  
  applicationStatusLabels: membershipStatusLabels,
  
  paymentMethodLabels,
  
  orders: adminCustomerOrders,
  
  inventoryProducts: adminInventoryProducts,
  
  inventorySearch: '',
  
  inventoryStatusFilter: 'all',
  
  selectedInventoryProductId: null,
  
  inventoryAdjustmentOpen: false,
  
  inventoryAdjustmentType: 'restock',
  
  inventoryAdjustmentQuantity: '',
  
  inventoryAdjustmentReason: '',
  
  inventoryAdjustmentError: '',
  
  inventoryFeedback: '',
  
  inventoryMovements: [],
  
  inventoryMovementFilter: 'all',
  
  approvedOrderStatuses: [
    'processing',
    'shipped',
    'delivered',
  ],
  
  orderStatusLabels,
  
  fulfillmentTypeLabels,
  
  orderPaymentMethodLabels,
  
  selectedApplicationId: null,
  
  applicationDetailsOpen: false,
  
  applicationSearch: '',
  
  applicationStatusFilter: 'all',
  
  selectedOrderId: null,
  
  orderDetailsOpen: false,
  
  orderSearch: '',
  
  orderStatusFilter: 'all',
  
  orderReviewPanelOpen: false,
  orderReviewAction: '',
  orderReviewNote: '',
  orderReviewError: '',
  
  reviewPanelOpen: false,
  
  reviewAction: '',
  
  reviewNote: '',
  
  reviewError: '',
  
  activePage: 'overview',
  
  mobileMenuOpen: false,
  
  get filteredApplications() {
    const normalizedSearch =
    this.applicationSearch.trim().toLowerCase()
    
    return this.applications.filter((application) => {
      const matchesStatus =
      this.applicationStatusFilter === 'all' ||
      application.status === this.applicationStatusFilter
      
      const searchableContent = [
        application.customer_name,
        application.customer_email,
        application.customer_mobile,
        application.reference_number,
        application.package?.name,
        application.id,
      ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      
      const matchesSearch =
      !normalizedSearch ||
      searchableContent.includes(normalizedSearch)
      
      return matchesStatus && matchesSearch
    })
  },
  
  get selectedApplication() {
    return (
      this.applications.find(
        (application) =>
          application.id === this.selectedApplicationId,
      ) || null
    )
  },
  
  get pendingVerificationCount() {
    return this.applications.filter(
      (application) =>
        application.status === 'pending-verification',
    ).length
  },
  
  get cancellationRequestCount() {
    return this.applications.filter(
      (application) =>
        application.status === 'cancellation-requested',
    ).length
  },
  
  get filteredOrders() {
    const normalizedSearch =
    this.orderSearch.trim().toLowerCase()
    
    return this.orders.filter((order) => {
      const matchesStatus =
      this.orderStatusFilter === 'all' ||
      order.status === this.orderStatusFilter
      
      const searchableContent = [
        order.order_number,
        order.customer_name,
        order.customer_email,
        order.customer_mobile,
        order.reference_number,
        order.delivery_region,
        ...order.items.map(
          (item) => item.product_name,
        ),
      ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      
      const matchesSearch =
      !normalizedSearch ||
      searchableContent.includes(normalizedSearch)
      
      return matchesStatus && matchesSearch
    })
  },
  
  get selectedOrder() {
    return (
      this.orders.find(
        (order) => order.id === this.selectedOrderId,
      ) || null
    )
  },
  
  get pendingOrderCount() {
    return this.orders.filter(
      (order) =>
        order.status === 'pending-verification',
    ).length
  },
  
  get approvedOrders() {
    return this.orders.filter(
      (order) =>
        this.approvedOrderStatuses.includes(
        order.status,
      ),
    )
  },
  
  get approvedSalesTotal() {
    return this.approvedOrders.reduce(
      (total, order) =>
        total + Number(order.subtotal || 0),
      0,
    )
  },
  
  get approvedProductCost() {
    return this.approvedOrders.reduce(
      (orderTotal, order) => {
        const itemCost = order.items.reduce(
          (itemTotal, item) =>
            itemTotal +
          Number(item.unit_cost || 0) *
          Number(item.quantity || 0),
          0,
        )
        
        return orderTotal + itemCost
      },
      0,
    )
  },
  
  get estimatedGrossProfit() {
    return (
      this.approvedSalesTotal -
      this.approvedProductCost
    )
  },
  
  get monthlyApprovedSales() {
    const now = new Date()
    
    return this.approvedOrders.reduce(
      (total, order) => {
        const approvedDateValue =
        order.approved_at ||
        order.reviewed_at ||
        order.updated_at
        
        if (!approvedDateValue) {
          return total
        }
        
        const approvedDate =
        new Date(approvedDateValue)
        
        const isCurrentMonth =
        approvedDate.getFullYear() ===
        now.getFullYear() &&
        approvedDate.getMonth() ===
        now.getMonth()
        
        return isCurrentMonth
        ? total + Number(order.subtotal || 0)
        : total
      },
      0,
    )
  },
  
  get approvedUnitsSold() {
    return this.approvedOrders.reduce(
      (orderTotal, order) => {
        const itemQuantity = order.items.reduce(
          (itemTotal, item) =>
            itemTotal +
          Number(item.quantity || 0),
          0,
        )
        
        return orderTotal + itemQuantity
      },
      0,
    )
  },
  
  get availableStockUnits() {
    return this.inventoryProducts.reduce(
      (total, product) =>
        total +
      Number(product.stockQuantity || 0),
      0,
    )
  },
  
  get lowStockProductCount() {
    return this.inventoryProducts.filter(
      (product) =>
        this.inventoryStatus(product) ===
      'low-stock',
    ).length
  },
  
  get outOfStockProductCount() {
    return this.inventoryProducts.filter(
      (product) =>
        this.inventoryStatus(product) ===
      'out-of-stock',
    ).length
  },
  
  get filteredInventoryProducts() {
    const normalizedSearch =
    this.inventorySearch
    .trim()
    .toLowerCase()
    
    return this.inventoryProducts.filter(
      (product) => {
        const productStatus =
        this.inventoryStatus(product)
        
        const matchesStatus =
        this.inventoryStatusFilter ===
        'all' ||
        productStatus ===
        this.inventoryStatusFilter
        
        const searchableContent = [
          product.name,
          product.sku,
          product.collectionLabel,
          product.category,
        ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        
        const matchesSearch =
        !normalizedSearch ||
        searchableContent.includes(
          normalizedSearch,
        )
        
        return matchesStatus && matchesSearch
      },
    )
  },
  
  inventoryStatus(product) {
    const stockQuantity =
    Number(product.stockQuantity || 0)
    
    const lowStockThreshold =
    Number(product.lowStockThreshold || 0)
    
    if (stockQuantity <= 0) {
      return 'out-of-stock'
    }
    
    if (stockQuantity <= lowStockThreshold) {
      return 'low-stock'
    }
    
    return 'in-stock'
  },
  
  inventoryStatusLabel(status) {
    const statusLabels = {
      'in-stock': 'In Stock',
      'low-stock': 'Low Stock',
      'out-of-stock': 'Out of Stock',
    }
    
    return statusLabels[status] || status
  },
  
  inventoryStatusBadgeClass(status) {
    const statusClasses = {
      'in-stock':
      'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
      
      'low-stock':
      'border-amber-500/30 bg-amber-500/10 text-amber-300',
      
      'out-of-stock':
      'border-red-500/30 bg-red-500/10 text-red-300',
    }
    
    return (
      statusClasses[status] ||
      'border-brand-border text-brand-muted'
    )
  },
  
  inventoryStatusDotClass(status) {
    const statusClasses = {
      'in-stock': 'bg-emerald-400',
      'low-stock': 'bg-amber-400',
      'out-of-stock': 'bg-red-400',
    }
    
    return (
      statusClasses[status] ||
      'bg-brand-muted'
    )
  },
  
  get filteredInventoryMovements() {
    if (this.inventoryMovementFilter === 'all') {
      return this.inventoryMovements
    }
    
    return this.inventoryMovements.filter(
      (movement) =>
        movement.type ===
      this.inventoryMovementFilter,
    )
  },
  
  get selectedInventoryProduct() {
    return (
      this.inventoryProducts.find(
        (product) =>
          product.id ===
        this.selectedInventoryProductId,
      ) || null
    )
  },
  
  get projectedInventoryStock() {
    if (!this.selectedInventoryProduct) {
      return 0
    }
    
    const currentStock = Number(
      this.selectedInventoryProduct
      .stockQuantity || 0,
    )
    
    const quantity = Number.parseInt(
      this.inventoryAdjustmentQuantity,
      10,
    )
    
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return currentStock
    }
    
    if (this.inventoryAdjustmentType === 'remove') {
      return currentStock - quantity
    }
    
    return currentStock + quantity
  },
  
  unitsSoldForProduct(productId) {
    return this.approvedOrders.reduce(
      (orderTotal, order) => {
        const itemQuantity = order.items
        .filter(
          (item) =>
            item.product_id === productId,
        )
        .reduce(
          (itemTotal, item) =>
            itemTotal +
          Number(item.quantity || 0),
          0,
        )
        
        return orderTotal + itemQuantity
      },
      0,
    )
  },
  
  inventoryMovementTypeLabel(type) {
    const typeLabels = {
      restock: 'Restock',
      add: 'Added Adjustment',
      remove: 'Removed Adjustment',
      'order-sale': 'Approved Order',
      'cancellation-return': 'Returned Stock',
    }
    
    return typeLabels[type] || type
  },
  
  inventoryMovementBadgeClass(type) {
    const typeClasses = {
      restock:
      'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
      
      add:
      'border-blue-500/30 bg-blue-500/10 text-blue-300',
      
      remove:
      'border-red-500/30 bg-red-500/10 text-red-300',
      
      'order-sale':
      'border-violet-500/30 bg-violet-500/10 text-violet-300',
      
      'cancellation-return':
      'border-amber-500/30 bg-amber-500/10 text-amber-300',
    }
    
    return (
      typeClasses[type] ||
      'border-brand-border text-brand-muted'
    )
  },
  
  openInventoryAdjustment(
    productId,
    adjustmentType = 'restock',
  ) {
    const productExists =
    this.inventoryProducts.some(
      (product) =>
        product.id === productId,
    )
    
    if (!productExists) {
      return
    }
    
    this.selectedInventoryProductId = productId
    this.inventoryAdjustmentType = adjustmentType
    this.inventoryAdjustmentQuantity = ''
    this.inventoryAdjustmentReason = ''
    this.inventoryAdjustmentError = ''
    this.inventoryAdjustmentOpen = true
    
    document.body.classList.add('overflow-hidden')
  },
  
  closeInventoryAdjustment() {
    this.inventoryAdjustmentOpen = false
    this.inventoryAdjustmentError = ''
    
    if (
      !this.mobileMenuOpen &&
      !this.applicationDetailsOpen &&
      !this.orderDetailsOpen
    ) {
      document.body.classList.remove(
        'overflow-hidden',
      )
    }
    
    window.setTimeout(() => {
      if (!this.inventoryAdjustmentOpen) {
        this.selectedInventoryProductId = null
        this.inventoryAdjustmentQuantity = ''
        this.inventoryAdjustmentReason = ''
      }
    }, 250)
  },
  
  saveInventoryAdjustment() {
    const product =
    this.selectedInventoryProduct
    
    if (!product) {
      this.inventoryAdjustmentError =
      'The selected product is unavailable.'
      return
    }
    
    const quantity = Number.parseInt(
      this.inventoryAdjustmentQuantity,
      10,
    )
    
    if (!Number.isInteger(quantity) || quantity <= 0) {
      this.inventoryAdjustmentError =
      'Enter a valid quantity greater than zero.'
      return
    }
    
    const reason =
    this.inventoryAdjustmentReason.trim()
    
    if (!reason) {
      this.inventoryAdjustmentError =
      'Enter a reason for this stock update.'
      return
    }
    
    const previousStock = Number(
      product.stockQuantity || 0,
    )
    
    const stockChange =
    this.inventoryAdjustmentType === 'remove'
    ? -quantity
    : quantity
    
    const newStock =
    previousStock + stockChange
    
    if (newStock < 0) {
      this.inventoryAdjustmentError =
      'The quantity to remove is greater than the available stock.'
      return
    }
    
    const movement = {
      id: `inventory-movement-${Date.now()}`,
      product_id: product.id,
      product_name: product.name,
      type: this.inventoryAdjustmentType,
      quantity: stockChange,
      previous_stock: previousStock,
      new_stock: newStock,
      reason,
      created_at: new Date().toISOString(),
    }
    
    this.inventoryProducts =
    this.inventoryProducts.map(
      (inventoryProduct) =>
        inventoryProduct.id === product.id
      ? {
        ...inventoryProduct,
        stockQuantity: newStock,
      }
      : inventoryProduct,
    )
    
    this.inventoryMovements.unshift(movement)
    
    this.inventoryFeedback =
    `${product.name} stock updated from ` +
    `${previousStock} to ${newStock}.`
    
    this.closeInventoryAdjustment()
    
    window.setTimeout(() => {
      this.inventoryFeedback = ''
    }, 4000)
  },
  
  orderStatusBadgeClass(status) {
    const statusClasses = {
      'pending-verification':
      'border-amber-500/40 bg-amber-500/10 text-amber-300',
      
      processing:
      'border-blue-500/30 bg-blue-500/10 text-blue-300',
      
      shipped:
      'border-violet-500/30 bg-violet-500/10 text-violet-300',
      
      delivered:
      'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
      
      rejected:
      'border-red-500/30 bg-red-500/10 text-red-300',
      
      cancelled:
      'border-brand-border bg-brand-panel text-brand-muted',
    }
    
    return (
      statusClasses[status] ||
      'border-brand-border bg-brand-panel text-brand-muted'
    )
  },
  
  orderStatusDotClass(status) {
    const statusClasses = {
      'pending-verification': 'bg-amber-400',
      processing: 'bg-blue-400',
      shipped: 'bg-violet-400',
      delivered: 'bg-emerald-400',
      rejected: 'bg-red-400',
      cancelled: 'bg-brand-muted',
    }
    
    return statusClasses[status] || 'bg-brand-muted'
  },
  
  openOrderReview(action) {
    if (!this.selectedOrder) {
      return
    }
    
    this.orderReviewAction = action
    this.orderReviewNote = ''
    this.orderReviewError = ''
    this.orderReviewPanelOpen = true
  },
  
  closeOrderReview() {
    this.orderReviewPanelOpen = false
    this.orderReviewAction = ''
    this.orderReviewNote = ''
    this.orderReviewError = ''
  },
  
  submitOrderReview() {
    const order = this.selectedOrder
    
    if (!order) {
      return
    }
    
    if (!this.orderReviewNote.trim()) {
      this.orderReviewError =
      'Add an admin note before updating this order.'
      return
    }
    
    const nextStatusByAction = {
      approve: 'processing',
      reject: 'rejected',
      ship: 'shipped',
      deliver: 'delivered',
    }
    
    const allowedActionByStatus = {
      pending: ['approve', 'reject'],
      processing: ['ship'],
      shipped: ['deliver'],
    }
    
    const allowedActions =
    allowedActionByStatus[order.status] || []
    
    if (!allowedActions.includes(this.orderReviewAction)) {
      this.orderReviewError =
      'This action is not available for the current order status.'
      return
    }
    
    const nextStatus =
    nextStatusByAction[this.orderReviewAction]
    
    const orderIndex = this.orders.findIndex(
      (orderItem) => orderItem.id === order.id,
    )
    
    if (orderIndex === -1 || !nextStatus) {
      this.orderReviewError =
      'Unable to update this order.'
      return
    }
    
    this.orders[orderIndex] = {
      ...this.orders[orderIndex],
      status: nextStatus,
      admin_note: this.orderReviewNote.trim(),
      reviewed_at: new Date().toISOString(),
    }
    
    this.closeOrderReview()
  },
  
  openOrderDetails(orderId) {
    this.closeApplicationDetails()
    this.selectedOrderId = orderId
    this.orderDetailsOpen = true
    document.body.classList.add('overflow-hidden')
  },
  
  closeOrderDetails() {
    this.closeOrderReview()
    this.orderDetailsOpen = false
    
    if (
      !this.mobileMenuOpen &&
      !this.applicationDetailsOpen
    ) {
      document.body.classList.remove('overflow-hidden')
    }
    
    window.setTimeout(() => {
      if (!this.orderDetailsOpen) {
        this.selectedOrderId = null
      }
    }, 250)
  },
  
  get reviewActionTitle() {
    const titles = {
      'approve-membership': 'Approve membership',
      'reject-payment': 'Reject payment',
      'approve-cancellation': 'Approve cancellation',
      'decline-cancellation': 'Decline cancellation',
    }
    
    return titles[this.reviewAction] || 'Review application'
  },
  
  get reviewActionDescription() {
    const descriptions = {
      'approve-membership':
      'The customer membership will be marked as approved.',
      
      'reject-payment':
      'The submitted payment will be rejected and the membership will remain inactive.',
      
      'approve-cancellation':
      'The application will be cancelled. Any applicable refund must still be processed manually.',
      
      'decline-cancellation':
      'The cancellation request will be declined and the application will return to payment verification.',
    }
    
    return descriptions[this.reviewAction] || ''
  },
  
  openReviewPanel(actionName) {
    if (!this.selectedApplication) {
      return
    }
    
    const allowedActions = {
      'pending-verification': [
        'approve-membership',
        'reject-payment',
      ],
      
      'cancellation-requested': [
        'approve-cancellation',
        'decline-cancellation',
      ],
    }
    
    const statusActions =
    allowedActions[this.selectedApplication.status] || []
    
    if (!statusActions.includes(actionName)) {
      return
    }
    
    this.reviewAction = actionName
    this.reviewNote = ''
    this.reviewError = ''
    this.reviewPanelOpen = true
  },
  
  closeReviewPanel() {
    this.reviewPanelOpen = false
    this.reviewAction = ''
    this.reviewNote = ''
    this.reviewError = ''
  },
  
  confirmReviewAction() {
    const normalizedNote = this.reviewNote.trim()
    
    if (!this.selectedApplication) {
      this.reviewError = 'Application details are unavailable.'
      return
    }
    
    if (normalizedNote.length < 3) {
      this.reviewError =
      'Enter a short admin note before confirming.'
      return
    }
    
    const nextStatuses = {
      'approve-membership': 'approved',
      'reject-payment': 'rejected',
      'approve-cancellation': 'cancelled',
      'decline-cancellation': 'pending-verification',
    }
    
    const nextStatus = nextStatuses[this.reviewAction]
    
    if (!nextStatus) {
      this.reviewError = 'Select a valid review action.'
      return
    }
    
    const applicationIndex = this.applications.findIndex(
      (application) =>
        application.id === this.selectedApplicationId,
    )
    
    if (applicationIndex === -1) {
      this.reviewError = 'Application could not be found.'
      return
    }
    
    this.applications[applicationIndex] = {
      ...this.applications[applicationIndex],
      status: nextStatus,
      admin_note: normalizedNote,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    this.closeReviewPanel()
  },
  
  applicationStatusBadgeClass(status) {
    const statusClasses = {
      'awaiting-payment':
      'border-amber-500/40 bg-amber-500/10 text-amber-300',
      
      'pending-verification':
      'border-amber-500/40 bg-amber-500/10 text-amber-300',
      
      'cancellation-requested':
      'border-red-400/30 bg-red-400/10 text-red-300',
      
      approved:
      'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
      
      rejected:
      'border-red-500/30 bg-red-500/10 text-red-300',
      
      cancelled:
      'border-brand-border bg-brand-panel text-brand-muted',
    }
    
    return (
      statusClasses[status] ||
      'border-brand-border bg-brand-panel text-brand-muted'
    )
  },
  
  applicationStatusDotClass(status) {
    const statusClasses = {
      'awaiting-payment': 'bg-amber-400',
      'pending-verification': 'bg-amber-400',
      'cancellation-requested': 'bg-red-400',
      approved: 'bg-emerald-400',
      rejected: 'bg-red-400',
      cancelled: 'bg-brand-muted',
    }
    
    return statusClasses[status] || 'bg-brand-muted'
  },
  
  formatMoney(amount) {
    return adminPesoFormatter.format(amount || 0)
  },
  
  formatDate(dateValue) {
    if (!dateValue) {
      return 'Not available'
    }
    
    return adminDateFormatter.format(new Date(dateValue))
  },
  
  openApplicationDetails(applicationId) {
    this.selectedApplicationId = applicationId
    this.applicationDetailsOpen = true
    document.body.classList.add('overflow-hidden')
  },
  
  closeApplicationDetails() {
    this.closeReviewPanel()
    this.applicationDetailsOpen = false
    
    if (
      !this.mobileMenuOpen &&
      !this.orderDetailsOpen
    ) {
      document.body.classList.remove('overflow-hidden')
    }
    
    window.setTimeout(() => {
      if (!this.applicationDetailsOpen) {
        this.selectedApplicationId = null
      }
    }, 250)
  },
  
  get activePageTitle() {
    return adminPageTitles[this.activePage] || 'Overview'
  },
  
  openPage(pageName) {
    if (!adminPageTitles[pageName]) {
      return
    }
    
    this.closeApplicationDetails()
    this.closeOrderDetails()
    this.closeInventoryAdjustment()
    this.activePage = pageName
    this.closeMobileMenu()
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  },
  
  openMobileMenu() {
    this.closeApplicationDetails()
    this.closeOrderDetails()
    this.mobileMenuOpen = true
    document.body.classList.add('overflow-hidden')
  },
  
  closeMobileMenu() {
    this.mobileMenuOpen = false
    
    if (!this.applicationDetailsOpen) {
      document.body.classList.remove('overflow-hidden')
    }
  },
  
  destroy() {
    document.body.classList.remove('overflow-hidden')
  },
}))

document.title = `Admin Dashboard | ${siteConfig.brand.name}`

document.querySelector('#admin-app').innerHTML = `
  <div
    x-data="adminDashboard"
    x-cloak
    class="min-h-screen bg-brand-black text-brand-cream"
    @keydown.escape.window="closeMobileMenu(); closeApplicationDetails(); closeOrderDetails(); closeInventoryAdjustment()"
  >
    <aside
      class="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-brand-border bg-brand-panel lg:block"
    >
      ${renderAdminSidebar()}
    </aside>

    <div
      x-show="mobileMenuOpen"
      x-transition.opacity
      class="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] lg:hidden"
      aria-hidden="true"
      @click="closeMobileMenu()"
    ></div>

    <aside
      x-show="mobileMenuOpen"
      x-transition:enter="transition duration-300 ease-out"
      x-transition:enter-start="-translate-x-full"
      x-transition:enter-end="translate-x-0"
      x-transition:leave="transition duration-200 ease-in"
      x-transition:leave-start="translate-x-0"
      x-transition:leave-end="-translate-x-full"
      class="fixed inset-y-0 left-0 z-50 w-[min(18rem,86vw)] border-r border-brand-border bg-brand-panel shadow-2xl lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Admin dashboard menu"
    >
      ${renderAdminSidebar()}
    </aside>

    <div class="min-h-screen lg:pl-72">
      <header
        class="sticky top-0 z-20 border-b border-brand-border bg-brand-panel/95 backdrop-blur-xl"
      >
        <div
          class="mx-auto flex min-h-16 w-[min(1280px,92%)] items-center justify-between gap-4"
        >
          <div class="flex min-w-0 items-center gap-3">
            <button
              type="button"
              class="grid size-10 shrink-0 place-items-center rounded-full border border-brand-border text-brand-cream transition hover:border-brand-gold hover:text-brand-gold lg:hidden"
              aria-label="Open admin menu"
              @click="openMobileMenu()"
            >
              <svg
                class="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                aria-hidden="true"
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke-linecap="round"
                />
              </svg>
            </button>

            <div class="min-w-0">
              <p
                class="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
              >
                Admin Portal
              </p>

              <p
                class="truncate text-sm font-semibold text-brand-cream"
                x-text="activePageTitle"
              ></p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span
              class="hidden rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-brand-gold sm:inline-flex"
            >
              UI Preview
            </span>

            <a
              href="/"
              class="text-xs font-semibold text-brand-muted transition hover:text-brand-gold sm:text-sm"
            >
              View Store
            </a>
          </div>
        </div>
      </header>

      <main
        class="mx-auto w-[min(1280px,92%)] py-8 sm:py-10"
      >
        <section
          x-show="activePage === 'overview'"
          x-transition.opacity
          aria-labelledby="admin-overview-title"
        >
          <div
            class="relative isolate overflow-hidden rounded-[1.75rem] border border-brand-gold/30 bg-brand-panel p-6 shadow-gold-soft sm:p-8 lg:p-10"
          >
            <div
              class="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-brand-gold/10 blur-3xl"
              aria-hidden="true"
            ></div>

            <div class="relative">
              <p
                class="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-brand-gold"
              >
                Administration
              </p>

              <h1
                id="admin-overview-title"
                class="mt-3 font-display text-4xl leading-none text-brand-cream sm:text-5xl"
              >
                Business overview
              </h1>

              <p
                class="mt-4 max-w-2xl text-sm leading-7 text-brand-muted sm:text-base"
              >
                Review membership applications, customer orders,
                accounts, and products from one central workspace.
              </p>
            </div>
          </div>

          <div
            class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            <article
              class="rounded-[1.4rem] border border-brand-border bg-brand-panel p-5 shadow-panel"
            >
              <p
                class="text-xs uppercase tracking-[0.13em] text-brand-muted"
              >
                Pending Applications
              </p>

              <strong
                class="mt-4 block font-display text-4xl text-brand-cream"
                x-text="pendingVerificationCount"
              >
              </strong>

              <p class="mt-2 text-xs leading-5 text-brand-muted">
                Waiting for payment review
              </p>
            </article>

            <article
              class="rounded-[1.4rem] border border-brand-border bg-brand-panel p-5 shadow-panel"
            >
              <p
                class="text-xs uppercase tracking-[0.13em] text-brand-muted"
              >
                Cancellation Requests
              </p>

              <strong
                class="mt-4 block font-display text-4xl text-brand-cream"
                x-text="cancellationRequestCount"
              >
              </strong>

              <p class="mt-2 text-xs leading-5 text-brand-muted">
                Waiting for manual review
              </p>
            </article>

            <article
              class="rounded-[1.4rem] border border-brand-border bg-brand-panel p-5 shadow-panel"
            >
              <p
                class="text-xs uppercase tracking-[0.13em] text-brand-muted"
              >
                Pending Orders
              </p>

              <strong
                class="mt-4 block font-display text-4xl text-brand-cream"
              >
                3
              </strong>

              <p class="mt-2 text-xs leading-5 text-brand-muted">
                Regular product orders
              </p>
            </article>

            <article
              class="rounded-[1.4rem] border border-brand-gold/40 bg-brand-panel p-5 shadow-gold-soft"
            >
              <p
                class="text-xs uppercase tracking-[0.13em] text-brand-muted"
              >
                Active Members
              </p>

              <strong
                class="mt-4 block font-display text-4xl text-brand-gold"
              >
                24
              </strong>

              <p class="mt-2 text-xs leading-5 text-brand-muted">
                Approved memberships
              </p>
            </article>
          </div>

          <div
            class="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
          >
            <section
              class="rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
            >
              <p
                class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
              >
                Priority Queue
              </p>

              <h2
                class="mt-2 font-display text-3xl text-brand-cream"
              >
                Items requiring attention
              </h2>

              <div class="mt-5 space-y-3">
                <button
                  type="button"
                  class="flex w-full items-center justify-between gap-4 rounded-xl border border-brand-border bg-brand-black px-4 py-4 text-left transition hover:border-brand-gold"
                  @click="openPage('memberships')"
                >
                  <span>
                    <strong
                      class="block text-sm text-brand-cream"
                    >
                      Membership applications
                    </strong>

                    <span
                      class="mt-1 block text-xs text-brand-muted"
                    >
                      Review payment proofs and package selections
                    </span>
                  </span>

                  <span
                    class="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300"
                    x-text="pendingVerificationCount"
                  >
                  </span>
                </button>

                <button
                  type="button"
                  class="flex w-full items-center justify-between gap-4 rounded-xl border border-brand-border bg-brand-black px-4 py-4 text-left transition hover:border-brand-gold"
                  @click="openPage('orders')"
                >
                  <span>
                    <strong
                      class="block text-sm text-brand-cream"
                    >
                      Customer orders
                    </strong>

                    <span
                      class="mt-1 block text-xs text-brand-muted"
                    >
                      Verify orders and payment submissions
                    </span>
                  </span>

                  <span
                    class="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300"
                  >
                    3
                  </span>
                </button>
              </div>
            </section>

            <aside
              class="rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
            >
              <p
                class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
              >
                System Status
              </p>

              <h2
                class="mt-2 font-display text-3xl text-brand-cream"
              >
                Frontend preview
              </h2>

              <div
                class="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4"
              >
                <div class="flex items-center gap-3">
                  <span
                    class="size-2 rounded-full bg-emerald-400"
                    aria-hidden="true"
                  ></span>

                  <strong class="text-sm text-emerald-200">
                    Interface ready
                  </strong>
                </div>

                <p
                  class="mt-2 text-xs leading-5 text-emerald-100/80"
                >
                  Supabase authentication and database actions are not
                  connected yet.
                </p>
              </div>
            </aside>
          </div>
        </section>

        ${renderMembershipApplicationsPage()}

${renderOrdersPage()}

${renderAdminSalesInventoryPage()}

${renderAdminInventoryMovementHistory()}

${adminNavigationItems
  .filter(
    (item) =>
      item.id !== 'overview' &&
    item.id !== 'memberships' &&
    item.id !== 'orders' &&
    item.id !== 'sales-inventory',
  )
  .map(
    (item) => `
      <section
        x-show="activePage === '${item.id}'"
        x-transition.opacity
        aria-labelledby="${item.id}-page-title"
      >
        <div
          class="rounded-[1.75rem] border border-brand-border bg-brand-panel p-6 shadow-panel sm:p-8"
        >
          <p
            class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold"
          >
            Admin Management
          </p>
        
          <h1
            id="${item.id}-page-title"
            class="mt-2 font-display text-4xl text-brand-cream sm:text-5xl"
          >
            ${item.label}
          </h1>
        
          <p
            class="mt-3 max-w-2xl text-sm leading-7 text-brand-muted"
          >
            This management page will be added in the next
            admin dashboard checkpoint.
          </p>
        </div>
      </section>
    `,
  )
  .join('')}
            </main>
    </div>
    
    ${renderApplicationDetailsDrawer()}
    
    ${renderOrderDetailsDrawer()}
    ${renderAdminInventoryAdjustmentDrawer()}
  </div>
`
  
  Alpine.start()