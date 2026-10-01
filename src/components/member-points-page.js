import { supabase } from '../lib/supabase.js'

export function registerMemberPointsPage(Alpine) {
  Alpine.data('memberPointsPage', () => ({
    transactions: [],
    statusFilter: 'all',
    loading: true,
    error: '',

    async init() {
      await this.loadTransactions()
    },

    async loadTransactions() {
      this.loading = true
      this.error = ''

      try {
        const { data, error } = await supabase
          .from('points_transactions')
          .select(`
            id, order_id, points, type, status, description, created_at
          `)
          .order('created_at', { ascending: false })

        if (error) throw error

        this.transactions = (data ?? []).map((transaction) => ({
          id: transaction.id,
          reference: transaction.order_id
            ? `Order ${transaction.order_id.slice(0, 8)}`
            : `Points ${transaction.id.slice(0, 8)}`,
          source: this.typeLabel(transaction.type),
          description:
            transaction.description ||
            'Qualified member product order',
          points: Number(transaction.points || 0),
          status: transaction.status || 'confirmed',
          date: transaction.created_at,
        }))
      } catch (error) {
        console.error('Unable to load member points:', error)
        this.error = 'Unable to load points history. Please refresh.'
        this.transactions = []
      } finally {
        this.loading = false
      }
    },

    get filteredTransactions() {
      if (this.statusFilter === 'all') {
        return this.transactions
      }

      return this.transactions.filter(
        (transaction) =>
          transaction.status === this.statusFilter,
      )
    },

    get availablePoints() {
      return this.transactions.reduce(
        (total, transaction) => {
          if (
            transaction.status !== 'confirmed' &&
            transaction.status !== 'reversed'
          ) {
            return total
          }

          return total + Number(transaction.points || 0)
        },
        0,
      )
    },

    get pendingPoints() {
      return this.transactions.reduce(
        (total, transaction) =>
          transaction.status === 'pending'
            ? total + Number(transaction.points || 0)
            : total,
        0,
      )
    },

    get reversedPoints() {
      return Math.abs(
        this.transactions.reduce(
          (total, transaction) =>
            transaction.status === 'reversed'
              ? total + Number(transaction.points || 0)
              : total,
          0,
        ),
      )
    },

    formatDate(value) {
      if (!value) return 'Not available'

      return new Intl.DateTimeFormat('en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(value))
    },

    typeLabel(type) {
      const labels = {
        order_purchase: 'Product Order',
        order: 'Product Order',
        manual_adjustment: 'Manual Adjustment',
        reversal: 'Reversal',
      }

      return labels[type] || type || 'Points'
    },

    statusLabel(status) {
      const labels = {
        confirmed: 'Confirmed',
        pending: 'Pending',
        reversed: 'Reversed',
      }

      return labels[status] || status
    },

    statusClass(status) {
      const classes = {
        confirmed:
          'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
        pending:
          'border-amber-400/30 bg-amber-400/10 text-amber-300',
        reversed:
          'border-red-400/30 bg-red-400/10 text-red-300',
      }

      return (
        classes[status] ||
        'border-brand-border text-brand-muted'
      )
    },
  }))
}

export function renderMemberPointsPage() {
  return `
    <section
      x-data="memberPointsPage"
      x-show="activePage === 'points' && isMember"
      x-transition.opacity
      aria-labelledby="member-points-title"
    >
      <div
        class="relative overflow-hidden rounded-[1.75rem] border border-brand-gold/30 bg-brand-panel p-6 shadow-gold-soft sm:p-8"
      >
        <div
          class="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-brand-gold/10 blur-3xl"
          aria-hidden="true"
        ></div>

        <div class="relative">
          <p class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold">
            Member Rewards
          </p>

          <h1
            id="member-points-title"
            class="mt-2 font-display text-4xl text-brand-cream sm:text-5xl"
          >
            Points Ledger
          </h1>

          <p class="mt-3 max-w-2xl text-sm leading-7 text-brand-muted">
            Track points earned from qualified delivered product orders.
          </p>
        </div>
      </div>

      <p
        x-show="loading"
        class="mt-6 rounded-xl border border-brand-border bg-brand-panel p-5 text-sm text-brand-muted"
      >
        Loading points history...
      </p>

      <p
        x-show="error"
        x-text="error"
        class="mt-6 rounded-xl border border-red-400/30 bg-brand-panel p-5 text-sm text-red-300"
        role="alert"
      ></p>

      <div x-show="!loading && !error">
        <div class="mt-6 grid gap-4 sm:grid-cols-3">
          <article class="rounded-[1.4rem] border border-emerald-400/30 bg-brand-panel p-5 shadow-panel">
            <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
              Available Points
            </p>
            <strong
              class="mt-3 block font-display text-4xl text-emerald-300"
              x-text="availablePoints.toLocaleString('en-PH')"
            ></strong>
            <p class="mt-2 text-xs leading-5 text-brand-muted">
              Confirmed balance after reversals
            </p>
          </article>

          <article class="rounded-[1.4rem] border border-amber-400/30 bg-brand-panel p-5 shadow-panel">
            <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
              Pending Points
            </p>
            <strong
              class="mt-3 block font-display text-4xl text-amber-300"
              x-text="pendingPoints.toLocaleString('en-PH')"
            ></strong>
            <p class="mt-2 text-xs leading-5 text-brand-muted">
              Waiting for admin confirmation
            </p>
          </article>

          <article class="rounded-[1.4rem] border border-red-400/30 bg-brand-panel p-5 shadow-panel">
            <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
              Reversed Points
            </p>
            <strong
              class="mt-3 block font-display text-4xl text-red-300"
              x-text="reversedPoints.toLocaleString('en-PH')"
            ></strong>
            <p class="mt-2 text-xs leading-5 text-brand-muted">
              Removed after correction, cancellation, or refund
            </p>
          </article>
        </div>

        <div class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6">
          <p class="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-gold">
            Confirmed Rules
          </p>

          <ul class="mt-4 grid gap-3 text-sm leading-6 text-brand-muted sm:grid-cols-2">
            <li>Minimum qualified product order: 10 bottles.</li>
            <li>Qualified product orders earn 5 points per bottle.</li>
            <li>Points are awarded only after delivery.</li>
            <li>Membership package bottles earn no points.</li>
            <li>Cancelled or refunded points may be reversed.</li>
          </ul>
        </div>

        <section
          class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
          aria-labelledby="points-history-title"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-gold">
                Activity
              </p>
              <h2
                id="points-history-title"
                class="mt-1 font-display text-3xl text-brand-cream"
              >
                Points History
              </h2>
            </div>

            <label class="text-xs font-semibold text-brand-muted">
              Status
              <select
                x-model="statusFilter"
                class="ml-2 rounded-lg border border-brand-border bg-brand-black px-3 py-2 text-xs text-brand-cream outline-none focus:border-brand-gold"
              >
                <option value="all">All</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="reversed">Reversed</option>
              </select>
            </label>
          </div>

          <div class="mt-5 space-y-3">
            <template
              x-for="transaction in filteredTransactions"
              :key="transaction.id"
            >
              <article class="grid gap-4 rounded-2xl border border-brand-border bg-brand-black p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <strong
                      class="text-sm text-brand-cream"
                      x-text="transaction.source"
                    ></strong>
                    <span
                      class="rounded-full border px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.1em]"
                      :class="statusClass(transaction.status)"
                      x-text="statusLabel(transaction.status)"
                    ></span>
                  </div>

                  <p
                    class="mt-2 text-sm leading-6 text-brand-muted"
                    x-text="transaction.description"
                  ></p>

                  <p class="mt-1 text-xs text-brand-muted">
                    <span x-text="transaction.reference"></span>
                    <span aria-hidden="true"> · </span>
                    <span x-text="formatDate(transaction.date)"></span>
                  </p>
                </div>

                <strong
                  class="font-display text-3xl"
                  :class="transaction.points < 0 ? 'text-red-300' : 'text-brand-gold'"
                  x-text="
                    (transaction.points > 0 ? '+' : '') +
                    transaction.points.toLocaleString('en-PH')
                  "
                ></strong>
              </article>
            </template>
          </div>

          <p
            x-show="filteredTransactions.length === 0"
            class="mt-5 rounded-xl border border-brand-border bg-brand-black px-4 py-8 text-center text-sm text-brand-muted"
          >
            No points history yet.
          </p>
        </section>
      </div>
    </section>
  `
}