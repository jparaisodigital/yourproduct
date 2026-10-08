import modalLogo from '../assets/logoyourproduct.webp'
import modalOrnament from '../assets/modal-ornament.webp'

const OPEN_DELAY = 1400

export function registerMembershipModal(
  Alpine,
) {
  Alpine.data('membershipInvite', () => ({
    open: false,
    timer: null,

    init() {
      this.scheduleOpen(OPEN_DELAY)
    },

    scheduleOpen(delay) {
      window.clearTimeout(this.timer)

      this.timer = window.setTimeout(() => {
        this.tryOpen()
      }, delay)
    },

    tryOpen() {
      const anotherDialogIsOpen = Array.from(
        document.querySelectorAll(
          '[role="dialog"]',
        ),
      ).some((element) => {
        return (
          element !== this.$root &&
          window.getComputedStyle(element)
            .display !== 'none'
        )
      })

      if (anotherDialogIsOpen) {
        this.scheduleOpen(2000)
        return
      }

      this.open = true
    },

    close() {
      this.open = false
    },

    destroy() {
      window.clearTimeout(this.timer)
      document.body.style.overflow = ''
    },
  }))
}

export function renderMembershipModal() {
  return `
    <div
      x-data="membershipInvite"
      x-cloak
      x-show="open"
      x-effect="
        document.body.style.overflow =
          open ? 'hidden' : ''
      "
      @keydown.escape.window="close()"
      class="fixed inset-0 z-[90] grid place-items-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="membership-modal-title"
    >
      <button
        type="button"
        class="absolute inset-0 cursor-default bg-black/60 backdrop-blur-[3px]"
        aria-label="Close membership offer"
        @click="close()"
      ></button>

      <section
        x-show="open"
        x-transition:enter="transition duration-200 ease-out"
        x-transition:enter-start="translate-y-3 scale-[0.98] opacity-0"
        x-transition:enter-end="translate-y-0 scale-100 opacity-100"
        x-transition:leave="transition duration-150 ease-in"
        x-transition:leave-start="translate-y-0 scale-100 opacity-100"
        x-transition:leave-end="translate-y-2 scale-[0.99] opacity-0"
        class="relative w-full max-w-lg overflow-hidden rounded-[1.5rem] border border-brand-gold/35 bg-brand-panel px-5 py-8 text-center shadow-2xl sm:px-10 sm:py-10"
      >
        <img
          src="${modalLogo}"
          alt=""
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 size-full scale-105 select-none object-contain p-5 opacity-[0.045] sm:p-8"
        >

        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-panel/10 via-brand-panel/35 to-brand-panel/75"
          aria-hidden="true"
        ></div>

        <img
          src="${modalOrnament}"
          alt=""
          aria-hidden="true"
          class="pointer-events-none absolute -bottom-8 -left-8 z-[5] w-24 max-w-none select-none object-contain opacity-[0.22] sm:w-32 sm:opacity-[0.3]"
        >

        <img
          src="${modalOrnament}"
          alt=""
          aria-hidden="true"
          class="pointer-events-none absolute -right-8 -top-8 z-[5] w-24 max-w-none rotate-180 select-none object-contain opacity-[0.22] sm:w-32 sm:opacity-[0.3]"
        >

        <button
          type="button"
          class="absolute right-4 top-4 z-20 grid size-9 place-items-center rounded-full border border-brand-border bg-brand-panel/85 text-brand-muted transition hover:border-brand-gold hover:text-brand-gold"
          aria-label="Close membership offer"
          @click="close()"
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

        <div class="relative z-10">
          <p
            class="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-brand-gold"
          >
            Member Pricing Is Live
          </p>

          <h2
            id="membership-modal-title"
            class="mx-auto mt-4 max-w-md font-display text-3xl font-semibold leading-none text-brand-cream sm:text-5xl"
          >
            From PHP 349 to as low as

            <span class="mt-2 block italic text-brand-gold">
              PHP 175 per bottle.
            </span>
          </h2>

          <p
            class="mx-auto mt-5 max-w-md text-sm leading-6 text-brand-muted sm:text-base sm:leading-7"
          >
            Become a YOUR PRODUCT member and unlock
            reseller pricing, referral rewards, and member
            dashboard access after approval.
          </p>

          <div
            class="mx-auto mt-7 grid max-w-sm gap-2 rounded-2xl border border-brand-border bg-brand-black/25 p-3 text-left"
          >
            <p class="flex items-center justify-between gap-4 text-xs text-brand-muted">
              <span>Starter member</span>
              <strong class="font-semibold text-brand-cream">
                PHP 245 / bottle
              </strong>
            </p>

            <p class="flex items-center justify-between gap-4 text-xs text-brand-muted">
              <span>Builder member</span>
              <strong class="font-semibold text-brand-cream">
                PHP 227 / bottle
              </strong>
            </p>

            <p class="flex items-center justify-between gap-4 text-xs text-brand-muted">
              <span>Leader member</span>
              <strong class="font-semibold text-brand-cream">
                PHP 210 / bottle
              </strong>
            </p>

            <p class="flex items-center justify-between gap-4 text-xs text-brand-muted">
              <span>Prestige member</span>
              <strong class="font-semibold text-brand-cream">
                PHP 175 / bottle
              </strong>
            </p>
          </div>

          <div
            class="mx-auto mt-7 flex max-w-sm flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <a
              href="#packages"
              class="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-black transition hover:-translate-y-0.5 hover:bg-brand-gold-light"
              @click="close()"
            >
              View Packages
            </a>

            <a
              href="/register/"
              class="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-brand-border bg-brand-panel/60 px-6 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
              @click="close()"
            >
              Create Account
            </a>
          </div>

          <button
            type="button"
            class="mt-6 text-xs text-brand-muted underline decoration-brand-border underline-offset-4 transition hover:text-brand-gold"
            @click="close()"
          >
            Continue Shopping
          </button>

          <p
            class="mx-auto mt-4 max-w-sm text-[0.65rem] leading-5 text-brand-muted"
          >
            Membership applications are manually reviewed
            before benefits activate.
          </p>
        </div>
      </section>
    </div>
  `
}
