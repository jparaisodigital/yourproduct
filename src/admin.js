import './style.css'

import Alpine from 'alpinejs'

import logoImage from './assets/logoyourproduct.png'

import {
  siteConfig,
} from './config/site-config.js'

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

Alpine.data('adminDashboard', () => ({
  activePage: 'overview',
  mobileMenuOpen: false,

  get activePageTitle() {
    return adminPageTitles[this.activePage] || 'Overview'
  },

  openPage(pageName) {
    if (!adminPageTitles[pageName]) {
      return
    }

    this.activePage = pageName
    this.closeMobileMenu()

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  },

  openMobileMenu() {
    this.mobileMenuOpen = true
    document.body.classList.add('overflow-hidden')
  },

  closeMobileMenu() {
    this.mobileMenuOpen = false
    document.body.classList.remove('overflow-hidden')
  },

  destroy() {
    document.body.classList.remove('overflow-hidden')
  },
}))

document.title =
  `Admin Dashboard | ${siteConfig.brand.name}`

document.querySelector('#admin-app').innerHTML = `
  <div
    x-data="adminDashboard"
    x-cloak
    class="min-h-screen bg-brand-black text-brand-cream"
    @keydown.escape.window="closeMobileMenu()"
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
              >
                2
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
              >
                1
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
                  >
                    2
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

        ${adminNavigationItems
          .filter((item) => item.id !== 'overview')
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
  </div>
`

Alpine.start()