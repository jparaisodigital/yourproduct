import './style.css'

import Alpine from 'alpinejs'

import { supabase } from './lib/supabase.js'

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
  packageSupplies,
} from './config/package-supplies-config.js'

import {
  renderAdminSalesInventoryPage,
} from './components/admin-sales-inventory-page.js'

import {
  renderAdminCustomersPage,
} from './components/admin-customers-page.js'

import {
  renderAdminProductsPage,
} from './components/admin-products-page.js'

import {
  renderAdminInventoryAdjustmentDrawer,
} from './components/admin-inventory-adjustment-drawer.js'

import {
  renderAdminPackageFulfillmentPanel,
} from './components/admin-package-fulfillment-panel.js'

import {
  membershipStatusLabels,
  membershipFulfillmentStatusLabels,
  paymentMethodLabels,
} from './config/admin-preview-data.js'

import {
  orderStatusLabels,
  fulfillmentTypeLabels,
  orderPaymentMethodLabels,
} from './config/admin-orders-preview-data.js'

import {
  registerAdminReferralsPayoutsPage,
  renderAdminReferralsPayoutsPage,
} from './components/admin-referrals-payouts-page.js'

import {
  registerAdminPointsAuditPage,
  renderAdminPointsAuditPage,
} from './components/admin-points-audit-page.js'

const adminInventoryProducts = products.map(
  (product) => ({
    ...product,
  }),
)

