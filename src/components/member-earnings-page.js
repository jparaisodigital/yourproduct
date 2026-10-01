import { supabase } from '../lib/supabase.js'

export function registerMemberEarningsPage(Alpine) {
  Alpine.data('memberEarningsPage', () => ({
    transactions: [],
    loading: true,
    error: '',

    async init() {
      await this.loadEarnings()
    },

    async loadEarnings() {
      this.loading = true
      this.error = ''

      try {
        const { data, error } = await supabase
          .from('referral_commissions')
          .select(`
            id, referred_customer_id, membership_application_id,
            referral_code, package_id, package_amount,
            commission_amount, status, created_at
          `)
          .order('created_at', { ascending: false })

        if (error) throw error

        this.transactions = (data ?? []).map((commission) => ({
          id: commission.id,
          description:
            `${this.packageLabel(commission.package_id)} direct referral commission`,
          packageAmount: Number(commission.package_amount || 0),
          amount: Number(commission.commission_amount || 0),
          status: commission.status || 'earned',
          referralCode: commission.referral_code || '',
          createdAt: commission.created_at,
        }))
      } catch (error) {
        console.error('Unable to load member earnings:', error)
        this.error = 'Unable to load earnings history. Please refresh.'
        this.transactions = []
      } finally {
        this.loading = false
      }
    },

    formatMoney(value) {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
      }).format(Number(value || 0))
    },

    formatDate(value) {
      if (!value) return 'Not available'

      return new Intl.DateTimeFormat('en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(value))
    },

    packageLabel(packageId) {
      const labels = {
        starter: 'Starter',
        builder: 'Builder',
        leader: 'Leader',
        prestige: 'Prestige',
      }

      return labels[packageId] || 'Membership'
    },

    amountForStatus(statuses) {
      const statusList = Array.isArray(statuses)
        ? statuses
        : [statuses]

      return this.transactions
        .filter((transaction) =>
          statusList.includes(transaction.status),
        )
        .reduce(
          (total, transaction) =>
            total + Number(transaction.amount || 0),
          0,
        )
    },

    get availableIncome() {
      return this.amountForStatus('earned')
    },

    get pendingIncome() {
      return this.amountForStatus([
        'requested',
        'approved',
      ])
    },

    get paidIncome() {
      return this.amountForStatus('paid')
    },

    get totalRecordedIncome() {
      return this.transactions
        .filter(
          (transaction) =>
            transaction.status !== 'cancelled',
        )
        .reduce(
          (total, transaction) =>
            total + Number(transaction.amount || 0),
          0,
        )
    },

    statusLabel(status) {
      const labels = {
        earned: 'Available',
        requested: 'Payout Requested',
        approved: 'Payout Approved',
        paid: 'Paid',
        cancelled: 'Cancelled',
      }

      return labels[status] || status
    },

    statusClass(status) {
      const classes = {
        earned:
          'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
        requested:
          'border-amber-400/40 bg-amber-400/10 text-amber-200',
        approved:
          'border-blue-400/40 bg-blue-400/10 text-blue-200',
        paid:
          'border-blue-400/40 bg-blue-400/10 text-blue-200',
        cancelled:
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
            <p class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold">
              Member Wallet
            </p>

            <h1
              id="member-earnings-title"
              class="mt-2 font-display text-4xl text-brand-cream sm:text-5xl"
            >
              Earnings
            </h1>

            <p class="mt-3 max-w-2xl text-sm leading-7 text-brand-muted">
              Monitor direct referral commissions from approved membership packages.
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

      <p
        x-show="loading"
        class="mt-6 rounded-xl border border-brand-border bg-brand-panel p-5 text-sm text-brand-muted"
      >
        Loading earnings...
      </p>

      <p
        x-show="error"
        x-text="error"
        class="mt-6 rounded-xl border border-red-400/30 bg-brand-panel p-5 text-sm text-red-300"
        role="alert"
      ></p>

      <div x-show="!loading && !error">
        <div class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article class="rounded-[1.35rem] border border-emerald-400/30 bg-brand-panel p-5 shadow-panel">
            <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
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

          <article class="rounded-[1.35rem] border border-amber-400/30 bg-brand-panel p-5 shadow-panel">
            <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
              Pending
            </p>

            <strong
              class="mt-3 block font-display text-4xl text-amber-300"
              x-text="formatMoney(pendingIncome)"
            ></strong>

            <p class="mt-3 text-xs leading-5 text-brand-muted">
              Requested or approved for payout
            </p>
          </article>

          <article class="rounded-[1.35rem] border border-blue-400/30 bg-brand-panel p-5 shadow-panel">
            <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
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

          <article class="rounded-[1.35rem] border border-brand-gold/35 bg-brand-charcoal p-5 shadow-panel">
            <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
              Total Recorded
            </p>

            <strong
              class="mt-3 block font-display text-4xl text-brand-gold"
              x-text="formatMoney(totalRecordedIncome)"
            ></strong>

            <p class="mt-3 text-xs leading-5 text-brand-muted">
              Excludes cancelled income
            </p>
          </article>
        </div>

        <aside class="mt-6 rounded-2xl border border-brand-gold/30 bg-brand-gold/5 px-5 py-4">
          <p class="text-sm font-semibold text-brand-cream">
            Direct referral commission
          </p>

          <p class="mt-1 text-xs leading-5 text-brand-muted">
            Members earn 10% commission from direct referred membership packages only.
            No downline, pairing, or automated cash payout is included.
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
              <p class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold">
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
              Real commission ledger
            </p>
          </div>

          <div
            x-show="transactions.length === 0"
            class="px-6 py-12 text-center"
          >
            <h3 class="font-display text-2xl text-brand-cream">
              No earnings records yet
            </h3>

            <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted">
              Direct referral commissions will appear here after referred members are approved.
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

                  <p class="mt-1 text-xs text-brand-muted">
                    <span x-text="'Package amount: ' + formatMoney(transaction.packageAmount)"></span>
                    <span aria-hidden="true"> · </span>
                    <span x-text="formatDate(transaction.createdAt)"></span>
                  </p>
                </div>

                <strong
                  class="font-display text-2xl text-brand-gold"
                  x-text="formatMoney(transaction.amount)"
                ></strong>
              </article>
            </template>
          </div>
        </section>
      </div>
    </section>
  `
}