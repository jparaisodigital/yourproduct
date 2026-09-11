export function renderFooter(siteConfig) {
    const currentYear = new Date().getFullYear()
  
    const footerLinks = siteConfig.navigation
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
  
    return `
      <footer class="border-t border-brand-border bg-brand-charcoal">
        <div class="mx-auto w-[min(1180px,90%)] py-14">
          <div class="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <a
                href="#home"
                class="inline-flex items-center gap-3"
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
  
              <p class="mt-5 max-w-sm text-sm leading-6 text-brand-muted">
                ${siteConfig.brand.shortDescription}
              </p>
            </div>
  
            <div>
              <h2 class="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
                Explore
              </h2>
  
              <nav class="mt-5 flex flex-col items-start gap-3" aria-label="Footer navigation">
                ${footerLinks}
              </nav>
            </div>
  
            <div>
              <h2 class="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
                Member Access
              </h2>
  
              <div class="mt-5 flex flex-col items-start gap-3">
                <a
                  href="#login"
                  class="text-sm text-brand-muted transition hover:text-brand-gold"
                >
                  Member Login
                </a>
  
                <a
                  href="#membership"
                  class="text-sm text-brand-muted transition hover:text-brand-gold"
                >
                  View Membership
                </a>
  
                <a
                  href="#rewards"
                  class="text-sm text-brand-muted transition hover:text-brand-gold"
                >
                  Rewards
                </a>
              </div>
            </div>
          </div>
  
          <div class="mt-12 flex flex-col gap-4 border-t border-brand-border pt-6 text-xs text-brand-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              © ${currentYear} ${siteConfig.brand.name}. All rights reserved.
            </p>
  
            <p>
              Membership benefits are subject to confirmed company mechanics.
            </p>
          </div>
        </div>
      </footer>
    `
  }