const adminPackageSupplies = packageSupplies.map(
  (supply) => ({
    ...supply,
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

registerAdminReferralsPayoutsPage(Alpine)

registerAdminPointsAuditPage(Alpine)

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
    id: 'referrals-payouts',
    label: 'Referrals & Payouts',
  },
  {
    id: 'points-audit',
    label: 'Points Audit',
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
  'referrals-payouts': 'Referrals & Payouts',
  'points-audit': 'Points Audit',
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
            Admin Workspace
          </p>

          <p class="mt-1 text-xs text-brand-muted">
            Orders, customers, products, and inventory are connected. Other sections are in progress.
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
  <!-- Payment/application status -->
  <span
    class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.08em]"
    :class="
      applicationStatusBadgeClass(
        application.status
      )
    "
  >
    <span
      class="size-1.5 shrink-0 rounded-full"
      :class="
        applicationStatusDotClass(
          application.status
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

  <!-- Package fulfillment status -->
  <span
    x-show="
      application.status === 'approved' &&
      application.fulfillment_status &&
      application.fulfillment_status !==
        'not-ready'
    "
    class="inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.08em]"
    :class="
      application.fulfillment_status ===
      'pending-allocation'
        ? 'text-amber-300'
        : application.fulfillment_status ===
          'ready-for-packing'
          ? 'text-brand-gold'
          : application.fulfillment_status ===
            'shipped'
            ? 'text-blue-300'
            : application.fulfillment_status ===
              'completed'
              ? 'text-emerald-300'
              : 'text-brand-muted'
    "
  >
    <span
      class="size-1.5 shrink-0 rounded-full"
      :class="
        application.fulfillment_status ===
        'pending-allocation'
          ? 'bg-amber-400'
          : application.fulfillment_status ===
            'ready-for-packing'
            ? 'bg-brand-gold'
            : application.fulfillment_status ===
              'shipped'
              ? 'bg-blue-400'
              : application.fulfillment_status ===
                'completed'
                ? 'bg-emerald-400'
                : 'bg-brand-muted'
      "
      aria-hidden="true"
    ></span>

    <span
      x-text="
        'Package · ' +
        membershipFulfillmentStatusLabel(
          application.fulfillment_status
        )
      "
    ></span>
  </span>

  <!-- Application reference -->
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
            x-show="!applicationsLoading && !applicationsError && filteredApplications.length === 0"
            class="rounded-[1.5rem] border border-dashed border-brand-border bg-brand-panel px-6 py-14 text-center"
          >
            <h2
              class="font-display text-2xl text-brand-cream"
            >
              Applications will appear here after customers submit payment details.
            </h2>

            <p
              class="mt-2 text-sm leading-6 text-brand-muted"
            >
              Orders will appear here after customers submit them.
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
                Live order records from Supabase. Review status
                and amounts here; approval actions come later.
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
                  x-text="
                    liveOrdersLoading || liveOrdersError
                      ? '—'
                      : liveOrders.filter(
                          (order) =>
                            order.status ===
                            'pending_verification',
                        ).length
                  "
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
                  x-text="
                    liveOrdersLoading || liveOrdersError
                      ? '—'
                      : liveOrders.length
                  "
                ></strong>
              </div>
            </div>
          </div>
        </div>

        <div
          x-show="liveOrdersLoading"
          class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel px-6 py-14 text-center"
        >
          <p class="text-sm text-brand-muted">
            Loading orders…
          </p>
        </div>

        <div
          x-show="!liveOrdersLoading && liveOrdersError"
          class="mt-6 rounded-[1.5rem] border border-red-400/30 bg-brand-panel p-5 text-sm text-red-300"
          role="alert"
          x-text="liveOrdersError"
        ></div>

        <div
          x-show="
            !liveOrdersLoading &&
            !liveOrdersError &&
            liveOrders.length === 0
          "
          class="mt-6 rounded-[1.5rem] border border-dashed border-brand-border bg-brand-panel px-6 py-14 text-center"
        >
          <h2 class="font-display text-2xl text-brand-cream">
  No customer orders found
</h2>

<p class="mt-2 text-sm leading-6 text-brand-muted">
  Orders will appear here after customers submit them.
</p>
        </div>

        <div
          x-show="
            !liveOrdersLoading &&
            !liveOrdersError &&
            liveOrders.length > 0
          "
          class="mt-6 space-y-4"
        >
          <template x-for="order in liveOrders" :key="order.id">
            <article
              class="rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
            >
              <p
                class="font-semibold text-brand-cream"
                x-text="
                  'Order ' + order.id.slice(0, 8).toUpperCase()
                "
              ></p>

              <span
  class="mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
  :class="orderStatusBadgeClass(order.status)"
  x-text="orderStatusLabel(order.status)"
></span>

              <p
                class="mt-2 text-xs text-brand-muted"
                x-text="formatDate(order.created_at)"
              ></p>

              <p
                class="mt-3 text-sm text-brand-cream"
                x-text="'Subtotal: ' + formatMoney(order.subtotal)"
              ></p>

              <p
                x-show="order.delivery_fee === null"
                class="mt-1 text-xs text-brand-muted"
              >
                Delivery fee to be confirmed
              </p>
                          <button
                type="button"
                @click="openOrderDetails(order.id)"
                class="mt-4 rounded-full border border-brand-gold px-5 py-2 text-sm font-semibold text-brand-gold"
              >
                View order details
              </button>
            </article>
          </template>
        </div>
      </section>
    `
}

function renderOrderDetailsDrawer() {
  return `
    <div
      x-show="orderDetailsOpen"
      x-transition.opacity
      class="fixed inset-0 z-40 bg-black/65"
      @click="closeOrderDetails()"
    ></div>

    <aside
      x-show="orderDetailsOpen"
      x-transition
      class="fixed inset-y-0 right-0 z-50 w-full max-w-2xl overflow-y-auto border-l border-brand-border bg-brand-panel p-6 shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-drawer-title"
    >
      <template x-if="selectedOrder">
        <div class="space-y-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-widest text-brand-gold">
                Customer order
              </p>
              <h2
                id="order-drawer-title"
                class="mt-2 font-display text-2xl text-brand-cream"
                x-text="'Order ' + selectedOrder.id.slice(0, 8).toUpperCase()"
              ></h2>
              <span
  class="mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
  :class="orderStatusBadgeClass(selectedOrder.status)"
  x-text="orderStatusLabel(selectedOrder.status)"
></span>
              <p
                class="mt-1 text-xs text-brand-muted"
                x-text="formatDate(selectedOrder.created_at)"
              ></p>
            </div>
            <button
              type="button"
              @click="closeOrderDetails()"
              class="rounded-full border border-brand-border px-4 py-2 text-sm text-brand-cream"
            >
              Close
            </button>
          </div>

          <section class="rounded-xl border border-brand-border bg-brand-black p-5">
            <h3 class="font-semibold text-brand-cream">Customer</h3>
            <p
              class="mt-3 text-sm text-brand-cream"
              x-text="[selectedOrder.customer_details.firstName, selectedOrder.customer_details.lastName].filter(Boolean).join(' ')"
            ></p>
            <p
              class="mt-1 text-sm text-brand-muted"
              x-text="selectedOrder.customer_details.emailAddress"
            ></p>
            <p
              class="mt-1 text-sm text-brand-muted"
              x-text="selectedOrder.customer_details.mobileNumber"
            ></p>
          </section>

          <section class="rounded-xl border border-brand-border bg-brand-black p-5">
            <h3 class="font-semibold text-brand-cream">Delivery</h3>
            <p
              class="mt-3 text-sm text-brand-cream"
              x-text="[selectedOrder.delivery_details.recipientFirstName, selectedOrder.delivery_details.recipientLastName].filter(Boolean).join(' ')"
            ></p>
            <p
              class="mt-1 text-sm text-brand-muted"
              x-text="selectedOrder.delivery_details.recipientMobile"
            ></p>
            <p
              class="mt-2 text-sm leading-6 text-brand-cream"
              x-text="[selectedOrder.delivery_details.houseStreet, selectedOrder.delivery_details.barangay, selectedOrder.delivery_details.city, selectedOrder.delivery_details.province, selectedOrder.delivery_details.region].filter(Boolean).join(', ')"
            ></p>
            <p
              x-show="selectedOrder.delivery_details.notes"
              class="mt-2 text-sm text-brand-muted"
              x-text="selectedOrder.delivery_details.notes"
            ></p>
          </section>

          <section class="rounded-xl border border-brand-border bg-brand-black p-5">
            <h3 class="font-semibold text-brand-cream">Items</h3>
            <template x-for="item in selectedOrder.order_items || []" :key="item.id">
              <div class="mt-3 flex justify-between gap-4 border-t border-brand-border pt-3 text-sm">
                <span
                  class="text-brand-cream"
                  x-text="item.product_name + ' × ' + item.quantity"
                ></span>
                <span
                  class="shrink-0 text-brand-gold"
                  x-text="formatMoney(Number(item.unit_price) * item.quantity)"
                ></span>
              </div>
            </template>
            <p
              class="mt-4 text-sm text-brand-cream"
              x-text="'Subtotal: ' + formatMoney(selectedOrder.subtotal)"
            ></p>
            <p
              class="mt-1 text-sm text-brand-muted"
              x-text="selectedOrder.delivery_fee === null ? 'Delivery fee to be confirmed' : 'Delivery fee: ' + formatMoney(selectedOrder.delivery_fee)"
            ></p>
          </section>

          <section class="rounded-xl border border-brand-border bg-brand-black p-5">
            <h3 class="font-semibold text-brand-cream">Payment</h3>
            <p
              class="mt-2 text-sm capitalize text-brand-muted"
              x-text="'Method: ' + selectedOrder.payment_method.replaceAll('-', ' ')"
            ></p>
            <p
              x-show="orderProofLoading"
              class="mt-3 text-sm text-brand-muted"
            >
              Loading payment proof…
            </p>
            <p
              x-show="orderProofError"
              x-text="orderProofError"
              class="mt-3 text-sm text-red-300"
              role="alert"
            ></p>
            <img
              x-show="orderProofUrl"
              :src="orderProofUrl"
              alt="Submitted payment proof"
              class="mt-3 max-h-96 w-full rounded-lg object-contain"
            >
          </section>

          <section
  class="rounded-xl border border-brand-border bg-brand-black p-5"
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
    Review order payment
  </h3>

  <p class="mt-2 text-xs leading-5 text-brand-muted">
    Verify the uploaded proof against the actual company account
    before approving this order.
  </p>

  <div
    x-show="!orderReviewPanelOpen"
    x-transition.opacity
    class="mt-5"
  >
    <div
      x-show="
        [
          'pending_verification',
          'pending-verification',
        ].includes(selectedOrder.status)
      "
      class="grid gap-3 sm:grid-cols-2"
    >
      <button
        type="button"
        class="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        @click="openOrderReview('approve')"
        :disabled="
          orderReviewSubmitting ||
          orderProofLoading ||
          !orderProofUrl
        "
      >
        Approve Payment
      </button>

      <button
        type="button"
        class="inline-flex min-h-11 items-center justify-center rounded-full border border-red-400/40 px-5 text-sm font-semibold text-red-300 transition hover:border-red-300 hover:bg-red-400/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
        @click="openOrderReview('reject')"
        :disabled="orderReviewSubmitting"
      >
        Reject Payment
      </button>
    </div>

    <div
  x-show="selectedOrder.status === 'processing'"
  class="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3"
>
  <p class="text-sm font-semibold text-sky-200">
    Payment approved
  </p>

  <p class="mt-1 text-xs leading-5 text-sky-100/80">
    This order is ready to be marked as shipped.
  </p>

  <button
    type="button"
    class="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-full bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
    @click="updateOrderFulfillment('shipped')"
    :disabled="orderFulfillmentSubmitting"
    x-text="orderFulfillmentSubmitting ? 'Updating...' : 'Mark as Shipped'"
  ></button>
</div>

<div
  x-show="selectedOrder.status === 'shipped'"
  class="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3"
>
  <p class="text-sm font-semibold text-blue-200">
    Order shipped
  </p>

  <p class="mt-1 text-xs leading-5 text-blue-100/80">
    Mark this order delivered once the customer receives it.
  </p>

  <button
    type="button"
    class="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
    @click="updateOrderFulfillment('delivered')"
    :disabled="orderFulfillmentSubmitting"
    x-text="orderFulfillmentSubmitting ? 'Updating...' : 'Mark as Delivered'"
  ></button>
</div>

<div
  x-show="selectedOrder.status === 'delivered'"
  class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3"
>
  <p class="text-sm font-semibold text-emerald-200">
    Order delivered
  </p>

  <p class="mt-1 text-xs leading-5 text-emerald-100/80">
    This order is complete. Award points only for qualified
    active-member perfume orders.
  </p>

  <button
  x-show="!orderPointsAwarded"
  type="button"
  class="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-full bg-brand-gold px-4 text-sm font-semibold text-[#17130d] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
  @click="awardOrderPoints()"
  :disabled="orderPointsSubmitting"
  x-text="orderPointsSubmitting ? 'Awarding...' : 'Award Points'"
></button>

<p
  x-show="orderPointsAwarded"
  class="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-200"
>
  Points already awarded
</p>

  <p
    x-show="orderPointsMessage"
    x-text="orderPointsMessage"
    class="mt-3 text-xs leading-5 text-emerald-100"
    role="status"
  ></p>

  <p
    x-show="orderPointsError"
    x-text="orderPointsError"
    class="mt-3 text-xs leading-5 text-red-200"
    role="alert"
  ></p>
</div>

<p
  x-show="orderFulfillmentError"
  x-text="orderFulfillmentError"
  class="mt-3 text-xs leading-5 text-red-300"
  role="alert"
></p>

    <div
      x-show="selectedOrder.status === 'rejected'"
      class="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3"
    >
      <p class="text-sm font-semibold text-red-200">
        Payment rejected
      </p>

      <p class="mt-1 text-xs leading-5 text-red-100/80">
        No additional payment review action is available.
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
            ? 'Reject this payment'
            : 'Review order payment'
      "
    ></p>

    <p
      class="mt-2 text-xs leading-5 text-brand-muted"
      x-text="
        orderReviewAction === 'approve'
          ? 'The payment will be accepted, stock will be deducted, and the order will move to processing.'
          : orderReviewAction === 'reject'
            ? 'The order payment will be rejected after confirmation.'
            : 'Confirm this payment review.'
      "
    ></p>

    <label
      x-show="orderReviewAction === 'approve'"
      class="mt-4 flex gap-3 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-xs leading-5 text-emerald-100"
    >
      <input
        type="checkbox"
        x-model="orderReviewPaymentVerified"
        class="mt-1 size-4 rounded border-emerald-300 bg-brand-black text-emerald-400"
      >

      <span>
        I verified the actual payment in the company account.
      </span>
    </label>

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
      :placeholder="
        orderReviewAction === 'reject'
          ? 'Required: explain why this payment is rejected'
          : 'Optional: add a short approval note'
      "
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
        class="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-border px-4 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-50"
        @click="closeOrderReview()"
        :disabled="orderReviewSubmitting"
      >
        Keep Current Status
      </button>

      <button
        type="button"
        class="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
        :class="
          orderReviewAction === 'reject'
            ? 'bg-red-700 text-white hover:bg-red-600'
            : 'bg-brand-gold text-[#17130d] hover:brightness-110'
        "
        @click="submitOrderReview()"
        :disabled="orderReviewSubmitting"
        x-text="
          orderReviewSubmitting
            ? 'Submitting...'
            : orderReviewAction === 'approve'
              ? 'Confirm Approval'
              : orderReviewAction === 'reject'
                ? 'Confirm Rejection'
                : 'Confirm Update'
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
      </template>
    </aside>
  `
}

function renderApplicationDetailsDrawer() {
  return `
    <div
      x-show="applicationDetailsOpen"
      x-transition.opacity
      class="fixed inset-0 z-40 bg-black/65"
      @click="closeApplicationDetails()"
    ></div>

    <aside
      x-show="applicationDetailsOpen"
      x-transition
      class="fixed inset-y-0 right-0 z-50 w-full max-w-xl overflow-y-auto border-l border-brand-border bg-brand-panel p-6 shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="application-drawer-title"
    >
      <template x-if="selectedApplication">
        <div class="space-y-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-widest text-brand-gold">
                Membership application
              </p>
              <h2
                id="application-drawer-title"
                class="mt-2 font-display text-2xl text-brand-cream"
                x-text="selectedApplication.customer_name"
              ></h2>
              <p
                class="mt-2 text-sm text-brand-gold"
                x-text="applicationStatusLabels[selectedApplication.status] || selectedApplication.status"
              ></p>
            </div>
            <button
              type="button"
              @click="closeApplicationDetails()"
              class="rounded-full border border-brand-border px-4 py-2 text-sm text-brand-cream"
            >
              Close
            </button>
          </div>

          <section class="rounded-xl border border-brand-border bg-brand-black p-5">
            <h3 class="font-semibold text-brand-cream">Application</h3>
            <p
              class="mt-3 text-sm text-brand-cream"
              x-text="'Package: ' + (selectedApplication.package?.name || selectedApplication.package_id)"
            ></p>
            <p
              class="mt-1 text-sm text-brand-cream"
              x-text="'Amount: ' + formatOptionalMoney(selectedApplication.amount)"
            ></p>
            <p
              class="mt-1 text-xs text-brand-muted"
              x-text="'Submitted: ' + formatDate(selectedApplication.submitted_at)"
            ></p>
          </section>

          <section class="rounded-xl border border-brand-border bg-brand-black p-5">
            <h3 class="font-semibold text-brand-cream">Customer</h3>
            <p
              class="mt-3 text-sm text-brand-cream"
              x-text="selectedApplication.customer_name"
            ></p>
            <p
              class="mt-1 text-sm text-brand-muted"
              x-text="selectedApplication.customer_email || 'No email available'"
            ></p>
            <p
              class="mt-1 text-sm text-brand-muted"
              x-text="selectedApplication.customer_mobile || 'No mobile number available'"
            ></p>
          </section>

          <section class="rounded-xl border border-brand-border bg-brand-black p-5">
            <h3 class="font-semibold text-brand-cream">Payment details</h3>
            <p
              class="mt-3 text-sm text-brand-muted"
              x-text="'Method: ' + (selectedApplication.payment_method || 'Not submitted')"
            ></p>
            <p
              class="mt-1 text-sm text-brand-muted"
              x-text="'Provider: ' + (selectedApplication.payment_provider || 'Not provided')"
            ></p>
            <p
              class="mt-1 text-sm text-brand-muted"
              x-text="'Sender: ' + (selectedApplication.sender_name || 'Not provided')"
            ></p>
            <p
              class="mt-1 break-all text-sm text-brand-muted"
              x-text="'Reference: ' + (selectedApplication.reference_number || 'Not provided')"
            ></p>
            <p
              class="mt-3 break-all text-xs text-brand-muted"
              x-text="'Proof file: ' + (selectedApplication.payment_proof_file_name || 'Not submitted')"
            ></p>

            <p
              x-show="applicationProofLoading"
              class="mt-3 text-sm text-brand-muted"
            >Loading payment proof…</p>

            <p
              x-show="applicationProofError"
              x-text="applicationProofError"
              class="mt-3 text-sm text-red-300"
              role="alert"
            ></p>

            <img
              x-show="applicationProofUrl"
              :src="applicationProofUrl"
              alt="Submitted membership payment proof"
              class="mt-3 max-h-96 w-full rounded-lg object-contain"
            >

            <p
              x-show="!applicationProofLoading && !applicationProofUrl && !applicationProofError"
              class="mt-3 text-xs text-brand-muted"
            >No payment screenshot submitted.</p>
          </section>

          <section
            x-show="selectedApplication.cancellation_reason"
            class="rounded-xl border border-brand-border bg-brand-black p-5"
          >
            <h3 class="font-semibold text-brand-cream">
              Cancellation request
            </h3>
            <p
              class="mt-2 text-sm text-brand-muted"
              x-text="selectedApplication.cancellation_reason"
            ></p>
          </section>

          <div class="mt-5 rounded-2xl border border-brand-border bg-brand-black/40 p-4">
            <p class="text-sm font-semibold text-brand-cream">
              Admin Review
            </p>

            <p class="mt-2 text-xs leading-5 text-brand-muted">
              Review the uploaded payment proof and verify the actual payment
              in the company account before approving this membership.
            </p>

            <div
              x-show="
                selectedApplication &&
                selectedApplication.status === 'pending-verification'
              "
              x-transition
              class="mt-4 grid gap-3 sm:grid-cols-2"
            >
              <button
                type="button"
                class="inline-flex min-h-11 items-center justify-center rounded-full border border-red-400/40 px-5 text-sm font-semibold text-red-300 transition hover:border-red-300 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                @click="openReviewPanel('reject-payment')"
                :disabled="reviewSubmitting"
              >
                Reject Payment
              </button>

              <button
                type="button"
                class="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-500 px-5 text-sm font-semibold text-[#07130d] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                @click="openReviewPanel('approve-membership')"
                :disabled="
                  reviewSubmitting ||
                  applicationProofLoading ||
                  !applicationProofUrl
                "
              >
                Approve Membership
              </button>
            </div>

            <p
              x-show="
                selectedApplication &&
                selectedApplication.status === 'awaiting-payment'
              "
              class="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-xs leading-5 text-amber-200"
            >
              This application is still awaiting payment. Review controls will
              appear after the customer uploads payment proof.
            </p>

            <p
              x-show="
                selectedApplication &&
                selectedApplication.status !== 'awaiting-payment' &&
                selectedApplication.status !== 'pending-verification'
              "
              class="mt-4 rounded-xl border border-brand-border bg-brand-panel p-3 text-xs leading-5 text-brand-muted"
            >
              This application has already been reviewed or closed.
            </p>

            <form
              x-show="reviewPanelOpen"
              x-transition
              class="mt-4 rounded-2xl border border-brand-border bg-brand-panel p-4"
              @submit.prevent="confirmReviewAction()"
            >
              <h3
                class="text-sm font-semibold text-brand-cream"
                x-text="reviewActionTitle"
              ></h3>

              <p
                class="mt-2 text-xs leading-5 text-brand-muted"
                x-text="reviewActionDescription"
              ></p>

              <label
                x-show="reviewAction === 'approve-membership'"
                class="mt-4 flex gap-3 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-xs leading-5 text-emerald-100"
              >
                <input
                  type="checkbox"
                  x-model="reviewPaymentVerified"
                  class="mt-1 size-4 rounded border-emerald-300 bg-brand-black text-emerald-400"
                >

                <span>
                  I verified the actual payment in the company account.
                </span>
              </label>

              <label
                for="admin-review-note"
                class="mt-4 block text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted"
              >
                Admin Note
              </label>

              <textarea
                id="admin-review-note"
                x-model.trim="reviewNote"
                rows="3"
                maxlength="300"
                :placeholder="
                  reviewAction === 'reject-payment'
                    ? 'Required: explain why this payment is rejected'
                    : 'Optional: add a short approval note'
                "
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
                  class="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-border px-4 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-50"
                  @click="closeReviewPanel()"
                  :disabled="reviewSubmitting"
                >
                  Keep Current Status
                </button>

                <button
                  type="submit"
                  class="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
                  :class="
                    reviewAction === 'reject-payment'
                      ? 'bg-red-700 text-white hover:bg-red-600'
                      : 'bg-brand-gold text-[#17130d] hover:brightness-110'
                  "
                  :disabled="reviewSubmitting"
                  x-text="
                    reviewSubmitting
                      ? 'Submitting...'
                      : reviewAction === 'approve-membership'
                        ? 'Confirm Approval'
                        : reviewAction === 'reject-payment'
                          ? 'Confirm Rejection'
                          : 'Confirm Update'
                  "
                ></button>
              </div>
            </form>
          </div>

          ${renderAdminPackageFulfillmentPanel()}
        </div>
      </template>
    </aside>
  `
}

Alpine.data('adminDashboard', () => ({
  applications: [],
  applicationsLoading: true,
  applicationsError: '',
  overviewPendingOrders: null,
  overviewActiveMembers: null,
  overviewMetricsError: '',

  applicationStatusLabels:
    membershipStatusLabels,

  membershipFulfillmentStatusLabels,

  paymentMethodLabels,

  isLoggingOut: false,
  logoutError: '',

  orders: [],

  adminCustomers: [],
  adminCustomersLoading: true,
  adminCustomersError: '',
  adminCustomerSearch: '',
  adminCustomerTypeFilter: 'all',
  adminCustomerMembershipFilter: 'all',
  adminCustomerAccountFilter: 'all',
  adminCustomerJoinedFilter: 'all',
  savingAvailabilityProductId: null,
  availabilitySaveError: '',
  availabilitySaveMessage: '',
  liveProducts: [],
  liveProductsLoading: true,
  liveProductsError: '',
  stockDrafts: {},
  stockAdjustmentModes: {},
  stockAdjustmentNotes: {},
  savingProductId: null,
  stockSaveMessage: '',
  stockSaveProductId: null,
  stockSaveError: '',
  stockHistory: [],
  stockHistoryLoading: true,
  stockHistoryError: '',

  liveOrders: [],

  liveOrdersLoading: false,

  liveOrdersError: '',

  inventoryProducts: adminInventoryProducts,

  packageSupplies: adminPackageSupplies,

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

  salesDateFilter: 'all',
  salesStatusFilter: 'all',
  salesCustomerTypeFilter: 'all',

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
  applicationProofUrl: '',
  applicationProofLoading: false,
  applicationProofError: '',
  applicationProofRequestId: 0,

  applicationSearch: '',

  applicationStatusFilter: 'all',

  selectedOrderId: null,
  orderDetailsOpen: false,
  orderProofUrl: '',
  orderProofLoading: false,
  orderProofError: '',

  orderSearch: '',

  orderStatusFilter: 'all',

  orderReviewPanelOpen: false,
  orderReviewAction: '',
  orderReviewNote: '',
  orderReviewError: '',

  orderReviewPaymentVerified: false,
  orderReviewSubmitting: false,

  orderFulfillmentSubmitting: false,
  orderFulfillmentError: '',
  orderPointsSubmitting: false,
  orderPointsMessage: '',
  orderPointsError: '',
  orderPointsAwarded: false,

  reviewPanelOpen: false,

  reviewAction: '',

  reviewNote: '',

  reviewError: '',

  reviewPaymentVerified: false,
  reviewSubmitting: false,

  packageAllocationQuantities: {},

  packageAllocationError: '',

  packageFulfillmentAction: '',

  packageFulfillmentError: '',

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

  get packageAllocationTotal() {
    return this.inventoryProducts.reduce(
      (total, product) => {
        const quantity = Number.parseInt(
          this.packageAllocationQuantities[
            product.id
          ],
          10,
        )

        if (
          !Number.isInteger(quantity) ||
          quantity <= 0
        ) {
          return total
        }

        return total + quantity
      },
      0,
    )
  },

  get packageAllocationProgress() {
    const requiredQuantity = Number(
      this.selectedApplication
      ?.package
      ?.productQuantity || 0,
    )

    if (requiredQuantity <= 0) {
      return 0
    }

    return Math.min(
      100,
      Math.round(
        (
          this.packageAllocationTotal /
          requiredQuantity
        ) * 100,
      ),
    )
  },

  get filteredAdminCustomers() {
    const search = this.adminCustomerSearch
      .trim()
      .toLowerCase()

    const now = new Date()

    return this.adminCustomers.filter((customer) => {
      const fullName = [
        customer.first_name,
        customer.last_name,
      ].filter(Boolean).join(' ')

      const matchesSearch =
        !search ||
        [
          fullName,
          customer.email,
          customer.mobile_number,
        ].some((value) =>
          String(value || '').toLowerCase().includes(search),
        )

      const matchesType =
        this.adminCustomerTypeFilter === 'all' ||
        customer.customer_type === this.adminCustomerTypeFilter

      const matchesMembership =
        this.adminCustomerMembershipFilter === 'all' ||
        customer.membership_status ===
          this.adminCustomerMembershipFilter

      const matchesAccount =
        this.adminCustomerAccountFilter === 'all' ||
        customer.account_status === this.adminCustomerAccountFilter

      let matchesJoined = true

      if (
        this.adminCustomerJoinedFilter !== 'all' &&
        customer.created_at
      ) {
        const createdAt = new Date(customer.created_at)

        if (this.adminCustomerJoinedFilter === 'today') {
          matchesJoined =
            createdAt.toDateString() === now.toDateString()
        }

        if (this.adminCustomerJoinedFilter === 'week') {
          const sevenDaysAgo = new Date(now)
          sevenDaysAgo.setDate(now.getDate() - 7)
          matchesJoined = createdAt >= sevenDaysAgo
        }

        if (this.adminCustomerJoinedFilter === 'month') {
          matchesJoined =
            createdAt.getFullYear() === now.getFullYear() &&
            createdAt.getMonth() === now.getMonth()
        }
      }

      return (
        matchesSearch &&
        matchesType &&
        matchesMembership &&
        matchesAccount &&
        matchesJoined
      )
    })
  },

  get canConfirmPackageAllocation() {
    const application =
    this.selectedApplication

    const selectedPackage =
    application?.package

    if (
      !application ||
      !selectedPackage ||
      application.status !== 'approved' ||
      application.package_inventory_deducted
    ) {
      return false
    }

    const requiredQuantity = Number(
      selectedPackage.productQuantity || 0,
    )

    if (
      requiredQuantity <= 0 ||
      this.packageAllocationTotal !==
      requiredQuantity
    ) {
      return false
    }

    const productQuantitiesAreValid =
    this.inventoryProducts.every(
      (product) => {
        const rawQuantity =
        this.packageAllocationQuantities[
          product.id
        ]

        const quantity =
        rawQuantity === '' ||
        rawQuantity === undefined
        ? 0
        : Number(rawQuantity)

        return (
          Number.isInteger(quantity) &&
          quantity >= 0 &&
          quantity <=
          Number(product.stockQuantity || 0)
        )
      },
    )

    if (!productQuantitiesAreValid) {
      return false
    }

    return selectedPackage
    .fixedInventoryItems
    .every((inclusion) => {
      const availableStock =
      this.packageSupplyStock(
        inclusion.inventoryItemId,
      )

      return (
        availableStock >=
        Number(inclusion.quantity || 0)
      )
    })
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
      this.liveOrders.find(
        (order) => order.id === this.selectedOrderId,
      ) || null
    )
  },

  async loadOverviewMetrics() {
    this.overviewPendingOrders = null
    this.overviewActiveMembers = null
    this.overviewMetricsError = ''

    try {
      const [ordersResult, membersResult] = await Promise.all([
        supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending_verification'),

        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'customer')
          .eq('customer_type', 'member')
          .eq('membership_status', 'active')
          .eq('account_status', 'active'),
      ])

      if (ordersResult.error) throw ordersResult.error
      if (membersResult.error) throw membersResult.error
      if (ordersResult.count === null || membersResult.count === null) {
        throw new Error('Overview counts are unavailable.')
      }

      this.overviewPendingOrders = ordersResult.count
      this.overviewActiveMembers = membersResult.count
    } catch (error) {
      console.error('Unable to load admin overview counts:', error)
      this.overviewMetricsError =
        'Unable to load overview counts. Please refresh.'
    }
  },

  async loadMembershipApplications() {
    this.applicationsLoading = true
    this.applicationsError = ''

    try {
      const { data, error } = await supabase
        .from('membership_applications')
        .select(`
          id, customer_id, package_id, amount, status,
          payment_method, payment_provider, sender_name,
          reference_number, payment_proof_file_name,
          payment_proof_path,
          cancellation_reason, refund_status, admin_note,
          approved_at, membership_activated_at,
          fulfillment_status, package_allocation,
          package_inventory_deducted,
          package_inventory_deducted_at,
          fulfillment_confirmed_at,
          submitted_at, updated_at,
          customer:profiles!membership_applications_customer_id_fkey(
            first_name, last_name, email, mobile_number
          )
        `)
        .order('submitted_at', { ascending: false })

      if (error) throw error

      this.applications = (data ?? []).map((application) => ({
        ...application,
        customer_name: [
          application.customer?.first_name,
          application.customer?.last_name,
        ].filter(Boolean).join(' ') || 'Customer',
        customer_email: application.customer?.email ?? '',
        customer_mobile: application.customer?.mobile_number ?? '',
        payment_proof_url: null,
        package: packages.find(
          (item) => item.id === application.package_id,
        ) ?? null,
      }))
    } catch (error) {
      console.error('Unable to load membership applications:', error)
      this.applicationsError =
        'Unable to load membership applications. Please refresh.'
      this.applications = []
    } finally {
      this.applicationsLoading = false
    }
  },

  async loadAdminCustomers() {
    this.adminCustomersLoading = true
    this.adminCustomersError = ''

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(
          'id, first_name, last_name, email, mobile_number, customer_type, membership_status, account_status, created_at',
        )
        .eq('role', 'customer')
        .order('created_at', { ascending: false })

      if (error) throw error
      this.adminCustomers = data ?? []
    } catch (error) {
      console.error('Unable to load admin customers:', error)
      this.adminCustomersError = 'Unable to load customers. Please refresh.'
      this.adminCustomers = []
    } finally {
      this.adminCustomersLoading = false
    }
  },

  async toggleProductAvailability(product) {
    if (this.savingAvailabilityProductId !== null) return

    this.availabilitySaveError = ''
    this.availabilitySaveMessage = ''

    const nextActive = !product.is_active
    this.savingAvailabilityProductId = product.id

    try {
      const { data, error } = await supabase.rpc(
        'admin_set_product_active',
        {
          p_product_id: product.id,
          p_is_active: nextActive,
        },
      )

      if (error) throw error

      product.is_active = data === true
      this.availabilitySaveMessage =
        `${product.name} is now ${product.is_active ? 'active' : 'inactive'}.`
    } catch (error) {
      console.error('Unable to change product availability:', error)
      this.availabilitySaveError =
        'Unable to change product availability. Please refresh and try again.'
    } finally {
      this.savingAvailabilityProductId = null
    }
  },

  async loadLiveProducts() {
    this.liveProductsLoading = true
    this.liveProductsError = ''

    try {
      const { data, error } = await supabase
        .from('products')
        .select(
          'id, sku, name, regular_price, member_price, stock_quantity, is_active',
        )
        .order('sku', { ascending: true })

      if (error) throw error

      this.liveProducts = data ?? []

      const liveProductsByName = new Map(
        this.liveProducts.map((product) => [
          product.name,
          product,
        ]),
      )

      this.inventoryProducts = adminInventoryProducts.map(
        (product) => {
          const liveProduct = liveProductsByName.get(
            product.name,
          )

          if (!liveProduct) {
            return {
              ...product,
              stockQuantity: 0,
            }
          }

          return {
            ...product,
            id: liveProduct.id,
            sku: liveProduct.sku,
            name: liveProduct.name,
            regularPrice: Number(
              liveProduct.regular_price || 0,
            ),
            memberPrice: Number(
              liveProduct.member_price || 0,
            ),
            stockQuantity: Number(
              liveProduct.stock_quantity || 0,
            ),
            isActive: liveProduct.is_active === true,
          }
        },
      )

      this.stockDrafts = Object.fromEntries(
        this.liveProducts.map((product) => [
          product.id,
          product.stock_quantity,
        ]),
      )

      this.stockAdjustmentModes = Object.fromEntries(
        this.liveProducts.map((product) => [
          product.id,
          'set',
        ]),
      )

      this.stockAdjustmentNotes = Object.fromEntries(
        this.liveProducts.map((product) => [
          product.id,
          '',
        ]),
      )
    } catch (error) {
      console.error('Unable to load admin products:', error)
      this.liveProductsError = 'Unable to load products. Please refresh.'
      this.liveProducts = []
    } finally {
      this.liveProductsLoading = false
    }
  },

  async loadStockHistory() {
    this.stockHistoryLoading = true
    this.stockHistoryError = ''

    try {
      const { data, error } = await supabase
        .from('inventory_movements')
        .select('id, product_id, previous_quantity, new_quantity, created_at')
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error

      this.stockHistory = data ?? []
    } catch (error) {
      console.error('Unable to load stock history:', error)
      this.stockHistoryError = 'Unable to load stock history.'
      this.stockHistory = []
    } finally {
      this.stockHistoryLoading = false
    }
  },


  async saveProductStock(product) {
    const mode =
      this.stockAdjustmentModes[product.id] || 'set'

    const rawQuantity = this.stockDrafts[product.id]
    const quantity =
      rawQuantity === '' ||
      rawQuantity === null ||
      rawQuantity === undefined
        ? NaN
        : Number(rawQuantity)

    const note =
      this.stockAdjustmentNotes[product.id]?.trim() || ''

    const currentStock = Number(product.stock_quantity || 0)

    this.stockSaveMessage = ''
    this.stockSaveError = ''
    this.stockSaveProductId = product.id

    if (!['set', 'add', 'deduct'].includes(mode)) {
      this.stockSaveError = 'Select a valid stock action.'
      return
    }

    if (!Number.isSafeInteger(quantity) || quantity < 0) {
      this.stockSaveError = 'Enter a whole number of 0 or more.'
      return
    }

    if (!note) {
      this.stockSaveError =
        'Add a short note for this stock adjustment.'
      return
    }

    const newStock =
      mode === 'add'
        ? currentStock + quantity
        : mode === 'deduct'
          ? currentStock - quantity
          : quantity

          if (newStock < 0) {
            this.stockSaveError =
              `Cannot deduct ${quantity} from ${product.name}. Current stock is only ${currentStock}.`
            return
          }

    this.savingProductId = product.id

    try {
      const { data, error } = await supabase.rpc(
        'admin_set_product_stock',
        {
          p_product_id: product.id,
          p_new_stock: newStock,
        },
      )

      if (error) throw error

      const savedStock = Number(data)

      product.stock_quantity = savedStock
      this.stockDrafts[product.id] = savedStock
      this.stockAdjustmentModes[product.id] = 'set'
      this.stockAdjustmentNotes[product.id] = ''

      this.stockSaveMessage =
        `Stock updated for ${product.name}. ${currentStock} → ${savedStock}.`

      await this.loadStockHistory()
    } catch (error) {
      console.error('Unable to save product stock:', error)
      this.stockSaveError =
        'Unable to save stock. Please try again.'
    } finally {
      this.savingProductId = null
    }
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

  approvedOrderDate(order) {
    const approvedDateValue =
    order.approved_at ||
    order.reviewed_at ||
    order.updated_at

    if (!approvedDateValue) {
      return null
    }

    const approvedDate =
    new Date(approvedDateValue)

    if (Number.isNaN(approvedDate.getTime())) {
      return null
    }

    return approvedDate
  },

  approvedSalesBetween(startDate, endDate) {
    return this.approvedOrders.reduce(
      (total, order) => {
        const approvedDate =
        this.approvedOrderDate(order)

        if (
          !approvedDate ||
          approvedDate < startDate ||
          approvedDate > endDate
        ) {
          return total
        }

        return (
          total +
          Number(order.subtotal || 0)
        )
      },
      0,
    )
  },

  get approvedSalesTotal() {
    return this.approvedOrders.reduce(
      (total, order) =>
        total + Number(order.subtotal || 0),
      0,
    )
  },

  get dailyApprovedSales() {
    const now = new Date()

    const startOfToday = new Date(now)
    startOfToday.setHours(0, 0, 0, 0)

    return this.approvedSalesBetween(
      startOfToday,
      now,
    )
  },

  get weeklyApprovedSales() {
    const now = new Date()

    const startOfWeek = new Date(now)
    const daysSinceMonday =
    (startOfWeek.getDay() + 6) % 7

    startOfWeek.setDate(
      startOfWeek.getDate() -
      daysSinceMonday,
    )

    startOfWeek.setHours(0, 0, 0, 0)

    return this.approvedSalesBetween(
      startOfWeek,
      now,
    )
  },

  get monthlyApprovedSales() {
    const now = new Date()

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    )

    startOfMonth.setHours(0, 0, 0, 0)

    return this.approvedSalesBetween(
      startOfMonth,
      now,
    )
  },

  hasConfirmedUnitCost(item) {
    if (
      item.unit_cost === null ||
      item.unit_cost === undefined ||
      item.unit_cost === ''
    ) {
      return false
    }

    const unitCost = Number(item.unit_cost)

    return (
      Number.isFinite(unitCost) &&
      unitCost >= 0
    )
  },

  get approvedProductCost() {
    if (this.approvedOrders.length === 0) {
      return 0
    }

    const hasMissingCost =
    this.approvedOrders.some((order) =>
      order.items.some(
      (item) =>
        !this.hasConfirmedUnitCost(item),
    ),
  )

  if (hasMissingCost) {
    return null
  }

  return this.approvedOrders.reduce(
    (orderTotal, order) => {
      const itemCost = order.items.reduce(
        (itemTotal, item) =>
          itemTotal +
        Number(item.unit_cost) *
        Number(item.quantity || 0),
        0,
      )

      return orderTotal + itemCost
    },
    0,
  )
},

get estimatedGrossProfit() {
  if (this.approvedProductCost === null) {
    return null
  }

  return (
    this.approvedSalesTotal -
    this.approvedProductCost
  )
},

get approvedUnitsSold() {
  return this.approvedOrders.reduce(
    (orderTotal, order) => {
      const itemQuantity =
      order.items.reduce(
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

get filteredSalesOrders() {
  let filteredOrders = [
    ...this.orders,
  ]

  if (this.salesStatusFilter !== 'all') {
    filteredOrders =
    filteredOrders.filter(
      (order) =>
        order.status ===
      this.salesStatusFilter,
    )
  }

  if (
    this.salesCustomerTypeFilter !== 'all'
  ) {
    filteredOrders =
    filteredOrders.filter(
      (order) =>
        order.customer_type ===
      this.salesCustomerTypeFilter,
    )
  }

  if (this.salesDateFilter !== 'all') {
    const now = new Date()

    filteredOrders =
    filteredOrders.filter((order) => {
      const orderDate =
      new Date(order.submitted_at)

      if (
        Number.isNaN(orderDate.getTime())
      ) {
        return false
      }

      if (
        this.salesDateFilter === 'today'
      ) {
        return (
          orderDate.toDateString() ===
          now.toDateString()
        )
      }

      const dateRangeDays = {
        '7-days': 7,
        '30-days': 30,
      }

      const selectedDays =
      dateRangeDays[
        this.salesDateFilter
      ]

      if (!selectedDays) {
        return true
      }

      const cutoffDate = new Date(now)

      cutoffDate.setDate(
        cutoffDate.getDate() -
        selectedDays,
      )

      return orderDate >= cutoffDate
    })
  }

  return filteredOrders.sort(
    (firstOrder, secondOrder) =>
      new Date(
      secondOrder.submitted_at,
    ).getTime() -
    new Date(
      firstOrder.submitted_at,
    ).getTime(),
  )
},

isRecognizedSalesOrder(order) {
  return this.approvedOrderStatuses.includes(
    order.status,
  )
},

orderProductSales(order) {
  return Number(
    order.subtotal ||
    order.total_amount ||
    0,
  )
},

orderProductCost(order) {
  const hasMissingCost =
  order.items.some(
    (item) =>
      !this.hasConfirmedUnitCost(item),
  )

  if (hasMissingCost) {
    return null
  }

  return order.items.reduce(
    (totalCost, item) =>
      totalCost +
    Number(item.unit_cost) *
    Number(item.quantity || 0),
    0,
  )
},

orderEstimatedGrossProfit(order) {
  if (!this.isRecognizedSalesOrder(order)) {
    return null
  }

  const productCost =
  this.orderProductCost(order)

  if (productCost === null) {
    return null
  }

  return (
    this.orderProductSales(order) -
    productCost
  )
},

salesRecognitionLabel(order) {
  const uncountedLabels = {
    'pending-verification':
    'Waiting for approval',

    rejected:
    'Rejected — not counted',

    cancelled:
    'Cancelled — reversed',

    refunded:
    'Refunded — reversed',
  }

  return (
    uncountedLabels[order.status] ||
    'Not counted in sales'
  )
},

get selectedInventoryProduct() {
  const allInventoryItems = [
    ...this.inventoryProducts,
    ...this.packageSupplies,
  ]

  return (
    allInventoryItems.find(
      (inventoryItem) =>
        inventoryItem.id ===
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
    add: 'Stock Added',
    remove: 'Stock Removed',
    'order-sale': 'Order Deduction',
    'cancellation-return': 'Cancellation Return',
    'refund-return': 'Refund Return',
    'package-fulfillment':
    'Package Fulfillment',
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

    'refund-return':
    'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',

    'package-fulfillment':
    'border-brand-gold/40 bg-brand-gold/10 text-brand-gold',
  }

  return (
    typeClasses[type] ||
    'border-brand-border text-brand-muted'
  )
},

openInventoryAdjustment(
  inventoryItemId,
  adjustmentType = 'restock',
) {
  const inventoryItemExists = [
    ...this.inventoryProducts,
    ...this.packageSupplies,
  ].some(
    (inventoryItem) =>
      inventoryItem.id === inventoryItemId,
  )

  if (!inventoryItemExists) {
    return
  }

  this.selectedInventoryProductId =
  inventoryItemId

  this.inventoryAdjustmentType =
  adjustmentType

  this.inventoryAdjustmentQuantity = ''
  this.inventoryAdjustmentReason = ''
  this.inventoryAdjustmentError = ''
  this.inventoryAdjustmentOpen = true

  document.body.classList.add(
    'overflow-hidden',
  )
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
  const inventoryItem =
  this.selectedInventoryProduct

  if (!inventoryItem) {
    this.inventoryAdjustmentError =
    'The selected inventory item is unavailable.'

    return
  }

  const quantity = Number.parseInt(
    this.inventoryAdjustmentQuantity,
    10,
  )

  if (
    !Number.isInteger(quantity) ||
    quantity <= 0
  ) {
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
    inventoryItem.stockQuantity || 0,
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

  const isPackageSupply =
  this.packageSupplies.some(
    (supply) =>
      supply.id === inventoryItem.id,
  )

  const movement = {
    id: `inventory-movement-${Date.now()}`,

    product_id: inventoryItem.id,
    product_name: inventoryItem.name,

    inventory_item_type:
    isPackageSupply
    ? 'package-supply'
    : 'product',

    type: this.inventoryAdjustmentType,

    quantity: stockChange,
    previous_stock: previousStock,
    new_stock: newStock,

    reason,

    created_at: new Date().toISOString(),
  }

  if (isPackageSupply) {
    this.packageSupplies =
    this.packageSupplies.map(
      (supply) =>
        supply.id === inventoryItem.id
      ? {
        ...supply,
        stockQuantity: newStock,
      }
      : supply,
    )
  } else {
    this.inventoryProducts =
    this.inventoryProducts.map(
      (product) =>
        product.id === inventoryItem.id
      ? {
        ...product,
        stockQuantity: newStock,
      }
      : product,
    )
  }

  this.inventoryMovements.unshift(
    movement,
  )

  this.inventoryFeedback =
  `${inventoryItem.name} stock updated ` +
  `from ${previousStock} to ${newStock}.`

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
    refunded: 'bg-violet-400',
  }

  return (
    statusClasses[status] ||
    'bg-brand-muted'
  )
},

deductInventoryForOrder(order) {
  if (order.inventory_deducted) {
    return true
  }

  const quantitiesByProduct = new Map()

  order.items.forEach((item) => {
    const currentQuantity =
    quantitiesByProduct.get(item.product_id) || 0

    quantitiesByProduct.set(
      item.product_id,
      currentQuantity + Number(item.quantity || 0),
    )
  })

  for (
    const [productId, requiredQuantity]
    of quantitiesByProduct
  ) {
    const product = this.inventoryProducts.find(
      (inventoryProduct) =>
        inventoryProduct.id === productId,
    )

    if (!product) {
      this.orderReviewError =
      `Product ${productId} was not found in inventory.`

      return false
    }

    const availableStock = Number(
      product.stockQuantity || 0,
    )

    if (availableStock < requiredQuantity) {
      this.orderReviewError =
      `${product.name} only has ` +
      `${availableStock} available stock. ` +
      `${requiredQuantity} unit(s) are required.`

      return false
    }
  }

  const movementTime = new Date().toISOString()
  const newMovements = []

  this.inventoryProducts =
  this.inventoryProducts.map((product) => {
    const soldQuantity =
    quantitiesByProduct.get(product.id) || 0

    if (soldQuantity <= 0) {
      return product
    }

    const previousStock = Number(
      product.stockQuantity || 0,
    )

    const newStock =
    previousStock - soldQuantity

    newMovements.push({
      id:
      `inventory-movement-${order.id}-` +
      `${product.id}-${Date.now()}`,

      product_id: product.id,
      product_name: product.name,
      type: 'order-sale',
      quantity: -soldQuantity,
      previous_stock: previousStock,
      new_stock: newStock,
      reason:
      `Approved order ${order.order_number}`,
      order_id: order.id,
      order_number: order.order_number,
      created_at: movementTime,
    })

    return {
      ...product,
      stockQuantity: newStock,
    }
  })

  this.inventoryMovements.unshift(
    ...newMovements,
  )

  this.inventoryFeedback =
  `${order.order_number} approved. ` +
  `Inventory was updated automatically.`

  window.setTimeout(() => {
    this.inventoryFeedback = ''
  }, 4000)

  return true
},

restoreInventoryForOrder(order, movementType) {
  if (
    !order.inventory_deducted ||
    order.inventory_restored
  ) {
    return true
  }

  const quantitiesByProduct = new Map()

  order.items.forEach((item) => {
    const currentQuantity =
    quantitiesByProduct.get(item.product_id) || 0

    quantitiesByProduct.set(
      item.product_id,
      currentQuantity + Number(item.quantity || 0),
    )
  })

  for (const productId of quantitiesByProduct.keys()) {
    const productExists =
    this.inventoryProducts.some(
      (product) => product.id === productId,
    )

    if (!productExists) {
      this.orderReviewError =
      `Product ${productId} was not found in inventory.`

      return false
    }
  }

  const movementTime = new Date().toISOString()
  const newMovements = []

  this.inventoryProducts =
  this.inventoryProducts.map((product) => {
    const returnedQuantity =
    quantitiesByProduct.get(product.id) || 0

    if (returnedQuantity <= 0) {
      return product
    }

    const previousStock = Number(
      product.stockQuantity || 0,
    )

    const newStock =
    previousStock + returnedQuantity

    newMovements.push({
      id:
      `inventory-return-${order.id}-` +
      `${product.id}-${Date.now()}`,

      product_id: product.id,
      product_name: product.name,
      type: movementType,
      quantity: returnedQuantity,
      previous_stock: previousStock,
      new_stock: newStock,
      reason:
      movementType === 'refund-return'
      ? `Refunded order ${order.order_number}`
      : `Cancelled order ${order.order_number}`,
      order_id: order.id,
      order_number: order.order_number,
      created_at: movementTime,
    })

    return {
      ...product,
      stockQuantity: newStock,
    }
  })

  this.inventoryMovements.unshift(
    ...newMovements,
  )

  return true
},

openOrderReview(action) {
  if (!this.selectedOrder) {
    return
  }

  const pendingStatuses = [
    'pending_verification',
    'pending-verification',
  ]

  if (!pendingStatuses.includes(this.selectedOrder.status)) {
    this.orderReviewError =
      'Only pending verification orders can be reviewed here.'
    return
  }

  if (!['approve', 'reject'].includes(action)) {
    this.orderReviewError =
      'This order action is not available yet.'
    return
  }

  this.orderReviewAction = action
  this.orderReviewNote = ''
  this.orderReviewError = ''
  this.orderReviewPaymentVerified = false
  this.orderReviewPanelOpen = true
},

closeOrderReview() {
  this.orderReviewPanelOpen = false
  this.orderReviewAction = ''
  this.orderReviewNote = ''
  this.orderReviewError = ''
  this.orderReviewPaymentVerified = false
},

async submitOrderReview() {
  if (this.orderReviewSubmitting) return

  const order = this.selectedOrder

  if (!order) {
    this.orderReviewError =
      'Order details are unavailable.'
    return
  }

  const pendingStatuses = [
    'pending_verification',
    'pending-verification',
  ]

  if (!pendingStatuses.includes(order.status)) {
    this.orderReviewError =
      'Only pending verification orders can be reviewed here.'
    return
  }

  if (!['approve', 'reject'].includes(this.orderReviewAction)) {
    this.orderReviewError =
      'This order action is not available yet.'
    return
  }

  const adminNote = this.orderReviewNote.trim()

  if (
    this.orderReviewAction === 'reject' &&
    adminNote.length < 3
  ) {
    this.orderReviewError =
      'Add an admin note before rejecting this order.'
    return
  }

  if (adminNote.length > 300) {
    this.orderReviewError =
      'Admin note must not exceed 300 characters.'
    return
  }

  if (
    this.orderReviewAction === 'approve' &&
    !this.orderReviewPaymentVerified
  ) {
    this.orderReviewError =
      'Confirm that the actual payment was verified before approval.'
    return
  }

  if (
    this.orderReviewAction === 'approve' &&
    !order.payment_proof_path
  ) {
    this.orderReviewError =
      'Payment proof must be available before approval.'
    return
  }

  this.orderReviewSubmitting = true
  this.orderReviewError = ''

  try {
    const { data: nextStatus, error } = await supabase.rpc(
      'admin_review_order_payment',
      {
        p_order_id: order.id,
        p_action: this.orderReviewAction,
        p_admin_note: adminNote || null,
        p_payment_verified:
          this.orderReviewAction === 'approve' &&
          this.orderReviewPaymentVerified,
      },
    )

    if (error) throw error

    const reviewedAt = new Date().toISOString()

    const updateOrder = (orderItem) => {
      if (orderItem.id !== order.id) {
        return orderItem
      }

      return {
        ...orderItem,
        status: nextStatus,
        admin_note: adminNote || orderItem.admin_note,
        reviewed_at: reviewedAt,
        payment_approved_at:
          nextStatus === 'processing'
            ? reviewedAt
            : orderItem.payment_approved_at,
        payment_rejected_at:
          nextStatus === 'rejected'
            ? reviewedAt
            : orderItem.payment_rejected_at,
      }
    }

    if (Array.isArray(this.orders)) {
      this.orders = this.orders.map(updateOrder)
    }

    if (Array.isArray(this.liveOrders)) {
      this.liveOrders = this.liveOrders.map(updateOrder)
    }

    this.closeOrderReview()

    if (typeof this.loadLiveOrders === 'function') {
      await this.loadLiveOrders()
    }
  } catch (error) {
    console.error('Unable to review order payment:', error)

    this.orderReviewError =
      'Could not confirm the order review. Refresh and check the order status.'
  } finally {
    this.orderReviewSubmitting = false
  }
},

async updateOrderFulfillment(nextStatus) {
  if (this.orderFulfillmentSubmitting) return

  const order = this.selectedOrder

  if (!order) {
    this.orderFulfillmentError =
      'Order details are unavailable.'
    return
  }

  if (!['shipped', 'delivered'].includes(nextStatus)) {
    this.orderFulfillmentError =
      'This fulfillment action is not available.'
    return
  }

  if (
    nextStatus === 'shipped' &&
    order.status !== 'processing'
  ) {
    this.orderFulfillmentError =
      'Only processing orders can be marked as shipped.'
    return
  }

  if (
    nextStatus === 'delivered' &&
    order.status !== 'shipped'
  ) {
    this.orderFulfillmentError =
      'Only shipped orders can be marked as delivered.'
    return
  }

  this.orderFulfillmentSubmitting = true
  this.orderFulfillmentError = ''

  try {
    const { data: updatedStatus, error } =
      await supabase.rpc(
        'admin_update_order_fulfillment',
        {
          p_order_id: order.id,
          p_next_status: nextStatus,
          p_admin_note: null,
        },
      )

    if (error) throw error

    const reviewedAt = new Date().toISOString()

    const updateOrder = (orderItem) => {
      if (orderItem.id !== order.id) {
        return orderItem
      }

      return {
        ...orderItem,
        status: updatedStatus,
        reviewed_at: reviewedAt,
      }
    }

    if (Array.isArray(this.orders)) {
      this.orders = this.orders.map(updateOrder)
    }

    if (Array.isArray(this.liveOrders)) {
      this.liveOrders = this.liveOrders.map(updateOrder)
    }

    this.selectedOrder = {
      ...order,
      status: updatedStatus,
      reviewed_at: reviewedAt,
    }

    if (typeof this.loadLiveOrders === 'function') {
      await this.loadLiveOrders()
    }

    const refreshedOrder = this.liveOrders.find(
      (item) => item.id === order.id,
    )

    if (refreshedOrder) {
      this.selectedOrder = refreshedOrder
    }
  } catch (error) {
    console.error(
      'Unable to update order fulfillment:',
      error,
    )

    this.orderFulfillmentError =
      'Could not update fulfillment status. Refresh and check the order.'
  } finally {
    this.orderFulfillmentSubmitting = false
  }
},

async loadOrderPointsStatus(orderId) {
  this.orderPointsAwarded = false
  this.orderPointsMessage = ''
  this.orderPointsError = ''

  if (!orderId) return

  try {
    const { data, error } = await supabase
      .from('points_transactions')
      .select('id')
      .eq('order_id', orderId)
      .eq('type', 'order_award')
      .maybeSingle()

    if (error) throw error

    this.orderPointsAwarded = Boolean(data)
  } catch (error) {
    console.error('Unable to load order points status:', error)
  }
},

async awardOrderPoints() {
  if (this.orderPointsSubmitting) return

  const order = this.selectedOrder

  if (!order) {
    this.orderPointsError = 'Order details are unavailable.'
    return
  }

  if (order.status !== 'delivered') {
    this.orderPointsError =
      'Only delivered orders can receive points.'
    return
  }

  this.orderPointsSubmitting = true
  this.orderPointsMessage = ''
  this.orderPointsError = ''

  try {
    const { data: awardedPoints, error } = await supabase.rpc(
      'admin_award_order_points',
      {
        p_order_id: order.id,
      },
    )

    if (error) throw error

    this.orderPointsMessage =
      `${Number(awardedPoints || 0).toLocaleString('en-PH')} points awarded.`
      this.orderPointsAwarded = true
  } catch (error) {
    console.error('Unable to award order points:', error)

    this.orderPointsError =
      error?.message ||
      'Could not award points. Refresh and check the order.'
  } finally {
    this.orderPointsSubmitting = false
  }
},

async openOrderDetails(orderId) {
  const order = this.liveOrders.find((item) => item.id === orderId)
  if (!order) return

  this.closeApplicationDetails()
  this.selectedOrderId = orderId
  this.orderProofUrl = ''
  this.orderProofError = ''
  this.orderProofLoading = Boolean(order.payment_proof_path)
  this.orderDetailsOpen = true
  await this.loadOrderPointsStatus(orderId)
  document.body.classList.add('overflow-hidden')

  if (!order.payment_proof_path) return

  try {
    const { data, error } = await supabase.storage
      .from('payment-proofs')
      .createSignedUrl(order.payment_proof_path, 300)

    if (error) throw error

    if (this.selectedOrderId === orderId && this.orderDetailsOpen) {
      this.orderProofUrl = data.signedUrl
    }
  } catch (error) {
    console.error('Unable to load order payment proof:', error)

    if (this.selectedOrderId === orderId && this.orderDetailsOpen) {
      this.orderProofError =
        'Unable to load payment proof. Close and reopen this order.'
    }
  } finally {
    if (this.selectedOrderId === orderId) {
      this.orderProofLoading = false
    }
  }
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

async confirmPackageAllocation() {
  if (!this.validatePackageAllocation()) {
    return
  }

  const application = this.selectedApplication
  const selectedPackage = application?.package

  if (!application || !selectedPackage) {
    this.packageAllocationError =
      'Package information is unavailable.'
    return
  }

  if (application.package_inventory_deducted) {
    this.packageAllocationError =
      'This package has already been confirmed.'
    return
  }

  const packageAllocation = this.inventoryProducts
    .map((product) => ({
      product_id: product.id,
      product_name: product.name,
      product_image_url: product.image,
      quantity: Number(
        this.packageAllocationQuantities[product.id] || 0,
      ),
    }))
    .filter((allocation) => allocation.quantity > 0)

  this.packageAllocationError = ''

  try {
    const { data: nextStatus, error } = await supabase.rpc(
      'admin_confirm_package_allocation',
      {
        p_application_id: application.id,
        p_allocation: packageAllocation,
      },
    )

    if (error) throw error

    this.inventoryFeedback =
      'Package inventory deducted and marked ready for packing.'

    if (typeof this.loadMembershipApplications === 'function') {
      await this.loadMembershipApplications()
    }

    if (typeof this.loadLiveProducts === 'function') {
      await this.loadLiveProducts()
    }

    if (typeof this.loadStockHistory === 'function') {
      await this.loadStockHistory()
    }

    const updatedApplication = this.applications.find(
      (applicationItem) => applicationItem.id === application.id,
    )

    if (updatedApplication) {
      this.selectedApplicationId = updatedApplication.id
    }

    this.packageAllocationError = ''
  } catch (error) {
    console.error('Unable to confirm package allocation:', error)

    this.packageAllocationError =
      error?.message ||
      'Could not confirm package allocation. Refresh and check inventory.'
  }
},

openPackageFulfillmentAction(action) {
  const application = this.selectedApplication

  if (!application) {
    this.packageFulfillmentError =
    'Application details are unavailable.'
    return
  }

  const requiredStatusByAction = {
    ship: 'ready-for-packing',
    unship: 'shipped',
    complete: 'shipped',
  }

  const requiredStatus =
  requiredStatusByAction[action]

  if (
    !requiredStatus ||
    application.fulfillment_status !==
    requiredStatus
  ) {
    this.packageFulfillmentError =
    'This package action is not available for the current status.'
    return
  }

  this.packageFulfillmentAction = action
  this.packageFulfillmentError = ''
},

closePackageFulfillmentAction() {
  this.packageFulfillmentAction = ''
  this.packageFulfillmentError = ''
},

confirmPackageFulfillmentAction() {
  const application = this.selectedApplication

  if (!application) {
    this.packageFulfillmentError =
    'Application details are unavailable.'
    return
  }

  const nextStatusByAction = {
    ship: 'shipped',
    unship: 'ready-for-packing',
    complete: 'completed',
  }

  const requiredStatusByAction = {
    ship: 'ready-for-packing',
    unship: 'shipped',
    complete: 'shipped',
  }

  const action = this.packageFulfillmentAction
  const nextStatus = nextStatusByAction[action]
  const requiredStatus =
  requiredStatusByAction[action]

  if (
    !nextStatus ||
    !requiredStatus ||
    application.fulfillment_status !==
    requiredStatus
  ) {
    this.packageFulfillmentError =
    'This package action is no longer available.'
    return
  }

  const applicationIndex =
  this.applications.findIndex(
    (applicationItem) =>
      applicationItem.id === application.id,
  )

  if (applicationIndex === -1) {
    this.packageFulfillmentError =
    'The membership application could not be found.'
    return
  }

  const updatedAt = new Date().toISOString()

  this.applications[applicationIndex] = {
    ...this.applications[applicationIndex],

    fulfillment_status: nextStatus,

    package_shipped_at:
    action === 'ship'
    ? updatedAt
    : action === 'unship'
    ? null
    : this.applications[applicationIndex]
    .package_shipped_at || null,

    package_completed_at:
    action === 'complete'
    ? updatedAt
    : this.applications[applicationIndex]
    .package_completed_at || null,

    updated_at: updatedAt,
  }

  this.closePackageFulfillmentAction()
},

get reviewActionTitle() {
  const titles = {
    'approve-membership': 'Approve membership',
    'reject-payment': 'Reject payment',
  }

  return titles[this.reviewAction] || 'Review application'
},

get reviewActionDescription() {
  const descriptions = {
    'approve-membership':
      'This will activate the customer membership after verified payment.',

    'reject-payment':
      'This will reject the submitted payment and keep the customer as a free account.',
  }

  return descriptions[this.reviewAction] || ''
},

openReviewPanel(actionName) {
  if (
    !this.selectedApplication ||
    this.selectedApplication.status !== 'pending-verification'
  ) {
    return
  }

  const allowedActions = [
    'approve-membership',
    'reject-payment',
  ]

  if (!allowedActions.includes(actionName)) {
    return
  }

  this.reviewAction = actionName
  this.reviewNote = ''
  this.reviewError = ''
  this.reviewPaymentVerified = false
  this.reviewPanelOpen = true
},

closeReviewPanel() {
  this.reviewPanelOpen = false
  this.reviewAction = ''
  this.reviewNote = ''
  this.reviewError = ''
  this.reviewPaymentVerified = false
},

async confirmReviewAction() {
  if (this.reviewSubmitting) return

  const selectedApplication = this.selectedApplication

  if (!selectedApplication) {
    this.reviewError = 'Application details are unavailable.'
    return
  }

  if (selectedApplication.status !== 'pending-verification') {
    this.reviewError =
      'Only pending verification applications can be reviewed.'
    return
  }

  const normalizedNote = this.reviewNote.trim()

  if (
    this.reviewAction === 'reject-payment' &&
    normalizedNote.length < 3
  ) {
    this.reviewError =
      'Enter a short admin note before rejecting this payment.'
    return
  }

  if (normalizedNote.length > 300) {
    this.reviewError =
      'Admin note must not exceed 300 characters.'
    return
  }

  if (
    this.reviewAction === 'approve-membership' &&
    !this.reviewPaymentVerified
  ) {
    this.reviewError =
      'Confirm that the actual payment was verified before approval.'
    return
  }

  if (
    this.reviewAction === 'approve-membership' &&
    !this.applicationProofUrl
  ) {
    this.reviewError =
      'Payment proof must be available before approval.'
    return
  }

  const reviewActionMap = {
    'approve-membership': 'approve',
    'reject-payment': 'reject',
  }

  const rpcAction = reviewActionMap[this.reviewAction]

  if (!rpcAction) {
    this.reviewError = 'Select a valid review action.'
    return
  }

  this.reviewSubmitting = true
  this.reviewError = ''

  try {
    const { data: nextStatus, error } = await supabase.rpc(
      'admin_review_membership_application',
      {
        p_application_id: selectedApplication.id,
        p_action: rpcAction,
        p_admin_note: normalizedNote || null,
        p_payment_verified:
          rpcAction === 'approve' &&
          this.reviewPaymentVerified,
      },
    )

    if (error) throw error

    const expectedStatus =
      rpcAction === 'approve'
        ? 'approved'
        : 'rejected'

    if (nextStatus !== expectedStatus) {
      throw new Error('Unexpected review status returned.')
    }

    const reviewedAt = new Date().toISOString()

    this.applications = this.applications.map((application) => {
      if (application.id !== selectedApplication.id) {
        return application
      }

      return {
        ...application,
        status: nextStatus,
        admin_note: normalizedNote || application.admin_note,
        reviewed_at: reviewedAt,
        updated_at: reviewedAt,
        approved_at:
          nextStatus === 'approved'
            ? reviewedAt
            : application.approved_at,
        membership_activated_at:
          nextStatus === 'approved'
            ? reviewedAt
            : application.membership_activated_at,
        fulfillment_status:
          nextStatus === 'approved'
            ? 'pending-allocation'
            : application.fulfillment_status,
      }
    })

    this.closeReviewPanel()

    if (typeof this.closeApplicationDetails === 'function') {
      this.closeApplicationDetails()
    }

    if (typeof this.loadApplications === 'function') {
      await this.loadApplications()
    } else if (
      typeof this.loadMembershipApplications === 'function'
    ) {
      await this.loadMembershipApplications()
    }
  } catch (error) {
    console.error('Unable to review membership application:', error)

    this.reviewError =
      'Could not confirm the review. Refresh and check the application status.'
  } finally {
    this.reviewSubmitting = false
  }
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

initializePackageAllocation() {
  const initialQuantities = {}

  this.inventoryProducts.forEach(
    (product) => {
      initialQuantities[product.id] = 0
    },
  )

  const savedAllocation =
  this.selectedApplication
  ?.package_allocation || []

  savedAllocation.forEach((item) => {
    if (
      Object.hasOwn(
        initialQuantities,
        item.product_id,
      )
    ) {
      initialQuantities[item.product_id] =
      Number(item.quantity || 0)
    }
  })

  this.packageAllocationQuantities =
  initialQuantities

  this.packageAllocationError = ''
},

membershipFulfillmentStatusLabel(status) {
  return (
    this.membershipFulfillmentStatusLabels[
      status
    ] ||
    status ||
    'Not Ready'
  )
},

packageSupplyStock(supplyId) {
  const supply = this.packageSupplies.find(
    (packageSupply) =>
      packageSupply.id === supplyId,
  )

  return Number(
    supply?.stockQuantity || 0,
  )
},

updatePackageAllocationQuantity(
  productId,
  rawValue,
) {
  const product =
  this.inventoryProducts.find(
    (inventoryProduct) =>
      inventoryProduct.id === productId,
  )

  if (!product) {
    this.packageAllocationError =
    'The selected product is unavailable.'

    return
  }

  const availableStock = Number(
    product.stockQuantity || 0,
  )

  const requestedQuantity =
  rawValue === ''
  ? 0
  : Number.parseInt(rawValue, 10)

  if (
    !Number.isInteger(requestedQuantity) ||
    requestedQuantity < 0
  ) {
    this.packageAllocationQuantities = {
      ...this.packageAllocationQuantities,
      [productId]: 0,
    }

    this.packageAllocationError =
    `Enter a valid quantity for ${product.name}.`

    return
  }

  const safeQuantity = Math.min(
    requestedQuantity,
    availableStock,
  )

  this.packageAllocationQuantities = {
    ...this.packageAllocationQuantities,
    [productId]: safeQuantity,
  }

  if (requestedQuantity > availableStock) {
    this.packageAllocationError =
    `${product.name} only has ` +
    `${availableStock} available stock.`

    return
  }

  this.validatePackageAllocation()
},

validatePackageAllocation() {
  const application =
  this.selectedApplication

  const selectedPackage =
  application?.package

  if (!application || !selectedPackage) {
    this.packageAllocationError =
    'Package information is unavailable.'

    return false
  }

  if (application.status !== 'approved') {
    this.packageAllocationError =
    'The membership payment must be approved before package allocation.'

    return false
  }

  if (
    application.package_inventory_deducted
  ) {
    this.packageAllocationError =
    'This package has already been confirmed.'

    return false
  }

  for (const product of this.inventoryProducts) {
    const rawQuantity =
    this.packageAllocationQuantities[
      product.id
    ]

    const quantity =
    rawQuantity === '' ||
    rawQuantity === undefined
    ? 0
    : Number(rawQuantity)

    if (
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      this.packageAllocationError =
      `Enter a valid quantity for ${product.name}.`

      return false
    }

    const availableStock = Number(
      product.stockQuantity || 0,
    )

    if (quantity > availableStock) {
      this.packageAllocationError =
      `${product.name} only has ` +
      `${availableStock} available stock.`

      return false
    }
  }

  const requiredQuantity = Number(
    selectedPackage.productQuantity || 0,
  )

  if (
    this.packageAllocationTotal <
    requiredQuantity
  ) {
    const remainingQuantity =
    requiredQuantity -
    this.packageAllocationTotal

    this.packageAllocationError =
    `Add ${remainingQuantity} more bottle` +
    `${remainingQuantity === 1 ? '' : 's'} ` +
    `to complete this package.`

    return false
  }

  if (
    this.packageAllocationTotal >
    requiredQuantity
  ) {
    const excessQuantity =
    this.packageAllocationTotal -
    requiredQuantity

    this.packageAllocationError =
    `Remove ${excessQuantity} bottle` +
    `${excessQuantity === 1 ? '' : 's'}. ` +
    `The package limit cannot be exceeded.`

    return false
  }

  for (
    const inclusion of
    selectedPackage.fixedInventoryItems
  ) {
    const availableStock =
    this.packageSupplyStock(
      inclusion.inventoryItemId,
    )

    const requiredStock = Number(
      inclusion.quantity || 0,
    )

    if (availableStock < requiredStock) {
      this.packageAllocationError =
      `${inclusion.name} only has ` +
      `${availableStock} available. ` +
      `${requiredStock} required.`

      return false
    }
  }

  this.packageAllocationError = ''

  return true
},

formatMoney(amount) {
  return adminPesoFormatter.format(amount || 0)
},

formatOptionalMoney(
  amount,
  fallback = 'Pending confirmation',
) {
  if (
    amount === null ||
    amount === undefined ||
    amount === ''
  ) {
    return fallback
  }

  const numericAmount = Number(amount)

  if (!Number.isFinite(numericAmount)) {
    return fallback
  }

  return adminPesoFormatter.format(
    numericAmount,
  )
},

formatDate(dateValue) {
  if (!dateValue) {
    return 'Not available'
  }

  return adminDateFormatter.format(new Date(dateValue))
},

formatCurrency(value) {
  return adminPesoFormatter.format(Number(value || 0))
},

csvEscape(value) {
  const text =
    value === null || value === undefined
      ? ''
      : String(value)

  return `"${text.replace(/"/g, '""')}"`
},

