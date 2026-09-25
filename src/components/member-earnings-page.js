export function registerMemberEarningsPage(
    Alpine,
    {
      availableIncome = 0,
      transactions = [],
    } = {},
  ) {
    Alpine.data('memberEarningsPage', () => ({
      availableIncome:
        Number(availableIncome || 0),
  
      transactions: Array.isArray(transactions)
        ? transactions
        : [],
  
      formatMoney(value) {
        return new Intl.NumberFormat('en-PH', {
          style: 'currency',
          currency: 'PHP',
          minimumFractionDigits: 0,
        }).format(Number(value || 0))
      },
  
      amountForStatus(status) {
        return this.transactions
          .filter(
            (transaction) =>
              transaction.status === status,
          )
          .reduce(
            (total, transaction) =>
              total +
              Number(transaction.amount || 0),
            0,
          )
      },
  
      get pendingIncome() {
        return this.amountForStatus('pending')
      },
  
      get paidIncome() {
        return this.amountForStatus('paid')
      },
  
      get totalRecordedIncome() {
        return (
          this.availableIncome +
          this.pendingIncome +
          this.paidIncome
        )
      },
  
      statusLabel(status) {
        const labels = {
          pending: 'Pending',
          available: 'Available',
          paid: 'Paid',
          reversed: 'Reversed',
        }
  
        return labels[status] || status
      },
  
      statusClass(status) {
        const classes = {
          pending:
            'border-amber-400/40 bg-amber-400/10 text-amber-200',
          available:
            'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
          paid:
            'border-blue-400/40 bg-blue-400/10 text-blue-200',
          reversed:
            'border-red-400/40 bg-red-400/10 text-red-200',
        }
  
        return (
          classes[status] ||
          'border-brand-border bg-brand-black text-brand-muted'
        )
      },
    }))
  }
  
  export function renderMemberEarningsPage() {
    return `
      <section
        x-data="memberEarningsPage"
        x-show="activePage === 'earnings' && isMember"
        x-transition.opacity
        aria-labelledby="member-earnings-title"
      >
        <div
          class="relative isolate overflow-hidden rounded-[1.75rem] border border-brand-gold/30 bg-brand-panel p-6 shadow-gold-soft sm:p-8"
        >
          <div
            class="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-brand-gold/10 blur-3xl"
            aria-hidden="true"
          ></div>
  
          <div
            class="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <p
                class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold"
              >
                Member Wallet
              </p>
  
              <h1
                id="member-earnings-title"
                class="mt-2 font-display text-4xl text-brand-cream sm:text-5xl"
              >
                Earnings
              </h1>
  
              <p
                class="mt-3 max-w-2xl text-sm leading-7 text-brand-muted"
              >
                Monitor pending, available, paid, and reversed
                referral-income records.
              </p>
            </div>
  
            <button
              type="button"
              class="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-gold px-5 text-sm font-semibold text-[#17130d] transition hover:bg-brand-gold-light"
              @click="openPage('payoutRequest')"
            >
              Request Payout
            </button>
          </div>
        </div>
  
        <div
          class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <article
            class="rounded-[1.35rem] border border-emerald-400/30 bg-brand-panel p-5 shadow-panel"
          >
            <p
              class="text-xs uppercase tracking-[0.13em] text-brand-muted"
            >
              Available
            </p>
  
            <strong
              class="mt-3 block font-display text-4xl text-emerald-300"
              x-text="formatMoney(availableIncome)"
            ></strong>
  
            <p class="mt-3 text-xs leading-5 text-brand-muted">
              Eligible for manual payout request
            </p>
          </article>
  
          <article
            class="rounded-[1.35rem] border border-amber-400/30 bg-brand-panel p-5 shadow-panel"
          >
            <p
              class="text-xs uppercase tracking-[0.13em] text-brand-muted"
            >
              Pending
            </p>
  
            <strong
              class="mt-3 block font-display text-4xl text-amber-300"
              x-text="formatMoney(pendingIncome)"
            ></strong>
  
            <p class="mt-3 text-xs leading-5 text-brand-muted">
              Waiting for qualification and approval
            </p>
          </article>
  
          <article
            class="rounded-[1.35rem] border border-blue-400/30 bg-brand-panel p-5 shadow-panel"
          >
            <p
              class="text-xs uppercase tracking-[0.13em] text-brand-muted"
            >
              Paid
            </p>
  
            <strong
              class="mt-3 block font-display text-4xl text-blue-300"
              x-text="formatMoney(paidIncome)"
            ></strong>
  
            <p class="mt-3 text-xs leading-5 text-brand-muted">
              Completed payout records
            </p>
          </article>
  
          <article
            class="rounded-[1.35rem] border border-brand-gold/35 bg-brand-charcoal p-5 shadow-panel"
          >
            <p
              class="text-xs uppercase tracking-[0.13em] text-brand-muted"
            >
              Total Recorded
            </p>
  
            <strong
              class="mt-3 block font-display text-4xl text-brand-gold"
              x-text="formatMoney(totalRecordedIncome)"
            ></strong>
  
            <p class="mt-3 text-xs leading-5 text-brand-muted">
              Excludes reversed income
            </p>
          </article>
        </div>
  
        <aside
          class="mt-6 rounded-2xl border border-brand-gold/30 bg-brand-gold/5 px-5 py-4"
        >
          <p class="text-sm font-semibold text-brand-cream">
            Manual verification applies
          </p>
  
          <p class="mt-1 text-xs leading-5 text-brand-muted">
            Referral income remains subject to confirmed eligibility,
            admin approval, cancellation, and refund rules. Final
            commission timing will be connected through Supabase.
          </p>
        </aside>
  
        <section
          class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
          aria-labelledby="earnings-history-title"
        >
          <div
            class="flex flex-col gap-3 border-b border-brand-border pb-5 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p
                class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
              >
                Wallet Records
              </p>
  
              <h2
                id="earnings-history-title"
                class="mt-1 font-display text-3xl text-brand-cream"
              >
                Earnings History
              </h2>
            </div>
  
            <p class="text-xs leading-5 text-brand-muted">
              Frontend preview
            </p>
          </div>
  
          <div
            x-show="transactions.length === 0"
            class="px-6 py-12 text-center"
          >
            <h3 class="font-display text-2xl text-brand-cream">
              No earnings records yet
            </h3>
  
            <p
              class="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted"
            >
              Qualified referral-income records will appear here after
              the Supabase connection is completed.
            </p>
          </div>
  
          <div
            x-show="transactions.length > 0"
            class="mt-5 grid gap-3"
          >
            <template
              x-for="transaction in transactions"
              :key="transaction.id"
            >
              <article
                class="grid gap-4 rounded-2xl border border-brand-border bg-brand-black p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <p
                      class="font-semibold text-brand-cream"
                      x-text="transaction.description"
                    ></p>
  
                    <span
                      class="rounded-full border px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.1em]"
                      :class="statusClass(transaction.status)"
                      x-text="statusLabel(transaction.status)"
                    ></span>
                  </div>
  
                  <p
                    class="mt-1 text-xs text-brand-muted"
                    x-text="transaction.createdAt"
                  ></p>
                </div>
  
                <strong
                  class="font-display text-2xl text-brand-gold"
                  x-text="formatMoney(transaction.amount)"
                ></strong>
              </article>
            </template>
          </div>
        </section>
      </section>
    `
  }
  