import './style.css'

import Alpine from 'alpinejs'

import { supabase } from './lib/supabase.js'

import logoImage from './assets/logoyourproduct.png'

import rewardJourneyImage from './assets/rewards/reward-journey.png'

import {
  siteConfig,
} from './config/site-config.js'

import {
  products,
  productCategories,
} from './config/products-config.js'

import {
  packages,
} from './config/packages-config.js'

import {
  renderProductCard,
} from './components/product-card.js'

import {
  renderCartDrawer,
} from './components/cart-drawer.js'

import {
  renderProductDrawer,
} from './components/product-drawer.js'

import {
  registerCustomerSupportChat,
  renderCustomerSupportChat,
} from './components/customer-support-chat.js'

import {
  registerMemberReferralCard,
  renderMemberReferralCard,
} from './components/member-referral-card.js'

import {
  renderMemberReferralsPage,
} from './components/member-referrals-page.js'

import {
  registerMemberPointsPage,
  renderMemberPointsPage,
} from './components/member-points-page.js'

import {
  registerMemberEarningsPage,
  renderMemberEarningsPage,
} from './components/member-earnings-page.js'

import {
  registerMemberPayoutPage,
  renderMemberPayoutPage,
} from './components/member-payout-page.js'

import {
  registerCartStore,
} from './stores/cart-store.js'

import {
  registerProductViewStore,
} from './stores/product-view-store.js'

import {
  flyToCart,
} from './lib/fly-to-cart.js'

const dashboardParams = new URLSearchParams(
  window.location.search,
)

const requestedPackageId =
dashboardParams.get('package')?.trim() || ''

const requestedMembershipStatus =
dashboardParams.get('membership')?.trim() || ''

const isApprovedMemberPreview =
  requestedMembershipStatus === 'active'

const selectedDashboardPackage =
packages.find(
  (packageItem) =>
    packageItem.id === requestedPackageId &&
  packageItem.isActive,
) || null

const allowedMembershipStatuses = [
  'awaiting-payment',
  'pending-verification',
  'cancellation-requested',
]

const hasPendingMembership =
!isApprovedMemberPreview &&
Boolean(selectedDashboardPackage) &&
allowedMembershipStatuses.includes(
  requestedMembershipStatus,
)
const dashboardPesoFormatter = new Intl.NumberFormat(
  'en-PH',
  {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  },
)

const membershipInclusionItems =
selectedDashboardPackage?.inclusions
.map(
  (inclusion) => `
        <li
          class="flex items-start gap-3 text-sm leading-6 text-brand-muted"
        >
          <span
            class="mt-2 size-1.5 shrink-0 rounded-full bg-brand-gold"
            aria-hidden="true"
          ></span>

          <span>${inclusion}</span>
        </li>
      `,
)
.join('') || ''

const pendingMembershipMarkup = hasPendingMembership
? `
      <section
        class="mt-6 overflow-hidden rounded-[1.5rem] border border-amber-500/40 bg-brand-panel shadow-gold-soft"
        aria-label="Membership application"
      >
        <div
          class="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
        >
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-3">
              <p
                class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
              >
                Membership Application
              </p>

              <span
                class="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-amber-300"
              >
                <span
                  class="relative flex size-2"
                  aria-hidden="true"
                >
                  <span
                    class="absolute inline-flex size-full rounded-full bg-amber-400 opacity-60 motion-safe:animate-ping motion-reduce:animate-none"
                    style="animation-duration: 1.8s;"
                  ></span>

                  <span
                    class="relative inline-flex size-2 rounded-full bg-amber-400 [box-shadow:0_0_10px_rgba(251,191,36,0.85)]"
                  ></span>
                </span>

                <span
                  x-text="
                    membershipApplicationStatus ===
                    'cancellation-requested'
                      ? 'Cancellation Requested'
                      : membershipApplicationStatus ===
                          'pending-verification'
                        ? 'Pending Verification'
                        : 'Awaiting Payment'
                  "
                ></span>
              </span>
            </div>

            <h2
              class="mt-3 font-display text-3xl text-brand-cream"
            >
              ${selectedDashboardPackage.name}
            </h2>

            <p
              class="mt-2 max-w-2xl text-sm leading-6 text-brand-muted"
              x-text="
                membershipApplicationStatus ===
                'cancellation-requested'
                  ? 'Your cancellation request is waiting for admin review. Any applicable refund will be handled manually.'
                  : membershipApplicationStatus ===
                      'pending-verification'
                    ? 'Your payment proof has been submitted and is now waiting for admin review. Your membership remains inactive until approved.'
                    : 'Your free customer account remains active. Continue to payment to submit your transaction details and payment proof for admin verification.'
              "
            ></p>

            <div
              class="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <button
                type="button"
                class="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-brand-border px-6 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold sm:w-auto"
                @click="openPage('membershipApplication')"
              >
                View Application Details
              </button>

              <button
                x-show="
                  membershipApplicationStatus ===
                  'awaiting-payment'
                "
                x-transition
                type="button"
                class="premium-cta inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-[#17130d] sm:w-auto"
                @click="openPage('membershipPayment')"
              >
                Continue to Payment
              </button>
            </div>
          </div>

          <div
            class="w-full shrink-0 rounded-2xl border border-brand-border bg-brand-black px-5 py-4 sm:w-auto sm:min-w-48 sm:text-right"
          >
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-muted"
            >
              Selected Package
            </p>

            <p
              class="mt-2 font-display text-3xl text-brand-gold"
            >
              ${dashboardPesoFormatter.format(
selectedDashboardPackage.price,
)}
            </p>
          </div>
        </div>
      </section>
    `
: ''

const membershipUpgradeMarkup =
  !hasPendingMembership && !isApprovedMemberPreview
    ? `
      <section
  x-show="!isMember"
  x-transition.opacity
  class="mt-6 overflow-hidden rounded-[1.5rem] border border-brand-gold/30 bg-brand-panel shadow-gold-soft"
  aria-label="Membership upgrade"
>
        <div
          class="grid gap-5 px-5 py-5 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center"
        >
          <div>
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
            >
              Optional Membership
            </p>

            <h2
              class="mt-3 font-display text-3xl text-brand-cream"
            >
              Upgrade to reseller pricing
            </h2>

            <p
              class="mt-2 max-w-2xl text-sm leading-6 text-brand-muted"
            >
              Apply for a membership package to unlock reseller pricing,
              package inclusions, referral tools, and future member rewards.
            </p>
          </div>

          <div
            class="flex flex-col gap-3 sm:flex-row lg:flex-col"
          >
            <a
              href="/#packages"
              class="premium-cta inline-flex min-h-11 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-[#17130d]"
            >
              View Packages
            </a>

            <p class="text-xs leading-5 text-brand-muted lg:max-w-52">
              Your account stays free until payment is submitted and approved.
            </p>
          </div>
        </div>
      </section>
    `
    : ''

const membershipApplicationPageMarkup = hasPendingMembership
? `
      <section
        x-show="activePage === 'membershipApplication'"
        x-transition.opacity
        aria-labelledby="membership-application-title"
      >
        <div
          class="rounded-[1.75rem] border border-brand-gold/30 bg-brand-panel p-6 shadow-gold-soft sm:p-8"
        >
          <div
            class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <p
                class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold"
              >
                Membership Application
              </p>

              <h1
                id="membership-application-title"
                class="mt-2 font-display text-4xl text-brand-cream sm:text-5xl"
              >
                Application details
              </h1>

              <p
                class="mt-3 max-w-2xl text-sm leading-7 text-brand-muted"
              >
                Review your selected package and current application
                status.
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

        <div
          class="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
        >
          <section
            class="rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
          >
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
            >
              Selected Package
            </p>

            <div
              class="mt-4 flex flex-col gap-4 border-b border-brand-border pb-5 sm:flex-row sm:items-end sm:justify-between"
            >
              <div>
                <h2
                  class="font-display text-3xl text-brand-cream"
                >
                  ${selectedDashboardPackage.name}
                </h2>

                <p
                  class="mt-2 text-sm leading-6 text-brand-muted"
                >
                  ${selectedDashboardPackage.description}
                </p>
              </div>

              <p
                class="shrink-0 font-display text-3xl text-brand-gold"
              >
                ${dashboardPesoFormatter.format(
selectedDashboardPackage.price,
)}
              </p>
            </div>

            <div class="mt-5">
              <p
                class="text-xs font-semibold uppercase tracking-[0.14em] text-brand-muted"
              >
                Package Inclusions
              </p>

              <ul class="mt-4 grid gap-3 sm:grid-cols-2">
                ${membershipInclusionItems}
              </ul>
            </div>
          </section>

          <aside
            class="rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
          >
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
            >
              Application Status
            </p>

            <div
              class="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5"
            >
              <div class="flex items-center gap-3">
                <span
                  class="size-2.5 rounded-full bg-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.9)] animate-pulse"
                  aria-hidden="true"
                ></span>

                <strong
                  class="text-sm uppercase tracking-[0.08em] text-amber-200"
                  x-text="
                    membershipApplicationStatus ===
                    'cancellation-requested'
                      ? 'Cancellation Requested'
                      : membershipApplicationStatus ===
                          'pending-verification'
                        ? 'Pending Verification'
                        : 'Awaiting Payment'
                  "
                ></strong>
              </div>

              <p
                class="mt-3 text-sm leading-6 text-amber-100/80"
                x-text="
                  membershipApplicationStatus ===
                  'cancellation-requested'
                    ? 'Your cancellation request is waiting for admin review. Any applicable refund will be handled manually.'
                    : membershipApplicationStatus ===
                        'pending-verification'
                      ? 'Your payment proof is waiting for admin review.'
                      : 'Complete your payment and submit the required proof.'
                "
              ></p>
            </div>

            <div class="mt-5 border-t border-brand-border pt-5">
              <p
                class="text-xs font-semibold uppercase tracking-[0.14em] text-brand-muted"
              >
                Membership Activation
              </p>

              <p class="mt-2 text-sm leading-6 text-brand-muted">
                Your account remains a free customer account until the
                application and payment are approved by the admin.
              </p>
            </div>

            <div
  x-show="
    membershipApplicationStatus === 'awaiting-payment' ||
    membershipApplicationStatus === 'pending-verification'
  "
  class="mt-6 border-t border-brand-border pt-5"
>
  <button
    x-show="!cancellationPanelOpen"
    x-transition
    type="button"
    class="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-red-400/40 px-5 text-sm font-semibold text-red-300 transition hover:border-red-300 hover:bg-red-400/10 hover:text-red-200"
    @click="openCancellationPanel()"
    x-text="
      membershipApplicationStatus === 'awaiting-payment'
        ? 'Cancel Application'
        : 'Request Cancellation'
    "
  ></button>

  <div
    x-show="cancellationPanelOpen"
    x-transition
    class="rounded-2xl border border-red-400/30 bg-red-400/5 p-4"
  >
    <p
      class="text-sm font-semibold text-brand-cream"
      x-text="
        membershipApplicationStatus === 'awaiting-payment'
          ? 'Cancel unpaid application'
          : 'Request application cancellation'
      "
    ></p>

    <p
      class="mt-2 text-xs leading-5 text-brand-muted"
      x-text="
        membershipApplicationStatus === 'awaiting-payment'
          ? 'No payment proof has been submitted. This application will be cancelled immediately.'
          : 'The admin will review your request. Any applicable refund will be handled manually.'
      "
    ></p>

    <label
      for="cancellation-reason"
      class="mt-4 block text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted"
      x-text="
        membershipApplicationStatus === 'awaiting-payment'
          ? 'Reason (optional)'
          : 'Reason for cancellation'
      "
    ></label>

    <textarea
      id="cancellation-reason"
      x-model.trim="cancellationReason"
      rows="3"
      maxlength="300"
      placeholder="Tell us why you want to cancel this application"
      class="mt-2 w-full resize-none rounded-xl border border-brand-border bg-brand-black px-4 py-3 text-sm leading-6 text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-red-400"
    ></textarea>

    <p
      x-show="cancellationError"
      x-text="cancellationError"
      class="mt-2 text-xs leading-5 text-red-300"
      role="alert"
    ></p>

    <div class="mt-4 grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        class="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-border px-4 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
        @click="closeCancellationPanel()"
      >
        Keep Application
      </button>

      <button
        type="button"
        class="inline-flex min-h-11 items-center justify-center rounded-full bg-red-700 px-4 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        @click="submitCancellationRequest()"
        :disabled="cancellationSubmitting"
        x-text="
          cancellationSubmitting
            ? 'Processing...'
            : membershipApplicationStatus === 'awaiting-payment'
              ? 'Cancel Application'
              : 'Confirm Request'
        "
      ></button>
    </div>
  </div>
</div>

            <button
              x-show="
                membershipApplicationStatus ===
                'awaiting-payment'
              "
              type="button"
              class="premium-cta mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-[#17130d]"
              @click="openPage('membershipPayment')"
            >
              Continue to Payment
            </button>
          </aside>
        </div>
      </section>
    `