downloadCsv(filename, rows) {
  const csvContent = rows
    .map((row) =>
      row.map((value) => this.csvEscape(value)).join(','),
    )
    .join('\r\n')

  const blob = new Blob([`\uFEFF${csvContent}`], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(url)
},

exportSalesCsv() {
  const rows = [
    [
      'Order ID',
      'Customer',
      'Email',
      'Status',
      'Submitted At',
      'Approved At',
      'Subtotal',
      'Total Amount',
    ],
    ...this.approvedOrders.map((order) => [
      order.id,
      order.customer_name || '',
      order.customer_email || '',
      order.status || '',
      order.submitted_at || order.created_at || '',
      order.approved_at || '',
      Number(order.subtotal || 0),
      Number(order.total_amount || order.subtotal || 0),
    ]),
  ]

  this.downloadCsv(
    `your-product-sales-${new Date().toISOString().slice(0, 10)}.csv`,
    rows,
  )
},

salesPeriodStart(period) {
  const now = new Date()

  if (period === 'today') {
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)
    return start
  }

  if (period === 'week') {
    const start = new Date(now)
    const daysSinceMonday = (start.getDay() + 6) % 7

    start.setDate(start.getDate() - daysSinceMonday)
    start.setHours(0, 0, 0, 0)

    return start
  }

  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  )

  start.setHours(0, 0, 0, 0)

  return start
},

