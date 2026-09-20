export function renderAccountCtaSection() {
  return `
    <section
      id="signup"
      class="relative isolate overflow-hidden border-t border-brand-border bg-brand-charcoal py-14 sm:py-16 lg:py-16"
    >
      <div
        class="pointer-events-none absolute left-1/2 top-1/2 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold/10 blur-3xl"
        aria-hidden="true"
      ></div>

      <div
        class="relative mx-auto w-[min(1080px,90%)]"
      >
        <div class="mx-auto max-w-4xl text-center">
          <h2
            class="font-display text-4xl leading-[1.05] text-brand-cream sm:text-5xl lg:text-[3.35rem]"
          >
            Your Member
            <span class="italic text-brand-gold">
              Journey
            </span>
          </h2>

          <p
            class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-brand-muted sm:text-base"
          >
            Explore Your Product as a new member or return to your
            account to continue your journey.
          </p>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-2">
          <article
            id="login"
            class="scroll-mt-28 rounded-[1.5rem] border border-brand-border bg-brand-panel p-6 shadow-[0_16px_45px_rgb(74_57_27_/_0.06)] sm:p-7"
          >
            <div
              class="grid size-11 place-items-center rounded-xl border border-brand-gold/30 bg-brand-gold/10 text-brand-gold"
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
                  d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                <path
                  d="M3 12h11"
                  stroke-linecap="round"
                />

                <path
                  d="m10 8 4 4-4 4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <p
              class="mt-5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand-gold"
            >
              Existing Member
            </p>

            <h3
              class="mt-2 font-display text-3xl leading-tight text-brand-cream"
            >
              Welcome back.
            </h3>

            <p
              class="mt-3 max-w-lg text-sm leading-6 text-brand-muted"
            >
              Access your dashboard, perfume information, orders,
              points, income, and payout-request status.
            </p>

            <a
              href="/login/"
              class="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl border border-brand-border px-5 text-xs font-semibold uppercase tracking-[0.08em] text-brand-cream transition hover:border-brand-gold hover:text-brand-gold sm:w-auto"
            >
              Member Login
            </a>
          </article>

          <article
            class="relative overflow-hidden rounded-[1.5rem] border border-brand-gold/40 bg-brand-black p-6 shadow-[0_16px_45px_rgb(183_138_50_/_0.08)] sm:p-7"
          >
            <div
              class="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-brand-gold/15 blur-3xl"
              aria-hidden="true"
            ></div>

            <div class="relative">
              <div
                class="grid size-11 place-items-center rounded-xl bg-brand-gold text-[#17130d]"
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
                    cx="9"
                    cy="7"
                    r="3"
                  />

                  <path
                    d="M3.5 20a5.5 5.5 0 0 1 11 0"
                    stroke-linecap="round"
                  />

                  <path
                    d="M18 8v6"
                    stroke-linecap="round"
                  />

                  <path
                    d="M15 11h6"
                    stroke-linecap="round"
                  />
                </svg>
              </div>

              <p
                class="mt-5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand-gold"
              >
                New Member
              </p>

              <h3
                class="mt-2 font-display text-3xl leading-tight text-brand-cream"
              >
                Start your journey.
              </h3>

              <p
                class="mt-3 max-w-lg text-sm leading-6 text-brand-muted"
              >
                Create your account and begin exploring the packages,
                fragrances, and benefits of Your Product.
              </p>

              <a
                href="/register/"
                class="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-brand-gold px-5 text-xs font-semibold uppercase tracking-[0.08em] text-[#17130d] transition hover:-translate-y-0.5 hover:bg-brand-gold-light sm:w-auto"
              >
                Create Account
              </a>
            </div>
          </article>
        </div>

        <p
          class="mt-5 text-center text-xs leading-5 text-brand-muted"
        >
          Secure account creation and member authentication will be
          connected during the backend development stage.
        </p>
      </div>
    </section>
  `
}