: ''

const membershipPaymentPageMarkup = hasPendingMembership
? `
      <section
        x-show="activePage === 'membershipPayment'"
        x-transition.opacity
        aria-labelledby="membership-payment-title"
      >
        <div
          class="rounded-[1.75rem] border border-brand-gold/30 bg-brand-panel p-6 shadow-gold-soft sm:p-8"
        >
          <div
            class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <p
                class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold"
              >
                Membership Payment
              </p>

              <h1
                id="membership-payment-title"
                class="mt-2 font-display text-4xl text-brand-cream sm:text-5xl"
              >
                Complete your package payment.
              </h1>

              <p
                class="mt-3 max-w-2xl text-sm leading-7 text-brand-muted"
              >
                Pay using an official e-wallet or bank account, then
                submit your transaction details and payment proof for
                admin verification.
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

        <div
          class="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]"
        >
          <aside
            class="rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
          >
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
            >
              Payment Summary
            </p>

            <h2
              class="mt-2 font-display text-3xl text-brand-cream"
            >
              ${selectedDashboardPackage.name}
            </h2>

            <p class="mt-2 text-sm leading-6 text-brand-muted">
              ${selectedDashboardPackage.description}
            </p>

            <div
              class="mt-5 border-t border-brand-border pt-5"
            >
              <p
                class="text-xs uppercase tracking-[0.13em] text-brand-muted"
              >
                Amount Due
              </p>

              <p
                class="mt-2 font-display text-4xl text-brand-gold"
              >
                ${dashboardPesoFormatter.format(
selectedDashboardPackage.price,
)}
              </p>
            </div>

            <div
              class="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3"
            >
              <p class="text-xs leading-5 text-amber-100">
                Membership remains inactive until the payment is
                reviewed and approved by the admin.
              </p>
            </div>
          </aside>

          <section
            class="rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
          >
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
            >
              Payment Details
            </p>

            <h2
              class="mt-2 font-display text-3xl text-brand-cream"
            >
              Select how you want to pay.
            </h2>

            <form
  class="mt-6"
  @submit.prevent="testMembershipPayment"
  @input="
    membershipPaymentError = ''
    membershipPaymentTested = false
  "
>
  <fieldset>
    <legend
      class="text-sm font-semibold text-brand-cream"
    >
      Payment method
    </legend>

    <div class="mt-3 grid gap-3 sm:grid-cols-2">
      <label
        class="cursor-pointer rounded-2xl border p-4 transition"
        :class="
          membershipPaymentForm.paymentMethod === 'e-wallet'
            ? 'border-brand-gold bg-brand-gold/10'
            : 'border-brand-border bg-brand-black hover:border-brand-gold/60'
        "
      >
        <input
          type="radio"
          name="membership-payment-method"
          value="e-wallet"
          x-model="membershipPaymentForm.paymentMethod"
          class="sr-only"
          required
        >

        <span
          class="block text-sm font-semibold text-brand-cream"
        >
          E-wallet
        </span>

        <span
          class="mt-1 block text-xs leading-5 text-brand-muted"
        >
          Pay using the official company e-wallet account.
        </span>
      </label>

      <label
        class="cursor-pointer rounded-2xl border p-4 transition"
        :class="
          membershipPaymentForm.paymentMethod === 'bank-transfer'
            ? 'border-brand-gold bg-brand-gold/10'
            : 'border-brand-border bg-brand-black hover:border-brand-gold/60'
        "
      >
        <input
          type="radio"
          name="membership-payment-method"
          value="bank-transfer"
          x-model="membershipPaymentForm.paymentMethod"
          class="sr-only"
          required
        >

        <span
          class="block text-sm font-semibold text-brand-cream"
        >
          Bank Transfer
        </span>

        <span
          class="mt-1 block text-xs leading-5 text-brand-muted"
        >
          Transfer to an official company bank account.
        </span>
      </label>
    </div>
  </fieldset>

  <div
    x-show="membershipPaymentForm.paymentMethod === 'e-wallet'"
    x-transition
    class="mt-4 rounded-2xl border border-brand-gold/30 bg-brand-black p-4"
  >
    <p
      class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand-gold"
    >
      Official E-wallet Account
    </p>

    <p class="mt-2 text-sm leading-6 text-brand-muted">
      Official e-wallet name and account number will be displayed here
      after client confirmation.
    </p>
  </div>

  <div
    x-show="membershipPaymentForm.paymentMethod === 'bank-transfer'"
    x-transition
    class="mt-4 rounded-2xl border border-brand-gold/30 bg-brand-black p-4"
  >
    <p
      class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand-gold"
    >
      Official Bank Account
    </p>

    <p class="mt-2 text-sm leading-6 text-brand-muted">
      Official bank name, account name, and account number will be
      displayed here after client confirmation.
    </p>
  </div>

  <div class="mt-5 grid gap-5 sm:grid-cols-2">
    <div>
      <label
        for="membership-sender-name"
        class="text-sm font-semibold text-brand-cream"
      >
        Sender or account name
      </label>

      <input
        id="membership-sender-name"
        type="text"
        x-model.trim="membershipPaymentForm.senderName"
        autocomplete="name"
        placeholder="Name used for payment"
        class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
        required
      >
    </div>

    <div>
      <label
        for="membership-reference-number"
        class="text-sm font-semibold text-brand-cream"
      >
        Reference number
      </label>

      <input
        id="membership-reference-number"
        type="text"
        x-model.trim="membershipPaymentForm.referenceNumber"
        inputmode="text"
        autocomplete="off"
        placeholder="Transaction reference"
        class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
        required
      >
    </div>
  </div>

  <div class="mt-5">
    <label
      for="membership-payment-proof"
      class="text-sm font-semibold text-brand-cream"
    >
      Payment screenshot
    </label>

    <label
      for="membership-payment-proof"
      class="mt-2 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-brand-border bg-brand-black px-5 py-6 text-center transition hover:border-brand-gold"
    >
      <span
        class="text-sm font-semibold text-brand-gold"
      >
        Choose payment screenshot
      </span>

      <span
        class="mt-2 text-xs leading-5 text-brand-muted"
      >
        JPG, PNG, or WebP only. Maximum file size is 5 MB.
      </span>

      <div
  x-show="membershipPaymentForm.proofPreviewUrl"
  x-transition
  class="mt-4 w-full overflow-hidden rounded-xl border border-brand-border bg-brand-panel p-2"
>
  <img
    :src="membershipPaymentForm.proofPreviewUrl"
    alt="Selected payment screenshot preview"
    class="mx-auto max-h-56 w-full rounded-lg object-contain"
  >
</div>

      <span
        x-show="membershipPaymentForm.proofFileName"
        x-text="membershipPaymentForm.proofFileName"
        class="mt-3 max-w-full truncate text-xs font-semibold text-brand-cream"
      ></span>
    </label>

    <input
      id="membership-payment-proof"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      class="sr-only"
      @change="handleMembershipProof($event)"
      required
    >
  </div>

  <label
    class="mt-5 flex cursor-pointer items-start gap-3"
  >
    <input
      type="checkbox"
      x-model="membershipPaymentForm.acceptedConfirmation"
      class="mt-1 size-4 shrink-0 accent-brand-gold"
      required
    >

    <span class="text-xs leading-5 text-brand-muted">
      I confirm that the package, amount, payment method,
      transaction details, and uploaded screenshot are correct.
    </span>
  </label>

  <p
    x-show="membershipPaymentError"
    x-text="membershipPaymentError"
    class="mt-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-900"
    role="alert"
  ></p>

  <div
  x-show="membershipPaymentSubmitted"
  x-transition
  class="rounded-2xl border border-emerald-400/30 bg-emerald-500/20 px-5 py-4"
>
  <div
    class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
  >
    <div>
      <p
        class="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-emerald-200"
      >
        Pending Verification
      </p>

      <p class="mt-1 font-semibold text-emerald-50">
        Your payment proof has been submitted.
      </p>

      <p class="mt-1 text-sm leading-6 text-emerald-50/80">
        Your membership remains inactive while the admin
        reviews your payment details.
      </p>

    </div>

    <button
      type="button"
      class="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-emerald-200/40 px-5 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-50/10"
      @click="openPage('general')"
    >
      Back to Dashboard
    </button>
  </div>
</div>

  <button
  x-show="
    membershipApplicationStatus === 'awaiting-payment' &&
    !membershipPaymentTested
  "
  x-transition
  type="submit"
  :disabled="
    !membershipPaymentsReady ||
    membershipApplicationStatus !== 'awaiting-payment' ||
    membershipPaymentSubmitting ||
    membershipPaymentSubmissionUncertain
  "
  class="premium-cta mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-gold px-7 text-sm font-semibold text-[#17130d] disabled:cursor-not-allowed disabled:opacity-60"
  x-text="
    !membershipPaymentsReady
      ? 'Membership payments opening soon'
      : membershipPaymentSubmitting
        ? 'Submitting payment proof...'
        : membershipPaymentSubmissionUncertain
          ? 'Check application status'
          : 'Submit Payment for Verification'
  "
></button>
</form>
          </section>
        </div>
      </section>
    `
: ''

const previewAccount = {
  firstName: isApprovedMemberPreview
    ? 'Juan'
    : 'Sample',

  lastName: isApprovedMemberPreview
    ? 'Dela Cruz'
    : 'Customer',

  emailAddress: isApprovedMemberPreview
    ? 'juan@example.com'
    : 'customer@example.com',

  mobileNumber: '09171234567',

  address: {
    province: 'Cavite',
    cityMunicipality: 'Bacoor',
    barangay: 'Sample Barangay',
    houseStreet: '123 Sample Street',
    landmark: '',
  },

  isMember: isApprovedMemberPreview,

  accountType: isApprovedMemberPreview
    ? 'Approved Member'
    : 'Free Customer',

  membershipStatus: isApprovedMemberPreview
    ? 'Active'
    : hasPendingMembership
      ? 'Awaiting Payment'
      : 'Not active',

  pendingPackageId:
    selectedDashboardPackage?.id || '',

    referralCode: isApprovedMemberPreview
    ? 'YP-A8K29'
    : '',

  directReferrals: 0,
  pointsBalance: 0,
  availableIncome: 0,
}

// Enable only after personal codes and referral records are live.
const memberReferralsReady = true