ordersBetween(startDate, endDate) {
  return this.approvedOrders.filter((order) => {
    const approvedDate = this.approvedOrderDate(order)

    return (
      approvedDate &&
      approvedDate >= startDate &&
      approvedDate <= endDate
    )
  })
},

exportSalesSummaryCsv() {
  const now = new Date()

  const periods = [
    ['Today', this.salesPeriodStart('today'), now],
    ['This Week', this.salesPeriodStart('week'), now],
    ['This Month', this.salesPeriodStart('month'), now],
  ]

  const rows = [
    [
      'Period',
      'Start Date',
      'End Date',
      'Product Sales',
      'Orders Count',
    ],
    ...periods.map(([label, startDate, endDate]) => {
      const orders = this.ordersBetween(startDate, endDate)
      const total = orders.reduce(
        (sum, order) =>
          sum + Number(order.subtotal || 0),
        0,
      )

      return [
        label,
        `'${startDate.toLocaleDateString('en-PH')}`,
        `'${endDate.toLocaleDateString('en-PH')}`,
        adminPesoFormatter.format(total),
        orders.length,
      ]
    }),
  ]

  this.downloadCsv(
    `your-product-sales-summary-${new Date().toISOString().slice(0, 10)}.csv`,
    rows,
  )
},

orderStatusLabel(status) {
  const labels = {
    pending_verification: 'Pending Verification',
    'pending-verification': 'Pending Verification',
    rejected: 'Payment Rejected',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    completed: 'Completed',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  }

  return labels[status] || String(status || 'Unknown')
    .replaceAll('_', ' ')
},

