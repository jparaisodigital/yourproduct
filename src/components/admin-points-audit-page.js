const previewPointEntries = [
    {
      id: 'POINT-0001',
      memberName: 'Maria Santos',
      memberEmail: 'maria@example.com',
      reference: 'YP-2026-0012',
      source: 'Repeat Purchase',
      description: '12 qualified bottles',
      points: 60,
      status: 'confirmed',
      date: '2026-09-22T08:30:00.000Z',
    },
    {
      id: 'POINT-0002',
      memberName: 'Maria Santos',
      memberEmail: 'maria@example.com',
      reference: 'YP-2026-TK01',
      source: 'Tester Kit',
      description: 'Fixed member tester-kit points',
      points: 10,
      status: 'confirmed',
      date: '2026-09-23T03:15:00.000Z',
    },
    {
      id: 'POINT-0003',
      memberName: 'Ana Cruz',
      memberEmail: 'ana@example.com',
      reference: 'YP-2026-0008',
      source: 'Repeat Purchase',
      description: 'Reversed after refund',
      points: -50,
      status: 'reversed',
      date: '2026-09-24T06:20:00.000Z',
    },
    {
      id: 'POINT-0004',
      memberName: 'Juan Dela Cruz',
      memberEmail: 'juan@example.com',
      reference: 'YP-2026-0015',
      source: 'Repeat Purchase',
      description: '10 bottles awaiting completion',
      points: 50,
      status: 'pending',
      date: '2026-09-25T01:10:00.000Z',
    },
  ]
  
  export function registerAdminPointsAuditPage(Alpine) {
    Alpine.data('adminPointsAuditPage', () => ({
      entries: previewPointEntries.map(
        (entry) => ({ ...entry }),
      ),
      search: '',
      statusFilter: 'all',
  
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
        return new Intl.DateTimeFormat('en-PH', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(value))
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
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold"
            >
              Rewards Monitoring
            </p>
            <h1
              id="admin-points-audit-title"
              class="mt-2 font-display text-4xl text-brand-cream sm:text-5xl"
            >
              Points Audit
            </h1>
            <p
              class="mt-3 max-w-2xl text-sm leading-7 text-brand-muted"
            >
              Review the source, order reference, status, and point movement
              for each member. This preview is read-only.
            </p>
          </div>
        </div>
  
        <div class="mt-6 grid gap-4 sm:grid-cols-3">
          <article class="rounded-[1.4rem] border border-emerald-400/30 bg-brand-panel p-5 shadow-panel">
            <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">Confirmed</p>
            <strong class="mt-3 block font-display text-4xl text-emerald-300" x-text="confirmedPoints.toLocaleString('en-PH')"></strong>
          </article>
          <article class="rounded-[1.4rem] border border-amber-400/30 bg-brand-panel p-5 shadow-panel">
            <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">Pending</p>
            <strong class="mt-3 block font-display text-4xl text-amber-300" x-text="pendingPoints.toLocaleString('en-PH')"></strong>
          </article>
          <article class="rounded-[1.4rem] border border-red-400/30 bg-brand-panel p-5 shadow-panel">
            <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">Reversed</p>
            <strong class="mt-3 block font-display text-4xl text-red-300" x-text="reversedPoints.toLocaleString('en-PH')"></strong>
          </article>
        </div>
  
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
                  <strong class="block truncate text-sm text-brand-cream" x-text="entry.memberName"></strong>
                  <p class="mt-1 truncate text-xs text-brand-muted" x-text="entry.memberEmail"></p>
                </div>
  
                <div>
                  <p class="text-sm font-semibold text-brand-cream" x-text="entry.source"></p>
                  <p class="mt-1 text-xs text-brand-muted" x-text="entry.description"></p>
                </div>
  
                <div>
                  <p class="text-xs font-semibold text-brand-gold" x-text="entry.reference"></p>
                  <p class="mt-1 text-xs text-brand-muted" x-text="formatDate(entry.date)"></p>
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
                    x-text="(entry.points > 0 ? '+' : '') + entry.points.toLocaleString('en-PH')"
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
  
          <p class="mt-5 text-center text-xs leading-5 text-brand-muted">
            Frontend preview only. No point records can be changed here yet.
          </p>
        </section>
      </section>
    `
  }
  