const previewRewards = [
  {
    label: 'Cellphone',
    icon: `
            <svg
              class="size-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              aria-hidden="true"
            >
              <rect
                x="7"
                y="2.5"
                width="10"
                height="19"
                rx="2"
              />

              <path
                d="M10 5h4M11 18.5h2"
                stroke-linecap="round"
              />
            </svg>
        `,
  },
  {
    label: 'Laptop',
    icon: `
            <svg
              class="size-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              aria-hidden="true"
            >
              <rect
                x="4"
                y="4"
                width="16"
                height="11"
                rx="1.5"
              />

              <path
                d="M2.5 19h19M8.5 19l.8-2h5.4l.8 2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
        `,
  },
  {
    label: 'Motorcycle',
    icon: `
            <svg
              class="size-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              aria-hidden="true"
            >
              <circle cx="6" cy="17" r="3" />
              <circle cx="18" cy="17" r="3" />

              <path
                d="M6 17h5l3-6h3.5M9 10h4l3 7M14 8h3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
        `,
  },
  {
    label: 'Car',
    icon: `
            <svg
              class="size-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              aria-hidden="true"
            >
              <path
                d="m5 11 2-5h10l2 5M4 11h16a1 1 0 0 1 1 1v5H3v-5a1 1 0 0 1 1-1Z"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <path
                d="M5 17v2M19 17v2M6.5 14h1M16.5 14h1"
                stroke-linecap="round"
              />
            </svg>
        `,
  },
]

const dashboardProducts = products.map((product) => ({
  ...product,
  isActive: false,
  stockQuantity: 0,
}))

let dashboardProductCardOptions = {}

const activeProducts = dashboardProducts

const dashboardCategoryButtons = productCategories
.map(
  (category) => `
          <button
            type="button"
            class="rounded-full border px-4 py-2 text-xs font-semibold transition sm:px-5 sm:py-2.5 sm:text-sm"
            :class="
              activeCategory === '${category.id}'
                ? 'border-brand-gold bg-brand-gold text-[#17130d]'
                : 'border-brand-border text-brand-muted hover:border-brand-gold hover:text-brand-gold'
            "
            @click="activeCategory = '${category.id}'"
            :aria-pressed="
              activeCategory === '${category.id}'
            "
          >
            ${category.label}
          </button>
        `,
)
.join('')

const dashboardProductCards = () => activeProducts
.map((product) => {
  const searchText = [
    product.name,
    product.sku,
    product.slug,
    product.collectionLabel,
    product.category,
  ]
  .join(' ')
  .toLowerCase()
  .replaceAll('\\', '\\\\')
  .replaceAll("'", "\\'")

  return `
          <div
            x-show="
              (
                activeCategory === 'all' ||
                activeCategory === '${product.category}'
              ) &&
              (
                productSearch.trim() === '' ||
                '${searchText}'.includes(
                  productSearch.trim().toLowerCase()
                )
              )
            "
            x-transition.opacity.duration.200ms
          >
          ${renderProductCard(product, dashboardProductCardOptions)}
          </div>
        `
})
.join('')

function renderSidebar() {
  return `
    <div class="flex h-full flex-col">
      <div
        class="flex min-h-20 items-center justify-between gap-3 border-b border-brand-border px-5"
      >
        <a
          href="/dashboard/"
          class="flex min-w-0 items-center gap-3"
          aria-label="${siteConfig.brand.name} dashboard"
        >
          <img
            src="${logoImage}"
            alt="${siteConfig.brand.name} logo"
            class="size-11 shrink-0 object-contain"
          >

          <span class="min-w-0">
            <span
              class="block truncate text-sm font-semibold uppercase tracking-[0.14em] text-brand-cream"
            >
              ${siteConfig.brand.name}
            </span>

            <span
              class="mt-0.5 block text-[0.58rem] uppercase tracking-[0.13em] text-brand-muted"
            >
              Customer Portal
            </span>
          </span>
        </a>

        <button
          type="button"
          class="grid size-10 place-items-center rounded-full border border-brand-border text-brand-muted transition hover:border-brand-gold hover:text-brand-gold lg:hidden"
          aria-label="Close dashboard menu"
          @click="closeMobileMenu()"
        >
          <svg
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            aria-hidden="true"
          >
            <path
              d="M6 6l12 12M18 6 6 18"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>

      <nav
        class="flex-1 overflow-y-auto px-4 py-6"
        aria-label="Customer portal navigation"
      >
        <p
          class="px-3 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-brand-muted"
        >
          Platform
        </p>

        <button
  type="button"
  class="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition"
  :class="
    activePage === 'general'
      ? 'bg-brand-gold text-[#17130d]'
      : 'text-brand-cream hover:bg-brand-charcoal'
  "
  @click="openPage('general')"
  :aria-current="
    activePage === 'general'
      ? 'page'
      : false
  "
>
  <svg
    class="size-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    aria-hidden="true"
  >
    <rect
      x="3"
      y="3"
      width="7"
      height="7"
      rx="1"
    />

    <rect
      x="14"
      y="3"
      width="7"
      height="7"
      rx="1"
    />

    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="1"
    />

    <rect
      x="14"
      y="14"
      width="7"
      height="7"
      rx="1"
    />
  </svg>

  <span>General</span>
</button>

        <div class="mt-3">
          <button
            type="button"
            class="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition"
            :class="
              activePage === 'createOrder' ||
              activePage === 'orderHistory'
                ? 'bg-brand-charcoal text-brand-gold'
                : 'text-brand-cream hover:bg-brand-charcoal'
            "
            @click="ordersOpen = !ordersOpen"
            :aria-expanded="ordersOpen"
          >
            <span class="flex items-center gap-3">
              <svg
                class="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                aria-hidden="true"
              >
                <path
                  d="M4 5h2l2 10h9l2-7H7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                <circle
                  cx="10"
                  cy="19"
                  r="1"
                />

                <circle
                  cx="17"
                  cy="19"
                  r="1"
                />
              </svg>

              <span>Orders</span>
            </span>

            <svg
              class="size-4 text-brand-muted transition"
              :class="ordersOpen ? 'rotate-180' : ''"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              aria-hidden="true"
            >
              <path
                d="m7 10 5 5 5-5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <div
            x-show="ordersOpen"
            x-transition
            class="ml-5 border-l border-brand-border pl-4"
          >
            <button
              type="button"
              class="block w-full rounded-lg px-3 py-2.5 text-left text-sm transition"
              :class="
                activePage === 'createOrder'
                  ? 'bg-brand-charcoal text-brand-gold'
                  : 'text-brand-muted hover:bg-brand-charcoal hover:text-brand-gold'
              "
              @click="openPage('createOrder')"
              :aria-current="
                activePage === 'createOrder'
                  ? 'page'
                  : false
              "
            >
              Create Order
            </button>

            <button
              type="button"
              class="block w-full rounded-lg px-3 py-2.5 text-left text-sm transition"
              :class="
                activePage === 'orderHistory'
                  ? 'bg-brand-charcoal text-brand-gold'
                  : 'text-brand-muted hover:bg-brand-charcoal hover:text-brand-gold'
              "
              @click="openPage('orderHistory')"
              :aria-current="
                activePage === 'orderHistory'
                  ? 'page'
                  : false
              "
            >
              Order History
            </button>
          </div>
        </div>

        <div
          x-show="isMember"
          x-transition
          class="mt-1"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-brand-cream transition hover:bg-brand-charcoal"
            @click="walletOpen = !walletOpen"
            :aria-expanded="walletOpen"
          >
            <span class="flex items-center gap-3">
              <svg
                class="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                aria-hidden="true"
              >
                <path
                  d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 16.5v-9Z"
                  stroke-linejoin="round"
                />

                <path
                  d="M4 8h16M15 12h5"
                  stroke-linecap="round"
                />
              </svg>

              <span>Wallet</span>
            </span>

            <svg
              class="size-4 text-brand-muted transition"
              :class="walletOpen ? 'rotate-180' : ''"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              aria-hidden="true"
            >
              <path
                d="m7 10 5 5 5-5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <div
            x-show="walletOpen"
            x-transition
            class="ml-5 border-l border-brand-border pl-4"
          >
            <button
              type="button"
              class="block w-full rounded-lg px-3 py-2.5 text-left text-sm transition"
              :class="
                activePage === 'earnings'
                  ? 'bg-brand-gold/10 font-semibold text-brand-gold'
                  : 'text-brand-muted hover:bg-brand-charcoal hover:text-brand-gold'
              "
              @click="openPage('earnings')"
              :aria-current="
                activePage === 'earnings'
                  ? 'page'
                  : false
              "
            >
              Earnings
            </button>

            <button
              type="button"
              class="block w-full rounded-lg px-3 py-2.5 text-left text-sm transition"
              :class="
                activePage === 'payoutRequest'
                  ? 'bg-brand-gold/10 font-semibold text-brand-gold'
                  : 'text-brand-muted hover:bg-brand-charcoal hover:text-brand-gold'
              "
              @click="openPage('payoutRequest')"
              :aria-current="
                activePage === 'payoutRequest'
                  ? 'page'
                  : false
              "
            >
              Payout Request
            </button>
          </div>
        </div>

                <button
  x-show="isMember && ${memberReferralsReady}"
  x-transition
  type="button"
  class="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition"
  :class="
    activePage === 'referrals'
      ? 'bg-brand-gold text-[#17130d]'
      : 'text-brand-cream hover:bg-brand-charcoal'
  "
  @click="openPage('referrals')"
          :aria-current="
            activePage === 'referrals'
              ? 'page'
              : false
          "
        >
          <svg
            class="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            aria-hidden="true"
          >
            <circle cx="9" cy="8" r="3"></circle>
            <circle cx="17" cy="10" r="2.5"></circle>

            <path
              d="M3.5 20a5.5 5.5 0 0 1 11 0M14 15.5a4.5 4.5 0 0 1 6.5 4"
              stroke-linecap="round"
            ></path>
          </svg>

          <span>My Referrals</span>
        </button>

        <button
  x-show="isMember"
  x-transition
  type="button"
  class="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition"
  :class="
    activePage === 'points'
      ? 'bg-brand-gold text-[#17130d]'
      : 'text-brand-cream hover:bg-brand-charcoal'
  "
  @click="openPage('points')"
  :aria-current="
    activePage === 'points'
      ? 'page'
      : false
  "
>
  <svg
    class="size-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="8"></circle>
    <path
      d="M9 12h6M12 9v6"
      stroke-linecap="round"
    ></path>
  </svg>

  <span>Points & Rewards</span>
</button>

        <button
  type="button"
  class="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition"
  :class="
    activePage === 'account'
      ? 'bg-brand-gold text-[#17130d]'
      : 'text-brand-cream hover:bg-brand-charcoal'
  "
  @click="openPage('account')"
  :aria-current="
    activePage === 'account'
      ? 'page'
      : false
  "
>
  <svg
    class="size-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="8"
      r="4"
    />

    <path
      d="M4.5 21a7.5 7.5 0 0 1 15 0"
      stroke-linecap="round"
    />
  </svg>

  <span>Account</span>
</button>
      </nav>

      <div class="border-t border-brand-border p-4">
        <div
          class="flex items-center gap-3 rounded-xl bg-brand-charcoal p-3"
        >
          <div
  class="grid size-10 shrink-0 place-items-center rounded-full bg-brand-gold text-sm font-bold text-[#17130d]"
  x-text="((profile.first_name || '').charAt(0) + (profile.last_name || '').charAt(0)).toUpperCase() || 'C'"
></div>

          <div class="min-w-0 flex-1">
  <p
    class="truncate text-sm font-semibold text-brand-cream"
    x-text="[profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Customer'"
  ></p>

  <p
  class="truncate text-xs text-brand-muted"
  x-text="profile.customer_type === 'member' ? 'Member' : 'Free Customer'"
></p>

  <p
    class="truncate text-xs text-brand-muted"
    x-text="profile.email || ''"
  ></p>

  <button
  type="button"
  class="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-brand-border px-4 text-xs font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold disabled:opacity-50"
  :disabled="isLoggingOut"
  @click="logOut()"
>
  <svg
    class="size-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    aria-hidden="true"
  >
    <path
      d="M10 6H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M14 16l4-4-4-4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M18 12H9"
      stroke-linecap="round"
    />
  </svg>

  <span x-text="isLoggingOut ? 'Logging out...' : 'Log out'"></span>
</button>

</div>
        </div>
      </div>
    </div>
  `
}

