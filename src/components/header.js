export function renderHeader(siteConfig) {
  const desktopLinks = siteConfig.navigation
  .map(
    (item) => `
        <a
          href="${item.href}"
          class="text-sm text-brand-muted transition hover:text-brand-gold"
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
          class="border-b border-brand-border py-4 text-lg text-brand-cream transition hover:text-brand-gold"
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
        <!-- Brand -->
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
  
        <!-- Desktop navigation -->
        <nav
          class="hidden items-center gap-7 md:flex"
          aria-label="Main navigation"
        >
          ${desktopLinks}
        </nav>
  
        <!-- Desktop actions -->
        <div class="hidden items-center gap-3 md:flex">
          <a
            href="#login"
            class="rounded-full px-4 py-2 text-sm text-brand-muted transition hover:text-brand-cream"
          >
            Log in
          </a>
  
          <a
  href="#signup"
  class="rounded-full bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-light"
>
  Sign Up
</a>
  
          <!-- Desktop cart button -->
          <button
            type="button"
            class="relative grid size-11 place-items-center rounded-full border border-brand-border text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
            :aria-label="'Open shopping cart with ' + $store.cart.itemCount + ' items'"
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
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 3h1.386a1.5 1.5 0 0 1 1.455 1.136l.383 1.535m0 0L6.75 10.5a1.5 1.5 0 0 0 1.455 1.136h7.884a1.5 1.5 0 0 0 1.43-1.048L19 5.671H5.474ZM8.25 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm9 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
  
            <span
              x-show="$store.cart.itemCount > 0"
              x-text="
                $store.cart.itemCount > 99
                  ? '99+'
                  : $store.cart.itemCount
              "
              class="absolute -right-1.5 -top-1.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-brand-gold px-1 text-[10px] font-bold leading-none text-brand-black"
              aria-hidden="true"
            ></span>
          </button>
        </div>
  
        <!-- Mobile controls -->
        <div class="flex shrink-0 items-center gap-2 md:hidden">
          <!-- Mobile cart button -->
          <button
            type="button"
            class="relative grid size-11 place-items-center rounded-full border border-brand-border text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
            :aria-label="'Open shopping cart with ' + $store.cart.itemCount + ' items'"
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
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 3h1.386a1.5 1.5 0 0 1 1.455 1.136l.383 1.535m0 0L6.75 10.5a1.5 1.5 0 0 0 1.455 1.136h7.884a1.5 1.5 0 0 0 1.43-1.048L19 5.671H5.474ZM8.25 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm9 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
  
            <span
              x-show="$store.cart.itemCount > 0"
              x-text="
                $store.cart.itemCount > 99
                  ? '99+'
                  : $store.cart.itemCount
              "
              class="absolute -right-1.5 -top-1.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-brand-gold px-1 text-[10px] font-bold leading-none text-brand-black"
              aria-hidden="true"
            ></span>
          </button>
  
          <!-- Mobile menu button -->
          <button
            type="button"
            class="relative grid size-11 place-items-center rounded-full border border-brand-border text-brand-cream"
            aria-label="Toggle navigation menu"
            :aria-expanded="menuOpen"
            @click="menuOpen = !menuOpen"
          >
            <span class="sr-only">Toggle menu</span>
  
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
  
      <!-- Mobile navigation -->
      <div
        class="border-t border-brand-border bg-brand-charcoal md:hidden"
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
            class="mt-5 rounded-full border border-brand-gold px-5 py-3 text-center text-sm font-semibold text-brand-gold"
            @click="menuOpen = false"
          >
            Member Login
          </a>
  
          <a
  href="#signup"
  class="mt-3 rounded-full bg-brand-gold px-5 py-3 text-center text-sm font-semibold text-brand-black"
  @click="menuOpen = false"
>
  Sign Up
</a>
        </nav>
      </div>
    </header>
  `
}