orderStatusBadgeClass(status) {
  const classes = {
    pending_verification:
      'border-amber-300/40 bg-amber-400/10 text-amber-200',
    'pending-verification':
      'border-amber-300/40 bg-amber-400/10 text-amber-200',
    rejected:
      'border-red-300/40 bg-red-400/10 text-red-200',
    processing:
      'border-sky-300/40 bg-sky-400/10 text-sky-200',
    shipped:
      'border-blue-300/40 bg-blue-400/10 text-blue-200',
    delivered:
      'border-emerald-300/40 bg-emerald-400/10 text-emerald-200',
    completed:
      'border-emerald-300/40 bg-emerald-400/10 text-emerald-200',
    cancelled:
      'border-zinc-300/40 bg-zinc-400/10 text-zinc-200',
    refunded:
      'border-purple-300/40 bg-purple-400/10 text-purple-200',
  }

  return classes[status] ||
    'border-brand-border bg-brand-black/40 text-brand-muted'
},

async openApplicationDetails(applicationId) {
  const application = this.applications.find(
    (item) => item.id === applicationId,
  )
  if (!application) return

  const requestId = ++this.applicationProofRequestId
  this.selectedApplicationId = applicationId
  this.applicationProofUrl = ''
  this.applicationProofError = ''
  this.applicationProofLoading = Boolean(application.payment_proof_path)

  this.initializePackageAllocation()
  this.applicationDetailsOpen = true
  document.body.classList.add('overflow-hidden')

  if (!application.payment_proof_path) return

  try {
    const { data, error } = await supabase.storage
      .from('payment-proofs')
      .createSignedUrl(application.payment_proof_path, 300)

    if (error) throw error

    if (
      requestId === this.applicationProofRequestId &&
      this.applicationDetailsOpen
    ) {
      this.applicationProofUrl = data.signedUrl
    }
  } catch (error) {
    console.error('Unable to load membership payment proof:', error)

    if (
      requestId === this.applicationProofRequestId &&
      this.applicationDetailsOpen
    ) {
      this.applicationProofError =
        'Unable to load payment proof. Close and reopen this application.'
    }
  } finally {
    if (requestId === this.applicationProofRequestId) {
      this.applicationProofLoading = false
    }
  }
},

