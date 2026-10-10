import { supabase } from '../lib/supabase.js'

export function registerAdminPointsAuditPage(Alpine) {
  Alpine.data('adminPointsAuditPage', () => ({
    entries: [],
    search: '',
    statusFilter: 'all',
    loading: true,
    error: '',
    selectedEntry: null,
    reversalConfirming: false,
    reversalNote: '',
    reversalError: '',

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
          customerId: entry.customer_id,
          orderId: entry.order_id,
          rawType: entry.type,
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
        (this.statusFilter === 'reversed'
          ? entry.rawType === 'reversal' ||
            Number(entry.points || 0) < 0 ||
            entry.status === 'reversed'
          : entry.status === this.statusFilter)

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
        this.entries.reduce((total, entry) => {
          const points = Number(entry.points || 0)
    
          if (
            entry.rawType === 'reversal' ||
            points < 0 ||
            entry.status === 'reversed'
          ) {
            return total + points
          }
    
          return total
        }, 0),
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
        order_award: 'Product Order Points',
        membership_award: 'Membership Package Points',
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

    canReverseEntry(entry) {
      return (
        entry &&
        entry.status === 'confirmed' &&
        Number(entry.points || 0) > 0 &&
        entry.rawType !== 'reversal'
      )
    },

    openEntryDetails(entry) {
      this.selectedEntry = entry
      this.reversalConfirming = false
      this.reversalNote = ''
      this.reversalError = ''
      document.body.classList.add('overflow-hidden')
    },

    closeEntryDetails() {
      this.selectedEntry = null
      this.reversalConfirming = false
      this.reversalNote = ''
      this.reversalError = ''
      document.body.classList.remove('overflow-hidden')
    },

    startReversalConfirmation() {
      this.reversalConfirming = true
      this.reversalNote = ''
      this.reversalError = ''
    },

    cancelReversalConfirmation() {
      this.reversalConfirming = false
      this.reversalNote = ''
      this.reversalError = ''
    },

    async confirmPointReversal() {
      const note = this.reversalNote.trim()

      if (!this.selectedEntry) {
        this.reversalError = 'Select a points transaction first.'
        return
      }

      if (!note || note.length > 300) {
        this.reversalError =
          'Enter an admin note from 1 to 300 characters before reversing points.'
        return
      }

      this.reversalError = ''

      try {
        const { error } = await supabase.rpc(
          'admin_reverse_points_transaction',
          {
            p_transaction_id: this.selectedEntry.id,
            p_admin_note: note,
          },
        )

        if (error) throw error

        await this.loadEntries()
        this.closeEntryDetails()
      } catch (error) {
        console.error('Unable to reverse points:', error)
        this.reversalError =
          error?.message ||
          'Could not reverse points. Refresh and try again.'
      }
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
              <button
                type="button"
                class="grid w-full gap-4 rounded-2xl border border-brand-border bg-brand-black p-4 text-left transition hover:border-brand-gold/60 hover:bg-brand-gold/5 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 lg:grid-cols-[1.1fr_0.9fr_0.8fr_auto] lg:items-center"
                @click="openEntryDetails(entry)"
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
              </button>
            </template>
          </div>

          <p
            x-show="filteredEntries.length === 0"
            class="mt-5 rounded-xl border border-brand-border bg-brand-black px-4 py-8 text-center text-sm text-brand-muted"
          >
            No point entries match the selected filters.
          </p>
        </section>

        <template x-teleport="body">
          <div
            x-show="selectedEntry"
            x-cloak
            x-transition.opacity.duration.200ms
            class="fixed inset-0 z-[130] grid place-items-center overflow-y-auto bg-black/80 px-4 py-6 backdrop-blur-sm"
            @click.self="closeEntryDetails()"
            @keydown.escape.window="closeEntryDetails()"
          >
            <div
              class="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[1.5rem] border border-brand-gold/35 bg-brand-panel p-6 shadow-gold-soft transition duration-200"
              role="dialog"
              aria-modal="true"
              aria-labelledby="points-entry-details-title"
            >
              <template x-if="selectedEntry">
                <div>
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <p class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold">
                        Points Transaction
                      </p>
                      <h2
                        id="points-entry-details-title"
                        class="mt-1 font-display text-3xl text-brand-cream"
                      >
                        Transaction Details
                      </h2>
                    </div>

                    <button
                      type="button"
                      class="rounded-full border border-brand-border px-3 py-1 text-xs font-semibold text-brand-muted transition hover:border-brand-gold hover:text-brand-gold"
                      @click="closeEntryDetails()"
                    >
                      Close
                    </button>
                  </div>

                  <div class="mt-5 grid gap-3 rounded-2xl border border-brand-border bg-brand-black p-4 text-sm">
                    <div>
                      <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">Member</p>
                      <p class="mt-1 font-semibold text-brand-cream" x-text="selectedEntry.memberName"></p>
                      <p class="text-xs text-brand-muted" x-text="selectedEntry.memberEmail"></p>
                    </div>

                    <div class="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">Source</p>
                        <p class="mt-1 font-semibold text-brand-cream" x-text="selectedEntry.source"></p>
                      </div>

                      <div>
                        <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">Reference</p>
                        <p class="mt-1 font-semibold text-brand-gold" x-text="selectedEntry.reference"></p>
                      </div>

                      <div>
                        <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">Status</p>
                        <span
                          class="mt-1 inline-flex rounded-full border px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.1em]"
                          :class="statusClass(selectedEntry.status)"
                          x-text="statusLabel(selectedEntry.status)"
                        ></span>
                      </div>

                      <div>
                        <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">Points</p>
                        <p
                          class="mt-1 font-display text-3xl"
                          :class="selectedEntry.points < 0 ? 'text-red-300' : 'text-brand-gold'"
                          x-text="(selectedEntry.points > 0 ? '+' : '') + selectedEntry.points.toLocaleString('en-PH')"
                        ></p>
                      </div>
                    </div>

                    <div>
                      <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">Description</p>
                      <p class="mt-1 leading-6 text-brand-cream" x-text="selectedEntry.description"></p>
                    </div>

                    <div>
                      <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">Date</p>
                      <p class="mt-1 text-brand-muted" x-text="formatDate(selectedEntry.date)"></p>
                    </div>
                  </div>

                  <div
                    x-show="selectedEntry.rawType === 'reversal'"
                    class="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm leading-6 text-red-200"
                  >
                    This is a reversal record. It is for audit history only and cannot be reversed again.
                  </div>

                  <div
                    x-show="canReverseEntry(selectedEntry) && !reversalConfirming"
                    class="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end"
                  >
                    <button
                      type="button"
                      class="inline-flex min-h-11 items-center justify-center rounded-full border border-red-400/40 px-5 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
                      @click="startReversalConfirmation()"
                    >
                      Reverse Points
                    </button>
                  </div>

                  <div
                    x-show="reversalConfirming"
                    x-transition
                    class="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-4"
                  >
                    <h3 class="font-display text-2xl text-brand-cream">
                      Confirm point reversal?
                    </h3>

                    <p class="mt-2 text-sm leading-6 text-brand-muted">
                      This will create a negative points transaction linked to this record. Admin note is required before continuing.
                    </p>

                    <label class="mt-4 block">
                      <span class="text-xs font-semibold uppercase tracking-[0.13em] text-brand-muted">
                        Admin note
                      </span>
                      <textarea
                        x-model="reversalNote"
                        rows="3"
                        maxlength="300"
                        placeholder="Example: Refund approved after customer reported damaged item."
                        class="mt-2 w-full rounded-xl border border-brand-border bg-brand-black px-4 py-3 text-sm text-brand-cream outline-none placeholder:text-brand-muted focus:border-brand-gold"
                      ></textarea>
                    </label>

                    <p
                      x-show="reversalError"
                      x-text="reversalError"
                      class="mt-3 text-sm text-red-300"
                      role="alert"
                    ></p>

                    <div class="mt-4 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        class="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-border px-5 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
                        @click="cancelReversalConfirmation()"
                      >
                        No, keep points
                      </button>

                      <button
                        type="button"
                        class="inline-flex min-h-11 items-center justify-center rounded-full bg-red-700 px-5 text-sm font-semibold text-white transition hover:bg-red-600"
                        @click="confirmPointReversal()"
                      >
                        Yes, reverse points
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </section>
  `
}