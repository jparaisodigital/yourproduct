import './style.css'

import Alpine from 'alpinejs'

import { supabase } from './lib/supabase.js'

import logoImage from './assets/logoyourproduct.webp'

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
    label: 'Points & Rewards',
  },
  {
    id: 'customers',
    label: 'Customers',
  },
]

const adminPageTitles = {
  overview: 'Overview',
  memberships: 'Membership Applications',
  orders: 'Orders',
  'sales-inventory': 'Sales & Inventory',
  'referrals-payouts': 'Referrals & Payouts',
  'points-audit': 'Points & Rewards',
  customers: 'Customers',
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

function sortAdminProducts(products) {
  return [...products].sort((firstProduct, secondProduct) => {
    if (firstProduct.id === 'tester-kit') {
      return -1
    }

    if (secondProduct.id === 'tester-kit') {
      return 1
    }

    return String(firstProduct.sku || '').localeCompare(
      String(secondProduct.sku || ''),
      undefined,
      {
        numeric: true,
      },
    )
  })
}

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

          <button
            type="button"
            class="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-brand-border px-4 text-xs font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="isLoggingOut"
            @click="logOut()"
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
                d="M10 17l5-5-5-5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>

              <path
                d="M15 12H3"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>

              <path
                d="M21 4v16"
                stroke-linecap="round"
              ></path>
            </svg>

            <span x-text="isLoggingOut ? 'Logging out...' : 'Log out'"></span>
          </button>
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
            class="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem_12rem_12rem]"
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

            <label class="block">
  <span class="sr-only">
    From date
  </span>

  <input
    x-model="applicationDateFrom"
    type="date"
    class="min-h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
  >
</label>

<label class="block">
  <span class="sr-only">
    To date
  </span>

  <input
    x-model="applicationDateTo"
    type="date"
    class="min-h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
  >
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
  applicationStatusFilter !== 'all' ||
  applicationDateFrom ||
  applicationDateTo
"
              type="button"
              class="text-xs font-semibold text-brand-gold transition hover:text-brand-gold-light"
              @click="
  applicationSearch = '';
  applicationStatusFilter = 'all';
  applicationDateFrom = '';
  applicationDateTo = '';
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

  <p
  x-show="
    application.status === 'approved' &&
    application.fulfillment_status === 'not-ready'
  "
  class="mt-2 text-xs font-semibold text-brand-gold"
>
  Next step: Allocate assorted perfumes.
</p>

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

                    <p
  x-show="application.packageOption"
  class="mt-1 text-xs font-semibold text-brand-gold"
  x-text="
    application.packageOption
      ? application.packageOption.label + ' - ' + application.packageOption.title
      : ''
  "
></p>

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
                      : pendingOrderCount
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
          x-show="
            !liveOrdersLoading &&
            !liveOrdersError &&
            liveOrders.length > 0
          "
          class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel"
        >
          <div class="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto] lg:items-end">
            <label class="block">
              <span class="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-muted">
                Search orders
              </span>

              <input
                type="search"
                x-model.debounce.250ms="orderSearch"
                placeholder="Search name, email, order ID, product..."
                class="mt-2 h-11 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
              />
            </label>

            <label class="block">
              <span class="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-muted">
                Status
              </span>

              <select
                x-model="orderStatusFilter"
                class="mt-2 h-11 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
              >
                <option value="all">All statuses</option>
                <option value="pending-verification">Pending verification</option>
                <option value="approved">Approved</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>

<label class="block">
  <span class="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-muted">
    From date
  </span>

  <input
    x-model="orderDateFrom"
    type="date"
    class="mt-2 h-11 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
  />
</label>

<label class="block">
  <span class="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-muted">
    To date
  </span>

  <input
    x-model="orderDateTo"
    type="date"
    class="mt-2 h-11 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
  />
</label>

            <label class="block">
              <span class="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-muted">
                Customer Type
              </span>

              <select
                x-model="orderCustomerTypeFilter"
                class="mt-2 h-11 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
              >
                <option value="all">All customers</option>
                <option value="regular">Free Customer</option>
                <option value="member">Member</option>
              </select>
            </label>

            <button
              type="button"
              class="inline-flex h-11 items-center justify-center rounded-xl border border-brand-border px-4 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
              @click="
                orderSearch = '';
orderStatusFilter = 'all';
orderDateFrom = '';
orderDateTo = '';
orderCustomerTypeFilter = 'all';
              "
            >
              Reset
            </button>
          </div>

          <p
            class="mt-4 text-xs text-brand-muted"
            x-text="filteredLiveOrders.length + ' of ' + liveOrders.length + ' orders shown'"
          ></p>
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
            liveOrders.length > 0 &&
            filteredLiveOrders.length === 0
          "
          class="mt-6 rounded-[1.5rem] border border-dashed border-brand-border bg-brand-panel px-6 py-14 text-center"
        >
          <h2 class="font-display text-2xl text-brand-cream">
            No matching orders
          </h2>

          <p class="mt-2 text-sm leading-6 text-brand-muted">
            Try changing the search or filters.
          </p>
        </div>

        <div
          x-show="
            !liveOrdersLoading &&
            !liveOrdersError &&
            filteredLiveOrders.length > 0
          "
          class="mt-6 space-y-4"
        >
          <template x-for="order in filteredLiveOrders" :key="order.id">
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

<div class="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:max-w-2xl">
  <p class="text-brand-muted">
  Customer name:
  <span
    class="font-semibold text-brand-cream"
    x-text="[order.customer_details?.firstName, order.customer_details?.lastName].filter(Boolean).join(' ') || 'No name'"
  ></span>
</p>

<p class="text-brand-muted">
  Customer type:
  <span
    class="font-semibold text-brand-cream"
    x-text="order.customer_type === 'member' ? 'Member' : 'Free Customer'"
  ></span>
</p>

  <p class="text-brand-muted">
    Items:
    <span
      class="font-semibold text-brand-cream"
      x-text="formatMoney(order.subtotal)"
    ></span>
  </p>

  <p class="text-brand-muted">
    Delivery fee:
    <span
      class="font-semibold text-brand-cream"
      x-text="order.delivery_fee === null ? 'To be confirmed' : formatMoney(order.delivery_fee)"
    ></span>
  </p>

  <p class="text-brand-muted">
    Points earned:
    <span
      class="font-semibold text-brand-gold"
      x-text="'+' + Number(order.pointsAwarded || 0).toLocaleString('en-PH')"
    ></span>
  </p>

  <p class="text-brand-muted sm:col-span-2">
    Total:
    <span
      class="font-semibold text-brand-gold"
      x-text="formatMoney(Number(order.subtotal || 0) + Number(order.delivery_fee || 0))"
    ></span>
  </p>
</div>

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

function getOrderItemImage(item) {
  const productId = String(item.product_id || '').trim()
  const productName = String(item.product_name || '').trim()
  const productSku = productName.toUpperCase()

  const matchedProduct = adminInventoryProducts.find((product) => {
    const id = String(product.id || '').trim()
    const sku = String(product.sku || '').trim().toUpperCase()
    const name = String(product.name || '').trim()

    return (
      id === productId ||
      sku === productSku ||
      name === productName
    )
  })

  return matchedProduct?.image || item.product_image_url || ''
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
  <h3
    class="font-semibold text-brand-cream"
    x-text="selectedOrder.delivery_details.fulfillmentType === 'pickup' ? 'Pickup' : 'Delivery'"
  ></h3>

  <div
    x-show="selectedOrder.delivery_details.fulfillmentType === 'pickup'"
    class="mt-3 rounded-xl border border-brand-gold/30 bg-brand-gold/10 px-4 py-3"
  >
    <p class="text-sm font-semibold text-brand-cream">
      Customer will pick up this order.
    </p>

    <p class="mt-2 text-sm leading-6 text-brand-muted">
      1244 Gen. Jacinto St, Makati City, Metro Manila
    </p>

    <p class="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-gold">
      No delivery fee
    </p>
  </div>

  <div x-show="selectedOrder.delivery_details.fulfillmentType !== 'pickup'">
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
  </div>
</section>

          <section class="rounded-xl border border-brand-border bg-brand-black p-5">
            <h3 class="font-semibold text-brand-cream">Items</h3>
            <template x-for="item in selectedOrder.order_items || []" :key="item.id">
              <div class="mt-3 flex items-center justify-between gap-4 border-t border-brand-border pt-3 text-sm">
  <div class="flex min-w-0 items-center gap-3">
    <div class="size-14 shrink-0 overflow-hidden rounded-xl border border-brand-border bg-brand-panel">
    <img
  x-show="item.imageUrl"
  :src="item.imageUrl"
  :alt="item.product_name"
  class="size-full object-cover"
    >
    </div>

    <div class="min-w-0">
      <p
        class="truncate text-brand-cream"
        x-text="item.product_name"
      ></p>

      <p
        class="mt-1 text-xs text-brand-muted"
        x-text="'Qty: ' + item.quantity"
      ></p>
    </div>
  </div>

  <span
    class="shrink-0 text-brand-gold"
    x-text="formatMoney(Number(item.unit_price) * item.quantity)"
  ></span>
</div>
            </template>
            <div class="mt-5 rounded-xl border border-brand-border bg-brand-panel p-4">
  <h4 class="text-sm font-semibold text-brand-cream">
    Order Summary
  </h4>

  <dl class="mt-3 space-y-2 text-sm">
  <div class="flex items-center justify-between gap-4">
    <dt class="text-brand-muted">Customer name</dt>
    <dd
      class="font-semibold text-brand-cream text-right"
      x-text="[selectedOrder.customer_details?.firstName, selectedOrder.customer_details?.lastName].filter(Boolean).join(' ') || 'No name'"
    ></dd>
  </div>

  <div class="flex items-center justify-between gap-4">
    <dt class="text-brand-muted">Customer type</dt>
    <dd
      class="font-semibold text-brand-cream"
      x-text="selectedOrder.customer_type === 'member' ? 'Member' : 'Free Customer'"
    ></dd>
  </div>

  <div class="flex items-center justify-between gap-4">
    <dt class="text-brand-muted">Items subtotal</dt>
    <dd
      class="font-semibold text-brand-cream"
      x-text="formatMoney(selectedOrder.subtotal)"
    ></dd>
  </div>

  <div class="flex items-center justify-between gap-4">
    <dt class="text-brand-muted">Delivery fee</dt>
    <dd
      class="font-semibold text-brand-cream"
      x-text="selectedOrder.delivery_fee === null ? 'To be confirmed' : formatMoney(selectedOrder.delivery_fee)"
    ></dd>
  </div>

  <div class="flex items-center justify-between gap-4">
    <dt class="text-brand-muted">Points earned</dt>
    <dd
      class="font-semibold text-brand-gold"
      x-text="'+' + Number(selectedOrder.pointsAwarded || 0).toLocaleString('en-PH')"
    ></dd>
  </div>

  <div class="border-t border-brand-border pt-2 flex items-center justify-between gap-4">
    <dt class="font-semibold text-brand-cream">Total order amount</dt>
    <dd
      class="font-display text-lg text-brand-gold"
      x-text="formatMoney(Number(selectedOrder.subtotal || 0) + Number(selectedOrder.delivery_fee || 0))"
    ></dd>
  </div>
</dl>
</div>
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

  <button
    x-show="orderProofUrl"
    type="button"
    class="mt-3 block w-full overflow-hidden rounded-xl border border-brand-border bg-brand-panel transition hover:border-brand-gold/60"
    @click="orderProofPreviewOpen = true"
  >
    <img
      :src="orderProofUrl"
      alt="Submitted payment proof"
      class="max-h-80 w-full object-contain"
    >

    <span
      class="block border-t border-brand-border px-3 py-2 text-center text-xs font-semibold text-brand-gold"
    >
      Click to zoom proof
    </span>
  </button>
</section>

<div
  x-show="orderProofPreviewOpen"
  x-cloak
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
  @click.self="orderProofPreviewOpen = false"
  @keydown.escape.window="orderProofPreviewOpen = false"
>
  <div class="relative inline-block max-h-[90vh] max-w-[92vw]">
    <img
      :src="orderProofUrl"
      alt="Submitted payment proof preview"
      class="block max-h-[90vh] max-w-[92vw] rounded-xl object-contain"
    >

    <button
      type="button"
      class="absolute -right-3 -top-3 z-10 inline-flex size-9 items-center justify-center rounded-full bg-black/80 text-xl font-semibold leading-none text-white shadow-lg ring-1 ring-white/20 transition hover:bg-black"
      @click="orderProofPreviewOpen = false"
      aria-label="Close payment proof preview"
    >
      ×
    </button>
  </div>
</div>

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

  <template x-if="orderFulfillmentConfirming !== 'shipped'">
  <button
    type="button"
    class="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-full bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
    @click="orderFulfillmentConfirming = 'shipped'"
    :disabled="orderFulfillmentSubmitting"
  >
    Mark as Shipped
  </button>
</template>

<template x-if="orderFulfillmentConfirming === 'shipped'">
  <div class="mt-4 grid gap-2 sm:grid-cols-2">
    <button
      type="button"
      class="inline-flex min-h-10 items-center justify-center rounded-full bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
      @click="updateOrderFulfillment('shipped')"
      :disabled="orderFulfillmentSubmitting"
      x-text="orderFulfillmentSubmitting ? 'Updating...' : 'Confirm Shipped'"
    ></button>

    <button
      type="button"
      class="inline-flex min-h-10 items-center justify-center rounded-full border border-brand-border px-4 text-sm font-semibold text-brand-muted transition hover:border-brand-gold/60 hover:text-brand-cream"
      @click="orderFulfillmentConfirming = ''"
      :disabled="orderFulfillmentSubmitting"
    >
      Cancel
    </button>
  </div>
</template>
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

  <template x-if="orderFulfillmentConfirming !== 'delivered'">
  <button
    type="button"
    class="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
    @click="orderFulfillmentConfirming = 'delivered'"
    :disabled="orderFulfillmentSubmitting"
  >
    Mark as Delivered
  </button>
</template>

<template x-if="orderFulfillmentConfirming === 'delivered'">
  <div class="mt-4 grid gap-2 sm:grid-cols-2">
    <button
      type="button"
      class="inline-flex min-h-10 items-center justify-center rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      @click="updateOrderFulfillment('delivered')"
      :disabled="orderFulfillmentSubmitting"
      x-text="orderFulfillmentSubmitting ? 'Updating...' : 'Confirm Delivered'"
    ></button>

    <button
      type="button"
      class="inline-flex min-h-10 items-center justify-center rounded-full border border-brand-border px-4 text-sm font-semibold text-brand-muted transition hover:border-brand-gold/60 hover:text-brand-cream"
      @click="orderFulfillmentConfirming = ''"
      :disabled="orderFulfillmentSubmitting"
    >
      Cancel
    </button>
  </div>
</template>
</div>

<div
  x-show="selectedOrder.status === 'delivered'"
  class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3"
>
  <p class="text-sm font-semibold text-emerald-200">
    Order delivered
  </p>

  <p class="mt-1 text-xs leading-5 text-emerald-100/80">
    This order is complete. Points are awarded automatically for eligible active-member orders.
  </p>

  <p
  x-show="Number(selectedOrder?.pointsAwarded || 0) > 0"
  class="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-200"
  x-text="'Points awarded: +' + Number(selectedOrder?.pointsAwarded || 0).toLocaleString('en-PH')"
></p>

<p
  x-show="Number(selectedOrder?.pointsAwarded || 0) === 0"
  class="mt-4 rounded-xl border border-brand-border bg-brand-black px-4 py-3 text-xs leading-5 text-brand-muted"
>
  No points were awarded for this order. Points apply only to eligible active-member orders.
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

            <div
  x-show="selectedApplication.packageOption"
  class="mt-3 rounded-xl border border-brand-gold/25 bg-brand-panel px-4 py-3"
>
    <p class="text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold">
    Selected Option
  </p>
  <p
    class="mt-1 text-sm font-semibold text-brand-cream"
    x-text="
      selectedApplication.packageOption
        ? selectedApplication.packageOption.label + ' - ' + selectedApplication.packageOption.title
        : ''
    "
  ></p>

  <p
    class="mt-1 text-xs leading-5 text-brand-muted"
    x-text="selectedApplication.packageOption?.description || ''"
  ></p>
</div>

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
            <div class="mt-4 rounded-xl border border-brand-border bg-brand-panel p-4">
  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-gold">
    Delivery address
  </p>

  <p
    class="mt-2 text-sm text-brand-cream"
    x-text="[
      selectedApplication.delivery_details?.recipientFirstName,
      selectedApplication.delivery_details?.recipientLastName
    ].filter(Boolean).join(' ') || 'No recipient name provided'"
  ></p>

  <p
    class="mt-1 text-sm text-brand-muted"
    x-text="selectedApplication.delivery_details?.recipientMobile || 'No mobile number provided'"
  ></p>

  <p
    class="mt-1 text-sm leading-6 text-brand-muted"
    x-text="[
      selectedApplication.delivery_details?.houseStreet,
      selectedApplication.delivery_details?.barangay,
      selectedApplication.delivery_details?.city,
      selectedApplication.delivery_details?.province
    ].filter(Boolean).join(', ') || 'No delivery address provided'"
  ></p>

  <p
    x-show="selectedApplication.delivery_details?.landmark"
    class="mt-1 text-sm text-brand-muted"
    x-text="'Landmark: ' + selectedApplication.delivery_details?.landmark"
  ></p>