window.Alpine = Alpine
registerCustomerSupportChat(Alpine)
registerMemberPointsPage(Alpine)
registerMemberReferralCard(Alpine, {
  referralCode: previewAccount.referralCode,
  memberName:
    `${previewAccount.firstName} ${previewAccount.lastName}`,
})

registerMemberEarningsPage(Alpine, {
  availableIncome: previewAccount.availableIncome,
  transactions: [],
})

registerMemberPayoutPage(Alpine, {
  availableIncome: previewAccount.availableIncome,
  payoutRequests: [],
})

Alpine.magic('addToCartWithAnimation', () => {
  return (productId, sourceButton) => {
    const product = dashboardProducts.find(
      (item) => item.id === productId,
    )

    if (
      !product ||
      !product.isActive ||
      product.stockQuantity <= 0
    ) {
      return
    }

    const cart = Alpine.store('cart')
    const previousQuantity = cart.quantityFor(productId)

    cart.add(productId)

    if (cart.quantityFor(productId) > previousQuantity) {
      flyToCart(sourceButton, product.image)
    }
  }
})


let signedInProfile = null
let signedInOrders = []
let signedInOrdersError = false

Alpine.data('customerPortal', () => ({
  activePage: 'general',
  profile: signedInProfile,
  orders: signedInOrders,
  ordersError: signedInOrdersError,
  isMember: signedInProfile.membership_status === 'active',
  hasPendingMembership,
  selectedPackage: selectedDashboardPackage,
  activeCategory: 'all',
  productSearch: '',
  membershipPaymentForm: {
    paymentMethod: '',
    senderName: '',
    referenceNumber: '',
    proofFile: null,
    proofFileName: '',
    proofPreviewUrl: '',
    acceptedConfirmation: false,
  },

  membershipPaymentsReady: true,
  membershipPaymentSubmitting: false,
  membershipPaymentSubmissionUncertain: false,

  membershipPaymentError: '',
  membershipPaymentTested: false,
  membershipPaymentSubmitted: false,
  membershipApplicationStatus: hasPendingMembership
  ? requestedMembershipStatus
  : 'not-active',

  cancellationPanelOpen: false,
  cancellationReason: '',
  cancellationError: '',
  cancellationSubmitting: false,

  mobileMenuOpen: false,
  isLoggingOut: false,
  logoutError: '',
  ordersOpen: true,
  walletOpen: true,

  profileForm: {
    firstName: signedInProfile.first_name ?? '',
    lastName: signedInProfile.last_name ?? '',
    emailAddress: signedInProfile.email ?? '',
    mobileNumber: signedInProfile.mobile_number ?? '',

    address: {
      province: '',
      cityMunicipality: '',
      barangay: '',
      houseStreet: '',
      landmark: '',
    },
  },

  profileFormTested: false,
profileFormError: '',
isSavingProfile: false,
previewNotice: '',
previewTimer: null,

  get filteredProductCount() {
    const normalizedSearch =
    this.productSearch.trim().toLowerCase()

    return activeProducts.filter((product) => {
      const matchesCategory =
      this.activeCategory === 'all' ||
      product.category === this.activeCategory

      const searchableText = [
        product.name,
        product.sku,
        product.slug,
        product.collectionLabel,
        product.category,
      ]
      .join(' ')
      .toLowerCase()

      return (
        matchesCategory &&
        (
          normalizedSearch === '' ||
          searchableText.includes(normalizedSearch)
        )
      )
    }).length
  },

  init() {
    this.$watch('mobileMenuOpen', (isOpen) => {
      document.body.classList.toggle(
        'mobile-menu-open',
        isOpen,
      )
    })
  },

  async logOut() {
    if (this.isLoggingOut) return

    this.isLoggingOut = true
    this.logoutError = ''

    try {
      const { error } = await supabase.auth.signOut({
        scope: 'local',
      })

      if (error) throw error

      window.location.replace('/login/')
    } catch (error) {
      console.error('Unable to log out:', error)
      this.logoutError = 'Unable to log out. Please try again.'
      this.isLoggingOut = false
    }
  },

  openMobileMenu() {
    this.mobileMenuOpen = true
  },

  closeMobileMenu() {
    this.mobileMenuOpen = false
  },

  openPage(pageName) {
    this.activePage = pageName
    this.profileFormTested = false
    this.closeMobileMenu()

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  },

  async savePersonalInfo() {
    if (this.isSavingProfile) return

    this.profileFormTested = false
    this.profileFormError = ''

    const firstName = this.profileForm.firstName.trim()
    const lastName = this.profileForm.lastName.trim()
    const mobileNumber = this.profileForm.mobileNumber.trim()

    if (!firstName || !lastName || !mobileNumber) {
      this.profileFormError =
        'Enter your first name, last name, and mobile number.'
      return
    }

    this.isSavingProfile = true

    try {
      const { data: { user }, error: authError } =
        await supabase.auth.getUser()

      if (authError || !user) {
        window.location.replace('/login/')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          mobile_number: mobileNumber,
        })
        .eq('id', user.id)
        .select('first_name, last_name, mobile_number')
        .single()

      if (error) throw error

      this.profile = { ...this.profile, ...data }
      this.profileFormTested = true
    } catch (error) {
      console.error('Unable to save personal information:', error)
      this.profileFormError =
        'Unable to save your information. Please try again.'
    } finally {
      this.isSavingProfile = false
    }
  },

  handleMembershipProof(event) {
    const file = event.target.files?.[0]

    this.membershipPaymentError = ''
    this.membershipPaymentTested = false
    this.membershipPaymentForm.proofFile = null
    this.membershipPaymentForm.proofFileName = ''

    if (this.membershipPaymentForm.proofPreviewUrl) {
      URL.revokeObjectURL(
        this.membershipPaymentForm.proofPreviewUrl,
      )
      this.membershipPaymentForm.proofPreviewUrl = ''
    }

    if (!file) return

    const allowedFileTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (!allowedFileTypes.includes(file.type)) {
      this.membershipPaymentError =
        'Upload a JPG, PNG, or WebP image only.'
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      this.membershipPaymentError =
        'The payment screenshot must not exceed 5 MB.'
      event.target.value = ''
      return
    }

    this.membershipPaymentForm.proofFile = file
    this.membershipPaymentForm.proofFileName = file.name
    this.membershipPaymentForm.proofPreviewUrl =
      URL.createObjectURL(file)
  },

  async testMembershipPayment() {
    if (
      this.membershipPaymentSubmitting ||
      this.membershipPaymentSubmissionUncertain
    ) return

    this.membershipPaymentError = ''
    this.membershipPaymentSubmitted = false
    this.membershipPaymentTested = false

    if (!this.membershipPaymentsReady) {
      this.membershipPaymentError =
        'Membership payment submission is not open yet.'
      return
    }

    if (this.membershipApplicationStatus !== 'awaiting-payment') {
      this.membershipPaymentError =
        'This application is no longer awaiting payment.'
      return
    }

    const payment = this.membershipPaymentForm
    const senderName = payment.senderName.trim()
    const referenceNumber = payment.referenceNumber.trim()
    const proofFile = payment.proofFile

    const allowedTypes = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    }

    if (!['e-wallet', 'bank-transfer'].includes(payment.paymentMethod)) {
      this.membershipPaymentError = 'Select a payment method.'
      return
    }

    if (
      !senderName ||
      senderName.length > 120 ||
      !referenceNumber ||
      referenceNumber.length > 120
    ) {
      this.membershipPaymentError =
        'Enter a sender name and reference number of up to 120 characters each.'
      return
    }

    if (
      !proofFile ||
      !allowedTypes[proofFile.type] ||
      proofFile.size > 5 * 1024 * 1024 ||
      proofFile.name.length > 255
    ) {
      this.membershipPaymentError =
        'Select a JPG, PNG, or WebP screenshot under 5 MB.'
      return
    }

    if (!payment.acceptedConfirmation) {
      this.membershipPaymentError =
        'Confirm that your payment information is correct.'
      return
    }

    this.membershipPaymentSubmitting = true
    let submissionStarted = false

    try {
      const { data: { user }, error: userError } =
        await supabase.auth.getUser()

      if (userError || !user) {
        throw userError || new Error('Sign in required.')
      }

      const { data: application, error: applicationError } =
        await supabase
          .from('membership_applications')
          .select('id, package_id, status')
          .eq('customer_id', user.id)
          .in('status', [
            'awaiting-payment',
            'pending-verification',
            'cancellation-requested',
          ])
          .order('submitted_at', { ascending: false })
          .limit(1)
          .maybeSingle()

      if (
        applicationError ||
        !application ||
        application.status !== 'awaiting-payment' ||
        application.package_id !== this.selectedPackage?.id
      ) {
        throw applicationError ||
          new Error('Application changed. Refresh this page.')
      }

      const proofPath = [
        user.id,
        application.id,
        `${crypto.randomUUID()}.${allowedTypes[proofFile.type]}`,
      ].join('/')

      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(proofPath, proofFile, {
          contentType: proofFile.type,
          upsert: false,
        })

      if (uploadError) throw uploadError

      submissionStarted = true

      const { data: nextStatus, error: submitError } =
        await supabase.rpc(
          'customer_submit_membership_payment',
          {
            p_application_id: application.id,
            p_payment_method: payment.paymentMethod,
            p_sender_name: senderName,
            p_reference_number: referenceNumber,
            p_proof_path: proofPath,
            p_proof_file_name: proofFile.name,
          },
        )

      if (submitError || nextStatus !== 'pending-verification') {
        throw submitError ||
          new Error('Unexpected application status.')
      }

      this.membershipApplicationStatus = nextStatus
      this.membershipPaymentSubmitted = true
      this.membershipPaymentTested = true

      const dashboardUrl = new URL(window.location.href)
      dashboardUrl.searchParams.set('membership', nextStatus)
      window.history.replaceState({}, '', dashboardUrl)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Unable to submit membership payment:', error)

      this.membershipPaymentSubmissionUncertain =
        submissionStarted

      this.membershipPaymentError = submissionStarted
        ? 'Could not confirm submission. Refresh and check your application status before trying again.'
        : 'Unable to upload payment proof. Please try again.'
    } finally {
      this.membershipPaymentSubmitting = false
    }
  },

  openCancellationPanel() {
    const cancellableStatuses = [
      'awaiting-payment',
      'pending-verification',
    ]

    if (
      !cancellableStatuses.includes(
        this.membershipApplicationStatus,
      )
    ) {
      return
    }

    this.cancellationError = ''
    this.cancellationPanelOpen = true

    requestAnimationFrame(() => {
      document
      .querySelector('#cancellation-reason')
      ?.focus()
    })
  },

  closeCancellationPanel() {
    this.cancellationPanelOpen = false
    this.cancellationError = ''
  },

  async submitCancellationRequest() {
    if (this.cancellationSubmitting) return

    const cancellationReason = this.cancellationReason.trim()
    const needsReview =
      this.membershipApplicationStatus === 'pending-verification'

    if (
      (needsReview && !cancellationReason) ||
      cancellationReason.length > 300
    ) {
      this.cancellationError =
        'Enter a cancellation reason of 1 to 300 characters.'
      return
    }

    this.cancellationError = ''
    this.cancellationSubmitting = true

    try {
      const { data: nextStatus, error } = await supabase.rpc(
        'customer_cancel_membership_application',
        {
          p_reason: cancellationReason || null,
        },
      )

      if (error) throw error

      if (nextStatus === 'cancelled') {
        window.location.replace('/dashboard/')
        return
      }

      if (nextStatus !== 'cancellation-requested') {
        throw new Error('Unexpected cancellation status.')
      }

      this.membershipApplicationStatus = nextStatus
      this.closeCancellationPanel()

      const dashboardUrl = new URL(window.location.href)
      dashboardUrl.searchParams.set(
        'membership',
        'cancellation-requested',
      )
      window.history.replaceState({}, '', dashboardUrl)

      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Unable to cancel membership application:', error)
      this.cancellationError =
        'Could not confirm cancellation. Refresh to check the application status.'
    } finally {
      this.cancellationSubmitting = false
    }
  },

  showPreviewNotice(pageName) {
    clearTimeout(this.previewTimer)

    this.previewNotice =
    `${pageName} will be added in the next dashboard checkpoint.`

    this.previewTimer = setTimeout(() => {
      this.previewNotice = ''
    }, 3200)
  },

  destroy() {
    document.body.classList.remove('mobile-menu-open')

    if (this.previewTimer) {
      window.clearTimeout(this.previewTimer)
      this.previewTimer = null
    }

    if (this.membershipPaymentForm.proofPreviewUrl) {
      URL.revokeObjectURL(
        this.membershipPaymentForm.proofPreviewUrl,
      )

      this.membershipPaymentForm.proofPreviewUrl = ''
    }
  },
}))

