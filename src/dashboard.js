import './style.css'

import Alpine from 'alpinejs'

import logoImage from './assets/logoyourproduct.png'

import {
  siteConfig,
} from './config/site-config.js'

const previewMember = {
  firstName: 'Sample',
  lastName: 'Member',
  emailAddress: 'member@example.com',
  membershipStatus: 'Membership pending',
  directReferrals: 0,
  pointsBalance: 0,
  availableIncome: 0,
}

const previewRewards = [
  {
    label: 'Cellphone',
    icon: '📱',
  },
  {
    label: 'Laptop',
    icon: '💻',
  },
  {
    label: 'Motorcycle',
    icon: '🏍️',
  },
  {
    label: 'Car',
    icon: '🚗',
  },
]

function renderSidebar() {
  return `
    <div class="flex h-full flex-col">
      <div
        class="flex min-h-20 items-center justify-between gap-3 border-b border-brand-border px-5"
      >
        <a
          href="/dashboard/"
          class="flex min-w-0 items-center gap-3"
          aria-label="${siteConfig.brand.name} dashboard"
        >
          <img
            src="${logoImage}"
            alt="${siteConfig.brand.name} logo"
            class="size-11 shrink-0 object-contain"
          >

          <span class="min-w-0">
            <span
              class="block truncate text-sm font-semibold uppercase tracking-[0.14em] text-brand-cream"
            >
              ${siteConfig.brand.name}
            </span>

            <span
              class="mt-0.5 block text-[0.58rem] uppercase tracking-[0.13em] text-brand-muted"
            >
              Member Platform
            </span>
          </span>
        </a>

        <button
          type="button"
          class="grid size-10 place-items-center rounded-full border border-brand-border text-brand-muted transition hover:border-brand-gold hover:text-brand-gold lg:hidden"
          aria-label="Close dashboard menu"
          @click="closeMobileMenu()"
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
            />
          </svg>
        </button>
      </div>

      <nav
        class="flex-1 overflow-y-auto px-4 py-6"
        aria-label="Member dashboard navigation"
      >
        <p
          class="px-3 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-brand-muted"
        >
          Platform
        </p>

        <a
          href="/dashboard/"
          class="mt-3 flex items-center gap-3 rounded-xl bg-brand-gold px-3 py-3 text-sm font-semibold text-[#17130d]"
          aria-current="page"
        >
          <svg
            class="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            aria-hidden="true"
          >
            <rect
              x="3"
              y="3"
              width="7"
              height="7"
              rx="1"
            />

            <rect
              x="14"
              y="3"
              width="7"
              height="7"
              rx="1"
            />

            <rect
              x="3"
              y="14"
              width="7"
              height="7"
              rx="1"
            />

            <rect
              x="14"
              y="14"
              width="7"
              height="7"
              rx="1"
            />
          </svg>

          <span>General</span>
        </a>

        <div class="mt-3">
          <button
            type="button"
            class="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-brand-cream transition hover:bg-brand-charcoal"
            @click="ordersOpen = !ordersOpen"
            :aria-expanded="ordersOpen"
          >
            <span class="flex items-center gap-3">
              <svg
                class="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                aria-hidden="true"
              >
                <path
                  d="M4 5h2l2 10h9l2-7H7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                <circle
                  cx="10"
                  cy="19"
                  r="1"
                />

                <circle
                  cx="17"
                  cy="19"
                  r="1"
                />
              </svg>

              <span>Orders</span>
            </span>

            <svg
              class="size-4 text-brand-muted transition"
              :class="ordersOpen ? 'rotate-180' : ''"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              aria-hidden="true"
            >
              <path
                d="m7 10 5 5 5-5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <div
            x-show="ordersOpen"
            x-transition
            class="ml-5 border-l border-brand-border pl-4"
          >
            <button
              type="button"
              class="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-brand-muted transition hover:bg-brand-charcoal hover:text-brand-gold"
              @click="
                showPreviewNotice('Create Order')
                closeMobileMenu()
              "
            >
              Create Order
            </button>

            <button
              type="button"
              class="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-brand-muted transition hover:bg-brand-charcoal hover:text-brand-gold"
              @click="
                showPreviewNotice('Order History')
                closeMobileMenu()
              "
            >
              Order History
            </button>
          </div>
        </div>

        <div class="mt-1">
          <button
            type="button"
            class="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-brand-cream transition hover:bg-brand-charcoal"
            @click="walletOpen = !walletOpen"
            :aria-expanded="walletOpen"
          >
            <span class="flex items-center gap-3">
              <svg
                class="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                aria-hidden="true"
              >
                <path
                  d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 16.5v-9Z"
                  stroke-linejoin="round"
                />

                <path
                  d="M4 8h16M15 12h5"
                  stroke-linecap="round"
                />
              </svg>

              <span>Wallet</span>
            </span>

            <svg
              class="size-4 text-brand-muted transition"
              :class="walletOpen ? 'rotate-180' : ''"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              aria-hidden="true"
            >
              <path
                d="m7 10 5 5 5-5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <div
            x-show="walletOpen"
            x-transition
            class="ml-5 border-l border-brand-border pl-4"
          >
            <button
              type="button"
              class="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-brand-muted transition hover:bg-brand-charcoal hover:text-brand-gold"
              @click="
                showPreviewNotice('Earnings')
                closeMobileMenu()
              "
            >
              Earnings
            </button>

            <button
              type="button"
              class="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-brand-muted transition hover:bg-brand-charcoal hover:text-brand-gold"
              @click="
                showPreviewNotice('Payout Request')
                closeMobileMenu()
              "
            >
              Payout Request
            </button>
          </div>
        </div>

        <button
          type="button"
          class="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-brand-cream transition hover:bg-brand-charcoal"
          @click="
            showPreviewNotice('Account')
            closeMobileMenu()
          "
        >
          <svg
            class="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="8"
              r="4"
            />

            <path
              d="M4.5 21a7.5 7.5 0 0 1 15 0"
              stroke-linecap="round"
            />
          </svg>

          <span>Account</span>
        </button>
      </nav>

      <div class="border-t border-brand-border p-4">
        <div
          class="flex items-center gap-3 rounded-xl bg-brand-charcoal p-3"
        >
          <div
            class="grid size-10 shrink-0 place-items-center rounded-full bg-brand-gold text-sm font-bold text-[#17130d]"
          >
            SM
          </div>

          <div class="min-w-0 flex-1">
            <p
              class="truncate text-sm font-semibold text-brand-cream"
            >
              ${previewMember.firstName}
              ${previewMember.lastName}
            </p>

            <p class="truncate text-xs text-brand-muted">
              Preview Account
            </p>
          </div>
        </div>
      </div>
    </div>
  `
}

