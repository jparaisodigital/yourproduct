import { supabase } from '../lib/supabase.js'

import rewardJourneyImage from '../assets/rewards/reward-journey.webp'
import androidPhoneImage from '../assets/rewards/android-phone.webp'
import laptopImage from '../assets/rewards/laptop.webp'
import iphoneImage from '../assets/rewards/iphone.webp'
import motorcycleImage from '../assets/rewards/motorcyle.webp'
import carImage from '../assets/rewards/car.webp'

const rewardCatalog = [
  {
    id: 'android-phone',
    name: 'Brand-New Android Cellphone',
    points: 10000,
    image: androidPhoneImage,
  },
  {
    id: 'laptop',
    name: 'Laptop',
    points: 20000,
    image: laptopImage,
  },
  {
    id: 'iphone',
    name: 'iPhone 17 Pro Max',
    points: 50000,
    image: iphoneImage,
  },
  {
    id: 'motorcycle',
    name: 'Achiever Motorcycle',
    points: 100000,
    image: motorcycleImage,
  },
  {
    id: 'car',
    name: 'Achiever Car',
    points: 200000,
    image: carImage,
  },
]

const rewardCardsMarkup = rewardCatalog
  .map(
    (reward) => `
      <article class="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-black">
        <div class="aspect-[4/5] bg-brand-panel p-2">
          <img
            src="${reward.image}"
            alt="${reward.name}"
            class="h-full w-full rounded-xl object-contain"
            loading="lazy"
          >
        </div>

        <div class="flex flex-1 flex-col p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-gold">
            ${reward.points.toLocaleString('en-PH')} points
          </p>

          <h3 class="mt-2 text-base font-semibold leading-6 text-brand-cream">
            ${reward.name}
          </h3>

          <p
            class="mt-3 text-xs leading-5"
            :class="availablePoints >= ${reward.points} ? 'text-emerald-300' : 'text-brand-muted'"
            x-text="
              availablePoints >= ${reward.points}
                ? 'Eligible for admin review'
                : 'Need ' + (${reward.points} - availablePoints).toLocaleString('en-PH') + ' more points'
            "
          ></p>

          <button
            type="button"
            class="mt-auto inline-flex min-h-10 items-center justify-center rounded-full border px-4 text-xs font-semibold transition"
            :class="
              availablePoints >= ${reward.points}
                ? 'border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-[#17130d]'
                : 'border-brand-border text-brand-muted opacity-60'
            "
            :disabled="availablePoints < ${reward.points}"
          >
            Request Reward
          </button>
        </div>
      </article>
    `,
  )
  .join('')

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
            'Approved member product order',
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
            My Points & Rewards
          </h1>

          <p class="mt-3 max-w-2xl text-sm leading-7 text-brand-muted">
            Track your points balance, history, and achievement rewards.
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

  <section
    class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
    aria-labelledby="points-history-title"
  >
    <div class="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
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

  <section
    class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
    aria-labelledby="reward-journey-title"
  >
    <div class="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <div>
        <p class="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-gold">
          Rewards
        </p>

        <h2
          id="reward-journey-title"
          class="mt-1 font-display text-3xl text-brand-cream"
        >
          Reward Journey
        </h2>

        <p class="mt-2 text-sm leading-6 text-brand-muted">
          Reach points milestones and request admin review for eligible rewards.
        </p>
      </div>

      <p class="text-xs leading-5 text-brand-muted lg:text-right">
        Rewards are subject to official qualification, mechanics, eligibility, and admin approval.
      </p>
    </div>

    <div class="mt-5 rounded-2xl border border-brand-border bg-brand-black p-3">
      <img
        src="${rewardJourneyImage}"
        alt="YOUR PRODUCT points achievement rewards"
        class="mx-auto h-auto max-h-[900px] w-full object-contain"
        loading="lazy"
      >
    </div>

    <div class="mt-6">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-gold">
            Rewards Catalog
          </p>

          <h3 class="mt-1 font-display text-2xl text-brand-cream">
            Choose a milestone reward
          </h3>
        </div>

        <p class="text-xs leading-5 text-brand-muted">
          Rewards are arranged from lowest to highest required points.
        </p>
      </div>

      <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        ${rewardCardsMarkup}
      </div>
    </div>
  </section>

        <div class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6">
          <p class="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-gold">
            Confirmed Rules
          </p>

          <ul class="mt-4 grid gap-3 text-sm leading-6 text-brand-muted sm:grid-cols-2">
            <li>Approved member product orders earn points even from 1 item.</li>
            <li>Perfume bottles earn 5 points each.</li>
            <li>Tester kits earn 10 points each.</li>
            <li>Approved membership packages also earn package points.</li>
            <li>Cancelled or refunded points may be reversed.</li>
            <li>Cancelled or refunded points may be reversed.</li>
          </ul>
        </div>
      </div>
    </section>
  `
}