closeApplicationDetails() {
  this.applicationProofRequestId++
  this.applicationProofUrl = ''
  this.applicationProofLoading = false
  this.applicationProofError = ''
  this.closeReviewPanel()
  this.closePackageFulfillmentAction()
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

      this.packageAllocationQuantities = {}
      this.packageAllocationError = ''
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

async init() {
  await this.loadLiveOrders()
},

async loadLiveOrders() {
  this.liveOrdersLoading = true
  this.liveOrdersError = ''

  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id, status, subtotal, delivery_fee, created_at,
        customer_details, delivery_details,
        payment_method, payment_proof_path,
        order_items(id, product_name, quantity, unit_price)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    this.liveOrders = data ?? []
  } catch (error) {
    console.error('Unable to load live orders:', error)
    this.liveOrders = []
    this.liveOrdersError =
      'Unable to load orders. Please refresh this page.'
  } finally {
    this.liveOrdersLoading = false
  }
},

async logOut() {
  if (this.isLoggingOut) return

  this.isLoggingOut = true
  this.logoutError = ''

  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    document.body.classList.remove('overflow-hidden')
    window.location.replace('/login/')
  } catch (error) {
    console.error('Unable to log out of admin dashboard:', error)
    this.logoutError = 'Unable to log out. Please try again.'
    this.isLoggingOut = false
  }
},

