import modalLogo from '../assets/logoyourproduct.png'
import modalOrnament from '../assets/modal-ornament.png'

const STORAGE_KEY = 'yp-membership-invite-last-shown'
const REPEAT_DELAY = 24 * 60 * 60 * 1000
const OPEN_DELAY = 10 * 1000

export function registerMembershipModal(Alpine) {
  Alpine.data('membershipInvite', () => ({
    open: false,
    timer: null,

    init() {
      let lastShown = 0

      try {
        lastShown = Number(
          localStorage.getItem(STORAGE_KEY),
        )
      } catch {
        lastShown = 0
      }

      const shownWithin24Hours =
        Date.now() - lastShown < REPEAT_DELAY

      if (shownWithin24Hours) {
        return
      }

      this.scheduleOpen(OPEN_DELAY)
    },

    scheduleOpen(delay) {
      clearTimeout(this.timer)

      this.timer = setTimeout(() => {
        this.tryOpen()
      }, delay)
    },

    tryOpen() {
      const anotherDialogIsOpen = Array.from(
        document.querySelectorAll('[role="dialog"]'),
      ).some((element) => {
        return (
          element !== this.$root &&
          window.getComputedStyle(element).display !==
            'none'
        )
      })

      if (anotherDialogIsOpen) {
        this.scheduleOpen(2000)
        return
      }

      this.open = true
      this.saveShownTime()
    },

    saveShownTime() {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          String(Date.now()),
        )
      } catch {
        // Modal still works if storage is unavailable.
      }
    },

    close() {
      this.open = false
    },

    destroy() {
      clearTimeout(this.timer)
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
        class="absolute inset-0 cursor-default bg-black/55 backdrop-blur-[3px]"
        aria-label="Close membership invitation"
        @click="close()"
      ></button>

      <section
        x-show="open"
        x-transition:enter="transition duration-300 ease-out"
        x-transition:enter-start="translate-y-5 scale-[0.97] opacity-0"
        x-transition:enter-end="translate-y-0 scale-100 opacity-100"
        x-transition:leave="transition duration-200 ease-in"
        x-transition:leave-start="translate-y-0 scale-100 opacity-100"
        x-transition:leave-end="translate-y-4 scale-[0.98] opacity-0"
        class="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-brand-gold/40 bg-brand-panel px-6 py-10 text-center shadow-2xl sm:px-12 sm:py-12"
      >
        <img
          src="${modalLogo}"
          alt=""
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 size-full scale-110 select-none object-contain p-4 opacity-[0.05] sm:p-8"
        >

        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-panel/20 via-brand-panel/35 to-brand-panel/65"
          aria-hidden="true"
        ></div>

        <img
          src="${modalOrnament}"
          alt=""
          aria-hidden="true"
          class="pointer-events-none absolute -bottom-8 -left-8 z-[5] w-28 max-w-none select-none object-contain opacity-[0.28] sm:-bottom-10 sm:-left-10 sm:w-36 sm:opacity-[0.34]"
        >

        <img
          src="${modalOrnament}"
          alt=""
          aria-hidden="true"
          class="pointer-events-none absolute -right-8 -top-8 z-[5] w-28 max-w-none rotate-180 select-none object-contain opacity-[0.28] sm:-right-10 sm:-top-10 sm:w-36 sm:opacity-[0.34]"
        >

        <button
          type="button"
          class="absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-full border border-brand-border bg-brand-panel/80 text-brand-muted transition hover:border-brand-gold hover:text-brand-gold"
          aria-label="Close membership invitation"
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
            class="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-brand-gold"
          >
            Membership Invitation
          </p>

          <h2
            id="membership-modal-title"
            class="mx-auto mt-4 max-w-md font-display text-4xl font-semibold leading-none text-brand-cream sm:text-5xl"
          >
            More Than a
            <span class="italic text-brand-gold">
              Signature Scent
            </span>
          </h2>

          <p
            class="mx-auto mt-5 max-w-md text-sm leading-6 text-brand-muted sm:text-base sm:leading-7"
          >
            Create an account to explore member benefits,
            points, rewards, and referral opportunities.
          </p>

          <div
            class="mx-auto mt-8 flex max-w-sm flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <a
              href="#packages"
              class="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-black transition hover:-translate-y-0.5 hover:bg-brand-gold-light"
              @click="close()"
            >
              Explore Membership
            </a>

            <a
              href="#login"
              class="inline-flex min-h-12 items-center justify-center rounded-full border border-brand-border bg-brand-panel/60 px-6 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
              @click="close()"
            >
              Member Login
            </a>
          </div>

          <button
            type="button"
            class="mt-6 text-xs text-brand-muted underline decoration-brand-border underline-offset-4 transition hover:text-brand-gold"
            @click="close()"
          >
            Continue Shopping
          </button>
        </div>
      </section>
    </div>
  `
}