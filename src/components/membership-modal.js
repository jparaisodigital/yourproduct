import popupImage from '../assets/popup.webp'

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
        class="relative w-full max-w-md overflow-hidden rounded-[1.35rem] border border-brand-gold/35 bg-brand-panel text-center shadow-2xl"
      >
        <button
          type="button"
          class="absolute right-4 top-4 z-30 grid size-9 place-items-center rounded-full border border-brand-gold/40 bg-brand-black/75 text-brand-cream backdrop-blur-sm transition hover:border-brand-gold hover:text-brand-gold"
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

        <div class="relative h-[13.5rem] overflow-hidden sm:h-[14.5rem]">
          <img
            src="${popupImage}"
            alt=""
            aria-hidden="true"
            class="absolute inset-0 size-full select-none object-cover object-center"
          >

          <div
            class="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-brand-panel"
            aria-hidden="true"
          ></div>

          <div class="absolute left-5 top-5 z-10 max-w-[12rem] text-left sm:left-7 sm:top-6 sm:max-w-[14rem]">
            <p class="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-brand-gold">
              Premium Fragrances
            </p>

            <h2
              id="membership-modal-title"
              class="mt-2 font-display text-[1.75rem] font-semibold leading-[0.95] text-brand-cream sm:text-3xl"
            >
              Luxury Scents

              <span class="mt-1.5 block text-base italic leading-tight text-brand-gold sm:text-lg">
                For Every You.
              </span>

              <p class="mt-3 text-[0.95rem] font-medium tracking-[0.01em] text-brand-cream [text-shadow:0_2px_8px_rgba(0,0,0,0.95)] sm:text-base">
  Made to be remembered.
</p>

            </h2>
          </div>
        </div>

        <div class="relative z-10 px-5 pb-4 sm:px-7 sm:pb-5">
          <div class="mx-auto grid max-w-sm grid-cols-2 gap-3 text-left">
            <div class="rounded-2xl border border-brand-border bg-brand-black/30 p-3">
              <p class="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand-muted">
                Perfumes
              </p>

              <p class="mt-1.5 text-2xl font-bold text-brand-cream">
                ₱349
              </p>

              <p class="mt-1 text-xs text-brand-muted">
                per bottle
              </p>
            </div>

            <div class="rounded-2xl border border-brand-gold/50 bg-brand-gold/10 p-3">
              <p class="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand-gold">
                Member Price
              </p>

              <p class="mt-2 text-2xl font-bold text-brand-gold">
                ₱175
              </p>

              <p class="mt-1 text-xs text-brand-muted">
                per bottle
              </p>
            </div>
          </div>

          <div class="mx-auto mt-3 max-w-sm rounded-2xl border border-brand-border bg-brand-black/25 px-4 py-3">
            <p class="text-sm font-semibold text-brand-cream">
              Become a Member
            </p>

            <p class="mt-1 text-xs leading-5 text-brand-muted sm:text-sm">
  Enjoy member pricing from ₱175 per bottle.
</p>
          </div>

          <div class="mx-auto mt-3 flex max-w-sm flex-col gap-2">
            <a
              href="#shop"
              class="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-bold uppercase tracking-[0.08em] text-brand-black transition hover:-translate-y-0.5 hover:bg-brand-gold-light"
              @click="close()"
            >
              Buy Now
            </a>

            <a
              href="#packages"
              class="inline-flex min-h-12 items-center justify-center rounded-full border border-brand-gold/50 bg-brand-panel/60 px-6 text-sm font-semibold uppercase tracking-[0.08em] text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
              @click.prevent="
                close()
                document
                  .querySelector('#packages')
                  ?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  })
              "
            >
              View Member Packages
            </a>
          </div>

          <button
            type="button"
            class="mt-3 text-xs text-brand-muted underline decoration-brand-border underline-offset-4 transition hover:text-brand-gold"
            @click="close()"
          >
            Continue Shopping
          </button>
        </div>
      </section>
    </div>
  `
}