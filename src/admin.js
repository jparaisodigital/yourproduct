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
    membershipApplications,
    membershipStatusLabels,
    paymentMethodLabels,
} from './config/admin-preview-data.js'

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
    
    selectedApplicationId: null,
    
    applicationDetailsOpen: false,
    
    applicationSearch: '',
    
    applicationStatusFilter: 'all',
    
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
      
        if (!this.mobileMenuOpen) {
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
        this.activePage = pageName
        this.closeMobileMenu()
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    },
    
    openMobileMenu() {
        this.closeApplicationDetails()
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
    @keydown.escape.window="closeMobileMenu(); closeApplicationDetails()"
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

${adminNavigationItems
    .filter(
        (item) =>
            item.id !== 'overview' &&
        item.id !== 'memberships',
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
  </div>
`
    
    Alpine.start()