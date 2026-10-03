import { supabase } from '../lib/supabase.js'

export function registerAdminPointsAuditPage(Alpine) {
  Alpine.data('adminPointsAuditPage', () => ({
    entries: [],
    search: '',
    statusFilter: 'all',
    loading: true,
    error: '',

    async init() {
      await this.loadEntries()
    },

    async loadEntries() {
      this.loading = true
      this.error = ''

      try {
        const { data, error } = await supabase
          .from('points_transactions')
          .select(`
            id, customer_id, order_id, points, type, status,
            description, created_at,
            customer:profiles!points_transactions_customer_id_fkey(
              first_name, last_name, email
            )
          `)
          .order('created_at', { ascending: false })

        if (error) throw error

        this.entries = (data ?? []).map((entry) => ({
          id: entry.id,
          memberName: [
            entry.customer?.first_name,
            entry.customer?.last_name,
          ].filter(Boolean).join(' ') || 'Member',
          memberEmail: entry.customer?.email || 'No email',
          reference: entry.order_id
            ? `Order ${entry.order_id.slice(0, 8)}`
            : `Points ${entry.id.slice(0, 8)}`,
          source: this.typeLabel(entry.type),
          description:
            entry.description ||
            'Approved member product order',
          points: Number(entry.points || 0),
          status: entry.status || 'confirmed',
          date: entry.created_at,
        }))
      } catch (error) {
        console.error('Unable to load points audit:', error)
        this.error = 'Unable to load points audit. Please refresh.'
        this.entries = []
      } finally {
        this.loading = false
      }
    },

    get filteredEntries() {
      const normalizedSearch =
        this.search.trim().toLowerCase()

      return this.entries.filter((entry) => {
        const matchesStatus =
          this.statusFilter === 'all' ||
          entry.status === this.statusFilter

        const searchableContent = [
          entry.memberName,
          entry.memberEmail,
          entry.reference,
          entry.source,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return (
          matchesStatus &&
          (!normalizedSearch ||
            searchableContent.includes(normalizedSearch))
        )
      })
    },

    get confirmedPoints() {
      return this.entries.reduce(
        (total, entry) =>
          entry.status === 'confirmed'
            ? total + Number(entry.points || 0)
            : total,
        0,
      )
    },

    get pendingPoints() {
      return this.entries.reduce(
        (total, entry) =>
          entry.status === 'pending'
            ? total + Number(entry.points || 0)
            : total,
        0,
      )
    },

    get reversedPoints() {
      return Math.abs(
        this.entries.reduce(
          (total, entry) =>
            entry.status === 'reversed'
              ? total + Number(entry.points || 0)
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

export function renderAdminPointsAuditPage() {
  return `
    <section
      x-data="adminPointsAuditPage"
      x-show="activePage === 'points-audit'"
      x-transition.opacity
      aria-labelledby="admin-points-audit-title"
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
            Rewards Monitoring
          </p>
          <h1
            id="admin-points-audit-title"
            class="mt-2 font-display text-4xl text-brand-cream sm:text-5xl"
          >
            Points & Rewards
          </h1>
          <p class="mt-3 max-w-2xl text-sm leading-7 text-brand-muted">
            Review member points activity and future reward redemption requests.
          </p>
        </div>
      </div>

      <p
        x-show="loading"
        class="mt-6 rounded-xl border border-brand-border bg-brand-panel p-5 text-sm text-brand-muted"
      >
        Loading points audit...
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
              Confirmed
            </p>
            <strong
              class="mt-3 block font-display text-4xl text-emerald-300"
              x-text="confirmedPoints.toLocaleString('en-PH')"
            ></strong>
          </article>

          <article class="rounded-[1.4rem] border border-amber-400/30 bg-brand-panel p-5 shadow-panel">
            <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
              Pending
            </p>
            <strong
              class="mt-3 block font-display text-4xl text-amber-300"
              x-text="pendingPoints.toLocaleString('en-PH')"
            ></strong>
          </article>

          <article class="rounded-[1.4rem] border border-red-400/30 bg-brand-panel p-5 shadow-panel">
            <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
              Reversed
            </p>
            <strong
              class="mt-3 block font-display text-4xl text-red-300"
              x-text="reversedPoints.toLocaleString('en-PH')"
            ></strong>
          </article>
        </div>

                <section
          class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
          aria-labelledby="admin-reward-requests-title"
        >
          <div class="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <p class="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-gold">
                Rewards
              </p>

              <h2
                id="admin-reward-requests-title"
                class="mt-1 font-display text-3xl text-brand-cream"
              >
                Reward Requests
              </h2>

              <p class="mt-2 max-w-2xl text-sm leading-6 text-brand-muted">
                Future member reward claims will appear here after redemption review is connected.
              </p>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl border border-brand-border bg-brand-black px-5 py-4">
                <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
                  Pending Requests
                </p>

                <strong class="mt-2 block font-display text-3xl text-brand-cream">
                  0
                </strong>
              </div>

              <div class="rounded-2xl border border-brand-border bg-brand-black px-5 py-4">
                <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
                  Approved Rewards
                </p>

                <strong class="mt-2 block font-display text-3xl text-brand-cream">
                  0
                </strong>
              </div>
            </div>
          </div>

          <div class="mt-5 rounded-2xl border border-dashed border-brand-border bg-brand-black px-5 py-8 text-center">
            <h3 class="font-display text-2xl text-brand-cream">
              No reward requests yet
            </h3>

            <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-brand-muted">
              Eligible members will be able to request rewards from their Points & Rewards page. Admin approval and point deduction will be added in the redemption backend update.
            </p>
          </div>
        </section>

        <section
          class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
        >
          <div class="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              type="search"
              x-model.debounce.250ms="search"
              placeholder="Search member, email, order, or source"
              class="h-11 rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none placeholder:text-brand-muted focus:border-brand-gold"
            >

            <select
              x-model="statusFilter"
              class="h-11 rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none focus:border-brand-gold"
            >
              <option value="all">All statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="reversed">Reversed</option>
            </select>
          </div>

          <div class="mt-5 space-y-3">
            <template x-for="entry in filteredEntries" :key="entry.id">
              <article
                class="grid gap-4 rounded-2xl border border-brand-border bg-brand-black p-4 lg:grid-cols-[1.1fr_0.9fr_0.8fr_auto] lg:items-center"
              >
                <div class="min-w-0">
                  <strong
                    class="block truncate text-sm text-brand-cream"
                    x-text="entry.memberName"
                  ></strong>
                  <p
                    class="mt-1 truncate text-xs text-brand-muted"
                    x-text="entry.memberEmail"
                  ></p>
                </div>

                <div>
                  <p
                    class="text-sm font-semibold text-brand-cream"
                    x-text="entry.source"
                  ></p>
                  <p
                    class="mt-1 text-xs text-brand-muted"
                    x-text="entry.description"
                  ></p>
                </div>

                <div>
                  <p
                    class="text-xs font-semibold text-brand-gold"
                    x-text="entry.reference"
                  ></p>
                  <p
                    class="mt-1 text-xs text-brand-muted"
                    x-text="formatDate(entry.date)"
                  ></p>
                </div>

                <div class="flex items-center justify-between gap-3 lg:justify-end">
                  <span
                    class="rounded-full border px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.1em]"
                    :class="statusClass(entry.status)"
                    x-text="statusLabel(entry.status)"
                  ></span>
                  <strong
                    class="min-w-14 text-right font-display text-2xl"
                    :class="entry.points < 0 ? 'text-red-300' : 'text-brand-gold'"
                    x-text="
                      (entry.points > 0 ? '+' : '') +
                      entry.points.toLocaleString('en-PH')
                    "
                  ></strong>
                </div>
              </article>
            </template>
          </div>

          <p
            x-show="filteredEntries.length === 0"
            class="mt-5 rounded-xl border border-brand-border bg-brand-black px-4 py-8 text-center text-sm text-brand-muted"
          >
            No point entries match the selected filters.
          </p>
        </section>
      </div>
    </section>
  `
}