window.Alpine = Alpine

Alpine.data('memberDashboard', () => ({
  mobileMenuOpen: false,
  ordersOpen: true,
  walletOpen: true,
  previewNotice: '',
  previewTimer: null,

  init() {
    this.$watch('mobileMenuOpen', (isOpen) => {
      document.body.classList.toggle(
        'mobile-menu-open',
        isOpen,
      )
    })
  },

  openMobileMenu() {
    this.mobileMenuOpen = true
  },

  closeMobileMenu() {
    this.mobileMenuOpen = false
  },

  showPreviewNotice(pageName) {
    clearTimeout(this.previewTimer)

    this.previewNotice =
      `${pageName} will be added in the next dashboard checkpoint.`

    this.previewTimer = setTimeout(() => {
      this.previewNotice = ''
    }, 3200)
  },

  destroy() {
    clearTimeout(this.previewTimer)

    document.body.classList.remove(
      'mobile-menu-open',
    )
  },
}))

document.title =
  `Member Dashboard | ${siteConfig.brand.name}`

document.querySelector('#dashboard-app').innerHTML = `
  <div
    x-data="memberDashboard"
    x-cloak
    class="min-h-screen bg-brand-black text-brand-cream"
    @keydown.escape.window="closeMobileMenu()"
  >
    <aside
      class="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-brand-border bg-brand-panel lg:block"
    >
      ${renderSidebar()}
    </aside>

    <div
      x-show="mobileMenuOpen"
      x-transition.opacity
      class="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] lg:hidden"
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
      aria-label="Dashboard menu"
    >
      ${renderSidebar()}
    </aside>

    <div class="min-h-screen lg:pl-72">
      <header
        class="sticky top-0 z-20 border-b border-brand-border bg-brand-panel/95 backdrop-blur-xl"
      >
        <div
          class="mx-auto flex min-h-16 w-[min(1240px,92%)] items-center justify-between gap-4"
        >
          <div class="flex min-w-0 items-center gap-3">
            <button
              type="button"
              class="grid size-10 shrink-0 place-items-center rounded-full border border-brand-border text-brand-cream transition hover:border-brand-gold hover:text-brand-gold lg:hidden"
              aria-label="Open dashboard menu"
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
                Member Platform
              </p>

              <p
                class="truncate text-sm font-semibold text-brand-cream"
              >
                General Dashboard
              </p>
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
        class="mx-auto w-[min(1240px,92%)] py-8 sm:py-10"
      >
        <section
          class="relative isolate overflow-hidden rounded-[1.75rem] border border-brand-gold/30 bg-brand-panel p-6 shadow-gold-soft sm:p-8 lg:p-10"
        >
          <div
            class="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-brand-gold/10 blur-3xl"
            aria-hidden="true"
          ></div>

          <div
            class="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <p
                class="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-brand-gold"
              >
                Your Future
              </p>

              <h1
                class="mt-3 font-display text-4xl leading-none text-brand-cream sm:text-5xl"
              >
                Welcome,
                <span class="italic text-brand-gold">
                  ${previewMember.firstName}.
                </span>
              </h1>

              <p
                class="mt-4 max-w-2xl text-sm leading-7 text-brand-muted sm:text-base"
              >
                This is the simplified member overview.
                Figures shown below are temporary preview
                values until the secure database is connected.
              </p>
            </div>

            <div
              class="w-full rounded-2xl border border-brand-border bg-brand-black px-5 py-4 lg:w-auto lg:min-w-64"
            >
              <p
                class="text-xs uppercase tracking-[0.12em] text-brand-muted"
              >
                Account Status
              </p>

              <div class="mt-2 flex items-center gap-2">
                <span
                  class="size-2 rounded-full bg-amber-500"
                ></span>

                <strong
                  class="text-sm text-brand-cream"
                >
                  ${previewMember.membershipStatus}
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section
          class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Member overview"
        >
          <article
            class="rounded-[1.35rem] border border-brand-border bg-brand-panel p-5 shadow-[0_12px_35px_rgb(62_48_24_/_0.06)]"
          >
            <p
              class="text-xs uppercase tracking-[0.13em] text-brand-muted"
            >
              Your People
            </p>

            <strong
              class="mt-3 block font-display text-4xl text-brand-cream"
            >
              ${previewMember.directReferrals}
            </strong>

            <p
              class="mt-3 text-xs leading-5 text-brand-muted"
            >
              Direct referrals only
            </p>
          </article>

          <article
            class="rounded-[1.35rem] border border-brand-border bg-brand-panel p-5 shadow-[0_12px_35px_rgb(62_48_24_/_0.06)]"
          >
            <p
              class="text-xs uppercase tracking-[0.13em] text-brand-muted"
            >
              Your Points
            </p>

            <strong
              class="mt-3 block font-display text-4xl text-brand-cream"
            >
              ${previewMember.pointsBalance}
            </strong>

            <p
              class="mt-3 text-xs leading-5 text-brand-muted"
            >
              Rules pending confirmation
            </p>
          </article>

          <article
            class="rounded-[1.35rem] border border-brand-border bg-brand-panel p-5 shadow-[0_12px_35px_rgb(62_48_24_/_0.06)]"
          >
            <p
              class="text-xs uppercase tracking-[0.13em] text-brand-muted"
            >
              Available Income
            </p>

            <strong
              class="mt-3 block font-display text-4xl text-brand-cream"
            >
              ₱${previewMember.availableIncome.toLocaleString(
                'en-PH',
              )}
            </strong>

            <p
              class="mt-3 text-xs leading-5 text-brand-muted"
            >
              Manual approval required
            </p>
          </article>

          <article
            class="rounded-[1.35rem] border border-brand-gold/35 bg-brand-charcoal p-5"
          >
            <p
              class="text-xs uppercase tracking-[0.13em] text-brand-muted"
            >
              Quick Action
            </p>

            <h2
              class="mt-3 font-display text-2xl text-brand-cream"
            >
              Ready to order?
            </h2>

            <button
              type="button"
              class="premium-cta mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand-gold px-5 text-sm font-semibold text-[#17130d]"
              @click="showPreviewNotice('Create Order')"
            >
              Create Order
            </button>
          </article>
        </section>

        <div
          class="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]"
        >
          <section
            class="rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
          >
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
            >
              Reward Journey
            </p>

            <h2
              class="mt-1 font-display text-3xl text-brand-cream"
            >
              Your Milestones
            </h2>

            <p
              class="mt-3 max-w-2xl text-sm leading-6 text-brand-muted"
            >
              Qualification thresholds are intentionally
              not shown yet. They will be added after the
              client confirms the final rules.
            </p>

            <div
              class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              ${previewRewards.map((reward) => `
                <article
                  class="rounded-2xl border border-brand-border bg-brand-black p-4 text-center"
                >
                  <span
                    class="mx-auto grid size-12 place-items-center rounded-full bg-brand-charcoal text-2xl"
                    aria-hidden="true"
                  >
                    ${reward.icon}
                  </span>

                  <h3
                    class="mt-3 text-sm font-semibold text-brand-cream"
                  >
                    ${reward.label}
                  </h3>

                  <p
                    class="mt-1 text-[0.65rem] uppercase tracking-[0.1em] text-brand-muted"
                  >
                    Locked
                  </p>
                </article>
              `).join('')}
            </div>
          </section>

          <section
            class="rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
          >
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
            >
              Membership
            </p>

            <h2
              class="mt-1 font-display text-3xl text-brand-cream"
            >
              Account Overview
            </h2>

            <dl
              class="mt-6 divide-y divide-brand-border"
            >
              <div
                class="flex items-center justify-between gap-4 py-3 first:pt-0"
              >
                <dt class="text-sm text-brand-muted">
                  Member Name
                </dt>

                <dd
                  class="text-right text-sm font-semibold text-brand-cream"
                >
                  ${previewMember.firstName}
                  ${previewMember.lastName}
                </dd>
              </div>

              <div
                class="flex items-center justify-between gap-4 py-3"
              >
                <dt class="text-sm text-brand-muted">
                  Email
                </dt>

                <dd
                  class="max-w-44 truncate text-right text-sm font-semibold text-brand-cream"
                >
                  ${previewMember.emailAddress}
                </dd>
              </div>

              <div
                class="flex items-center justify-between gap-4 py-3"
              >
                <dt class="text-sm text-brand-muted">
                  Package
                </dt>

                <dd
                  class="text-right text-sm font-semibold text-brand-cream"
                >
                  Not Assigned
                </dd>
              </div>

              <div
                class="flex items-center justify-between gap-4 py-3 last:pb-0"
              >
                <dt class="text-sm text-brand-muted">
                  Verification
                </dt>

                <dd
                  class="text-right text-sm font-semibold text-amber-700"
                >
                  Preview Status
                </dd>
              </div>
            </dl>

            <button
              type="button"
              class="premium-outline mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-brand-border px-5 text-sm font-semibold text-brand-cream hover:border-brand-gold hover:text-brand-gold"
              @click="showPreviewNotice('Account')"
            >
              View Account
            </button>
          </section>
        </div>

        <section
          class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
        >
          <div
            class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p
                class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
              >
                Recent Activity
              </p>

              <h2
                class="mt-1 font-display text-3xl text-brand-cream"
              >
                Recent Orders
              </h2>
            </div>

            <button
              type="button"
              class="text-left text-sm font-semibold text-brand-gold transition hover:text-brand-gold-light"
              @click="showPreviewNotice('Order History')"
            >
              View Order History
            </button>
          </div>

          <div
            class="mt-6 rounded-2xl border border-dashed border-brand-border bg-brand-black px-5 py-10 text-center"
          >
            <span
              class="mx-auto grid size-12 place-items-center rounded-full bg-brand-charcoal text-brand-gold"
            >
              <svg
                class="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                aria-hidden="true"
              >
                <path
                  d="M4 5h2l2 10h9l2-7H7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                <circle
                  cx="10"
                  cy="19"
                  r="1"
                />

                <circle
                  cx="17"
                  cy="19"
                  r="1"
                />
              </svg>
            </span>

            <h3
              class="mt-4 font-display text-2xl text-brand-cream"
            >
              No Preview Orders Yet
            </h3>

            <p
              class="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted"
            >
              Real order records will appear here after
              Supabase and secure account access are connected.
            </p>
          </div>
        </section>

        <p
          class="mt-6 text-center text-xs leading-5 text-brand-muted"
        >
          Dashboard interface preview — no account,
          points, income, or order data is being saved yet.
        </p>
      </main>
    </div>

    <div
      x-show="previewNotice"
      x-transition
      class="fixed bottom-5 left-1/2 z-[70] w-[min(26rem,90%)] -translate-x-1/2 rounded-xl border border-brand-gold/35 bg-brand-panel px-4 py-3 text-center text-sm font-medium text-brand-cream shadow-2xl"
      role="status"
      x-text="previewNotice"
    ></div>
  </div>
`

Alpine.start()