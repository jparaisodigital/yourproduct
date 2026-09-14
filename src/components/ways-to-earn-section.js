export function renderWaysToEarnSection() {
    const platformSteps = [
      {
        number: '01',
        label: 'Your People',
        title: 'View Direct Referrals',
        description:
          'See how many people you have directly referred to Your Product.',
      },
      {
        number: '02',
        label: 'Your Income',
        title: 'Review Your Income',
        description:
          'View the income recorded in your account and funds available for withdrawal.',
      },
      {
        number: '03',
        label: 'Your Wallet',
        title: 'Request a Payout',
        description:
          'Choose a bank or e-wallet and submit your request for manual review.',
      },
    ]
  
    const payoutMethods = [
      'All Banks',
      'BDO',
      'BPI',
      'MariBank',
      'CIMB',
      'GoTyme',
      'Maya',
      'GCash',
    ]
  
    const stepCards = platformSteps
      .map(
        (step) => `
          <article
            class="group relative overflow-hidden rounded-[1.4rem] border border-brand-border bg-brand-panel p-5 shadow-panel transition duration-300 hover:-translate-y-1 hover:border-brand-gold/50 sm:p-6"
          >
            <div
              class="pointer-events-none absolute -right-12 -top-12 size-28 rounded-full bg-brand-gold/10 blur-2xl"
              aria-hidden="true"
            ></div>
  
            <div class="relative">
              <div class="flex items-start justify-between gap-4">
                <span
                  class="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
                >
                  ${step.label}
                </span>
  
                <span
                  class="font-display text-3xl leading-none text-brand-gold/20"
                  aria-hidden="true"
                >
                  ${step.number}
                </span>
              </div>
  
              <h3
                class="mt-4 font-display text-2xl leading-tight text-brand-cream"
              >
                ${step.title}
              </h3>
  
              <p class="mt-2 text-sm leading-6 text-brand-muted">
                ${step.description}
              </p>
            </div>
          </article>
        `,
      )
      .join('')
  
    const payoutMethodItems = payoutMethods
      .map(
        (method) => `
          <span
            class="rounded-lg border border-brand-border bg-brand-black/50 px-3 py-2 text-[0.68rem] font-semibold text-brand-muted"
          >
            ${method}
          </span>
        `,
      )
      .join('')
  
    return `
      <section
        id="ways-to-earn"
        class="relative isolate overflow-hidden border-t border-brand-border bg-brand-black py-14 sm:py-16 lg:py-16"
      >
        <div
          class="pointer-events-none absolute -left-40 bottom-0 size-80 rounded-full bg-brand-gold/10 blur-3xl"
          aria-hidden="true"
        ></div>
  
        <div class="relative mx-auto w-[min(1120px,90%)]">
          <div
            class="grid gap-4 lg:grid-cols-[1fr_0.75fr] lg:items-end"
          >
            <div>
              <p
                class="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-brand-gold"
              >
                Ways to Earn
              </p>
  
              <h2
                class="mt-3 max-w-3xl font-display text-4xl leading-[1.05] text-brand-cream sm:text-5xl lg:text-[3.35rem]"
              >
                Your people, income,
                <span class="italic text-brand-gold">
                  and payouts.
                </span>
              </h2>
            </div>
  
            <p
              class="max-w-lg text-sm leading-6 text-brand-muted sm:text-base lg:justify-self-end"
            >
              The member dashboard will provide a simple view of your
              direct referrals, recorded income, and payout requests.
            </p>
          </div>
  
          <div class="mt-8 grid gap-4 md:grid-cols-3">
            ${stepCards}
          </div>
  
          <div
            class="mt-6 grid overflow-hidden rounded-[1.5rem] border border-brand-gold/30 bg-brand-charcoal lg:grid-cols-[1fr_0.72fr]"
          >
            <div class="p-6 sm:p-7 lg:p-8">
              <p
                class="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand-gold"
              >
                Manual Payout Processing
              </p>
  
              <h3
                class="mt-3 max-w-xl font-display text-3xl leading-tight text-brand-cream"
              >
                Payout requests are
                <span class="italic text-brand-gold">
                  reviewed manually.
                </span>
              </h3>
  
              <p
                class="mt-3 max-w-xl text-sm leading-6 text-brand-muted"
              >
                Members can submit their withdrawal details through the
                website. The company will review the request and process
                the actual transfer manually.
              </p>
  
              <div class="mt-5 flex flex-wrap gap-2">
                ${payoutMethodItems}
              </div>
            </div>
  
            <div
              class="relative flex items-center justify-center overflow-hidden border-t border-brand-border bg-brand-black p-6 lg:border-l lg:border-t-0"
            >
              <div
                class="pointer-events-none absolute size-52 rounded-full bg-brand-gold/10 blur-3xl"
                aria-hidden="true"
              ></div>
  
              <div
                class="relative w-full max-w-sm rounded-[1.25rem] border border-brand-border bg-brand-panel p-5 shadow-panel"
              >
                <div class="flex items-center justify-between gap-4">
                  <span
                    class="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-muted"
                  >
                    Available Income
                  </span>
  
                  <span
                    class="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold text-brand-gold"
                  >
                    <span
                      class="size-1.5 rounded-full bg-brand-gold"
                      aria-hidden="true"
                    ></span>
  
                    Member Wallet
                  </span>
                </div>
  
                <p
                  class="mt-4 font-display text-3xl leading-none text-brand-cream"
                >
                  PHP ——
                </p>
  
                <p
                  class="mt-4 border-t border-brand-border pt-4 text-xs leading-5 text-brand-muted"
                >
                  Your confirmed balance will appear inside your member
                  dashboard.
                </p>
  
                <span
                  class="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-brand-gold px-5 text-xs font-semibold uppercase tracking-[0.08em] text-[#17130d] opacity-70"
                >
                  Request Payout
                </span>
              </div>
            </div>
          </div>
  
          <p
            class="mt-5 text-center text-xs leading-5 text-brand-muted"
          >
            Exact earning calculations, payout limits, and schedules
            remain subject to official client confirmation.
          </p>
        </div>
      </section>
    `
  }