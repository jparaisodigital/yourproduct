import headerLogo from '../assets/logoyourproduct.png'

export function renderHeader(siteConfig) {
  const desktopLinks = siteConfig.navigation
    .map(
      (item) => `
        <a
          href="${item.href}"
          class="header-nav-link text-sm text-brand-muted hover:text-brand-gold"
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
          class="header-mobile-link border-b border-brand-border py-3.5 text-base text-brand-cream hover:text-brand-gold"
          @click="menuOpen = false"
        >
          ${item.label}
        </a>
      `,
    )
    .join('')

  const themeToggleButton = `
    <button
      type="button"
      class="premium-icon grid size-11 shrink-0 place-items-center rounded-full border border-brand-border text-brand-cream hover:border-brand-gold hover:bg-brand-gold/10 hover:text-brand-gold"
      :aria-label="
        theme === 'black'
          ? 'Switch to Ivory and Gold theme'
          : 'Switch to Black and Gold theme'
      "
      :title="
        theme === 'black'
          ? 'Ivory and Gold theme'
          : 'Black and Gold theme'
      "
      @click="toggleTheme()"
    >
      <svg
        x-cloak
        x-show="theme === 'black'"
        class="size-5"
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
        class="size-5"
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
            ? 'Switch to Ivory and Gold theme'
            : 'Switch to Black and Gold theme'
        "
      ></span>
    </button>
  `

  return `
    <header
      class="sticky top-0 z-30 border-b border-brand-border bg-brand-black/90 backdrop-blur-xl"
      x-data="{
        menuOpen: false,
        theme: 'black',

        init() {
          const savedTheme =
            window.localStorage.getItem('your-product-theme')

          this.theme =
            savedTheme === 'ivory'
              ? 'ivory'
              : 'black'

          this.applyTheme()
        },

        applyTheme() {
          if (this.theme === 'ivory') {
            document.documentElement.setAttribute(
              'data-theme',
              'ivory'
            )
          } else {
            document.documentElement.removeAttribute(
              'data-theme'
            )
          }

          window.localStorage.setItem(
            'your-product-theme',
            this.theme
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
}
      }"
      x-effect="
        document.body.classList.toggle(
          'mobile-menu-open',
          menuOpen
        )
      "
      @keydown.escape.window="menuOpen = false"
      @resize.window="
        if (window.innerWidth >= 1024) {
          menuOpen = false
        }
      "
    >
      <div
        class="mx-auto flex min-h-20 w-[min(1180px,90%)] items-center justify-between gap-4"
      >
        <a
          href="#home"
          class="flex min-w-0 items-center gap-3"
          aria-label="${siteConfig.brand.name} home"
        >
          <img
            src="${headerLogo}"
            alt=""
            width="48"
            height="48"
            class="size-11 shrink-0 object-contain sm:size-12"
          >

          <span class="min-w-0">
            <strong
              class="block truncate text-sm tracking-[0.16em] text-brand-cream"
            >
              ${siteConfig.brand.name}
            </strong>

            <small
              class="block truncate text-[8px] uppercase tracking-[0.08em] text-brand-muted sm:text-[9px] sm:tracking-[0.14em]"
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
          ${themeToggleButton}

          <a
            href="/login/"
            class="premium-icon group grid size-11 place-items-center rounded-full border border-brand-border text-brand-muted hover:border-brand-gold hover:bg-brand-gold/10 hover:text-brand-gold"
            aria-label="Member Login"
            title="Member Login"
          >
            <svg
              class="size-5"
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
            href="/register/"
            class="premium-cta group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-gold px-5 text-sm font-semibold text-[#17130d] hover:bg-brand-gold-light"
          >
            <span>
              Sign Up
            </span>

            <span
              class="premium-cta-arrow text-base leading-none"
              aria-hidden="true"
            >
              →
            </span>
          </a>

          <button
            type="button"
            class="premium-icon relative grid size-11 place-items-center rounded-full border border-brand-border text-brand-cream hover:border-brand-gold hover:bg-brand-gold/10 hover:text-brand-gold"
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
          ${themeToggleButton}

          <button
            type="button"
            class="premium-icon relative grid size-11 place-items-center rounded-full border border-brand-border text-brand-cream hover:border-brand-gold hover:bg-brand-gold/10 hover:text-brand-gold"
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
            class="premium-icon relative grid size-11 place-items-center rounded-full border border-brand-border text-brand-cream hover:border-brand-gold hover:bg-brand-gold/10 hover:text-brand-gold"
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
            href="/login/"
            class="premium-outline mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-brand-gold px-5 text-sm font-semibold text-brand-gold hover:bg-brand-gold/10"
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
            href="/register/"
            class="premium-cta mt-2.5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-gold px-5 text-sm font-semibold text-[#17130d] hover:bg-brand-gold-light"
            @click="menuOpen = false"
          >
            <span>
              Sign Up
            </span>

            <span
              class="premium-cta-arrow text-base leading-none"
              aria-hidden="true"
            >
              →
            </span>
          </a>
        </nav>
      </div>
    </header>
  `
}