document.title =
  `Customer Portal | ${siteConfig.brand.name}`

async function startDashboard() {
  const { data: { user }, error } =
    await supabase.auth.getUser()

  if (error || !user) {
    window.location.replace('/login/')
    return
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(
      'id, first_name, last_name, email, mobile_number, username, customer_type, membership_status, role, account_status',
    )
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    console.error('Unable to load profile:', profileError)
    document.querySelector('#dashboard-app').textContent =
      'Unable to load your profile. Please refresh.'
    return
  }

  if (profile.account_status !== 'active') {
    await supabase.auth.signOut()
    window.location.replace('/login/')
    return
  }

  if (profile.role === 'admin') {
    window.location.replace('/admin/')
    return
  }

  if (profile.role !== 'customer') {
    document.querySelector('#dashboard-app').textContent =
      'This account cannot access the customer dashboard.'
    return
  }

  signedInProfile = profile

  window.customerReferralCode = profile.username || ''
  window.customerReferralName = [
    profile.first_name,
    profile.last_name,
  ].filter(Boolean).join(' ') || 'YOUR PRODUCT Member'

  previewAccount.firstName =
  profile.first_name || previewAccount.firstName

previewAccount.lastName =
  profile.last_name || previewAccount.lastName

previewAccount.referralCode =
  profile.username || previewAccount.referralCode

const openApplicationStatuses = [
  'awaiting-payment',
  'pending-verification',
  'cancellation-requested',
]

let { data: membershipApplication, error: membershipError } =
  await supabase
    .from('membership_applications')
    .select('package_id, status')
    .eq('customer_id', user.id)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .maybeSingle()

const hasExistingOpenApplication =
  membershipApplication &&
  openApplicationStatuses.includes(membershipApplication.status)

const shouldCreateApplication =
  !membershipError &&
  !hasExistingOpenApplication &&
  requestedMembershipStatus === 'awaiting-payment' &&
  Boolean(selectedDashboardPackage) &&
  profile.customer_type === 'regular' &&
  profile.membership_status === 'none'

if (shouldCreateApplication) {
  const { data: newApplication, error: insertError } =
    await supabase
      .from('membership_applications')
      .insert({
        customer_id: user.id,
        package_id: selectedDashboardPackage.id,
        amount: selectedDashboardPackage.price,
      })
      .select('package_id, status')
      .single()

  if (insertError?.code === '23505') {
    // Another tab may have created an open application first.
    const { data: existingApplication, error: reloadError } =
      await supabase
        .from('membership_applications')
        .select('package_id, status')
        .eq('customer_id', user.id)
        .in('status', openApplicationStatuses)
        .limit(1)
        .maybeSingle()

    membershipApplication = existingApplication
    membershipError = reloadError
  } else {
    membershipApplication = newApplication
    membershipError = insertError
  }
}

if (membershipError) {
  console.error(
    'Unable to load or start membership application:',
    membershipError,
  )
  document.querySelector('#dashboard-app').textContent =
    'Unable to load your membership details. Please refresh.'
  return
}

const hasOpenApplication =
  membershipApplication &&
  openApplicationStatuses.includes(membershipApplication.status)

const expectedStatus = hasOpenApplication
  ? membershipApplication.status
  : ''

const expectedPackageId = hasOpenApplication
  ? membershipApplication.package_id
  : ''

if (
  requestedMembershipStatus !== expectedStatus ||
  requestedPackageId !== expectedPackageId
) {
  const dashboardUrl = new URL(window.location.href)

  if (expectedStatus) {
    dashboardUrl.searchParams.set('membership', expectedStatus)
    dashboardUrl.searchParams.set('package', expectedPackageId)
  } else {
    dashboardUrl.searchParams.delete('membership')
    dashboardUrl.searchParams.delete('package')
  }

  window.location.replace(dashboardUrl.toString())
  return
}

let productsLoadError = false

try {
  const { data, error: productsError } = await supabase
    .from('products')
    .select(
      'id, is_active, stock_quantity, regular_price, member_price',
    )

  if (productsError) throw productsError

  const liveProductsById = new Map(
    (data ?? []).map((product) => [product.id, product]),
  )

  for (const product of dashboardProducts) {
    const liveProduct = liveProductsById.get(product.id)
    const hasValidPrices =
    Number(liveProduct?.regular_price) > 0

    product.isActive =
      liveProduct?.is_active === true &&
      hasValidPrices

    product.stockQuantity = product.isActive
      ? Math.max(0, Number(liveProduct.stock_quantity) || 0)
      : 0

    if (liveProduct?.regular_price != null) {
      product.regularPrice = Number(liveProduct.regular_price)
    }

    if (liveProduct?.member_price != null) {
      product.memberPrice = Number(liveProduct.member_price)
    }
  }
} catch (error) {
  console.error('Unable to load dashboard products:', error)
  productsLoadError = true
}

let dashboardPricingType = 'regular'

if (
  profile.customer_type === 'member' &&
  profile.membership_status === 'active'
) {
  const { data: approvedApplication, error: tierError } =
    await supabase
      .from('membership_applications')
      .select('package_id')
      .eq('customer_id', profile.id)
      .eq('status', 'approved')
      .not('membership_activated_at', 'is', null)
      .order('membership_activated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

  if (tierError) {
    console.error('Unable to load dashboard pricing tier:', tierError)
  }

  if (
    [
      'starter',
      'builder',
      'leader',
      'prestige',
    ].includes(approvedApplication?.package_id)
  ) {
    dashboardPricingType = approvedApplication.package_id
  }
}

const tierPriceByType = {
  starter: 245,
  builder: 227,
  leader: 210,
  prestige: 175,
}

const tierLabelByType = {
  starter: 'Your Starter price',
  builder: 'Your Builder price',
  leader: 'Your Leader price',
  prestige: 'Your Prestige price',
}

const dashboardHasApprovedPricingTier =
  [
    'starter',
    'builder',
    'leader',
    'prestige',
  ].includes(dashboardPricingType)

  dashboardProductCardOptions =
  dashboardHasApprovedPricingTier
    ? {
        tierLabel: tierLabelByType[dashboardPricingType],
        tierPrice: tierPriceByType[dashboardPricingType],
      }
    : {}

registerCartStore(Alpine, dashboardProducts, {
  pricingType: dashboardPricingType,
})

registerProductViewStore(
  Alpine,
  dashboardProducts,
  dashboardProductCardOptions,
)

  const { data: orderRows, error: ordersError } = await supabase
    .from('orders')
    .select('id, status, subtotal, delivery_fee, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  signedInOrders = orderRows ?? []
  signedInOrdersError = Boolean(ordersError)

  if (ordersError) {
    console.error('Unable to load orders:', ordersError)
  }

  document.querySelector('#dashboard-app').innerHTML = `
  <div
    x-data="customerPortal"
    x-cloak
    class="min-h-screen bg-brand-black text-brand-cream"
    @keydown.escape.window="closeMobileMenu()"
  >
    <aside
      class="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-brand-border bg-brand-panel lg:block"
    >
      ${renderSidebar()}
    </aside>

    <div
      x-show="mobileMenuOpen"
      x-transition.opacity
      class="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] lg:hidden"
      aria-hidden="true"
      @click="closeMobileMenu()"
    ></div>

    <aside
      x-show="mobileMenuOpen"
      x-transition:enter="transition duration-300 ease-out"
      x-transition:enter-start="-translate-x-full"
      x-transition:enter-end="translate-x-0"
      x-transition:leave="transition duration-200 ease-in"
      x-transition:leave-start="translate-x-0"
      x-transition:leave-end="-translate-x-full"
      class="fixed inset-y-0 left-0 z-50 w-[min(18rem,86vw)] border-r border-brand-border bg-brand-panel shadow-2xl lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Dashboard menu"
    >
      ${renderSidebar()}
    </aside>

    <div class="min-h-screen lg:pl-72">
      <header
        class="sticky top-0 z-20 border-b border-brand-border bg-brand-panel/95 backdrop-blur-xl"
      >
        <div
          class="mx-auto flex min-h-16 w-[min(1240px,92%)] items-center justify-between gap-4"
        >
          <div class="flex min-w-0 items-center gap-3">
            <button
              type="button"
              class="grid size-10 shrink-0 place-items-center rounded-full border border-brand-border text-brand-cream transition hover:border-brand-gold hover:text-brand-gold lg:hidden"
              aria-label="Open dashboard menu"
              @click="openMobileMenu()"
            >
              <svg
                class="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                aria-hidden="true"
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke-linecap="round"
                />
              </svg>
            </button>

            <div class="min-w-0">
              <p
                class="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
              >
                Customer Portal
              </p>

              <p
  class="truncate text-sm font-semibold text-brand-cream"
  x-text="
  activePage === 'membershipApplication'
    ? 'Application Details'
    : activePage === 'membershipPayment'
      ? 'Membership Payment'
      : activePage === 'referrals'
        ? 'My Referrals'
        : activePage === 'points'
          ? 'My Points'
          : activePage === 'earnings'
            ? 'Earnings'
            : activePage === 'payoutRequest'
              ? 'Payout Request'
              : activePage === 'account'
                ? 'Account Settings'
                : activePage === 'createOrder'
                  ? 'Create Order'
                  : activePage === 'orderHistory'
                    ? 'Order History'
                    : 'General Dashboard'
"
></p>
            </div>
          </div>

          <div class="flex items-center gap-3">

            <button
              x-show="activePage === 'createOrder'"
              x-transition.opacity
              type="button"
              class="relative grid size-10 shrink-0 place-items-center rounded-full border border-brand-border text-brand-cream transition hover:border-brand-gold hover:bg-brand-gold/10 hover:text-brand-gold active:scale-95"
              :aria-label="'Open shopping cart with ' + $store.cart.itemCount + ' items'"
              data-cart-target
              @click="$dispatch('open-cart')"
            >
              <svg
                class="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                aria-hidden="true"
              >
                <path
                  d="M4 5h2l2 10h9l2-7H7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                <circle cx="10" cy="19" r="1" />
                <circle cx="17" cy="19" r="1" />
              </svg>

              <span
                x-show="$store.cart.itemCount > 0"
                x-text="
                  $store.cart.itemCount > 99
                    ? '99+'
                    : $store.cart.itemCount
                "
                class="absolute -right-1.5 -top-1.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-brand-gold px-1 text-[10px] font-bold leading-none text-[#17130d]"
                aria-hidden="true"
              ></span>
            </button>

            <a
  x-show="activePage !== 'createOrder'"
  x-transition.opacity
  href="/"
  class="inline-flex items-center gap-2 text-xs font-semibold text-brand-muted transition hover:text-brand-gold sm:text-sm"
>
  <svg
    class="size-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    aria-hidden="true"
  >
    <path
      d="M4 10h16"
      stroke-linecap="round"
    />
    <path
      d="M5 10l1.2-5h11.6L19 10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M6 10v9h12v-9"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9 19v-5h6v5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <span>View Store</span>
</a>

          </div>
        </div>
      </header>

      <main
        class="mx-auto w-[min(1240px,92%)] py-8 sm:py-10"
      >
        <div
          x-show="activePage === 'general'"
          x-transition.opacity
        >

                <section
          x-data="memberReferralCard"
          x-init="
            currentReferralCode = profile?.username || currentReferralCode;
            currentMemberName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || currentMemberName;
          "
          class="relative isolate overflow-hidden rounded-[1.75rem] border border-brand-gold/30 bg-brand-panel p-6 shadow-gold-soft sm:p-8"
        >
          <div
            class="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-brand-gold/10 blur-3xl"
            aria-hidden="true"
          ></div>

          <div
            class="relative grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center"
          >
            <div>
              <p
                class="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-brand-gold"
              >
                Customer Portal
              </p>

              <h1
                class="mt-3 font-display text-3xl leading-tight text-brand-cream sm:text-4xl"
              >
                Welcome,
                <span
                  class="italic text-brand-gold"
                  x-text="(profile.first_name || 'Customer') + '.'"
                ></span>
              </h1>

              <p
                class="mt-3 max-w-2xl text-sm leading-6 text-brand-muted sm:text-base"
              >
                Manage orders, points, rewards, and referrals from your dashboard.
              </p>

              <div
                class="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-2"
              >
                <span
                  class="size-2 rounded-full bg-emerald-500"
                  aria-hidden="true"
                ></span>

                <span
                  class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-gold"
                  x-text="profile.customer_type === 'member' ? 'Member Account' : 'Free Customer'"
                ></span>
              </div>
            </div>

            <div
              x-show="isMember"
              x-transition.opacity
              class="rounded-2xl border border-brand-border bg-brand-black/60 p-5"
            >
              <p
                class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
              >
                Direct Referral
              </p>

              <p
                class="mt-2 text-sm leading-6 text-brand-muted"
              >
                Share your link to track direct referrals. Earn 10% from approved membership packages.
              </p>

              <div
                class="mt-4 rounded-xl border border-brand-border bg-brand-panel p-4"
              >
                <p
                  class="text-xs uppercase tracking-[0.12em] text-brand-muted"
                >
                  Referral code
                </p>

                <strong
                  class="mt-1 block break-all text-sm text-brand-gold"
                  x-text="referralCode"
                ></strong>
              </div>

              <div
                class="mt-4 flex flex-col gap-3 sm:flex-row"
              >
                <button
                  type="button"
                  class="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-brand-gold px-5 text-sm font-semibold text-[#17130d] transition hover:bg-brand-gold-light"
                  @click="copyReferralLink()"
                >
                  Copy Link
                </button>

                <button
                  type="button"
                  class="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-brand-border px-5 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
                  @click="shareReferralLink()"
                >
                  Share Link
                </button>
              </div>

              <p
                x-cloak
                x-show="feedbackMessage"
                x-transition
                x-text="feedbackMessage"
                class="mt-4 rounded-xl border px-4 py-3 text-xs font-medium leading-5"
                :class="
                  feedbackTone === 'error'
                    ? 'border-red-400/40 bg-red-400/10 text-red-200'
                    : 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
                "
                role="status"
                aria-live="polite"
              ></p>
            </div>
          </div>
        </section>

        ${pendingMembershipMarkup}
        ${membershipUpgradeMarkup}

        <section
          x-show="!isMember"
          x-transition.opacity
          class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Customer overview"
        >
          <article
            class="rounded-[1.35rem] border border-brand-border bg-brand-panel p-5 shadow-[0_12px_35px_rgb(62_48_24_/_0.06)]"
          >
            <p
              class="text-xs uppercase tracking-[0.13em] text-brand-muted"
            >
              Account Type
            </p>

            <strong
  class="mt-3 block font-display text-2xl text-brand-cream"
  x-text="profile.customer_type === 'member' ? 'Member' : 'Free Customer'"
></strong>

            <p
              class="mt-3 text-xs leading-5 text-brand-muted"
            >
              Ready for regular orders
            </p>
          </article>

          <article
            class="rounded-[1.35rem] border border-brand-border bg-brand-panel p-5 shadow-[0_12px_35px_rgb(62_48_24_/_0.06)]"
          >
            <p
              class="text-xs uppercase tracking-[0.13em] text-brand-muted"
            >
              Total Orders
            </p>

            <strong
  class="mt-3 block font-display text-4xl text-brand-cream"
  x-text="ordersError ? '—' : orders.length"
></strong>

            <p
              class="mt-3 text-xs leading-5 text-brand-muted"
            >
              Order totals will appear here once connected
            </p>
          </article>

          <article
            class="rounded-[1.35rem] border border-brand-border bg-brand-panel p-5 shadow-[0_12px_35px_rgb(62_48_24_/_0.06)]"
          >
            <p
              class="text-xs uppercase tracking-[0.13em] text-brand-muted"
            >
              Membership
            </p>

           <strong
  class="mt-3 block font-display text-2xl text-brand-cream"
  x-text="({ none: 'Not Active', pending: 'Pending', active: 'Active', rejected: 'Rejected', suspended: 'Suspended' })[profile.membership_status] || 'Unknown'"
></strong>

<p
  class="mt-3 text-xs leading-5 text-brand-muted"
  x-text="
    profile.membership_status === 'none'
      ? 'Upgrade remains optional'
      : profile.membership_status === 'pending'
        ? 'Membership application is pending'
        : profile.membership_status === 'active'
          ? 'Membership is active'
          : profile.membership_status === 'rejected'
            ? 'Membership application was declined'
            : profile.membership_status === 'suspended'
              ? 'Contact support about your membership'
              : 'Status unavailable'
  "
></p>
          </article>

          <article
            class="rounded-[1.35rem] border border-brand-gold/35 bg-brand-charcoal p-5"
          >
            <p
              class="text-xs uppercase tracking-[0.13em] text-brand-muted"
            >
              Quick Action
            </p>

            <h2
              class="mt-3 font-display text-2xl text-brand-cream"
            >
              Ready to order?
            </h2>

            <button
              type="button"
              class="premium-cta mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand-gold px-5 text-sm font-semibold text-[#17130d]"
              @click="openPage('createOrder')"
            >
              Create Order
            </button>
          </article>
        </section>

        <section
          class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          x-show="isMember"
          x-transition.opacity
          aria-label="Approved member overview"
        >
          <article
            class="rounded-[1.35rem] border border-brand-border bg-brand-panel p-5 shadow-[0_12px_35px_rgb(62_48_24_/_0.06)]"
          >
            <p
              class="text-xs uppercase tracking-[0.13em] text-brand-muted"
            >
              Your People
            </p>

            <strong
              class="mt-3 block font-display text-4xl text-brand-cream"
            >
            ${memberReferralsReady ? previewAccount.directReferrals : '—'}
            </strong>

            <p
              class="mt-3 text-xs leading-5 text-brand-muted"
            >
              Direct referral tracking active
            </p>
          </article>

          <article
            class="rounded-[1.35rem] border border-brand-border bg-brand-panel p-5 shadow-[0_12px_35px_rgb(62_48_24_/_0.06)]"
          >
            <p
              class="text-xs uppercase tracking-[0.13em] text-brand-muted"
            >
              Your Points
            </p>

            <strong
              class="mt-3 block font-display text-4xl text-brand-cream"
            >
              ${previewAccount.pointsBalance}
            </strong>

            <p
              class="mt-3 text-xs leading-5 text-brand-muted"
            >
               Delivered member orders earn points
            </p>
          </article>

          <article
            class="rounded-[1.35rem] border border-brand-border bg-brand-panel p-5 shadow-[0_12px_35px_rgb(62_48_24_/_0.06)]"
          >
            <p
              class="text-xs uppercase tracking-[0.13em] text-brand-muted"
            >
              Available Income
            </p>

            <strong
              class="mt-3 block font-display text-4xl text-brand-cream"
            >
              ₱${previewAccount.availableIncome.toLocaleString(
'en-PH',
)}
            </strong>

            <p
              class="mt-3 text-xs leading-5 text-brand-muted"
            >
              Manual approval required
            </p>
          </article>

          <article
            class="rounded-[1.35rem] border border-brand-gold/35 bg-brand-charcoal p-5"
          >
            <p
              class="text-xs uppercase tracking-[0.13em] text-brand-muted"
            >
              Quick Action
            </p>

            <h2
              class="mt-3 font-display text-2xl text-brand-cream"
            >
              Ready to order?
            </h2>

            <button
              type="button"
              class="premium-cta mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand-gold px-5 text-sm font-semibold text-[#17130d]"
              @click="openPage('createOrder')"
            >
              Create Order
            </button>
          </article>
                </section>

        <div
          class="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]"
        >
          <section
            x-show="!isMember"
            x-transition.opacity
            class="relative isolate overflow-hidden rounded-[1.5rem] border border-brand-gold/35 bg-brand-charcoal p-5 shadow-panel sm:p-6"
          >
            <div
              class="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-brand-gold/10 blur-3xl"
              aria-hidden="true"
            ></div>

            <div class="relative">
              <p
                class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
              >
                Optional Membership
              </p>

              <h2
                class="mt-1 max-w-xl font-display text-3xl text-brand-cream"
              >
                Turn every qualified purchase into progress.
              </h2>

              <p
                class="mt-3 max-w-2xl text-sm leading-6 text-brand-muted"
              >
                Explore the membership packages when you are ready
                to unlock approved points, rewards and earning features.
                Your regular customer account remains free.
              </p>

              <ul
                class="mt-6 grid gap-3 text-sm text-brand-cream sm:grid-cols-3"
              >
                <li
                  class="flex items-center gap-3 rounded-xl border border-brand-border bg-brand-black/60 px-4 py-3"
                >
                  <span
                    class="size-2 shrink-0 rounded-full bg-brand-gold"
                    aria-hidden="true"
                  ></span>
                  Points
                </li>

                <li
                  class="flex items-center gap-3 rounded-xl border border-brand-border bg-brand-black/60 px-4 py-3"
                >
                  <span
                    class="size-2 shrink-0 rounded-full bg-brand-gold"
                    aria-hidden="true"
                  ></span>
                  Rewards
                </li>

                <li
                  class="flex items-center gap-3 rounded-xl border border-brand-border bg-brand-black/60 px-4 py-3"
                >
                  <span
                    class="size-2 shrink-0 rounded-full bg-brand-gold"
                    aria-hidden="true"
                  ></span>
                  Earning Features
                </li>
              </ul>

              <a
                href="/#packages"
                class="premium-cta mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-[#17130d] sm:w-auto"
              >
                Explore Membership Packages
              </a>
            </div>
          </section>

          <section
            x-data="{ rewardJourneyZoomOpen: false }"
            x-show="isMember"
            x-transition.opacity
            class="rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
          >
                        <button
              type="button"
              class="mt-6 block w-full overflow-hidden rounded-2xl border border-brand-border bg-brand-black/70 p-2 transition hover:border-brand-gold/60"
              aria-label="Open reward journey image"
              @click="rewardJourneyZoomOpen = true"
            >
              <img
                src="${rewardJourneyImage}"
                alt="YOUR PRODUCT reward journey"
                class="mx-auto max-h-[34rem] w-full rounded-xl object-contain"
                loading="lazy"
              >
            </button>

            <div
              x-cloak
              x-show="rewardJourneyZoomOpen"
              x-transition.opacity.duration.200ms
              class="fixed inset-0 z-[95] grid place-items-center bg-black/80 px-4 py-6 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
              aria-label="Reward journey image preview"
              @keydown.escape.window="rewardJourneyZoomOpen = false"
            >
              <button
                type="button"
                class="absolute inset-0 cursor-default"
                aria-label="Close reward journey preview"
                @click="rewardJourneyZoomOpen = false"
              ></button>

              <div
                class="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-brand-gold/40 bg-brand-black p-3 shadow-2xl"
              >
                <button
                  type="button"
                  class="absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full border border-white/15 bg-black/80 text-xl leading-none text-white shadow-lg transition hover:border-brand-gold hover:text-brand-gold"
                  aria-label="Close reward journey preview"
                  @click="rewardJourneyZoomOpen = false"
                >
                  <span aria-hidden="true">&times;</span>
                </button>

                <img
                  src="${rewardJourneyImage}"
                  alt="YOUR PRODUCT reward journey enlarged preview"
                  class="max-h-[86vh] w-full rounded-xl object-contain"
                >
              </div>
            </div>
          </section>

          <section
            class="rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
          >
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
            >
              Membership
            </p>

            <h2
              class="mt-1 font-display text-3xl text-brand-cream"
            >
              Account Overview
            </h2>

            <dl
              class="mt-6 divide-y divide-brand-border"
            >
              <div
                class="flex items-center justify-between gap-4 py-3 first:pt-0"
              >
                <dt class="text-sm text-brand-muted">
                  Customer Name
                </dt>

                <dd
  class="text-right text-sm font-semibold text-brand-cream"
  x-text="[profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Customer'"
></dd>
              </div>

              <div
                class="flex items-center justify-between gap-4 py-3"
              >
                <dt class="text-sm text-brand-muted">
                  Email
                </dt>

                <dd
  class="max-w-44 truncate text-right text-sm font-semibold text-brand-cream"
  x-text="profile.email || ''"
></dd>
              </div>

              <div
                class="flex items-center justify-between gap-4 py-3"
              >
                <dt class="text-sm text-brand-muted">
                  Membership
                </dt>

                <dd
  class="text-right text-sm font-semibold text-brand-cream"
  x-text="({ none: 'Not active', pending: 'Pending', active: 'Active', rejected: 'Rejected', suspended: 'Suspended' })[profile.membership_status] || 'Unknown'"
></dd>
              </div>

              <div
                class="flex items-center justify-between gap-4 py-3 last:pb-0"
              >
                <dt class="text-sm text-brand-muted">
                  Account Type
                </dt>

                <dd
  class="text-right text-sm font-semibold text-brand-cream"
  x-text="profile.customer_type === 'member' ? 'Member' : 'Free Customer'"
></dd>
              </div>
            </dl>

            <button
              type="button"
              class="premium-outline mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-brand-border px-5 text-sm font-semibold text-brand-cream hover:border-brand-gold hover:text-brand-gold"
              @click="openPage('account')"
            >
              View Account
            </button>
          </section>
        </div>

        <section
          class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
        >
          <div
            class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p
                class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
              >
                Recent Activity
              </p>

              <h2
                class="mt-1 font-display text-3xl text-brand-cream"
              >
                Recent Orders
              </h2>
            </div>

            <button
              type="button"
              class="text-left text-sm font-semibold text-brand-gold transition hover:text-brand-gold-light"
              @click="openPage('orderHistory')"
            >
              View Order History
            </button>
          </div>

          <div
            class="mt-6 rounded-2xl border border-dashed border-brand-border bg-brand-black px-5 py-10 text-center"
          >
            <span
              class="mx-auto grid size-12 place-items-center rounded-full bg-brand-charcoal text-brand-gold"
            >
              <svg
                class="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                aria-hidden="true"
              >
                <path
                  d="M4 5h2l2 10h9l2-7H7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                <circle
                  cx="10"
                  cy="19"
                  r="1"
                />

                <circle
                  cx="17"
                  cy="19"
                  r="1"
                />
              </svg>
            </span>

            <h3
              class="mt-4 font-display text-2xl text-brand-cream"
            >
              No Preview Orders Yet
            </h3>

            <p
              class="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted"
            >
              Real order records will appear here after
              Supabase and secure account access are connected.
            </p>
          </div>
        </section>

        <p
          class="mt-6 text-center text-xs leading-5 text-brand-muted"
        >
          Dashboard interface preview — no account,
          points, income, or order data is being saved yet.
        </p>
                </div>

        ${memberReferralsReady ? renderMemberReferralsPage() : ''}

        ${renderMemberPointsPage()}

        ${renderMemberEarningsPage()}

        ${renderMemberPayoutPage()}

        ${membershipApplicationPageMarkup}

        ${membershipPaymentPageMarkup}

        <section
          x-show="activePage === 'account'"
          x-transition.opacity
          aria-labelledby="account-page-title"
        >
          <div
            class="rounded-[1.75rem] border border-brand-gold/30 bg-brand-panel p-6 shadow-gold-soft sm:p-8"
          >
            <div
              class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
            >
              <div>
                <p
                  class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold"
                >
                  Customer Account
                </p>

                <h1
                  id="account-page-title"
                  class="mt-2 font-display text-4xl text-brand-cream sm:text-5xl"
                >
                  Profile and address
                </h1>

                <p
                  class="mt-3 max-w-2xl text-sm leading-7 text-brand-muted"
                >
                  Review the information that will be connected
                  to your secure customer account and future orders.
                </p>
              </div>

              <div
                class="rounded-2xl border border-brand-border bg-brand-black px-5 py-4"
              >
                <p
                  class="text-xs uppercase tracking-[0.12em] text-brand-muted"
                >
                  Membership Status
                </p>

                <p
  class="mt-2 text-sm font-semibold text-brand-cream"
  x-text="({ none: 'Not active', pending: 'Pending', active: 'Active', rejected: 'Rejected', suspended: 'Suspended' })[profile.membership_status] || 'Unknown'"
></p>
              </div>
            </div>
          </div>

          <form
  class="mt-6 grid gap-6 xl:grid-cols-[1fr_0.85fr]"
  @submit.prevent="savePersonalInfo()"
  novalidate
>
            <section
              class="rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
              aria-labelledby="personal-information-title"
            >
              <p
                class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
              >
                Account Details
              </p>

              <h2
                id="personal-information-title"
                class="mt-1 font-display text-3xl text-brand-cream"
              >
                Personal information
              </h2>

              <div class="mt-6 grid gap-5 sm:grid-cols-2">
                <label class="block">
                  <span
                    class="text-xs font-semibold uppercase tracking-[0.1em] text-brand-muted"
                  >
                    First Name
                  </span>

                  <input
                    type="text"
                    name="firstName"
                    autocomplete="given-name"
                    required
                    maxlength="80"
                    x-model.trim="profileForm.firstName"
                    class="mt-2 min-h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted/70 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/15"
                  >
                </label>

                <label class="block">
                  <span
                    class="text-xs font-semibold uppercase tracking-[0.1em] text-brand-muted"
                  >
                    Last Name
                  </span>

                  <input
                    type="text"
                    name="lastName"
                    autocomplete="family-name"
                    required
                    maxlength="80"
                    x-model.trim="profileForm.lastName"
                    class="mt-2 min-h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted/70 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/15"
                  >
                </label>

                <label class="block sm:col-span-2">
                  <span
                    class="text-xs font-semibold uppercase tracking-[0.1em] text-brand-muted"
                  >
                    Email Address
                  </span>

                  <input
                    type="email"
                    name="emailAddress"
                    autocomplete="email"
                    readonly
                    x-model="profileForm.emailAddress"
                    class="mt-2 min-h-12 w-full cursor-not-allowed rounded-xl border border-brand-border bg-brand-charcoal px-4 text-sm text-brand-muted outline-none"
                  >

                  <span
                    class="mt-2 block text-xs leading-5 text-brand-muted"
                  >
                    Email changes will require a secure verification
                    process after authentication is connected.
                  </span>
                </label>

                <label class="block sm:col-span-2">
                  <span
                    class="text-xs font-semibold uppercase tracking-[0.1em] text-brand-muted"
                  >
                    Mobile Number
                  </span>

                  <input
                    type="tel"
                    name="mobileNumber"
                    autocomplete="tel"
                    inputmode="tel"
                    required
                    maxlength="20"
                    x-model.trim="profileForm.mobileNumber"
                    class="mt-2 min-h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted/70 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/15"
                  >
                </label>
              </div>
            </section>

            <section
              class="rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
              aria-labelledby="default-address-title"
            >
              <p
                class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
              >
                Delivery Details
              </p>

              <h2
                id="default-address-title"
                class="mt-1 font-display text-3xl text-brand-cream"
              >
                Default address
              </h2>

              <div class="mt-6 grid gap-5 sm:grid-cols-2">
                <label class="block">
                  <span
                    class="text-xs font-semibold uppercase tracking-[0.1em] text-brand-muted"
                  >
                    Province
                  </span>

                  <input
                    type="text"
                    name="province"
                    autocomplete="address-level1"
                    required
                    maxlength="100"
                    x-model.trim="profileForm.address.province"
                    class="mt-2 min-h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/15"
                  >
                </label>

                <label class="block">
                  <span
                    class="text-xs font-semibold uppercase tracking-[0.1em] text-brand-muted"
                  >
                    City / Municipality
                  </span>

                  <input
                    type="text"
                    name="cityMunicipality"
                    autocomplete="address-level2"
                    required
                    maxlength="100"
                    x-model.trim="profileForm.address.cityMunicipality"
                    class="mt-2 min-h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/15"
                  >
                </label>

                <label class="block sm:col-span-2">
                  <span
                    class="text-xs font-semibold uppercase tracking-[0.1em] text-brand-muted"
                  >
                    Barangay
                  </span>

                  <input
                    type="text"
                    name="barangay"
                    autocomplete="address-level3"
                    required
                    maxlength="100"
                    x-model.trim="profileForm.address.barangay"
                    class="mt-2 min-h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/15"
                  >
                </label>

                <label class="block sm:col-span-2">
                  <span
                    class="text-xs font-semibold uppercase tracking-[0.1em] text-brand-muted"
                  >
                    House No. and Street
                  </span>

                  <input
                    type="text"
                    name="houseStreet"
                    autocomplete="street-address"
                    required
                    maxlength="180"
                    x-model.trim="profileForm.address.houseStreet"
                    class="mt-2 min-h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/15"
                  >
                </label>

                <label class="block sm:col-span-2">
                  <span
                    class="text-xs font-semibold uppercase tracking-[0.1em] text-brand-muted"
                  >
                    Landmark
                    <span class="normal-case tracking-normal">
                      (Optional)
                    </span>
                  </span>

                  <input
                    type="text"
                    name="landmark"
                    maxlength="180"
                    x-model.trim="profileForm.address.landmark"
                    class="mt-2 min-h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/15"
                  >
                </label>
              </div>
            </section>

            <section
              class="rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6 xl:col-span-2"
            >
              <div
                class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2
                    class="font-display text-2xl text-brand-cream"
                  >
                    Review your information
                  </h2>

                  <p
                    class="mt-2 max-w-2xl text-sm leading-6 text-brand-muted"
                  >
                    Saves your first name, last name, and mobile number.
                    Email and delivery address are not changed.
                  </p>
                </div>

                <button
  type="submit"
  :disabled="isSavingProfile"
  class="premium-cta inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-[#17130d] sm:w-auto"
>
  <span x-text="isSavingProfile ? 'Saving…' : 'Save Personal Information'"></span>
</button>
              </div>

              <div
  x-show="profileFormTested"
  x-transition
  class="mt-5 rounded-xl border border-brand-gold/35 bg-brand-gold/10 px-4 py-3 text-sm leading-6 text-brand-cream"
  role="status"
>
  Personal information saved.
</div>

<p
  x-show="profileFormError"
  x-text="profileFormError"
  class="mt-3 text-sm text-red-400"
  role="alert"
></p>
            </section>
          </form>

          <p
            class="mt-6 text-center text-xs leading-5 text-brand-muted"
          >
            Account interface preview — Delivery address saving is not available yet.
          </p>
        </section>

        <section
          x-show="activePage === 'createOrder'"
          x-transition.opacity
          aria-labelledby="create-order-page-title"
        >
          <div
            class="rounded-[1.75rem] border border-brand-gold/30 bg-brand-panel p-6 shadow-gold-soft sm:p-8"
          >
            <div
              class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
            >
              <div>
                <p
                  class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold"
                >
                  Perfume Catalog
                </p>

                <h1
                  id="create-order-page-title"
                  class="mt-2 font-display text-4xl text-brand-cream sm:text-5xl"
                >
                  Create your order
                </h1>

                <p
                  class="mt-3 max-w-2xl text-sm leading-7 text-brand-muted"
                >
                  Browse the shared collection, review product
                  details and add your selected perfumes to the cart.
                </p>
              </div>

              <button
                type="button"
                class="premium-outline relative inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-brand-border px-6 text-sm font-semibold text-brand-cream hover:border-brand-gold hover:text-brand-gold sm:w-auto"
                @click="$dispatch('open-cart')"
                aria-label="Open shopping cart"
                data-cart-target
              >
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  aria-hidden="true"
                >
                  <path
                    d="M4 5h2l2 10h9l2-7H7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <circle cx="10" cy="19" r="1" />
                  <circle cx="17" cy="19" r="1" />
                </svg>

                Cart

                <span
                  class="grid min-w-6 place-items-center rounded-full bg-brand-gold px-1.5 py-0.5 text-[0.65rem] font-bold text-[#17130d]"
                  x-text="$store.cart.itemCount"
                >
                  0
                </span>
              </button>
            </div>
          </div>

          <section
            class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
            aria-label="Catalog controls"
          >
            <div
              class="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center"
            >
              <label class="relative block">
                <span class="sr-only">
                  Search perfumes
                </span>

                <svg
                  class="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand-muted"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path
                    d="m20 20-4-4"
                    stroke-linecap="round"
                  />
                </svg>

                <input
                  type="search"
                  x-model.debounce.150ms="productSearch"
                  placeholder="Search by perfume name or SKU"
                  maxlength="100"
                  class="min-h-12 w-full rounded-xl border border-brand-border bg-brand-black py-3 pl-11 pr-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted/70 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/15"
                >
              </label>

              <button
                type="button"
                class="text-left text-xs font-semibold text-brand-muted transition hover:text-brand-gold lg:text-right"
                x-show="productSearch"
                @click="productSearch = ''"
              >
                Clear Search
              </button>
            </div>

            <div
              class="mt-5 flex flex-wrap gap-2 sm:gap-3"
              aria-label="Filter products by collection"
            >
              ${dashboardCategoryButtons}
            </div>

            <div
              class="mt-5 flex items-center justify-between gap-4 border-t border-brand-border pt-4"
            >
              <p class="text-sm text-brand-muted">
                <span
                  class="font-semibold text-brand-cream"
                  x-text="filteredProductCount"
                ></span>
                catalog
                <span
                  x-text="filteredProductCount === 1 ? 'product' : 'products'"
                ></span>
              </p>

              <p
                class="hidden text-xs text-brand-muted sm:block"
              >
                Approved package tier required for reseller pricing
              </p>
            </div>
          </section>

          ${productsLoadError
            ? '<p class="mt-5 rounded-xl border border-red-400/30 bg-brand-panel p-4 text-sm text-red-300" role="alert">Product availability is temporarily unavailable. Please refresh.</p>'
            : ''}

          <div
            class="mt-6 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3"
            aria-live="polite"
          >
            ${dashboardProductCards()}
          </div>

          <div
            x-show="filteredProductCount === 0"
            x-transition
            class="mt-6 rounded-2xl border border-dashed border-brand-border bg-brand-panel px-5 py-12 text-center"
          >
            <h2
              class="font-display text-2xl text-brand-cream"
            >
              No perfumes found
            </h2>

            <p
              class="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted"
            >
              Try another search term or select a different
              perfume collection.
            </p>

            <button
              type="button"
              class="mt-5 text-sm font-semibold text-brand-gold hover:text-brand-gold-light"
              @click="
                productSearch = ''
                activeCategory = 'all'
              "
            >
              Reset Catalog
            </button>
          </div>

          <p
            class="mt-6 text-center text-xs leading-5 text-brand-muted"
          >
            Product names, prices and stock are temporary preview
            data until the final catalog is approved and connected.
          </p>
        </section>

        <section
          x-show="activePage === 'orderHistory'"
          x-transition.opacity
          aria-labelledby="order-history-page-title"
        >
          <div
            class="rounded-[1.75rem] border border-brand-gold/30 bg-brand-panel p-6 shadow-gold-soft sm:p-8"
          >
            <div
              class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
            >
              <div>
                <p
                  class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold"
                >
                  Your Orders
                </p>

                <h1
                  id="order-history-page-title"
                  class="mt-2 font-display text-4xl text-brand-cream sm:text-5xl"
                >
                  Order history
                </h1>

                <p
                  class="mt-3 max-w-2xl text-sm leading-7 text-brand-muted"
                >
                  Review submitted orders and their latest
                  admin-confirmed status in one place.
                </p>
              </div>

              <button
                type="button"
                class="premium-cta inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-[#17130d] sm:w-auto"
                @click="openPage('createOrder')"
              >
                Create New Order
              </button>
            </div>
          </div>

          <section
            class="mt-6 grid gap-4 sm:grid-cols-3"
            aria-label="Order overview"
          >
            <article
              class="rounded-[1.35rem] border border-brand-border bg-brand-panel p-5 shadow-panel"
            >
              <p
                class="text-xs uppercase tracking-[0.13em] text-brand-muted"
              >
                Total Orders
              </p>

              <strong
  class="mt-3 block font-display text-4xl text-brand-cream"
  x-text="ordersError ? '—' : orders.length"
></strong>
            </article>

            <article
              class="rounded-[1.35rem] border border-brand-border bg-brand-panel p-5 shadow-panel"
            >
              <p
                class="text-xs uppercase tracking-[0.13em] text-brand-muted"
              >
                Pending Verification
              </p>

              <strong
  class="mt-3 block font-display text-4xl text-brand-cream"
  x-text="ordersError ? '—' : orders.filter(order => order.status === 'pending_verification').length"
></strong>
            </article>

            <article
              class="rounded-[1.35rem] border border-brand-border bg-brand-panel p-5 shadow-panel"
            >
              <p
                class="text-xs uppercase tracking-[0.13em] text-brand-muted"
              >
                Completed
              </p>

              <strong
  class="mt-3 block font-display text-4xl text-brand-cream"
  x-text="ordersError ? '—' : orders.filter(order => order.status === 'completed').length"
></strong>
            </article>
          </section>

          <section
            class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
            aria-labelledby="order-records-title"
          >
            <div
              class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
            >
              <div>
                <p
                  class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
                >
                  Order Records
                </p>

                <h2
                  id="order-records-title"
                  class="mt-1 font-display text-3xl text-brand-cream"
                >
                  Recent submissions
                </h2>
              </div>

              <span
                class="text-xs leading-5 text-brand-muted"
              >
                Latest orders will appear first
              </span>
            </div>

            <div
  x-show="!ordersError && orders.length === 0"
  class="mt-6 rounded-2xl border border-dashed border-brand-border bg-brand-black px-5 py-12 text-center"
>
              <span
                class="mx-auto grid size-12 place-items-center rounded-full bg-brand-charcoal text-brand-gold"
                aria-hidden="true"
              >
                <svg
                  class="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                >
                  <path
                    d="M4 5h2l2 10h9l2-7H7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />

                  <circle cx="10" cy="19" r="1" />
                  <circle cx="17" cy="19" r="1" />

                  <path
                    d="M14.5 5.5h5M17 3v5"
                    stroke-linecap="round"
                  />
                </svg>
              </span>

              <h3
                class="mt-4 font-display text-2xl text-brand-cream"
              >
                No orders submitted yet
              </h3>

              <p
                class="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted"
              >
                Once an order is submitted and stored securely,
                its reference number and status will appear here.
              </p>

              <button
                type="button"
                class="premium-outline mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-brand-border px-6 text-sm font-semibold text-brand-cream hover:border-brand-gold hover:text-brand-gold"
                @click="openPage('createOrder')"
              >
                Browse Perfumes
              </button>
            </div>
          </section>

                    <div
            x-show="ordersError"
            class="mt-6 rounded-2xl border border-red-400/30 bg-brand-panel p-5 text-sm text-red-300"
            role="alert"
          >
            Unable to load orders. Please refresh this page.
          </div>

          <div
            x-show="!ordersError && orders.length > 0"
            class="mt-6 space-y-3"
          >
            <template x-for="order in orders" :key="order.id">
              <article class="rounded-2xl border border-brand-border bg-brand-panel p-5">
                <p
                  class="font-semibold text-brand-cream"
                  x-text="'Order ' + order.id.slice(0, 8).toUpperCase()"
                ></p>
                <span
  class="mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
  :class="{
    'border-amber-300/40 bg-amber-400/10 text-amber-200': [
      'pending_verification',
      'pending-verification',
    ].includes(order.status),
    'border-red-300/40 bg-red-400/10 text-red-200': order.status === 'rejected',
    'border-sky-300/40 bg-sky-400/10 text-sky-200': order.status === 'processing',
    'border-blue-300/40 bg-blue-400/10 text-blue-200': order.status === 'shipped',
    'border-emerald-300/40 bg-emerald-400/10 text-emerald-200': [
      'delivered',
      'completed',
    ].includes(order.status),
    'border-brand-border bg-brand-black/40 text-brand-muted': ![
      'pending_verification',
      'pending-verification',
      'rejected',
      'processing',
      'shipped',
      'delivered',
      'completed',
    ].includes(order.status),
  }"
  x-text="{
    pending_verification: 'Pending Verification',
    'pending-verification': 'Pending Verification',
    rejected: 'Payment Rejected',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    completed: 'Completed',
  }[order.status] || order.status.replaceAll('_', ' ')"
></span>
                <p
                  class="mt-2 text-xs text-brand-muted"
                  x-text="new Date(order.created_at).toLocaleDateString('en-PH')"
                ></p>
                <p
                  class="mt-3 text-sm text-brand-cream"
                  x-text="'Items: ₱' + Number(order.subtotal).toLocaleString('en-PH', { minimumFractionDigits: 2 })"
                ></p>
                <p
                  x-show="order.delivery_fee === null"
                  class="mt-1 text-xs text-brand-muted"
                >
                  Delivery handled manually
                </p>
              </article>
            </template>
          </div>
        </section>
      </main>
    </div>

    <div
      x-show="previewNotice"
      x-transition
      class="fixed bottom-5 left-1/2 z-[70] w-[min(26rem,90%)] -translate-x-1/2 rounded-xl border border-brand-gold/35 bg-brand-panel px-4 py-3 text-center text-sm font-medium text-brand-cream shadow-2xl"
      role="status"
      x-text="previewNotice"
    ></div>

       ${renderCartDrawer()}

    ${renderProductDrawer()}

    ${renderCustomerSupportChat()}
  </div>
`

Alpine.start()
}

void startDashboard()
