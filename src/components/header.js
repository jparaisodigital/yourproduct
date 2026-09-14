export function renderHeader(siteConfig) {
  const desktopLinks = siteConfig.navigation
    .map(
      (item) => `
        <a
          href="${item.href}"
          class="text-sm text-brand-muted transition duration-200 hover:text-brand-gold"
        >
          ${item.label}
        </a>
      `,
    )
    .join('')

  const mobileLinks = siteConfig.navigation
    .map(
      (item) => `
        <a
          href="${item.href}"
          class="border-b border-brand-border py-3.5 text-base text-brand-cream transition hover:text-brand-gold"
          @click="menuOpen = false"
        >
          ${item.label}
        </a>
      `,
    )
    .join('')

  return `
    <header
      class="sticky top-0 z-30 border-b border-brand-border bg-brand-black/90 backdrop-blur-xl"
      x-data="{ menuOpen: false }"
    >
      <div
        class="mx-auto flex min-h-20 w-[min(1180px,90%)] items-center justify-between gap-4"
      >
        <a
          href="#home"
          class="flex min-w-0 items-center gap-3"
          aria-label="${siteConfig.brand.name} home"
        >
          <span
            class="grid size-11 shrink-0 place-items-center rounded-full border border-brand-gold font-display text-2xl font-semibold text-brand-gold"
            aria-hidden="true"
          >
            YP
          </span>

          <span class="min-w-0">
            <strong
              class="block truncate text-sm tracking-[0.16em] text-brand-cream"
            >
              ${siteConfig.brand.name}
            </strong>

            <small
              class="hidden truncate text-[9px] uppercase tracking-[0.14em] text-brand-muted sm:block"
            >
              ${siteConfig.brand.tagline}
            </small>
          </span>
        </a>

        <nav
          class="hidden items-center gap-7 lg:flex"
          aria-label="Main navigation"
        >
          ${desktopLinks}
        </nav>

        <div class="hidden items-center gap-2.5 lg:flex">
          <a
            href="#login"
            class="group grid size-11 place-items-center rounded-full border border-brand-border text-brand-muted transition duration-200 hover:border-brand-gold hover:bg-brand-gold/10 hover:text-brand-gold active:scale-95"
            aria-label="Member Login"
            title="Member Login"
          >
            <svg
              class="size-5 transition duration-200 group-hover:scale-105"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.65"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="8"
                r="3.25"
              />

              <path
                d="M5.5 20c.55-4.05 2.95-6.1 6.5-6.1s5.95 2.05 6.5 6.1"
                stroke-linecap="round"
              />
            </svg>

            <span class="sr-only">
              Member Login
            </span>
          </a>

          <a
            href="#signup"
            class="inline-flex h-11 items-center justify-center rounded-xl bg-brand-gold px-5 text-sm font-semibold text-[#17130d] transition duration-200 hover:-translate-y-0.5 hover:bg-brand-gold-light"
          >
            Sign Up
          </a>

          <button
            type="button"
            class="relative grid size-11 place-items-center rounded-full border border-brand-border text-brand-cream transition duration-200 hover:border-brand-gold hover:bg-brand-gold/10 hover:text-brand-gold active:scale-95"
            :aria-label="'Open shopping cart with ' + $store.cart.itemCount + ' items'"
            data-cart-target
            @click="$dispatch('open-cart')"
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
                d="M3.5 4.5h2l1.65 9.1a2 2 0 0 0 1.97 1.65h7.96a2 2 0 0 0 1.95-1.55L20.5 7.5H6.05"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <circle
                cx="9.25"
                cy="19"
                r="1.25"
                fill="currentColor"
                stroke="none"
              />

              <circle
                cx="17.25"
                cy="19"
                r="1.25"
                fill="currentColor"
                stroke="none"
              />
            </svg>

            <span
              x-cloak
              x-show="$store.cart.itemCount > 0"
              x-text="
                $store.cart.itemCount > 99
                  ? '99+'
                  : $store.cart.itemCount
              "
              class="absolute -right-1.5 -top-1.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-brand-gold px-1 text-[10px] font-bold leading-none text-[#17130d]"
              aria-hidden="true"
            ></span>
          </button>
        </div>

        <div class="flex shrink-0 items-center gap-2 lg:hidden">
          <button
            type="button"
            class="relative grid size-11 place-items-center rounded-full border border-brand-border text-brand-cream transition hover:border-brand-gold hover:text-brand-gold active:scale-95"
            :aria-label="'Open shopping cart with ' + $store.cart.itemCount + ' items'"
            data-cart-target
            @click="$dispatch('open-cart')"
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
                d="M3.5 4.5h2l1.65 9.1a2 2 0 0 0 1.97 1.65h7.96a2 2 0 0 0 1.95-1.55L20.5 7.5H6.05"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <circle
                cx="9.25"
                cy="19"
                r="1.25"
                fill="currentColor"
                stroke="none"
              />

              <circle
                cx="17.25"
                cy="19"
                r="1.25"
                fill="currentColor"
                stroke="none"
              />
            </svg>

            <span
              x-cloak
              x-show="$store.cart.itemCount > 0"
              x-text="
                $store.cart.itemCount > 99
                  ? '99+'
                  : $store.cart.itemCount
              "
              class="absolute -right-1.5 -top-1.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-brand-gold px-1 text-[10px] font-bold leading-none text-[#17130d]"
              aria-hidden="true"
            ></span>
          </button>

          <button
            type="button"
            class="relative grid size-11 place-items-center rounded-full border border-brand-border text-brand-cream transition hover:border-brand-gold hover:text-brand-gold active:scale-95"
            aria-label="Toggle navigation menu"
            :aria-expanded="menuOpen"
            @click="menuOpen = !menuOpen"
          >
            <span class="sr-only">
              Toggle menu
            </span>

            <span class="relative block h-4 w-5">
              <span
                class="absolute left-0 top-0 block h-px w-5 bg-current transition duration-300"
                :class="
                  menuOpen
                    ? 'translate-y-[7px] rotate-45'
                    : ''
                "
              ></span>

              <span
                class="absolute left-0 top-[7px] block h-px w-5 bg-current transition duration-300"
                :class="menuOpen ? 'opacity-0' : ''"
              ></span>

              <span
                class="absolute bottom-0 left-0 block h-px w-5 bg-current transition duration-300"
                :class="
                  menuOpen
                    ? '-translate-y-[8px] -rotate-45'
                    : ''
                "
              ></span>
            </span>
          </button>
        </div>
      </div>

      <div
        class="border-t border-brand-border bg-brand-charcoal lg:hidden"
        x-cloak
        x-show="menuOpen"
        x-transition:enter="transition duration-300 ease-out"
        x-transition:enter-start="-translate-y-3 opacity-0"
        x-transition:enter-end="translate-y-0 opacity-100"
        x-transition:leave="transition duration-200 ease-in"
        x-transition:leave-start="translate-y-0 opacity-100"
        x-transition:leave-end="-translate-y-3 opacity-0"
      >
        <nav
          class="mx-auto flex w-[min(1180px,90%)] flex-col py-3"
          aria-label="Mobile navigation"
        >
          ${mobileLinks}

          <a
            href="#login"
            class="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-brand-gold px-5 text-sm font-semibold text-brand-gold transition hover:bg-brand-gold/10"
            @click="menuOpen = false"
          >
            <svg
              class="size-[1.1rem]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.65"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="8"
                r="3.25"
              />

              <path
                d="M5.5 20c.55-4.05 2.95-6.1 6.5-6.1s5.95 2.05 6.5 6.1"
                stroke-linecap="round"
              />
            </svg>

            Member Login
          </a>

          <a
            href="#signup"
            class="mt-2.5 inline-flex h-11 items-center justify-center rounded-xl bg-brand-gold px-5 text-sm font-semibold text-[#17130d]"
            @click="menuOpen = false"
          >
            Sign Up
          </a>
        </nav>
      </div>
    </header>
  `
}