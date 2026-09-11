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
        class="sticky top-0 z-50 border-b border-brand-border bg-brand-black/90 backdrop-blur-xl"
        x-data="{ menuOpen: false }"
      >
        <div class="mx-auto flex min-h-20 w-[min(1180px,90%)] items-center justify-between gap-6">
          <a
            href="#home"
            class="flex items-center gap-3"
            aria-label="${siteConfig.brand.name} home"
          >
            <span
              class="grid size-11 place-items-center rounded-full border border-brand-gold font-display text-2xl font-semibold text-brand-gold"
              aria-hidden="true"
            >
              YP
            </span>
  
            <span>
              <strong class="block text-sm tracking-[0.16em] text-brand-cream">
                ${siteConfig.brand.name}
              </strong>
  
              <small class="block text-[9px] uppercase tracking-[0.14em] text-brand-muted">
                ${siteConfig.brand.tagline}
              </small>
            </span>
          </a>
  
          <nav
            class="hidden items-center gap-7 md:flex"
            aria-label="Main navigation"
          >
            ${desktopLinks}
          </nav>
  
          <div class="hidden items-center gap-3 md:flex">
            <a
              href="#login"
              class="rounded-full px-4 py-2 text-sm text-brand-muted transition hover:text-brand-cream"
            >
              Log in
            </a>
  
            <a
              href="#membership"
              class="rounded-full bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-light"
            >
              Explore Membership
            </a>
          </div>
  
          <button
            type="button"
            class="relative grid size-11 place-items-center rounded-full border border-brand-border text-brand-cream md:hidden"
            aria-label="Toggle navigation menu"
            :aria-expanded="menuOpen"
            @click="menuOpen = !menuOpen"
          >
            <span class="sr-only">Toggle menu</span>
  
            <span class="relative block h-4 w-5">
              <span
                class="absolute left-0 top-0 block h-px w-5 bg-current transition duration-300"
                :class="menuOpen ? 'translate-y-[7px] rotate-45' : ''"
              ></span>
  
              <span
                class="absolute left-0 top-[7px] block h-px w-5 bg-current transition duration-300"
                :class="menuOpen ? 'opacity-0' : ''"
              ></span>
  
              <span
                class="absolute bottom-0 left-0 block h-px w-5 bg-current transition duration-300"
                :class="menuOpen ? '-translate-y-[8px] -rotate-45' : ''"
              ></span>
            </span>
          </button>
        </div>
  
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
          </nav>
        </div>
      </header>
    `
  }