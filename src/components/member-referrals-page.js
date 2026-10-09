import { supabase } from '../lib/supabase.js'

import { renderMemberReferralCard } from './member-referral-card.js'

export function registerMemberReferralsPage(Alpine) {
  Alpine.data('memberReferralsPage', () => ({
    referrals: [],
    loading: true,
    error: '',

    async init() {
      await this.loadReferrals()
    },

    async loadReferrals() {
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

        this.referrals = (data ?? []).map((commission) => ({
          id: commission.id,
          referredCustomerId: commission.referred_customer_id,
          applicationId: commission.membership_application_id,
          packageId: commission.package_id,
          packageLabel: this.packageLabel(commission.package_id),
          packageAmount: Number(commission.package_amount || 0),
          commissionAmount: Number(commission.commission_amount || 0),
          status: commission.status || 'earned',
          referralCode: commission.referral_code || '',
          createdAt: commission.created_at,
        }))
      } catch (error) {
        console.error('Unable to load referral records:', error)
        this.error = 'Unable to load referral records. Please refresh.'
        this.referrals = []
      } finally {
        this.loading = false
      }
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

    get totalReferrals() {
      return this.referrals.length
    },

    get qualifiedCount() {
      return this.referrals.filter(
        (referral) => referral.status !== 'cancelled',
      ).length
    },

    get pendingCount() {
      return this.referrals.filter((referral) =>
        ['requested', 'approved'].includes(referral.status),
      ).length
    },

    get availableCount() {
      return this.referrals.filter(
        (referral) => referral.status === 'earned',
      ).length
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

export function renderMemberReferralsPage() {
  return `
    <section
      x-data="memberReferralsPage"
      x-show="activePage === 'referrals' && isMember"
      x-transition.opacity
      aria-labelledby="member-referrals-title"
    >
      <div
        class="relative isolate overflow-hidden rounded-[1.75rem] border border-brand-gold/30 bg-brand-panel p-6 shadow-gold-soft sm:p-8"
      >
        <div
          class="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-brand-gold/10 blur-3xl"
          aria-hidden="true"
        ></div>

        <div class="relative">
          <p class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold">
            Direct Referral Program
          </p>

          <h1
            id="member-referrals-title"
            class="mt-2 font-display text-4xl text-brand-cream sm:text-5xl"
          >
            My Referrals
          </h1>

          <p class="mt-3 max-w-2xl text-sm leading-6 text-brand-muted">
            Share your personal referral link and monitor approved direct referral commission records.
          </p>
        </div>
      </div>

      <div class="mt-6">
        ${renderMemberReferralCard()}
      </div>

      <div
        x-show="error"
        class="mt-6 rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-4 text-sm text-red-200"
        x-text="error"
      ></div>

      <div
        class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Referral overview"
      >
        <article class="rounded-[1.35rem] border border-brand-border bg-brand-panel p-5 shadow-panel">
          <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
            Direct Referrals
          </p>
          <strong class="mt-3 block font-display text-4xl text-brand-cream" x-text="loading ? '—' : totalReferrals"></strong>
          <p class="mt-3 text-xs leading-5 text-brand-muted">Recorded commission rows</p>
        </article>

        <article class="rounded-[1.35rem] border border-brand-border bg-brand-panel p-5 shadow-panel">
          <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
            Qualified
          </p>
          <strong class="mt-3 block font-display text-4xl text-brand-cream" x-text="loading ? '—' : qualifiedCount"></strong>
          <p class="mt-3 text-xs leading-5 text-brand-muted">Eligible records</p>
        </article>

        <article class="rounded-[1.35rem] border border-brand-border bg-brand-panel p-5 shadow-panel">
          <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
            Pending Review
          </p>
          <strong class="mt-3 block font-display text-4xl text-brand-cream" x-text="loading ? '—' : pendingCount"></strong>
          <p class="mt-3 text-xs leading-5 text-brand-muted">Requested or approved payout</p>
        </article>

        <article class="rounded-[1.35rem] border border-brand-border bg-brand-panel p-5 shadow-panel">
          <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
            Available
          </p>
          <strong class="mt-3 block font-display text-4xl text-brand-cream" x-text="loading ? '—' : availableCount"></strong>
          <p class="mt-3 text-xs leading-5 text-brand-muted">Approved commission record</p>
        </article>
      </div>

      <section
        class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
        aria-labelledby="direct-referral-list-title"
      >
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Referral Records
            </p>

            <h2
              id="direct-referral-list-title"
              class="mt-1 font-display text-3xl text-brand-cream"
            >
              Direct Referral List
            </h2>

            <p class="mt-2 text-sm leading-6 text-brand-muted">
              Real referral commission ledger from approved membership packages.
            </p>
          </div>
        </div>

        <p
          x-show="loading"
          class="mt-5 rounded-xl border border-brand-border bg-brand-black px-4 py-8 text-center text-sm text-brand-muted"
        >
          Loading referral records...
        </p>

        <p
          x-show="!loading && referrals.length === 0"
          class="mt-5 rounded-xl border border-brand-border bg-brand-black px-4 py-8 text-center text-sm text-brand-muted"
        >
          No direct referrals yet.
        </p>

        <div
          x-show="!loading && referrals.length > 0"
          class="mt-5 grid gap-3"
        >
          <template x-for="referral in referrals" :key="referral.id">
            <article class="grid gap-4 rounded-2xl border border-brand-border bg-brand-black p-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <strong
                    class="text-sm text-brand-cream"
                    x-text="referral.packageLabel + ' Package'"
                  ></strong>

                  <span
                    class="rounded-full border px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.1em]"
                    :class="statusClass(referral.status)"
                    x-text="statusLabel(referral.status)"
                  ></span>
                </div>

                <p class="mt-2 text-sm leading-6 text-brand-muted">
                  <span x-text="'Package amount: ' + formatMoney(referral.packageAmount)"></span>
                  <span aria-hidden="true"> · </span>
                  <span x-text="'Referral code: ' + (referral.referralCode || 'N/A')"></span>
                </p>

                <p class="mt-1 text-xs text-brand-muted">
                  <span x-text="'Record ' + String(referral.id).slice(0, 8)"></span>
                  <span aria-hidden="true"> · </span>
                  <span x-text="formatDate(referral.createdAt)"></span>
                </p>
              </div>

              <strong
                class="font-display text-3xl text-brand-gold"
                x-text="formatMoney(referral.commissionAmount)"
              ></strong>
            </article>
          </template>
        </div>
      </section>
    </section>
  `
}