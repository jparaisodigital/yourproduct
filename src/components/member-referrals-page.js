const directReferrals = []

import { renderMemberReferralCard } from './member-referral-card.js'

const referralRowsMarkup = directReferrals.length
  ? directReferrals
      .map(
        (referral) => `
          <article
            class="rounded-2xl border border-brand-border bg-brand-black p-4 sm:p-5"
          >
            <div
              class="flex flex-col gap-4 lg:grid lg:grid-cols-[1.25fr_0.8fr_0.9fr_0.9fr_auto] lg:items-center"
            >
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <h3
                    class="font-display text-2xl text-brand-cream"
                  >
                    ${referral.fullName}
                  </h3>

                  <span
                    class="rounded-full border border-brand-border px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-brand-muted"
                  >
                    ${referral.id}
                  </span>
                </div>

                <p
                  class="mt-1 text-xs leading-5 text-brand-muted"
                >
                  Joined through your personal referral link
                </p>
              </div>

              <div>
                <p
                  class="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-brand-muted"
                >
                  Joined
                </p>

                <p
                  class="mt-1 text-sm font-semibold text-brand-cream"
                >
                  ${referral.joinedDate}
                </p>
              </div>

              <div>
                <p
                  class="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-brand-muted"
                >
                  Account
                </p>

                <p
                  class="mt-1 text-sm font-semibold text-brand-cream"
                >
                  ${referral.accountStatus}
                </p>
              </div>

              <div>
                <p
                  class="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-brand-muted"
                >
                  Qualification
                </p>

                <p
                  class="mt-1 text-sm font-semibold text-brand-cream"
                >
                  ${referral.qualificationStatus}
                </p>
              </div>

              <div class="lg:text-right">
                <span
                  class="inline-flex rounded-full border px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] ${referral.statusClass}"
                >
                  ${referral.commissionStatus}
                </span>
              </div>
            </div>
          </article>
        `,
      )
      .join('')
  : `
      <div
        class="rounded-2xl border border-dashed border-brand-border bg-brand-black/60 p-6 text-center"
      >
        <p
          class="font-display text-xl text-brand-cream"
        >
          No direct referrals yet
        </p>
        <p
          class="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted"
        >
          Customers who register through your personal referral link will appear here once referral tracking records are available.
        </p>
      </div>
    `

export function renderMemberReferralsPage() {
  // Dynamic counts based on real data
  const totalReferrals = directReferrals.length
  const qualifiedCount = directReferrals.filter(r => r.qualificationStatus === 'Qualified').length
  const pendingCount = directReferrals.filter(r => r.commissionStatus === 'Pending Review').length
  const availableCount = directReferrals.filter(r => r.commissionStatus === 'Available').length

  return `
    <section
      x-show="
        activePage === 'referrals' &&
        isMember
      "
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

        <div
          class="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold"
            >
              Direct Referral Program
            </p>

            <h1
              id="member-referrals-title"
              class="mt-2 font-display text-4xl text-brand-cream sm:text-5xl"
            >
              My Referrals
            </h1>

            <p
              class="mt-3 max-w-2xl text-sm leading-7 text-brand-muted"
            >
              View customers who registered through your personal
              referral link and monitor their qualification status.
            </p>
          </div>

          <button
            type="button"
            class="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-border px-5 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
            @click="openPage('general')"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      ${renderMemberReferralCard()}

      <section
        class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Referral overview"
      >
        <article
          class="rounded-[1.35rem] border border-brand-border bg-brand-panel p-5 shadow-panel"
        >
          <p
            class="text-xs uppercase tracking-[0.13em] text-brand-muted"
          >
            Direct Referrals
          </p>

          <strong
            class="mt-3 block font-display text-4xl text-brand-cream"
          >
            ${totalReferrals}
          </strong>

          <p
            class="mt-3 text-xs leading-5 text-brand-muted"
          >
            Registered through your link
          </p>
        </article>

        <article
          class="rounded-[1.35rem] border border-brand-border bg-brand-panel p-5 shadow-panel"
        >
          <p
            class="text-xs uppercase tracking-[0.13em] text-brand-muted"
          >
            Qualified
          </p>

          <strong
            class="mt-3 block font-display text-4xl text-brand-cream"
          >
            ${qualifiedCount}
          </strong>

          <p
            class="mt-3 text-xs leading-5 text-brand-muted"
          >
            Eligible records
          </p>
        </article>

        <article
          class="rounded-[1.35rem] border border-brand-border bg-brand-panel p-5 shadow-panel"
        >
          <p
            class="text-xs uppercase tracking-[0.13em] text-brand-muted"
          >
            Pending Review
          </p>

          <strong
            class="mt-3 block font-display text-4xl text-amber-300"
          >
            ${pendingCount}
          </strong>

          <p
            class="mt-3 text-xs leading-5 text-brand-muted"
          >
            Waiting for admin approval
          </p>
        </article>

        <article
          class="rounded-[1.35rem] border border-brand-gold/35 bg-brand-charcoal p-5 shadow-panel"
        >
          <p
            class="text-xs uppercase tracking-[0.13em] text-brand-muted"
          >
            Available
          </p>

          <strong
            class="mt-3 block font-display text-4xl text-emerald-300"
          >
            ${availableCount}
          </strong>

          <p
            class="mt-3 text-xs leading-5 text-brand-muted"
          >
            Approved commission record
          </p>
        </article>
      </section>

      <aside
        class="mt-6 rounded-2xl border border-brand-gold/30 bg-brand-gold/5 px-5 py-4"
        aria-label="Referral reminder"
      >
        <div class="flex items-start gap-3">
          <span
            class="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-brand-gold/30 bg-brand-black text-brand-gold"
            aria-hidden="true"
          >
            <svg
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <circle cx="12" cy="12" r="9"></circle>

              <path
                d="M12 10v6M12 7h.01"
                stroke-linecap="round"
              ></path>
            </svg>
          </span>

          <div>
            <p
              class="text-sm font-semibold text-brand-cream"
            >
              Direct referrals only
            </p>

            <p
              class="mt-1 text-xs leading-5 text-brand-muted"
            >
              Registration alone does not create a commission.
              Eligible purchases and payment confirmation must still
              be reviewed and approved by the admin.
            </p>
          </div>
        </div>
      </aside>

      <section
        class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
        aria-labelledby="direct-referral-list-title"
      >
        <div
          class="flex flex-col gap-3 border-b border-brand-border pb-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
            >
              Referral Records
            </p>

            <h2
              id="direct-referral-list-title"
              class="mt-1 font-display text-3xl text-brand-cream"
            >
              Direct Referral List
            </h2>
          </div>

          <p
            class="text-xs leading-5 text-brand-muted"
          >
            Real referral records
          </p>
        </div>

        <div class="mt-5 grid gap-3">
          ${referralRowsMarkup}
        </div>
      </section>
    </section>
  `
}