destroy() {
  document.body.classList.remove('overflow-hidden')
},
}))

async function startAdminDashboard() {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    window.location.replace('/login/')
    return
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, account_status')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    console.error('Unable to check admin access:', profileError)
    document.querySelector('#admin-app').textContent =
      'Unable to check access. Please refresh.'
    return
  }

  if (profile.role !== 'admin' || profile.account_status !== 'active') {
    window.location.replace('/dashboard/')
    return
  }

document.title = `Admin Dashboard | ${siteConfig.brand.name}`

document.querySelector('#admin-app').innerHTML = `
   <div
    x-data="adminDashboard"
    x-init="loadLiveProducts(); loadStockHistory(); loadAdminCustomers(); loadMembershipApplications(); loadOverviewMetrics()"
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
              In Development
            </span>

            <a
  href="/"
  class="text-xs font-semibold text-brand-muted transition hover:text-brand-gold sm:text-sm"
>
  View Store
</a>

<button
  type="button"
  class="text-xs font-semibold text-brand-muted transition hover:text-brand-gold disabled:opacity-50 sm:text-sm"
  @click="logOut()"
  :disabled="isLoggingOut"
  x-text="isLoggingOut ? 'Logging out...' : 'Log out'"
></button>

<p
  x-show="logoutError"
  x-text="logoutError"
  class="text-xs text-red-300"
  role="alert"
></p>
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

          <div class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  <article class="rounded-[1.4rem] border border-brand-border bg-brand-panel p-5 shadow-panel">
    <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
      Pending Applications
    </p>

    <strong
      class="mt-4 block font-display text-4xl text-brand-cream"
      x-text="pendingVerificationCount"
    ></strong>

    <p class="mt-2 text-xs leading-5 text-brand-muted">
      Waiting for payment review
    </p>
  </article>

  <article class="rounded-[1.4rem] border border-brand-border bg-brand-panel p-5 shadow-panel">
    <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
      Cancellation Requests
    </p>

    <strong
      class="mt-4 block font-display text-4xl text-brand-cream"
      x-text="cancellationRequestCount"
    ></strong>

    <p class="mt-2 text-xs leading-5 text-brand-muted">
      Waiting for manual review
    </p>
  </article>

  <article class="rounded-[1.4rem] border border-brand-border bg-brand-panel p-5 shadow-panel">
    <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
      Pending Orders
    </p>

    <strong
      class="mt-4 block font-display text-4xl text-brand-cream"
      x-text="overviewPendingOrders === null ? '—' : overviewPendingOrders"
    ></strong>

    <p class="mt-2 text-xs leading-5 text-brand-muted">
      Regular product orders
    </p>
  </article>

  <article class="rounded-[1.4rem] border border-brand-gold/40 bg-brand-panel p-5 shadow-gold-soft">
    <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
      Active Members
    </p>

    <strong
      class="mt-4 block font-display text-4xl text-brand-gold"
      x-text="overviewActiveMembers === null ? '—' : overviewActiveMembers"
    ></strong>

    <p class="mt-2 text-xs leading-5 text-brand-muted">
      Approved memberships
    </p>
  </article>
</div>

<div class="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
  <section class="rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6">
    <p class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold">
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
  x-text="overviewPendingOrders === null ? '—' : overviewPendingOrders"
></span>
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
                Integration in progress
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
                   Live data connected
                  </strong>
                </div>

                <p
                  class="mt-2 text-xs leading-5 text-emerald-100/80"
                >
                  Authentication, orders, customers, products, inventory, memberships, referrals, payouts, and points are connected.
                </p>
              </div>
            </aside>
          </div>
        </section>

        ${renderMembershipApplicationsPage()}

${renderOrdersPage()}

${renderAdminSalesInventoryPage()}

${renderAdminCustomersPage()}

${renderAdminProductsPage()}

${renderAdminReferralsPayoutsPage()}

${renderAdminPointsAuditPage()}

${adminNavigationItems
  .filter(
    (item) =>
      item.id !== 'overview' &&
      item.id !== 'memberships' &&
      item.id !== 'orders' &&
      item.id !== 'sales-inventory' &&
      item.id !== 'customers' &&
      item.id !== 'products' &&
      item.id !== 'referrals-payouts' &&
      item.id !== 'points-audit',
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
}

startAdminDashboard()