</div>
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

            <button
  x-show="applicationProofUrl"
  type="button"
  class="mt-3 block w-full overflow-hidden rounded-xl border border-brand-border bg-brand-panel transition hover:border-brand-gold/60"
  @click="applicationProofPreviewOpen = true"
>
  <img
    :src="applicationProofUrl"
    alt="Submitted membership payment proof"
    class="max-h-96 w-full object-contain"
  >

  <span class="block border-t border-brand-border px-3 py-2 text-center text-xs font-semibold text-brand-gold">
    Click to zoom proof
  </span>
</button>

            <p
              x-show="!applicationProofLoading && !applicationProofUrl && !applicationProofError"
              class="mt-3 text-xs text-brand-muted"
            >No payment screenshot submitted.</p>
          </section>

          <div
  x-show="applicationProofPreviewOpen"
  x-cloak
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
  @click.self="applicationProofPreviewOpen = false"
  @keydown.escape.window="applicationProofPreviewOpen = false"
>
  <div class="relative inline-block max-h-[90vh] max-w-[92vw]">
    <img
      :src="applicationProofUrl"
      alt="Submitted membership payment proof preview"
      class="block max-h-[90vh] max-w-[92vw] rounded-xl object-contain"
    >

    <button
      type="button"
      class="absolute -right-3 -top-3 z-10 inline-flex size-9 items-center justify-center rounded-full bg-black/80 text-xl font-semibold leading-none text-white shadow-lg ring-1 ring-white/20 transition hover:bg-black"
      @click="applicationProofPreviewOpen = false"
      aria-label="Close membership payment proof preview"
    >
      ×
    </button>
  </div>
