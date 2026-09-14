export function renderAccountCtaSection() {
    return `
      <section
        id="signup"
        class="relative isolate overflow-hidden border-t border-brand-border bg-brand-charcoal py-20 sm:py-24 lg:py-28"
      >
        <div
          class="pointer-events-none absolute left-1/2 top-1/2 size-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold/10 blur-3xl"
          aria-hidden="true"
        ></div>
  
        <div class="relative mx-auto w-[min(1180px,90%)]">
          <!-- Heading -->
          <div class="mx-auto max-w-3xl text-center">
            <p
              class="text-xs font-semibold uppercase tracking-[0.32em] text-brand-gold"
            >
              Your Member Journey
            </p>
  
            <h2
              class="mt-5 font-display text-4xl leading-tight text-brand-cream sm:text-5xl lg:text-6xl"
            >
              Your future begins
              <span class="italic text-brand-gold">
                with one step.
              </span>
            </h2>
  
            <p
              class="mx-auto mt-6 max-w-2xl text-base leading-8 text-brand-muted"
            >
              Explore Your Product as a new member or return to your
              account to continue your journey.
            </p>
          </div>
  
          <!-- Account options -->
          <div class="mt-12 grid gap-5 lg:grid-cols-2">
            <!-- Login -->
            <article
              id="login"
              class="scroll-mt-28 rounded-[2rem] border border-brand-border bg-brand-panel p-7 sm:p-10"
            >
              <div
                class="grid size-14 place-items-center rounded-2xl border border-brand-gold/30 bg-brand-gold/10 text-brand-gold"
              >
                <svg
                  class="size-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15"
                  />
  
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m12 9 3-3m0 0 3 3m-3-3v12"
                  />
                </svg>
              </div>
  
              <p
                class="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold"
              >
                Existing Member
              </p>
  
              <h3
                class="mt-3 font-display text-3xl text-brand-cream sm:text-4xl"
              >
                Welcome back.
              </h3>
  
              <p class="mt-4 max-w-lg text-sm leading-7 text-brand-muted">
                Access your dashboard, perfume information, orders,
                points, income, and payout-request status.
              </p>
  
              <button
                type="button"
                class="mt-8 inline-flex w-full cursor-not-allowed items-center justify-center rounded-full border border-brand-border px-7 py-3.5 text-sm font-semibold text-brand-muted opacity-70 sm:w-auto"
                disabled
              >
                Member Login — Coming Soon
              </button>
            </article>
  
            <!-- Signup -->
            <article
              class="relative overflow-hidden rounded-[2rem] border border-brand-gold/40 bg-brand-black p-7 sm:p-10"
            >
              <div
                class="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-brand-gold/15 blur-3xl"
                aria-hidden="true"
              ></div>
  
              <div class="relative">
                <div
                  class="grid size-14 place-items-center rounded-2xl bg-brand-gold text-brand-black"
                >
                  <svg
                    class="size-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 21a7.5 7.5 0 0 1 15 0M19.5 8.25v6m3-3h-6"
                    />
                  </svg>
                </div>
  
                <p
                  class="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold"
                >
                  New Member
                </p>
  
                <h3
                  class="mt-3 font-display text-3xl text-brand-cream sm:text-4xl"
                >
                  Start your journey.
                </h3>
  
                <p class="mt-4 max-w-lg text-sm leading-7 text-brand-muted">
                  Create your member account and begin exploring the
                  packages, fragrances, and community of Your Product.
                </p>
  
                <button
                  type="button"
                  class="mt-8 inline-flex w-full cursor-not-allowed items-center justify-center rounded-full bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-black opacity-70 sm:w-auto"
                  disabled
                >
                  Sign Up — Coming Soon
                </button>
              </div>
            </article>
          </div>
  
          <p
            class="mt-7 text-center text-xs leading-5 text-brand-muted"
          >
            Registration and member login will be activated during the
            approved authentication and database stage.
          </p>
        </div>
      </section>
    `
  }