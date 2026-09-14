export function renderWaysToEarnSection() {
    const platformSteps = [
      {
        number: '01',
        label: 'Your People',
        title: 'Build Meaningful Connections',
        description:
          'Your dashboard will show the number of people directly connected to you.',
      },
      {
        number: '02',
        label: 'Your Income',
        title: 'Track Available Income',
        description:
          'View the income recorded in your member account and see funds available for withdrawal.',
      },
      {
        number: '03',
        label: 'Your Wallet',
        title: 'Request Your Payout',
        description:
          'Submit a payout request using an available bank or supported e-wallet.',
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
            class="group relative overflow-hidden rounded-3xl border border-brand-border bg-brand-panel p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-gold/50 sm:p-7"
          >
            <div
              class="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-brand-gold/10 blur-2xl"
              aria-hidden="true"
            ></div>
  
            <div class="relative">
              <div class="flex items-start justify-between gap-4">
                <span
                  class="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold"
                >
                  ${step.label}
                </span>
  
                <span
                  class="font-display text-4xl text-brand-gold/25"
                  aria-hidden="true"
                >
                  ${step.number}
                </span>
              </div>
  
              <h3
                class="mt-8 font-display text-2xl leading-tight text-brand-cream"
              >
                ${step.title}
              </h3>
  
              <p class="mt-4 text-sm leading-7 text-brand-muted">
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
            class="rounded-full border border-brand-border bg-brand-black px-4 py-2 text-xs font-semibold text-brand-muted"
          >
            ${method}
          </span>
        `,
      )
      .join('')
  
    return `
      <section
        id="ways-to-earn"
        class="relative isolate overflow-hidden border-t border-brand-border bg-brand-black py-20 sm:py-24 lg:py-28"
      >
        <div
          class="pointer-events-none absolute -left-40 bottom-0 size-96 rounded-full bg-brand-gold/10 blur-3xl"
          aria-hidden="true"
        ></div>
  
        <div class="relative mx-auto w-[min(1180px,90%)]">
          <!-- Section heading -->
          <div
            class="grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-end"
          >
            <div>
              <p
                class="text-xs font-semibold uppercase tracking-[0.32em] text-brand-gold"
              >
                Ways to Earn
              </p>
  
              <h2
                class="mt-5 max-w-3xl font-display text-4xl leading-tight text-brand-cream sm:text-5xl lg:text-6xl"
              >
                See your progress.
                <span class="block italic text-brand-gold">
                  Move with purpose.
                </span>
              </h2>
            </div>
  
            <p
              class="max-w-xl text-sm leading-7 text-brand-muted sm:text-base lg:justify-self-end"
            >
              The member platform will provide a clear view of your
              direct connections, recorded income, and payout-request
              status.
            </p>
          </div>
  
          <!-- Platform cards -->
          <div class="mt-12 grid gap-5 md:grid-cols-3">
            ${stepCards}
          </div>
  
          <!-- Manual payout information -->
          <div
            class="mt-8 grid overflow-hidden rounded-[2rem] border border-brand-gold/30 bg-brand-charcoal lg:grid-cols-[1fr_0.8fr]"
          >
            <div class="p-7 sm:p-10 lg:p-12">
              <p
                class="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold"
              >
                Simple and Transparent
              </p>
  
              <h3
                class="mt-5 max-w-xl font-display text-3xl leading-tight text-brand-cream sm:text-4xl"
              >
                Request online.
                <span class="italic text-brand-gold">
                  Receive manually.
                </span>
              </h3>
  
              <p class="mt-5 max-w-xl text-sm leading-7 text-brand-muted">
                Members can submit their withdrawal information through
                the website. The company will review the request and
                process the actual transfer manually.
              </p>
  
              <div class="mt-8 flex flex-wrap gap-2">
                ${payoutMethodItems}
              </div>
            </div>
  
            <!-- Wallet preview -->
            <div
              class="relative flex min-h-80 items-center justify-center overflow-hidden border-t border-brand-border bg-brand-black p-7 lg:border-l lg:border-t-0"
            >
              <div
                class="absolute size-64 rounded-full border border-brand-gold/10"
                aria-hidden="true"
              ></div>
  
              <div
                class="absolute size-48 rounded-full border border-brand-gold/20"
                aria-hidden="true"
              ></div>
  
              <div
                class="relative w-full max-w-xs rounded-3xl border border-brand-border bg-brand-panel p-6 shadow-2xl"
              >
                <div class="flex items-center justify-between">
                  <span
                    class="text-xs uppercase tracking-[0.18em] text-brand-muted"
                  >
                    Available Income
                  </span>
  
                  <span
                    class="size-2 rounded-full bg-brand-gold"
                    aria-hidden="true"
                  ></span>
                </div>
  
                <p class="mt-5 font-display text-4xl text-brand-cream">
                  PHP ——
                </p>
  
                <div class="mt-6 border-t border-brand-border pt-5">
                  <p class="text-xs leading-5 text-brand-muted">
                    Your confirmed balance will appear inside your
                    member dashboard.
                  </p>
                </div>
  
                <span
                  class="mt-6 flex w-full items-center justify-center rounded-full bg-brand-gold px-5 py-3 text-sm font-semibold text-brand-black"
                >
                  Request Payout
                </span>
              </div>
            </div>
          </div>
  
          <p
            class="mt-8 text-center text-xs leading-5 text-brand-muted"
          >
            Exact earning qualifications, calculations, payout limits,
            and schedules are pending official client confirmation.
          </p>
        </div>
      </section>
    `
  }