</div>

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
  selectedApplication.status === 'pending-verification' &&
  !reviewPanelOpen
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
              Payment approved. Continue with package fulfillment below.
            </p>

            <form
  x-ref="membershipReviewPanel"
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
    :disabled="
      reviewSubmitting ||
      (
        reviewAction === 'approve-membership' &&
        !reviewPaymentVerified
      )
    "
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

${renderAdminPackageFulfillmentPanel()}
        </div>
      </template>
    </aside>
  `
}

Alpine.data('adminDashboard', () => ({
  theme: 'black',
  applications: [],
  applicationsLoading: true,
  applicationsError: '',
  overviewPendingOrders: null,
  overviewActiveMembers: null,
  overviewMetricsError: '',

  applicationStatusLabels: membershipStatusLabels,
  membershipFulfillmentStatusLabels,
  paymentMethodLabels,

  isLoggingOut: false,
  logoutError: '',

  orders: [],

  adminCustomers: [],
adminCustomersLoading: true,
adminCustomersError: '',
adminCustomerSearch: '',
adminCustomerMembershipFilter: 'all',
adminCustomerAccountFilter: 'all',
adminCustomerJoinedFrom: '',
adminCustomerJoinedTo: '',
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
  stockHistoryDateFrom: '',
  stockHistoryDateTo: '',
  salesDateFrom: '',
  salesDateTo: '',

liveOrders: [],
liveOrdersLoading: true,
liveOrdersError: '',

newOrderNotificationOpen: false,
newOrderNotificationOrders: [],
newMembershipNotificationOpen: false,
newMembershipNotificationApplications: [],

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

  salesExportConfirmOpen: false,
  salesExportConfirmType: '',

  inventoryMovements: [],
  inventoryMovementFilter: 'all',

  salesDateFilter: 'all',
salesStatusFilter: 'all',
salesCustomerTypeFilter: 'all',
memberSalesTierFilter: 'all',

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
  applicationProofPreviewOpen: false,
  applicationProofLoading: false,
  applicationProofError: '',
  applicationProofRequestId: 0,

  applicationSearch: '',
  applicationStatusFilter: 'all',
  applicationDateFrom: '',
  applicationDateTo: '',

  selectedOrderId: null,
  orderDetailsOpen: false,
  orderProofUrl: '',
  orderProofLoading: false,
  orderProofError: '',

  orderSearch: '',
  orderStatusFilter: 'all',
  orderDateFrom: '',
  orderDateTo: '',
  orderCustomerTypeFilter: 'all',

  orderReviewPanelOpen: false,
  orderReviewAction: '',
  orderReviewNote: '',
  orderReviewError: '',

  orderReviewPaymentVerified: false,
  orderReviewSubmitting: false,

  orderFulfillmentSubmitting: false,
  orderFulfillmentConfirming: '',
  orderFulfillmentError: '',
  orderProofPreviewOpen: false,
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

      const applicationDate = new Date(
        application.submitted_at || application.created_at,
      )
      
      const fromDate = this.applicationDateFrom
        ? new Date(`${this.applicationDateFrom}T00:00:00`)
        : null
      
      const toDate = this.applicationDateTo
        ? new Date(`${this.applicationDateTo}T23:59:59`)
        : null
      
      const matchesDate =
        (!fromDate || applicationDate >= fromDate) &&
        (!toDate || applicationDate <= toDate)

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

      return matchesStatus && matchesDate && matchesSearch
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

  get selectedApplicationPackageProductQuantity() {
    const application = this.selectedApplication

    return Number(
      application?.packageOption?.productQuantity ??
      application?.package?.productQuantity ??
      0,
    )
  },

  get selectedApplicationFixedInventoryItems() {
    const application = this.selectedApplication

    return (
      application?.packageOption?.fixedInventoryItems ??
      application?.package?.fixedInventoryItems ??
      []
    )
  },

  get packageAllocationProducts() {
    return this.inventoryProducts.filter(
      (product) => product.id !== 'tester-kit',
    )
  },

  get packageAllocationTotal() {
    return this.packageAllocationProducts.reduce(
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
    const requiredQuantity =
      this.selectedApplicationPackageProductQuantity

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
  
    const joinedFromDate = this.adminCustomerJoinedFrom
      ? new Date(`${this.adminCustomerJoinedFrom}T00:00:00`)
      : null
  
    const joinedToDate = this.adminCustomerJoinedTo
      ? new Date(`${this.adminCustomerJoinedTo}T23:59:59`)
      : null
  
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
  
      const matchesMembership =
        this.adminCustomerMembershipFilter === 'all' ||
        customer.membership_status ===
          this.adminCustomerMembershipFilter
  
      const matchesAccount =
        this.adminCustomerAccountFilter === 'all' ||
        customer.account_status === this.adminCustomerAccountFilter
  
      const joinedDate = customer.created_at
        ? new Date(customer.created_at)
        : null
  
      const matchesJoined =
        (!joinedFromDate || (joinedDate && joinedDate >= joinedFromDate)) &&
        (!joinedToDate || (joinedDate && joinedDate <= joinedToDate))
  
        return (
          matchesSearch &&
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

    const requiredQuantity =
    this.selectedApplicationPackageProductQuantity

    if (
      requiredQuantity <= 0 ||
      this.packageAllocationTotal !==
      requiredQuantity
    ) {
      return false
    }

    const productQuantitiesAreValid =
    this.packageAllocationProducts.every(
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

  get filteredLiveOrders() {
    const normalizedSearch =
      this.orderSearch.trim().toLowerCase()

    const sourceOrders = Array.isArray(this.liveOrders)
      ? this.liveOrders
      : []

      return sourceOrders.filter((order) => {
        const matchesStatus =
          this.orderStatusFilter === 'all' ||
          (
            this.orderStatusFilter === 'pending-verification'
              ? this.isPendingOrderStatus(order.status)
              : order.status === this.orderStatusFilter
          )

        const matchesCustomerType =
        this.orderCustomerTypeFilter === 'all' ||
        order.customer_type === this.orderCustomerTypeFilter
      
      const orderDate = new Date(order.created_at)
      
      const fromDate = this.orderDateFrom
        ? new Date(`${this.orderDateFrom}T00:00:00`)
        : null
      
      const toDate = this.orderDateTo
        ? new Date(`${this.orderDateTo}T23:59:59`)
        : null
      
      const matchesDate =
        (!fromDate || orderDate >= fromDate) &&
        (!toDate || orderDate <= toDate)
      
      const orderItems = Array.isArray(order.items)
        ? order.items
        : Array.isArray(order.order_items)
          ? order.order_items
          : []

          const searchableContent = [
            order.id,
            order.order_number,
            order.customer_name,
            order.customer_email,
            order.customer_mobile,
            order.customer_details?.firstName,
            order.customer_details?.lastName,
            order.customer_details?.emailAddress,
            order.customer_details?.mobileNumber,
        order.reference_number,
        order.delivery_region,
        order.delivery_city,
        order.delivery_barangay,
        order.delivery_address,
        ...orderItems.map((item) =>
          [
            item.product_name,
            item.name,
            item.product?.name,
            item.sku,
          ].filter(Boolean).join(' '),
        ),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const matchesSearch =
        !normalizedSearch ||
        searchableContent.includes(normalizedSearch)

        return matchesStatus && matchesCustomerType && matchesDate && matchesSearch
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
    this.overviewActiveMembers = null
    this.overviewMetricsError = ''

    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'customer')
        .eq('customer_type', 'member')
        .eq('membership_status', 'active')
        .eq('account_status', 'active')

      if (error) throw error
      if (count === null) {
        throw new Error('Overview counts are unavailable.')
      }

      this.overviewActiveMembers = count
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
          id, customer_id, package_id, selected_package_option_id, amount, status,
          payment_method, payment_provider, sender_name,
          payment_proof_file_name, payment_proof_path,
          delivery_details,
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

      this.applications = (data ?? []).map((application) => {
        const selectedPackage =
          packages.find(
            (item) => item.id === application.package_id,
          ) ?? null

        const selectedPackageOption =
          selectedPackage?.options?.find(
            (option) =>
              option.id === application.selected_package_option_id,
          ) ?? null

        return {
          ...application,
          customer_name: [
            application.customer?.first_name,
            application.customer?.last_name,
          ].filter(Boolean).join(' ') || 'Customer',
          customer_email: application.customer?.email ?? '',
          customer_mobile: application.customer?.mobile_number ?? '',
          payment_proof_url: null,
          package: selectedPackage,
          packageOption: selectedPackageOption,
        }
      })

      const unseenPendingMembershipApplications =
        this.applications.filter((application) => {
          if (application.status !== 'pending-verification') {
            return false
          }

          return (
            localStorage.getItem(
              `admin-seen-membership-${application.id}`,
            ) !== 'seen'
          )
        })

      this.newMembershipNotificationApplications =
        unseenPendingMembershipApplications

      this.newMembershipNotificationOpen =
        unseenPendingMembershipApplications.length > 0
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

      const fallbackProductsById = new Map(
        adminInventoryProducts.map((product) => [
          String(product.id || '').trim(),
          product,
        ]),
      )

      const fallbackProductsBySku = new Map(
        adminInventoryProducts.map((product) => [
          String(product.sku || '').trim().toUpperCase(),
          product,
        ]),
      )

      this.liveProducts = sortAdminProducts(
        (data ?? []).map((liveProduct) => {
          const normalizedLiveId = String(liveProduct.id || '').trim()
          const normalizedLiveSku = String(liveProduct.sku || '')
            .trim()
            .toUpperCase()

          const fallbackProduct =
            fallbackProductsById.get(normalizedLiveId) ||
            fallbackProductsBySku.get(normalizedLiveSku)

          const liveProductName = String(liveProduct.name || '').trim()
          const liveProductSku = String(
            liveProduct.sku || fallbackProduct?.sku || '',
          )
            .trim()
            .toUpperCase()

          const shouldUseFallbackName =
            !liveProductName ||
            liveProductName.toUpperCase() === liveProductSku

          return {
            ...liveProduct,
            sku: liveProductSku,
            name: shouldUseFallbackName
              ? fallbackProduct?.name || liveProductSku || 'Unnamed product'
              : liveProductName,
          }
        }),
      )

      const liveProductsById = new Map(
        this.liveProducts.map((product) => [
          product.id,
          product,
        ]),
      )

      this.inventoryProducts = adminInventoryProducts.map(
        (product) => {
          const liveProduct = liveProductsById.get(
            product.id,
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
            name: String(liveProduct.name || '').trim() || product.name,
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

  isPendingOrderStatus(status) {
    return [
      'pending',
      'pending_verification',
      'pending-verification',
    ].includes(status)
  },

  get pendingOrderCount() {
    const sourceOrders = Array.isArray(this.liveOrders)
      ? this.liveOrders
      : this.orders

    return sourceOrders.filter((order) =>
      this.isPendingOrderStatus(order.status),
    ).length
  },

  get approvedOrders() {
    const sourceOrders =
      this.liveOrders.length > 0
        ? this.liveOrders
        : this.orders

    return sourceOrders.filter((order) =>
      this.approvedOrderStatuses.includes(order.status),
    )
  },

  approvedOrderDate(order) {
    const approvedDateValue =
    order.payment_approved_at ||
    order.shipped_at ||
    order.delivered_at ||
    order.reviewed_at ||
    order.created_at

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

  get salesRangeStartDate() {
    if (this.salesDateFrom) {
      const startDate = new Date(`${this.salesDateFrom}T00:00:00`)
  
      if (!Number.isNaN(startDate.getTime())) {
        return startDate
      }
    }
  
    const fallbackStartDate = new Date()
    fallbackStartDate.setDate(fallbackStartDate.getDate() - 6)
    fallbackStartDate.setHours(0, 0, 0, 0)
  
    return fallbackStartDate
  },
  
  get salesRangeEndDate() {
    if (this.salesDateTo) {
      const endDate = new Date(`${this.salesDateTo}T23:59:59`)
  
      if (!Number.isNaN(endDate.getTime())) {
        return endDate
      }
    }
  
    return new Date()
  },
  
  get selectedRangeApprovedSales() {
    return this.approvedSalesBetween(
      this.salesRangeStartDate,
      this.salesRangeEndDate,
    )
  },
  
  get salesChartData() {
    const chartDays = []
    const startDate = new Date(this.salesRangeStartDate)
    const endDate = new Date(this.salesRangeEndDate)
  
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 999)
  
    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime()) ||
      startDate > endDate
    ) {
      return []
    }
  
    const cursorDate = new Date(startDate)
  
    while (cursorDate <= endDate && chartDays.length < 31) {
      const dayStart = new Date(cursorDate)
      dayStart.setHours(0, 0, 0, 0)
  
      const dayEnd = new Date(cursorDate)
      dayEnd.setHours(23, 59, 59, 999)
  
      chartDays.push({
        label: dayStart.toLocaleDateString('en-PH', {
          month: 'short',
          day: 'numeric',
        }),
        sales: this.approvedSalesBetween(dayStart, dayEnd),
      })
  
      cursorDate.setDate(cursorDate.getDate() + 1)
    }
  
    return chartDays
  },
  
  get salesChartMaxValue() {
    return Math.max(
      ...this.salesChartData.map((day) => Number(day.sales || 0)),
      1,
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

get filteredStockHistory() {
  const fromDate = this.stockHistoryDateFrom
    ? new Date(`${this.stockHistoryDateFrom}T00:00:00`)
    : null

  const toDate = this.stockHistoryDateTo
    ? new Date(`${this.stockHistoryDateTo}T23:59:59`)
    : null

  return this.stockHistory.filter((movement) => {
    const movementDate = movement.created_at
      ? new Date(movement.created_at)
      : null

    return (
      (!fromDate || (movementDate && movementDate >= fromDate)) &&
      (!toDate || (movementDate && movementDate <= toDate))
    )
  })
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

get completedMemberSalesOrders() {
  const sourceOrders = Array.isArray(this.liveOrders)
    ? this.liveOrders
    : []

  const validMemberTiers = [
    'starter',
    'builder',
    'leader',
    'prestige',
  ]

  const now = new Date()

  return sourceOrders.filter((order) => {
    if (order.status !== 'delivered') {
      return false
    }

    if (order.customer_type !== 'member') {
      return false
    }

    if (order.customer_membership_status !== 'active') {
      return false
    }

    if (order.customer_account_status !== 'active') {
      return false
    }

    if (!validMemberTiers.includes(order.customer_package_id)) {
      return false
    }

    if (
      this.memberSalesTierFilter !== 'all' &&
      order.customer_package_id !== this.memberSalesTierFilter
    ) {
      return false
    }

    if (this.salesDateFilter === 'all') {
      return true
    }

    const orderDate = new Date(
      order.delivered_at ||
      order.created_at,
    )

    if (Number.isNaN(orderDate.getTime())) {
      return false
    }

    if (this.salesDateFilter === 'today') {
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
      dateRangeDays[this.salesDateFilter]

    if (!selectedDays) {
      return true
    }

    const cutoffDate = new Date(now)

    cutoffDate.setDate(
      cutoffDate.getDate() - selectedDays,
    )

    return orderDate >= cutoffDate
  })
},

get completedMemberSalesTotal() {
  return this.completedMemberSalesOrders.reduce(
    (total, order) =>
      total + this.orderProductSales(order),
    0,
  )
},

get completedMemberSalesOrderCount() {
  return this.completedMemberSalesOrders.length
},

get completedMemberSalesActiveBuyerCount() {
  const buyers = new Set(
    this.completedMemberSalesOrders
      .map((order) =>
        String(
          order.customer_details?.emailAddress || '',
        )
          .trim()
          .toLowerCase(),
      )
      .filter(Boolean),
  )

  return buyers.size
},

get completedMemberSalesAverageOrder() {
  if (this.completedMemberSalesOrderCount === 0) {
    return 0
  }

  return (
    this.completedMemberSalesTotal /
    this.completedMemberSalesOrderCount
  )
},

get memberSalesRanking() {
  const members = new Map()

  this.completedMemberSalesOrders.forEach((order) => {
    const email = String(
      order.customer_details?.emailAddress || '',
    )
      .trim()
      .toLowerCase()

    if (!email) {
      return
    }

    const firstName = String(
      order.customer_first_name || '',
    ).trim()

    const lastName = String(
      order.customer_last_name || '',
    ).trim()

    const fallbackName = String(
      order.customer_details?.fullName ||
      order.customer_details?.name ||
      email,
    ).trim()

    const memberName =
      [firstName, lastName]
        .filter(Boolean)
        .join(' ') ||
      fallbackName

    const existingMember =
      members.get(email) || {
        email,
        name: memberName,
        tier: order.customer_package_id,
        completedOrders: 0,
        units: 0,
        totalSales: 0,
      }

    const orderItems = Array.isArray(order.order_items)
      ? order.order_items
      : []

    const orderUnits = orderItems.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0,
    )

    existingMember.completedOrders += 1
    existingMember.units += orderUnits
    existingMember.totalSales +=
      this.orderProductSales(order)

    members.set(email, existingMember)
  })

  return [...members.values()].sort(
    (firstMember, secondMember) =>
      secondMember.totalSales -
      firstMember.totalSales,
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
    const fulfillmentAction =
    nextStatus === 'shipped' ? 'ship' : 'deliver'

  const { data: updatedStatus, error } =
    await supabase.rpc(
      'admin_update_order_fulfillment',
      {
        p_order_id: order.id,
        p_action: fulfillmentAction,
        p_tracking_reference: null,
        p_fulfillment_note: null,
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

    this.selectedOrderId = order.id

    if (typeof this.loadLiveOrders === 'function') {
      await this.loadLiveOrders()
    }

    const refreshedOrder = this.liveOrders.find(
      (item) => item.id === order.id,
    )

    if (refreshedOrder) {
      this.selectedOrderId = refreshedOrder.id
    }
  } catch (error) {
    console.error(
      'Unable to update order fulfillment:',
      error,
    )

    this.orderFulfillmentError =
    error?.message ||
    'Could not update fulfillment status. Refresh and check the order.'
  } finally {
    this.orderFulfillmentSubmitting = false
    this.orderFulfillmentConfirming = ''
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

  if (!this.approvedOrderStatuses.includes(order.status)) {
    this.orderPointsError =
      'Only approved orders can receive points.'
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

closeNewOrderNotification() {
  this.newOrderNotificationOrders.forEach((order) => {
    localStorage.setItem(`admin-seen-order-${order.id}`, 'seen')
  })

  this.newOrderNotificationOpen = false
  this.newOrderNotificationOrders = []
},

async viewNewOrderNotification(orderId) {
  if (!orderId) return

  localStorage.setItem(`admin-seen-order-${orderId}`, 'seen')

  this.newOrderNotificationOrders =
    this.newOrderNotificationOrders.filter(
      (order) => order.id !== orderId,
    )

  this.newOrderNotificationOpen = false

  await this.openOrderDetails(orderId)
},

closeNewMembershipNotification() {
  this.newMembershipNotificationApplications.forEach((application) => {
    localStorage.setItem(
      `admin-seen-membership-${application.id}`,
      'seen',
    )
  })

  this.newMembershipNotificationOpen = false
  this.newMembershipNotificationApplications = []
},

async viewNewMembershipNotification(applicationId) {
  if (!applicationId) return

  localStorage.setItem(
    `admin-seen-membership-${applicationId}`,
    'seen',
  )

  this.newMembershipNotificationApplications =
    this.newMembershipNotificationApplications.filter(
      (application) => application.id !== applicationId,
    )

  this.newMembershipNotificationOpen = false

  await this.openApplicationDetails(applicationId)
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

  const packageAllocation = this.packageAllocationProducts
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

async confirmPackageFulfillmentAction() {
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

this.packageFulfillmentSubmitting = true
this.packageFulfillmentError = ''

try {
  const { data: updatedApplication, error } = await supabase.rpc(
    'admin_update_membership_package_fulfillment',
    {
      p_application_id: application.id,
      p_next_status: nextStatus,
    },
  )
  
  if (error) {
    throw error
  }

  this.applications[applicationIndex] = {
    ...this.applications[applicationIndex],
    fulfillment_status:
  updatedApplication?.fulfillment_status || nextStatus,
updated_at:
  updatedApplication?.updated_at || updatedAt,
  }

  Object.assign(this.selectedApplication, {
    fulfillment_status:
      updatedApplication?.fulfillment_status || nextStatus,
    updated_at:
      updatedApplication?.updated_at || updatedAt,
  })

  this.closePackageFulfillmentAction()
} catch (error) {
  console.error('Unable to update package fulfillment status:', error)

  const errorMessage =
    error?.message ||
    error?.details ||
    error?.hint ||
    'Could not update package fulfillment status. Please try again.'

  this.packageFulfillmentError = errorMessage
} finally {
  this.packageFulfillmentSubmitting = false
}
},

get reviewActionTitle() {
  const titles = {
    'approve-membership': 'Confirm membership approval',
    'reject-payment': 'Confirm payment rejection',
  }

  return titles[this.reviewAction] || 'Review application'
},

get reviewActionDescription() {
  const descriptions = {
    'approve-membership':
      'This will activate the customer membership after verified payment. Check the verification box before confirming.',

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

this.$nextTick(() => {
  this.$refs.membershipReviewPanel?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
})
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

const returnedStatus =
  typeof nextStatus === 'string'
    ? nextStatus
    : Array.isArray(nextStatus)
      ? nextStatus[0]?.status || nextStatus[0]
      : nextStatus?.status || null

const resolvedStatus = returnedStatus || expectedStatus

if (returnedStatus && returnedStatus !== expectedStatus) {
  console.warn('Unexpected review status returned:', returnedStatus)
}

    const reviewedAt = new Date().toISOString()

    this.applications = this.applications.map((application) => {
      if (application.id !== selectedApplication.id) {
        return application
      }

      return {
        ...application,
        status: resolvedStatus,
        admin_note: normalizedNote || application.admin_note,
        reviewed_at: reviewedAt,
        updated_at: reviewedAt,
        approved_at:
          resolvedStatus === 'approved'
            ? reviewedAt
            : application.approved_at,
        membership_activated_at:
          resolvedStatus === 'approved'
            ? reviewedAt
            : application.membership_activated_at,
        fulfillment_status:
          resolvedStatus === 'approved'
            ? 'pending-allocation'
            : application.fulfillment_status,
      }
    })

    this.closeReviewPanel()

    const reviewedApplicationId = selectedApplication.id

    if (resolvedStatus === 'approved') {
      if (typeof this.loadApplications === 'function') {
        await this.loadApplications()
      } else if (
        typeof this.loadMembershipApplications === 'function'
      ) {
        await this.loadMembershipApplications()
      }

      this.activePage = 'memberships'
      this.closeMobileMenu()

      await this.openApplicationDetails(reviewedApplicationId)

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    } else {
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
    }
  } catch (error) {
    console.error('Unable to review membership application:', error)

this.reviewError =
  error?.message ||
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

  for (const product of this.packageAllocationProducts) {
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

  const requiredQuantity =
  this.selectedApplicationPackageProductQuantity

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
    this.selectedApplicationFixedInventoryItems
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

getOrderItemImage(item) {
  return getOrderItemImage(item)
},

formatMoney(amount) {
  return adminPesoFormatter.format(amount || 0)
},

formatCompactMoney(value) {
  const amount = Number(value || 0)

  if (amount >= 1000000) {
    return `₱${(amount / 1000000).toFixed(1)}M`
  }

  if (amount >= 1000) {
    return `₱${(amount / 1000).toFixed(amount >= 10000 ? 0 : 1)}K`
  }

  return `₱${amount.toLocaleString('en-PH')}`
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

openSalesExportConfirm(type) {
  if (!['details', 'summary'].includes(type)) return

  this.salesExportConfirmType = type
  this.salesExportConfirmOpen = true
},

closeSalesExportConfirm() {
  this.salesExportConfirmOpen = false
  this.salesExportConfirmType = ''
},

confirmSalesExport() {
  const exportType = this.salesExportConfirmType

  this.closeSalesExportConfirm()

  if (exportType === 'details') {
    this.exportSalesCsv()
    return
  }

  if (exportType === 'summary') {
    this.exportSalesSummaryCsv()
  }
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
        `PHP ${Number(total || 0).toLocaleString('en-PH')}`,
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
  const savedTheme =
    window.localStorage.getItem('your-product-theme')

  this.theme =
    savedTheme === 'ivory'
      ? 'ivory'
      : 'black'

  this.applyTheme()

  await this.loadLiveOrders()
},

applyTheme() {
  if (this.theme === 'ivory') {
    document.documentElement.setAttribute(
      'data-theme',
      'ivory',
    )
  } else {
    document.documentElement.removeAttribute(
      'data-theme',
    )
  }

  window.localStorage.setItem(
    'your-product-theme',
    this.theme,
  )
},

toggleTheme() {
  const root = document.documentElement

  root.classList.add('theme-transitioning')

  window.requestAnimationFrame(() => {
    this.theme =
      this.theme === 'black'
        ? 'ivory'
        : 'black'

    this.applyTheme()

    window.setTimeout(() => {
      root.classList.remove('theme-transitioning')
    }, 650)
  })
},

async loadLiveOrders() {
  this.liveOrdersLoading = true
  this.liveOrdersError = ''

  try {
    const { data, error } = await supabase
  .from('orders')
  .select(`
    id, status, subtotal, delivery_fee, created_at,
    payment_approved_at, payment_rejected_at,
    reviewed_at, shipped_at, delivered_at,
    admin_note,
    customer_details, delivery_details,
    payment_method, payment_proof_path,
    order_items(id, product_id, product_name, quantity, unit_price, product_image_url)
  `)
  .order('created_at', { ascending: false })

    if (error) throw error

    const orderIds = (data ?? []).map((order) => order.id)
    let pointsByOrderId = new Map()

    if (orderIds.length > 0) {
      const { data: pointRows, error: pointsError } = await supabase
        .from('points_transactions')
        .select('order_id, points')
        .in('order_id', orderIds)
        .eq('type', 'order_award')
        .eq('status', 'confirmed')

      if (pointsError) {
        console.error('Unable to load order points:', pointsError)
      } else {
        pointsByOrderId = new Map(
          (pointRows ?? []).map((row) => [
            row.order_id,
            Number(row.points || 0),
          ]),
        )
      }
    }

    const customerEmails = [
      ...new Set(
        (data ?? [])
          .map((order) => order.customer_details?.emailAddress)
          .filter(Boolean)
          .map((email) => String(email).trim().toLowerCase()),
      ),
    ]
    
    let customerProfileByEmail = new Map()

if (customerEmails.length > 0) {
  const { data: profileRows, error: profilesError } = await supabase
    .from('profiles')
    .select(
      'email, first_name, last_name, customer_type, membership_status, account_status, selected_package_id',
    )
    .in('email', customerEmails)

  if (profilesError) {
    console.error('Unable to load order customer profiles:', profilesError)
  } else {
    customerProfileByEmail = new Map(
      (profileRows ?? []).map((profile) => [
        String(profile.email || '').trim().toLowerCase(),
        profile,
      ]),
    )
  }
}

this.liveOrders = (data ?? []).map((order) => {
  const customerEmail = String(
    order.customer_details?.emailAddress || '',
  )
    .trim()
    .toLowerCase()

  const customerProfile =
    customerProfileByEmail.get(customerEmail) || null

  return {
    ...order,
    customer_type:
      customerProfile?.customer_type || 'regular',
    customer_membership_status:
      customerProfile?.membership_status || null,
    customer_account_status:
      customerProfile?.account_status || null,
    customer_package_id:
      customerProfile?.selected_package_id || null,
    customer_first_name:
      customerProfile?.first_name || '',
    customer_last_name:
      customerProfile?.last_name || '',
    order_items: (order.order_items ?? []).map((item) => ({
      ...item,
      imageUrl: getOrderItemImage(item),
    })),
    pointsAwarded: pointsByOrderId.get(order.id) ?? 0,
  }
})

    const unseenPendingOrders = this.liveOrders.filter((order) => {
      if (!this.isPendingOrderStatus(order.status)) return false
    
      return (
        localStorage.getItem(`admin-seen-order-${order.id}`) !== 'seen'
      )
    })
    
    this.newOrderNotificationOrders = unseenPendingOrders
    this.newOrderNotificationOpen = unseenPendingOrders.length > 0

    this.overviewPendingOrders = this.pendingOrderCount
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
    
            <a
  href="/"
  data-fade-link
  class="inline-flex items-center gap-2 text-xs font-semibold text-brand-muted transition hover:text-brand-gold sm:text-sm"
>
  <svg
    class="size-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    aria-hidden="true"
  >
    <path
      d="M3.75 9.5h16.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M5 9.5 6.1 5.8A1.25 1.25 0 0 1 7.3 4.9h9.4a1.25 1.25 0 0 1 1.2.9L19 9.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M5.25 9.5v8.35A1.15 1.15 0 0 0 6.4 19h11.2a1.15 1.15 0 0 0 1.15-1.15V9.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9 19v-4.25a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V19"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <span>View Store</span>
</a>

<div
  class="ml-2 flex items-center border-l border-brand-border pl-4"
>
  <button
    type="button"
    class="premium-icon group grid size-10 shrink-0 place-items-center rounded-full border border-brand-border text-brand-muted transition duration-300 hover:border-brand-gold hover:bg-brand-gold/10 hover:text-brand-gold"
    :aria-label="
      theme === 'black'
        ? 'Switch to light mode'
        : 'Switch to dark mode'
    "
    :title="
      theme === 'black'
        ? 'Light mode'
        : 'Dark mode'
    "
    @click="toggleTheme()"
  >
    <svg
      x-cloak
      x-show="theme === 'black'"
      x-transition:enter="transition duration-300 ease-out"
      x-transition:enter-start="opacity-0 rotate-45 scale-75"
      x-transition:enter-end="opacity-100 rotate-0 scale-100"
      x-transition:leave="transition duration-200 ease-in"
      x-transition:leave-start="opacity-100 rotate-0 scale-100"
      x-transition:leave-end="opacity-0 -rotate-45 scale-75"
      class="size-[1.1rem]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3.5" />

      <path
        d="M12 2.75v2M12 19.25v2M2.75 12h2M19.25 12h2M5.45 5.45l1.4 1.4M17.15 17.15l1.4 1.4M18.55 5.45l-1.4 1.4M6.85 17.15l-1.4 1.4"
        stroke-linecap="round"
      />
    </svg>

    <svg
      x-cloak
      x-show="theme === 'ivory'"
      x-transition:enter="transition duration-300 ease-out"
      x-transition:enter-start="opacity-0 -rotate-45 scale-75"
      x-transition:enter-end="opacity-100 rotate-0 scale-100"
      x-transition:leave="transition duration-200 ease-in"
      x-transition:leave-start="opacity-100 rotate-0 scale-100"
      x-transition:leave-end="opacity-0 rotate-45 scale-75"
      class="size-[1.1rem]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      aria-hidden="true"
    >
      <path
        d="M20.25 15.4A8.25 8.25 0 0 1 8.6 3.75a8.25 8.25 0 1 0 11.65 11.65Z"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    <span
      class="sr-only"
      x-text="
        theme === 'black'
          ? 'Switch to light mode'
          : 'Switch to dark mode'
      "
    ></span>
  </button>
</div>

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
      x-text="liveOrdersLoading || liveOrdersError ? '—' : pendingOrderCount"
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
  x-text="liveOrdersLoading || liveOrdersError ? '—' : pendingOrderCount"
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

    <div
  x-show="newOrderNotificationOpen"
  x-transition.opacity
  class="fixed inset-0 z-[60] flex items-center justify-center bg-black/65 px-4 py-6"
  @click.self="closeNewOrderNotification()"
  @keydown.escape.window="newOrderNotificationOpen && closeNewOrderNotification()"
  role="dialog"
  aria-modal="true"
  aria-labelledby="new-order-notification-title"
>
  <div
    class="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-panel shadow-2xl"
    @click.stop
  >
    <div
      class="flex shrink-0 items-start justify-between gap-4 border-b border-brand-border px-5 py-5 sm:px-6"
    >
      <div>
        <p
          class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold"
        >
          New Orders
        </p>

        <h2
          id="new-order-notification-title"
          class="mt-2 text-xl font-semibold text-brand-cream sm:text-2xl"
          x-text="newOrderNotificationOrders.length === 1
            ? '1 Order Awaiting Verification'
            : newOrderNotificationOrders.length + ' Orders Awaiting Verification'"
        ></h2>

        <p class="mt-2 text-sm leading-6 text-brand-muted">
          Review the latest customer orders that need payment verification.
        </p>
      </div>

      <button
        type="button"
        class="shrink-0 rounded-lg border border-brand-border px-3 py-2 text-sm text-brand-muted transition hover:border-brand-gold/40 hover:text-brand-gold"
        @click="closeNewOrderNotification()"
      >
        Mark All Seen
      </button>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
      <div class="space-y-4">
        <template
          x-for="order in newOrderNotificationOrders"
          :key="order.id"
        >
          <article
            class="rounded-xl border border-brand-border bg-black/10 p-4 sm:p-5"
          >
            <div
              class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div class="min-w-0">
                <p
                  class="text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold"
                >
                  Order
                </p>

                <p
                  class="mt-1 break-all text-sm font-semibold text-brand-cream"
                  x-text="order.id"
                ></p>
              </div>

              <p
                class="shrink-0 text-sm text-brand-muted"
                x-text="formatDate(order.created_at)"
              ></p>
            </div>

            <div
              class="mt-4 grid gap-3 border-t border-brand-border pt-4 sm:grid-cols-2"
            >
              <div>
                <p class="text-xs text-brand-muted">Customer</p>
                <p
                  class="mt-1 text-sm font-medium text-brand-cream"
                  x-text="((order.customer_details?.firstName || '') + ' ' + (order.customer_details?.lastName || '')).trim() || order.customer_details?.emailAddress || 'Customer'"
                ></p>
              </div>

              <div class="sm:text-right">
                <p class="text-xs text-brand-muted">Amount</p>
                <p
                  class="mt-1 text-base font-semibold text-brand-cream"
                  x-text="formatCurrency(Number(order.subtotal || 0) + Number(order.delivery_fee || 0))"
                ></p>
              </div>
            </div>

            <button
              type="button"
              class="mt-4 w-full rounded-xl bg-brand-gold px-4 py-3 text-sm font-semibold text-[#17130d] transition hover:brightness-110"
              @click="viewNewOrderNotification(order.id)"
            >
              View Order
            </button>
          </article>
        </template>
      </div>
    </div>

    <div
      class="shrink-0 border-t border-brand-border px-5 py-4 sm:px-6"
    >
      <p class="text-center text-xs leading-5 text-brand-muted">
        Viewed orders will not appear here again. New pending orders will appear on the next dashboard load.
      </p>
    </div>
  </div>
</div>

<div
  x-show="newMembershipNotificationOpen"
  x-transition.opacity
  class="fixed inset-0 z-[61] flex items-center justify-center bg-black/65 px-4 py-6"
  @click.self="closeNewMembershipNotification()"
  @keydown.escape.window="newMembershipNotificationOpen && closeNewMembershipNotification()"
  role="dialog"
  aria-modal="true"
  aria-labelledby="new-membership-notification-title"
>
  <div
    class="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-panel shadow-2xl"
    @click.stop
  >
    <div
      class="flex shrink-0 items-start justify-between gap-4 border-b border-brand-border px-5 py-5 sm:px-6"
    >
      <div>
        <p
          class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold"
        >
          New Membership Applications
        </p>

        <h2
          id="new-membership-notification-title"
          class="mt-2 text-xl font-semibold text-brand-cream sm:text-2xl"
          x-text="newMembershipNotificationApplications.length === 1
            ? '1 Application Awaiting Verification'
            : newMembershipNotificationApplications.length + ' Applications Awaiting Verification'"
        ></h2>

        <p class="mt-2 text-sm leading-6 text-brand-muted">
          Review the latest membership package payments that need verification.
        </p>
      </div>

      <button
        type="button"
        class="shrink-0 rounded-lg border border-brand-border px-3 py-2 text-sm text-brand-muted transition hover:border-brand-gold/40 hover:text-brand-gold"
        @click="closeNewMembershipNotification()"
      >
        Mark All Seen
      </button>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
      <div class="space-y-4">
        <template
          x-for="application in newMembershipNotificationApplications"
          :key="application.id"
        >
          <article
            class="rounded-xl border border-brand-border bg-black/10 p-4 sm:p-5"
          >
            <div
              class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div class="min-w-0">
                <p
                  class="text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold"
                >
                  Membership Application
                </p>

                <p
                  class="mt-1 break-all text-sm font-semibold text-brand-cream"
                  x-text="application.id"
                ></p>
              </div>

              <p
                class="shrink-0 text-sm text-brand-muted"
                x-text="formatDate(application.submitted_at)"
              ></p>
            </div>

            <div
              class="mt-4 grid gap-3 border-t border-brand-border pt-4 sm:grid-cols-3"
            >
              <div>
                <p class="text-xs text-brand-muted">Customer</p>
                <p
                  class="mt-1 text-sm font-medium text-brand-cream"
                  x-text="application.customer_name || application.customer_email || 'Customer'"
                ></p>
              </div>

              <div>
                <p class="text-xs text-brand-muted">Package</p>
                <p
                  class="mt-1 text-sm font-medium text-brand-cream"
                  x-text="application.package?.name || application.package_id || 'Membership Package'"
                ></p>
              </div>

              <div class="sm:text-right">
                <p class="text-xs text-brand-muted">Amount</p>
                <p
                  class="mt-1 text-base font-semibold text-brand-cream"
                  x-text="formatCurrency(Number(application.amount || 0))"
                ></p>
              </div>
            </div>

            <button
              type="button"
              class="mt-4 w-full rounded-xl bg-brand-gold px-4 py-3 text-sm font-semibold text-[#17130d] transition hover:brightness-110"
              @click="viewNewMembershipNotification(application.id)"
            >
              View Application
            </button>
          </article>
        </template>
      </div>
    </div>

    <div
      class="shrink-0 border-t border-brand-border px-5 py-4 sm:px-6"
    >
      <p class="text-center text-xs leading-5 text-brand-muted">
        Viewed applications will not appear here again. New pending applications will appear on the next dashboard load.
      </p>
    </div>
  </div>
</div>

${renderOrderDetailsDrawer()}
    ${renderAdminInventoryAdjustmentDrawer()}
  </div>
`

Alpine.start()
}

startAdminDashboard()
