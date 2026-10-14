import './style.css'

import Alpine from 'alpinejs'

import { supabase } from './lib/supabase.js'

import {
  bindFadeLinks,
  navigateWithFade,
} from './lib/page-transition.js'

import logoImage from './assets/logoyourproduct.webp'

import rewardJourneyImage from './assets/rewards/reward-journey.webp'

import starterPackageImage from './assets/starter.webp'
import builderPackageImage from './assets/builder.webp'
import leaderPackageImage from './assets/leader.webp'
import prestigePackageImage from './assets/prestige.webp'

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
  registerMemberReferralsPage,
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

const dashboardPageNames = [
  'general',
  'membershipApplication',
  'membershipPayment',
  'createOrder',
  'orderHistory',
  'earnings',
  'payoutRequest',
  'referrals',
  'points',
  'account',
]

const requestedDashboardPage =
  dashboardParams.get('page')?.trim() || ''

const initialDashboardPage =
  dashboardPageNames.includes(requestedDashboardPage)
    ? requestedDashboardPage
    : 'general'

const isApprovedMemberPreview =
  requestedMembershipStatus === 'active'

  const selectedDashboardPackage =
  packages.find(
    (packageItem) =>
      packageItem.id === requestedPackageId &&
    packageItem.isActive,
  ) || null

  const requestedPackageOptionId =
    dashboardParams.get('option')?.trim() || ''

  const selectedDashboardPackageOption =
    selectedDashboardPackage?.options?.find(
      (option) =>
        option.id === requestedPackageOptionId,
    ) || null

    const selectedMembershipPackageOption =
  selectedDashboardPackageOption
    ? {
        label: selectedDashboardPackageOption.label,
        title: selectedDashboardPackageOption.title,
        description: selectedDashboardPackageOption.description,
      }
    : null

  const allowedMembershipStatuses = [
  'awaiting-payment',
'pending-verification',
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

const selectedDashboardPackageInclusions =
  selectedMembershipPackageOption
    ? [
        selectedMembershipPackageOption.title,
        'Business Access',
      ]
    : selectedDashboardPackage?.inclusions || []

const membershipInclusionItems =
  selectedDashboardPackageInclusions
    .map(
      (inclusion) => `
        <li class="flex gap-3 text-sm leading-6 text-brand-muted">
          <span class="mt-2 size-1.5 shrink-0 rounded-full bg-brand-gold"></span>
          <span>${inclusion}</span>
        </li>
      `,
    )
    .join('')

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
  x-text="isMember ? 'Package Purchase' : 'Membership Application'"
></p>

              <span
                class="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-amber-300"
              >
                <span class="relative flex size-2" aria-hidden="true">
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

            <h2 class="mt-3 font-display text-3xl text-brand-cream">
              ${selectedDashboardPackage.name}
            </h2>

            <p
  class="mt-2 max-w-3xl text-sm leading-6 text-brand-muted"
  x-text="
    membershipApplicationStatus === 'cancellation-requested'
      ? 'Your cancellation request is waiting for admin review. Any applicable refund will be handled manually.'
      : membershipApplicationStatus === 'pending-verification'
        ? (
          isMember
            ? 'Your payment proof has been submitted and is now waiting for admin review. Your current membership remains active while this package is reviewed.'
            : 'Your payment proof has been submitted and is now waiting for admin review. Your membership remains inactive until approved.'
        )
        : (
          isMember
            ? 'Your current membership remains active. Continue to payment to submit this package purchase for admin verification.'
            : 'Your free customer account remains active. Continue to payment to submit your transaction details and payment proof for admin verification.'
        )
  "
></p>

            <div class="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-stretch">
              ${selectedMembershipPackageOption
                ? `
                  <div class="flex min-h-32 flex-col justify-center rounded-2xl border border-brand-border bg-brand-black/70 px-5 py-4">
                    <p class="text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold">
                      Selected Option · ${selectedMembershipPackageOption.label}
                    </p>
                    <p class="mt-2 text-base font-semibold text-brand-cream">
                      ${selectedMembershipPackageOption.title}
                    </p>
                    <p class="mt-1 text-xs leading-5 text-brand-muted">
                      ${selectedMembershipPackageOption.description}
                    </p>
                  </div>
                `
                : ''}

              <div class="flex min-h-32 flex-col justify-center rounded-2xl border border-brand-border bg-brand-black/70 px-5 py-4 lg:text-right">
                <p class="text-xs font-semibold uppercase tracking-[0.14em] text-brand-muted">
                  Selected Package
                </p>
                <p class="mt-3 font-display text-3xl text-brand-gold">
                  ${dashboardPesoFormatter.format(
                    selectedDashboardPackage.price,
                  )}
                </p>
              </div>
            </div>

            <div
              class="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <button
                type="button"
                class="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-brand-border px-6 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold sm:w-auto"
                @click="openPage('membershipApplication')"
              >
                <span x-text="isMember ? 'View Package Details' : 'View Application Details'"></span>
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
        </div>
      </section>
    `
: ''

const membershipUpgradeMarkup =
  !hasPendingMembership
    ? `
      <section
        x-data="{
          selectedPackageModal: null,
          selectedImagePreview: null,
          selectedStarterOption: '',
          packagePurchaseSubmitting: false,
          packages: {
            starter: {
              id: 'starter',
              name: 'Your Starter',
              label: 'Starter',
              price: '₱1,000',
              image: '${starterPackageImage}',
              description: 'Perfect for beginners who want to start small.',
              inclusions: [
  'Choose 1 starter option below',
  'Each perfume comes with its own box',
  '30% reseller pricing: ₱245 per perfume',
  '20 package points for incentives',
],
            },
            builder: {
              id: 'builder',
              name: 'Your Builder',
              label: 'Builder',
              price: '₱5,000',
              image: '${builderPackageImage}',
              description: 'Build today. A stronger tomorrow.',
              inclusions: [
  '25 assorted bottles, 85ml',
  'Each perfume comes with its own box',
  '1 tester kit',
  '35% reseller pricing: ₱227 per perfume',
  '125 package points for incentives',
],
            },
            leader: {
              id: 'leader',
              name: 'Your Leader',
              label: 'Leader',
              price: '₱10,000',
              image: '${leaderPackageImage}',
              description: 'Lead your way to greater success.',
              inclusions: [
  '55 assorted bottles, 85ml',
  'Each perfume comes with its own box',
  '1 tester kit',
  '1 tarpaulin',
  '40% reseller pricing: ₱209 per perfume',
  '250 package points for incentives',
],
            },
            prestige: {
  id: 'prestige',
  name: 'Your Prestige',
  label: 'Prestige',
  price: '₱50,000',
  image: '${prestigePackageImage}',
  description: 'Maximize today. Multiply tomorrow.',
  inclusions: [
  '240 assorted bottles, 85ml',
  'Each perfume comes with its own box',
  '2 tester kits',
  '1 tarpaulin',
  '1 mini stall',
  '50% reseller pricing: ₱175 per perfume',
  '1,200 package points for incentives',
],
},
          },
          openPackageModal(packageId) {
            this.selectedPackageModal = this.packages[packageId]
            this.selectedStarterOption = ''
            document.body.classList.add('overflow-hidden')

            requestAnimationFrame(() => {
              this.$refs.packageModalContent?.scrollTo?.({
                top: 0,
                behavior: 'auto',
              })
            })
          },
          closePackageModal() {
            this.selectedPackageModal = null
            this.selectedStarterOption = ''
            document.body.classList.remove('overflow-hidden')
          },

          openImagePreview(packageId) {
  this.selectedImagePreview = this.packages[packageId]
  document.body.classList.add('overflow-hidden')
},

closeImagePreview() {
  this.selectedImagePreview = null
  document.body.classList.remove('overflow-hidden')
},

          confirmPackageApplication() {
  if (this.packagePurchaseSubmitting) return
  if (!this.selectedPackageModal) return

  const packageId = this.selectedPackageModal.id

  if (packageId === 'starter' && !this.selectedStarterOption) return

  this.packagePurchaseSubmitting = true

  const optionQuery =
    packageId === 'starter'
      ? '&option=' + encodeURIComponent(this.selectedStarterOption)
      : ''

 const nextUrl =
  '/dashboard/?package=' +
  encodeURIComponent(packageId) +
  '&membership=awaiting-payment' +
  optionQuery +
  '&page=membershipApplication'

window.yourProductNavigateWithFade(nextUrl)

window.setTimeout(() => {
  window.location.href = nextUrl
}, 700)
},
        }"
        x-show="true"
x-transition.opacity
class="mt-6 relative isolate overflow-hidden rounded-[1.75rem] border border-brand-gold/35 bg-brand-charcoal p-4 shadow-panel sm:p-6"
>
  <div
    class="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-brand-gold/10 blur-3xl"
    aria-hidden="true"
  ></div>

  <div class="relative">
    <div class="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
      <div>
        <p
          class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
          x-text="isMember ? 'Member Packages' : 'Choose Your Package'"
        ></p>

        <h2
          class="mt-2 max-w-xl font-display text-3xl leading-tight text-brand-cream sm:text-4xl"
          x-text="isMember ? 'Upgrade or purchase another package.' : 'Start your reseller journey.'"
        ></h2>
      </div>

      <p
        class="max-w-2xl text-sm leading-6 text-brand-muted lg:justify-self-end lg:text-right"
        x-text="isMember
          ? 'Select a package to upgrade your tier or purchase another package. Your highest approved tier remains active.'
          : 'Choose from Starter, Builder, Leader, or Prestige. Your account stays free until payment is submitted and approved.'
        "
      ></p>
    </div>

    <div class="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <template x-for="packageItem in Object.values(packages)" :key="packageItem.id">
        <article
          class="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-brand-border bg-brand-black/80 text-left shadow-[0_18px_50px_rgb(74_57_27_/_0.08)] transition hover:-translate-y-1 hover:border-brand-gold/70 hover:shadow-gold-soft"
        >
          <button
            type="button"
            class="relative aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-brand-black"
            @click="openImagePreview(packageItem.id)"
            aria-label="Preview package image"
          >
            <img
              :src="packageItem.image"
              :alt="packageItem.name"
              class="size-full object-contain object-center p-2 transition duration-500 group-hover:scale-[1.02]"
              loading="lazy"
              decoding="async"
            >

            <span
              class="pointer-events-none absolute right-3 top-3 rounded-full border border-brand-gold/40 bg-black/60 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-brand-gold opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
            >
              Preview
            </span>
          </button>

          <div class="flex flex-1 flex-col p-4">
            <div>
              <p
                class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand-gold"
                x-text="packageItem.label"
              ></p>

              <div class="mt-1 flex items-start justify-between gap-3">
                <h3
                  class="font-display text-2xl leading-tight text-brand-cream"
                  x-text="packageItem.name"
                ></h3>

                <strong
                  class="shrink-0 font-display text-xl text-brand-gold"
                  x-text="packageItem.price"
                ></strong>
              </div>
            </div>

            <p
              class="mb-5 mt-3 text-sm leading-6 text-brand-muted"
              x-text="packageItem.description"
            ></p>

            <button
  type="button"
  class="premium-cta mt-auto inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand-gold px-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#17130d] transition hover:bg-brand-gold-light"
  @click="openPackageModal(packageItem.id)"
>
  View inclusions
</button>
          </div>
        </article>
      </template>
    </div>
  </div>
        <template x-teleport="body">
          <div
            x-show="selectedImagePreview"
            x-cloak
            class="fixed inset-0 z-[110] grid place-items-center bg-black/90 px-4 py-6 backdrop-blur-sm"
            @click.self="closeImagePreview()"
            @keydown.escape.window="closeImagePreview()"
          >
            <div class="relative w-full max-w-3xl rounded-[1.5rem] border border-brand-gold/30 bg-brand-panel p-4 shadow-gold-soft">
              <button
                type="button"
                class="absolute right-3 top-3 z-20 inline-flex size-9 items-center justify-center rounded-full bg-brand-black text-lg font-semibold leading-none text-brand-cream transition hover:text-brand-gold"
                @click="closeImagePreview()"
                aria-label="Close image preview"
              >
                X
              </button>

              <template x-if="selectedImagePreview">
                <img
                  :src="selectedImagePreview.image"
                  :alt="selectedImagePreview.name"
                  class="mx-auto max-h-[82vh] w-auto max-w-full rounded-xl object-contain"
                >
              </template>
            </div>
          </div>
        </template>

        <template x-teleport="body">
          <div
            x-show="selectedPackageModal"
            x-cloak
            class="fixed inset-0 z-[100] grid place-items-center bg-black/90 px-4 py-4 backdrop-blur-sm sm:px-6 lg:pl-[19.5rem]"
            @click.self="closePackageModal()"
            @keydown.escape.window="closePackageModal()"
          >
            <div class="relative w-full max-w-[1240px] overflow-hidden rounded-[1.5rem] border border-brand-gold/30 bg-brand-panel shadow-gold-soft">
              <button
                type="button"
                class="absolute right-3 top-3 z-20 inline-flex size-9 items-center justify-center rounded-full bg-brand-black text-lg font-semibold leading-none text-brand-cream transition hover:text-brand-gold"
                @click="closePackageModal()"
                aria-label="Close package details"
              >
                X
              </button>

              <template x-if="selectedPackageModal">
                <div
                  x-ref="packageModalContent"
                  class="max-h-[92vh] overflow-y-auto lg:h-[90vh] lg:max-h-none lg:overflow-hidden"
                >
                  <div class="grid lg:h-full lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">

                    <div class="flex max-h-[36vh] items-center justify-center bg-brand-black p-4 sm:p-6 lg:h-full lg:max-h-none lg:min-h-0">
                      <img
                        :src="selectedPackageModal.image"
                        :alt="selectedPackageModal.name"
                        class="max-h-[30vh] w-auto max-w-full rounded-xl object-contain lg:max-h-full lg:w-auto lg:max-w-full"
                      >
                    </div>

                    <div class="flex flex-col lg:h-full lg:min-h-0">
                      <div class="p-5 sm:p-6 lg:flex-1 lg:overflow-y-auto">
                        <div class="pr-10">
                          <p
                            class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand-gold"
                            x-text="selectedPackageModal.label"
                          ></p>

                          <div class="mt-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                            <h3
                              class="font-display text-3xl text-brand-cream"
                              x-text="selectedPackageModal.name"
                            ></h3>

                            <strong
                              class="font-display text-2xl text-brand-gold"
                              x-text="selectedPackageModal.price"
                            ></strong>
                          </div>

                          <p
                            class="mt-3 text-sm leading-6 text-brand-muted"
                            x-text="selectedPackageModal.description"
                          ></p>
                        </div>

                        <div class="mt-5 rounded-xl border border-brand-border bg-brand-black p-4">
                          <p class="text-sm font-semibold text-brand-cream">
                            Package inclusions
                          </p>

                          <ul class="mt-3 grid gap-x-6 gap-y-2 text-sm leading-6 text-brand-muted sm:grid-cols-2">
                            <template
                              x-for="inclusion in selectedPackageModal.inclusions"
                              :key="inclusion"
                            >
                              <li class="flex gap-2">
                                <span class="mt-2 size-1.5 shrink-0 rounded-full bg-brand-gold"></span>
                                <span x-text="inclusion"></span>
                              </li>
                            </template>
                          </ul>
                        </div>

                        <div
                          x-show="selectedPackageModal.id === 'starter'"
                          class="mt-5 rounded-xl border border-brand-gold/30 bg-brand-black p-4"
                        >
                          <p class="text-sm font-semibold text-brand-cream">
                            Choose Starter option
                          </p>

                          <div class="mt-3 grid gap-3 sm:grid-cols-2">
                            <label class="flex cursor-pointer items-start gap-3 rounded-xl border border-brand-border p-3 transition hover:border-brand-gold/60">
                              <input
                                type="radio"
                                name="starter-package-option"
                                value="starter-option-a"
                                x-model="selectedStarterOption"
                                class="mt-1 size-4 accent-[#b78a32]"
                              >
                              <span>
                                <span class="block text-sm font-semibold text-brand-cream">
                                  Option A: 4 Bottles
                                </span>
                                <span class="mt-1 block text-xs leading-5 text-brand-muted">
                                  4 assorted bottles, 60ml each.
                                </span>
                              </span>
                            </label>

                            <label class="flex cursor-pointer items-start gap-3 rounded-xl border border-brand-border p-3 transition hover:border-brand-gold/60">
                              <input
                                type="radio"
                                name="starter-package-option"
                                value="starter-option-b"
                                x-model="selectedStarterOption"
                                class="mt-1 size-4 accent-[#b78a32]"
                              >
                              <span>
                                <span class="block text-sm font-semibold text-brand-cream">
                                  Option B: Tester Kit + 2 Bottles
                                </span>
                                <span class="mt-1 block text-xs leading-5 text-brand-muted">
                                  1 Starter Tester Kit with 20 pcs 5ml testers + 2 Assorted Bottles 60ml each.
                                </span>
                              </span>
                            </label>
                          </div>
                        </div>

                        <div class="mt-5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3">
                          <p class="text-sm font-semibold text-amber-100">
  <span x-text="isMember ? 'Confirm package purchase?' : 'Confirm membership application?'"></span>
</p>

<p class="mt-1 text-xs leading-5 text-amber-100/80">
  <span
    x-text="isMember
      ? 'Selecting yes will start this package purchase. Payment still needs to be submitted and approved by admin.'
      : 'Selecting yes will start this package application. Payment still needs to be submitted and approved by admin.'
    "
  ></span>
</p>
                        </div>
                      </div>

                      <div class="grid gap-3 border-t border-brand-border p-5 sm:grid-cols-2 sm:p-6 lg:flex lg:justify-end">
                       <button
  type="button"
  class="inline-flex min-h-12 items-center justify-center rounded-full border border-brand-border px-6 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-50"
  :disabled="packagePurchaseSubmitting"
  @click="closePackageModal()"
>
  No, cancel
</button>

<button
  type="button"
  class="premium-cta inline-flex min-h-11 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-[#17130d] disabled:cursor-not-allowed disabled:opacity-50"
  :disabled="selectedPackageModal.id === 'starter' && !selectedStarterOption"
  @click="confirmPackageApplication()"
>
  <span x-text="isMember ? 'Yes, purchase package' : 'Yes, start application'"></span>
</button>
                      </div>
                    </div>

                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>

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
  x-text="isMember ? 'Package Purchase' : 'Membership Application'"
></p>

              <h1
  id="membership-application-title"
  class="mt-2 font-display text-4xl text-brand-cream sm:text-5xl"
  x-text="isMember ? 'Package details' : 'Application details'"
></h1>

              <p
  class="mt-3 max-w-2xl text-sm leading-7 text-brand-muted"
  x-text="isMember
    ? 'Review your selected package before submitting payment proof. Your current membership remains active while this package is reviewed.'
    : 'Review your selected package before submitting payment proof. This application is not final yet while it is still awaiting payment.'
  "
></p>
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

                ${selectedMembershipPackageOption
                  ? `
                    <div class="mt-4 rounded-xl border border-brand-gold/25 bg-brand-black/70 px-4 py-3">
                      <p class="text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold">
                       Selected option · ${selectedMembershipPackageOption.label}
                      </p>
                      <p class="mt-1 text-sm font-semibold text-brand-cream">
                        ${selectedMembershipPackageOption.title}
                      </p>
                      <p class="mt-1 text-xs leading-5 text-brand-muted">
                        ${selectedMembershipPackageOption.description}
                      </p>
                    </div>
                  `
                  : ''}

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
  x-text="isMember ? 'Package Status' : 'Application Status'"
></p>

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
                      : 'You can still cancel or change your package before submitting payment proof.'
                "
              ></p>
            </div>

            <div class="mt-5 border-t border-brand-border pt-5">
  <p
    class="text-xs font-semibold uppercase tracking-[0.14em] text-brand-muted"
    x-text="isMember ? 'Package Review' : 'Membership Activation'"
  ></p>

  <p
    class="mt-2 text-sm leading-6 text-brand-muted"
    x-text="isMember
      ? 'Your highest approved membership tier remains active. This package will be added after admin approval.'
      : 'Your account remains a free customer account until your payment proof is submitted, reviewed, and approved by the admin.'
    "
  ></p>
</div>

            <div
  x-show="
    membershipApplicationStatus === 'awaiting-payment'
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
    ? (isMember ? 'Cancel Package Purchase' : 'Cancel Application')
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
    ? (isMember ? 'Cancel unpaid package purchase' : 'Cancel unpaid application')
    : (isMember ? 'Request package cancellation' : 'Request application cancellation')
"
    ></p>

    <p
      class="mt-2 text-xs leading-5 text-brand-muted"
      x-text="
  membershipApplicationStatus === 'awaiting-payment'
    ? (
      isMember
        ? 'No payment proof has been submitted. This package purchase will be cancelled immediately.'
        : 'No payment proof has been submitted. This application will be cancelled immediately.'
    )
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

        <div class="mt-5 grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        class="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-brand-border px-5 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="cancellationSubmitting"
        @click="closeCancellationPanel()"
      >
        <span x-text="isMember ? 'Keep Package Purchase' : 'Keep Application'"></span>
      </button>

      <button
        type="button"
        class="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-red-700 px-5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        @click="submitCancellationRequest()"
        :disabled="cancellationSubmitting"
        x-text="
          cancellationSubmitting
            ? 'Processing...'
            : membershipApplicationStatus === 'awaiting-payment'
              ? (isMember ? 'Cancel Package Purchase' : 'Cancel Application')
              : 'Confirm Request'
        "
      ></button>
    </div>
  </div>
</div>

            <button
              x-show="
  membershipApplicationStatus === 'awaiting-payment' &&
  !cancellationPanelOpen
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
  class="rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6 lg:sticky lg:top-24 lg:self-start"
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

            ${selectedMembershipPackageOption
              ? `
                <div class="mt-4 rounded-xl border border-brand-gold/25 bg-brand-black/70 px-4 py-3">
                  <p class="text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold">
                    Selected option · ${selectedMembershipPackageOption.label}
                  </p>
                  <p class="mt-1 text-sm font-semibold text-brand-cream">
                    ${selectedMembershipPackageOption.title}
                  </p>
                  <p class="mt-1 text-xs leading-5 text-brand-muted">
                    ${selectedMembershipPackageOption.description}
                  </p>
                </div>
              `
              : ''}

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
  <p
    class="text-xs leading-5 text-amber-100"
    x-text="isMember
      ? 'Your current membership remains active while this package payment is reviewed.'
      : 'Membership remains inactive until the payment is reviewed and approved by the admin.'
    "
  ></p>
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
          GCash or Maya. Use the official company account provided by admin.
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
          Bank details pending. Official bank transfer details will be added after client confirmation.
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
            Official GCash / Maya Account
    </p>

    <p class="mt-2 text-sm leading-6 text-brand-muted">
      Official GCash or Maya account details will be provided by admin before payment.
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
           Bank Details Pending
    </p>

    <p class="mt-2 text-sm leading-6 text-brand-muted">
      Official bank name, account name, and account number will be added after client confirmation.
    </p>
    </div>

  <div class="mt-5">
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

  <section class="mt-6 rounded-2xl border border-brand-border bg-brand-black p-4">
    <p class="text-sm font-semibold text-brand-cream">
      Delivery details
    </p>

    <p class="mt-2 text-xs leading-5 text-brand-muted">
      Please complete the delivery address for your package inclusions before submitting payment proof.
    </p>

    <div class="mt-4 grid gap-4 sm:grid-cols-2">
      <input type="text" x-model.trim="membershipPaymentForm.deliveryDetails.recipientFirstName" placeholder="Recipient first name" maxlength="80" required class="h-12 rounded-xl border border-brand-border bg-brand-panel px-4 text-sm text-brand-cream outline-none focus:border-brand-gold">
      <input type="text" x-model.trim="membershipPaymentForm.deliveryDetails.recipientLastName" placeholder="Recipient last name" maxlength="80" required class="h-12 rounded-xl border border-brand-border bg-brand-panel px-4 text-sm text-brand-cream outline-none focus:border-brand-gold">
      <input type="tel" x-model.trim="membershipPaymentForm.deliveryDetails.recipientMobile" placeholder="Mobile number" maxlength="20" required class="h-12 rounded-xl border border-brand-border bg-brand-panel px-4 text-sm text-brand-cream outline-none focus:border-brand-gold sm:col-span-2">
      <input type="text" x-model.trim="membershipPaymentForm.deliveryDetails.province" placeholder="Province" maxlength="100" required class="h-12 rounded-xl border border-brand-border bg-brand-panel px-4 text-sm text-brand-cream outline-none focus:border-brand-gold">
      <input type="text" x-model.trim="membershipPaymentForm.deliveryDetails.city" placeholder="City / Municipality" maxlength="100" required class="h-12 rounded-xl border border-brand-border bg-brand-panel px-4 text-sm text-brand-cream outline-none focus:border-brand-gold">
      <input type="text" x-model.trim="membershipPaymentForm.deliveryDetails.barangay" placeholder="Barangay" maxlength="100" required class="h-12 rounded-xl border border-brand-border bg-brand-panel px-4 text-sm text-brand-cream outline-none focus:border-brand-gold sm:col-span-2">
      <input type="text" x-model.trim="membershipPaymentForm.deliveryDetails.houseStreet" placeholder="House no. and street" maxlength="180" required class="h-12 rounded-xl border border-brand-border bg-brand-panel px-4 text-sm text-brand-cream outline-none focus:border-brand-gold sm:col-span-2">
      <input type="text" x-model.trim="membershipPaymentForm.deliveryDetails.landmark" placeholder="Landmark optional" maxlength="180" class="h-12 rounded-xl border border-brand-border bg-brand-panel px-4 text-sm text-brand-cream outline-none focus:border-brand-gold sm:col-span-2">
    </div>
  </section>

  <div class="mt-5">

    <label
  for="membership-payment-proof"
  class="mt-2 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-brand-border bg-brand-black px-5 py-6 text-center transition hover:border-brand-gold"
>
  <div
    x-show="membershipPaymentForm.proofPreviewUrl"
    x-transition
    class="w-full overflow-hidden rounded-xl border border-brand-border bg-brand-panel p-2"
  >
    <img
      :src="membershipPaymentForm.proofPreviewUrl"
      alt="Selected payment screenshot preview"
      class="mx-auto max-h-56 w-full rounded-lg object-contain"
    >
  </div>

  <span
    class="premium-cta mt-4 inline-flex min-h-10 w-full max-w-xs items-center justify-center rounded-full bg-brand-gold px-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#17130d] transition hover:bg-brand-gold-light"
    x-text="membershipPaymentForm.proofPreviewUrl ? 'Change Payment Screenshot' : 'Upload Payment Screenshot'"
  ></span>

  <span
    class="mt-2 text-xs leading-5 text-brand-muted"
  >
    JPG, PNG, or WebP only. Maximum file size is 5 MB.
  </span>

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

  <div class="mt-5 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3">
    <p class="text-xs leading-5 text-amber-100">
      Submit payment proof only after sending payment. After proof is submitted, cancellation requests must be reviewed by admin.
    </p>
  </div>

  <label
    class="mt-5 mb-4 flex cursor-pointer items-start gap-3"
  >
    <input
      type="checkbox"
      x-model="membershipPaymentForm.acceptedConfirmation"
      class="mt-1 size-4 shrink-0 accent-brand-gold"
      required
    >

    <span class="text-xs leading-5 text-brand-muted">
      I confirm that I already sent the payment and the uploaded screenshot is correct.
    </span>
  </label>

  <p
    x-show="membershipPaymentError"
    x-text="membershipPaymentError"
    class="mt-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-900"
    role="alert"
  ></p>

   <div
  id="membership-payment-status"
  x-show="membershipPaymentSubmitted"
  x-transition
  class="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/20 px-5 py-4"
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
          : 'Submit Payment Proof for Review'
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

<div
  class="mt-3 border-t border-brand-border pt-3"
>
  <p class="px-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-muted">
    Member Resources
  </p>

  <a
    href="/university/?from=dashboard"
    class="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-brand-cream transition hover:bg-brand-charcoal hover:text-brand-gold"
  >
    <span>Your University</span>
  </a>

  <a
    href="/videos/?from=dashboard"
    class="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-brand-cream transition hover:bg-brand-charcoal hover:text-brand-gold"
  >
    <span>YP Videos</span>
  </a>

  <a
  href="/business-center/?from=dashboard"
  class="mt-1 flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-brand-cream transition hover:bg-brand-charcoal hover:text-brand-gold"
>
  <span>Business Center</span>
  <small class="rounded-full border border-brand-gold/30 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-brand-gold">
    Soon
  </small>
</a>
</div>

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
  class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand-gold"
  x-text="[profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Customer'"
></p>

<p
  class="mt-2 text-sm font-semibold text-brand-cream"
  x-text="isMember ? '${previewAccount.membershipLabel}' : 'Free Customer'"
></p>

<p
  class="mt-3 truncate text-xs text-brand-muted"
  x-text="profile.email || ''"
></p>

<button
  type="button"
  class="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-brand-border px-4 text-xs font-semibold text-brand-cream transition hover:border-red-400/60 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
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
      d="M10 17l5-5-5-5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>

    <path
      d="M15 12H3"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>

    <path
      d="M21 4v16"
      stroke-linecap="round"
    ></path>
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
window.yourProductNavigateWithFade = navigateWithFade
registerCustomerSupportChat(Alpine)
registerMemberPointsPage(Alpine)
registerMemberReferralCard(Alpine, {
  referralCode: previewAccount.referralCode,
  memberName:
    `${previewAccount.firstName} ${previewAccount.lastName}`,
})

registerMemberReferralsPage(Alpine)

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
let signedInMembershipPackages = []
let signedInMembershipPackagesError = false
let signedInMembershipCelebration = null

Alpine.data('customerPortal', () => ({
  activePage:
  (
    initialDashboardPage === 'membershipApplication' ||
    initialDashboardPage === 'membershipPayment'
  ) &&
  !hasPendingMembership
    ? 'general'
    : initialDashboardPage,
  profile: signedInProfile,
  orders: signedInOrders,
  ordersError: signedInOrdersError,
  packagePurchaseSubmitting: false,
  membershipPackages: signedInMembershipPackages,
  membershipPackagesError: signedInMembershipPackagesError,
  membershipCelebration: signedInMembershipCelebration,
  membershipCelebrationOpen: Boolean(signedInMembershipCelebration),
  isMember: signedInProfile.membership_status === 'active',
  hasPendingMembership,
  selectedPackage: selectedDashboardPackage,
  activeCategory: 'all',
  productSearch: '',
  membershipPaymentForm: {
    paymentMethod: '',
    senderName: '',
    proofFile: null,
    proofFileName: '',
    proofPreviewUrl: '',
    acceptedConfirmation: false,
    deliveryDetails: {
      recipientFirstName: signedInProfile.first_name ?? '',
      recipientLastName: signedInProfile.last_name ?? '',
      recipientMobile: signedInProfile.mobile_number ?? '',
      province: '',
      city: '',
      barangay: '',
      houseStreet: '',
      landmark: '',
    },
  },

  membershipPaymentsReady: true,
  membershipPaymentSubmitting: false,
  membershipPaymentSubmissionUncertain: false,

  membershipPaymentError: '',
  membershipPaymentTested: false,
  membershipPaymentSubmitted: false,
  membershipPaymentConfirmOpen: false,
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
defaultAddressEnabled: Boolean(signedInProfile.default_address_enabled),

  profileForm: {
    firstName: signedInProfile.first_name ?? '',
    lastName: signedInProfile.last_name ?? '',
    emailAddress: signedInProfile.email ?? '',
    mobileNumber: signedInProfile.mobile_number ?? '',

    address: {
      province: signedInProfile.default_province ?? '',
      cityMunicipality: signedInProfile.default_city_municipality ?? '',
      barangay: signedInProfile.default_barangay ?? '',
      houseStreet: signedInProfile.default_house_street ?? '',
      landmark: signedInProfile.default_landmark ?? '',
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
  
    window.addEventListener('popstate', () => {
      const nextParams = new URLSearchParams(
        window.location.search,
      )
  
      const nextPage = nextParams.get('page')?.trim() || 'general'
  
      this.activePage = dashboardPageNames.includes(nextPage)
        ? nextPage
        : 'general'
  
      this.profileFormTested = false
      this.closeMobileMenu()
  
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
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
  
      navigateWithFade('/login/')
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
  
  formatMoney(value) {
    return dashboardPesoFormatter.format(Number(value || 0))
  },
  
  openPage(pageName) {
    if (!dashboardPageNames.includes(pageName)) return
  
    this.activePage = pageName
    this.profileFormTested = false
    this.closeMobileMenu()
  
    const nextUrl = new URL(window.location.href)
  
    if (pageName === 'general') {
      nextUrl.searchParams.delete('page')
    } else {
      nextUrl.searchParams.set('page', pageName)
    }
  
    window.history.pushState(
      { page: pageName },
      '',
      nextUrl,
    )
  
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  },
  
  closeMembershipCelebration() {
    if (this.membershipCelebration?.storageKey) {
      localStorage.setItem(
        this.membershipCelebration.storageKey,
        'seen',
      )
    }
  
    this.membershipCelebrationOpen = false
  },
  
  viewMembershipCelebrationHistory() {
    this.closeMembershipCelebration()
    this.openPage('orderHistory')
  
    window.setTimeout(() => {
      document
        .querySelector('#membership-package-records-title')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
    }, 150)
  },

  async savePersonalInfo() {
    if (this.isSavingProfile) return

    this.profileFormTested = false
    this.profileFormError = ''

    const firstName = this.profileForm.firstName.trim()
    const lastName = this.profileForm.lastName.trim()
    const mobileNumber = this.profileForm.mobileNumber.trim()

    const defaultAddressEnabled = Boolean(this.defaultAddressEnabled)
const address = this.profileForm.address

const defaultProvince = defaultAddressEnabled
  ? address.province.trim()
  : null
const defaultCityMunicipality = defaultAddressEnabled
  ? address.cityMunicipality.trim()
  : null
const defaultBarangay = defaultAddressEnabled
  ? address.barangay.trim()
  : null
const defaultHouseStreet = defaultAddressEnabled
  ? address.houseStreet.trim()
  : null
const defaultLandmark = defaultAddressEnabled
  ? address.landmark.trim()
  : null

    if (!firstName || !lastName || !mobileNumber) {
      this.profileFormError =
        'Enter your first name, last name, and mobile number.'
      return
    }

    if (
      defaultAddressEnabled &&
      (
        !defaultProvince ||
        !defaultCityMunicipality ||
        !defaultBarangay ||
        !defaultHouseStreet
      )
    ) {
      this.profileFormError =
        'Complete your default address or turn it off before saving.'
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
    default_address_enabled: defaultAddressEnabled,
    default_province: defaultProvince,
    default_city_municipality: defaultCityMunicipality,
    default_barangay: defaultBarangay,
    default_house_street: defaultHouseStreet,
    default_landmark: defaultLandmark,
  })
  .eq('id', user.id)
  .select(
    'first_name, last_name, mobile_number, default_address_enabled, default_province, default_city_municipality, default_barangay, default_house_street, default_landmark',
  )
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

  async testMembershipPayment(confirmed = false) {
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
    const proofFile = payment.proofFile
    const deliveryDetails = {
  recipientFirstName: payment.deliveryDetails.recipientFirstName.trim(),
  recipientLastName: payment.deliveryDetails.recipientLastName.trim(),
  recipientMobile: payment.deliveryDetails.recipientMobile.trim(),
  province: payment.deliveryDetails.province.trim(),
  city: payment.deliveryDetails.city.trim(),
  barangay: payment.deliveryDetails.barangay.trim(),
  houseStreet: payment.deliveryDetails.houseStreet.trim(),
  landmark: payment.deliveryDetails.landmark.trim(),
}

    const allowedTypes = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    }

    if (!['e-wallet', 'bank-transfer'].includes(payment.paymentMethod)) {
      this.membershipPaymentError = 'Select a payment method.'
      return
    }

    if (!senderName || senderName.length > 120) {
      this.membershipPaymentError =
        'Enter the sender or account name used for payment.'
      return
    }

    if (
      !deliveryDetails.recipientFirstName ||
      !deliveryDetails.recipientLastName ||
      !deliveryDetails.recipientMobile ||
      !deliveryDetails.province ||
      !deliveryDetails.city ||
      !deliveryDetails.barangay ||
      !deliveryDetails.houseStreet
    ) {
      this.membershipPaymentError =
        'Complete the delivery name, mobile number, and address.'
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
        'Confirm that you already sent the payment and the screenshot is correct.'
      return
    }

    if (!confirmed) {
      this.membershipPaymentConfirmOpen = true
      return
    }
    
    this.membershipPaymentConfirmOpen = false

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
            p_proof_path: proofPath,
            p_proof_file_name: proofFile.name,
            p_delivery_details: deliveryDetails,
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
      requestAnimationFrame(() => {
        document
          .querySelector('#membership-payment-status')
          ?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
      })
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
        window.yourProductNavigateWithFade('/dashboard/')
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
      console.error('Unable to cancel package or membership application:', error)
      this.cancellationError =
        'Could not confirm cancellation. Refresh to check the package or application status.'
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
      'id, first_name, last_name, email, mobile_number, username, customer_type, membership_status, selected_package_id, role, account_status, default_address_enabled, default_province, default_city_municipality, default_barangay, default_house_street, default_landmark',
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
  ]

let { data: membershipApplication, error: membershipError } =
  await supabase
    .from('membership_applications')
    .select('package_id, selected_package_option_id, status')
    .eq('customer_id', user.id)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .maybeSingle()

const hasExistingOpenApplication =
  membershipApplication &&
  openApplicationStatuses.includes(membershipApplication.status)

  const canStartPackageApplication =
  profile.membership_status === 'none' ||
  profile.membership_status === 'active'

const shouldCreateApplication =
  !membershipError &&
  !hasExistingOpenApplication &&
  requestedMembershipStatus === 'awaiting-payment' &&
  Boolean(selectedDashboardPackage) &&
  canStartPackageApplication

  if (shouldCreateApplication) {
    const { data: restartedApplication, error: restartError } =
      await supabase
        .rpc('restart_membership_application', {
          p_package_id: selectedDashboardPackage.id,
          p_selected_package_option_id:
            selectedDashboardPackageOption?.id || null,
          p_amount: selectedDashboardPackage.price,
        })
        .maybeSingle()
  
    membershipApplication = restartedApplication
    membershipError = restartError
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

if (
  membershipApplication?.selected_package_option_id &&
  !requestedPackageOptionId &&
  selectedDashboardPackage?.id === membershipApplication.package_id
) {
  const nextParams = new URLSearchParams(window.location.search)

  nextParams.set(
    'option',
    membershipApplication.selected_package_option_id,
  )

  window.location.replace(
    window.location.pathname + '?' + nextParams.toString(),
  )
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
    dashboardUrl.searchParams.set('page', 'membershipApplication')
  } else {
    dashboardUrl.searchParams.delete('membership')
    dashboardUrl.searchParams.delete('package')
    dashboardUrl.searchParams.delete('option')
    dashboardUrl.searchParams.delete('page')
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
  profile.membership_status === 'active' &&
  [
    'starter',
    'builder',
    'leader',
    'prestige',
  ].includes(profile.selected_package_id)
) {
  dashboardPricingType = profile.selected_package_id
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
    .select('id, status, subtotal, delivery_fee, delivery_details, admin_note, reviewed_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

    const orderIds = (orderRows ?? []).map((order) => order.id)
    let pointsByOrderId = new Map()
    let signedInPointsBalance = 0
    let hasConfirmedMembershipPoints = false
    let signedInDirectReferrals = 0

if (orderIds.length > 0) {
  const { data: pointRows, error: pointsError } = await supabase
    .from('points_transactions')
    .select('order_id, points')
    .in('order_id', orderIds)
    .eq('type', 'order_award')
    .eq('status', 'confirmed')

  if (pointsError) {
    console.error('Unable to load order points:', pointsError)
  } else {
    const confirmedPointRows = pointRows ?? []

    pointsByOrderId = new Map(
      confirmedPointRows.map((row) => [
        row.order_id,
        Number(row.points || 0),
      ]),
    )
  }
}

const { data: balancePointRows, error: balancePointsError } =
  await supabase
    .from('points_transactions')
    .select('points, type')
    .eq('customer_id', user.id)
    .eq('status', 'confirmed')

if (balancePointsError) {
  console.error('Unable to load points balance:', balancePointsError)
} else {
  const confirmedBalanceRows = balancePointRows ?? []

hasConfirmedMembershipPoints = confirmedBalanceRows.some(
  (row) => row.type === 'membership_award',
)

signedInPointsBalance = confirmedBalanceRows.reduce(
  (total, row) => total + Number(row.points || 0),
  0,
)
}

const { data: directReferralRows, error: directReferralsError } =
  await supabase
    .from('referral_commissions')
    .select('id')
    .eq('referrer_customer_id', user.id)

if (directReferralsError) {
  console.error('Unable to load direct referral count:', directReferralsError)
} else {
  signedInDirectReferrals = directReferralRows?.length || 0
}

  signedInOrders = (orderRows ?? []).map((order) => ({
    ...order,
    pointsAwarded: pointsByOrderId.get(order.id) ?? 0,
  }))
  signedInOrdersError = Boolean(ordersError)

  const {
    data: membershipPackageRows,
    error: membershipPackagesError,
  } = await supabase
    .from('membership_applications')
    .select(`
      id,
      package_id,
      selected_package_option_id,
      status,
      fulfillment_status,
      package_allocation,
      package_inventory_deducted,
      submitted_at,
      approved_at,
      membership_activated_at,
      updated_at
    `)
    .eq('customer_id', user.id)
    .in('status', ['awaiting-payment', 'pending-review', 'approved'])
    .order('submitted_at', { ascending: false })
  
  signedInMembershipPackages = (membershipPackageRows ?? []).map(
    (application) => {
      const packageItem = packages.find(
        (packageInfo) => packageInfo.id === application.package_id,
      )
  
      const packageOption =
        packageItem?.options?.find(
          (option) =>
            option.id === application.selected_package_option_id,
        ) || null
  
      return {
        ...application,
        package: packageItem || null,
        packageOption,
        packageName:
          packageItem?.name ||
          application.package_id ||
          'Membership Package',
        packageQuantity:
          packageOption?.productQuantity ??
          packageItem?.productQuantity ??
          0,
        packageInclusions:
          packageItem?.inclusions || [],
        fixedInventoryItems:
          packageOption?.fixedInventoryItems ??
          packageItem?.fixedInventoryItems ??
          [],
        packageAllocation: Array.isArray(
          application.package_allocation,
        )
          ? application.package_allocation
          : [],
      }
    },
  )

  const packageTierValue = {
    starter: 1,
    builder: 2,
    leader: 3,
    prestige: 4,
  }
  
  const packageDiscountLabel = {
    starter: '30% off per bottle',
    builder: '35% off per bottle',
    leader: '40% off per bottle',
    prestige: '50% off per bottle',
  }
  
  const approvedMembershipRows = [...signedInMembershipPackages]
    .filter((application) => application.status === 'approved')
    .sort(
      (a, b) =>
        new Date(b.approved_at || b.membership_activated_at || b.updated_at || b.submitted_at) -
        new Date(a.approved_at || a.membership_activated_at || a.updated_at || a.submitted_at),
    )
  
  const latestApprovedMembership = approvedMembershipRows[0] || null

  const activeMembershipLabelByPackage = {
    starter: 'Starter Member',
    builder: 'Builder Member',
    leader: 'Leader Member',
    prestige: 'Prestige Member',
  }
  
  const activeMembershipLabel =
    signedInProfile?.membership_status === 'active' &&
    activeMembershipLabelByPackage[signedInProfile?.selected_package_id]
      ? activeMembershipLabelByPackage[signedInProfile.selected_package_id]
      : signedInProfile?.membership_status === 'active'
        ? 'Member Account'
        : 'Free Customer'

  const approvedMembershipPointsBalance =
  approvedMembershipRows.reduce(
    (total, application) =>
      total + Number(application.package?.pointsReward || 0),
    0,
  )

if (
  !hasConfirmedMembershipPoints &&
  approvedMembershipPointsBalance > 0
) {
  signedInPointsBalance += approvedMembershipPointsBalance
}
  
  if (latestApprovedMembership) {
    const storageKey =
      'your-product-seen-membership-award-' +
      latestApprovedMembership.id
  
    const celebrationAlreadySeen =
      localStorage.getItem(storageKey) === 'seen'
  
    if (!celebrationAlreadySeen) {
      const latestPackageId = latestApprovedMembership.package?.id
      const latestPackageTier = packageTierValue[latestPackageId] || 0
  
      const highestPackage =
        approvedMembershipRows.reduce((highest, application) => {
          const currentTier =
            packageTierValue[application.package?.id] || 0
          const highestTier =
            packageTierValue[highest?.package?.id] || 0
  
          return currentTier > highestTier ? application : highest
        }, latestApprovedMembership)
  
      const highestPackageId = highestPackage?.package?.id
      const highestPackageName =
        highestPackage?.packageName ||
        'your active membership'
  
      const hasPreviousApprovedPackage =
        approvedMembershipRows.length > 1
  
      const previousHighestTier = approvedMembershipRows
        .filter(
          (application) =>
            application.id !== latestApprovedMembership.id,
        )
        .reduce((highestTier, application) => {
          const currentTier =
            packageTierValue[application.package?.id] || 0
  
          return Math.max(highestTier, currentTier)
        }, 0)
  
      const isFirstMembership = !hasPreviousApprovedPackage
      const isUpgrade =
        hasPreviousApprovedPackage &&
        latestPackageTier > previousHighestTier
      const isRepeatOrLower =
        hasPreviousApprovedPackage && !isUpgrade
  
        signedInMembershipCelebration = {
          storageKey,
          eyebrow: isRepeatOrLower
            ? 'Package Approved'
            : 'Reward Unlocked',
          title: isFirstMembership
          ? 'Congratulations!'
          : isUpgrade
            ? 'Package upgrade approved!'
            : 'Package approved!',
        headline: isFirstMembership
          ? `${latestApprovedMembership.packageName} membership is approved.`
          : isUpgrade
            ? `${latestApprovedMembership.packageName} upgrade is approved.`
            : `${latestApprovedMembership.packageName} package purchase is approved.`,
        points:
          latestApprovedMembership.package?.pointsReward ||
          0,
        message: isFirstMembership
          ? `Member discount unlocked: ${packageDiscountLabel[latestPackageId] || latestApprovedMembership.package?.discountLabel || 'member pricing'}.`
          : isUpgrade
            ? `New member discount unlocked: ${packageDiscountLabel[latestPackageId] || latestApprovedMembership.package?.discountLabel || 'member pricing'}.`
            : `Your ${highestPackageName} discount remains active.`,
      }
    }
  }
  
  signedInMembershipPackagesError = Boolean(membershipPackagesError)
  
  if (membershipPackagesError) {
    console.error(
      'Unable to load membership packages:',
      membershipPackagesError,
    )
  }

  previewAccount.pointsBalance = signedInPointsBalance
  previewAccount.directReferrals = signedInDirectReferrals
  previewAccount.membershipLabel = activeMembershipLabel

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
                class="block max-w-full break-all italic text-brand-gold sm:inline"
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
                  x-text="profile.customer_type === 'member' ? '${previewAccount.membershipLabel}' : 'Free Customer'"
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
  x-data="{ rewardJourneyZoomOpen: false }"
  x-show="isMember"
  x-transition.opacity
  class="min-w-0 overflow-hidden rounded-[1.5rem] border border-brand-border bg-brand-panel p-4 shadow-panel sm:p-6"
>
            <button
              type="button"
              class="block w-full max-w-full overflow-hidden rounded-2xl border border-brand-border bg-brand-black/70 p-2 transition hover:border-brand-gold/60"
              aria-label="Open reward journey image"
              @click="rewardJourneyZoomOpen = true"
            >
              <img
                src="${rewardJourneyImage}"
                alt="YOUR PRODUCT reward journey"
                class="mx-auto block h-auto max-h-[34rem] w-full max-w-full rounded-xl object-contain"
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
          class="min-w-0 overflow-hidden rounded-[1.5rem] border border-brand-border bg-brand-panel p-4 shadow-panel sm:p-6"
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
                class="grid min-w-0 gap-1 py-3 first:pt-0 sm:flex sm:items-center sm:justify-between sm:gap-4"
              >
                <dt class="text-sm text-brand-muted">
                  Customer Name
                </dt>

                <dd
  class="min-w-0 break-words text-left text-sm font-semibold text-brand-cream sm:text-right"
  x-text="[profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Customer'"
></dd>
              </div>

              <div
                class="grid min-w-0 gap-1 py-3 sm:flex sm:items-center sm:justify-between sm:gap-4"
              >
                <dt class="text-sm text-brand-muted">
                  Email
                </dt>

                <dd
  class="min-w-0 break-all text-left text-sm font-semibold text-brand-cream sm:max-w-44 sm:truncate sm:text-right"
  x-text="profile.email || ''"
></dd>
              </div>

              <div
                class="grid min-w-0 gap-1 py-3 sm:flex sm:items-center sm:justify-between sm:gap-4"
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
                class="grid min-w-0 gap-1 py-3 last:pb-0 sm:flex sm:items-center sm:justify-between sm:gap-4"
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

            <div
              class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
            >
              <button
                type="button"
                class="text-left text-sm font-semibold text-brand-gold transition hover:text-brand-gold-light"
                @click="openPage('points')"
              >
                View Points & Rewards
              </button>

              <button
                type="button"
                class="text-left text-sm font-semibold text-brand-gold transition hover:text-brand-gold-light"
                @click="openPage('orderHistory')"
              >
                View Order History
              </button>
            </div>
          </div>

          <div
  x-show="ordersError"
  class="mt-6 rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-4 text-sm text-red-200"
>
  Unable to load recent orders. Please refresh this page.
</div>

<div
  x-show="!ordersError && orders.length === 0"
  class="mt-6 rounded-2xl border border-dashed border-brand-border bg-brand-black px-5 py-10 text-center"
>
  <span class="mx-auto grid size-12 place-items-center rounded-full bg-brand-charcoal text-brand-gold">
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
      <circle cx="10" cy="19" r="1" />
      <circle cx="17" cy="19" r="1" />
    </svg>
  </span>

  <h3 class="mt-4 font-display text-2xl text-brand-cream">
    No Orders Yet
  </h3>

  <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted">
    Your latest submitted orders will appear here.
  </p>
</div>

<div
  x-show="!ordersError && orders.length > 0"
  class="mt-6 grid gap-3"
>
  <template
    x-for="order in orders.slice(0, 3)"
    :key="order.id"
  >
    <article class="rounded-2xl border border-brand-border bg-brand-black p-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p
            class="text-sm font-semibold text-brand-cream"
            x-text="'Order ' + order.id.slice(0, 8).toUpperCase()"
          ></p>

          <p
            class="mt-1 text-xs text-brand-muted"
            x-text="new Date(order.created_at).toLocaleDateString('en-PH')"
          ></p>
        </div>

        <span
  class="shrink-0 rounded-full border px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.08em]"
  :class="{
    'border-amber-300/40 bg-amber-400/10 text-amber-200': ['pending', 'pending_verification', 'pending-verification'].includes(order.status),
    'border-sky-300/40 bg-sky-400/10 text-sky-200': order.status === 'processing',
    'border-blue-300/40 bg-blue-400/10 text-blue-200': order.status === 'shipped',
    'border-emerald-300/40 bg-emerald-400/10 text-emerald-200': order.status === 'delivered',
    'border-red-300/40 bg-red-400/10 text-red-200': order.status === 'rejected',
    'border-brand-border text-brand-muted': !['pending', 'pending_verification', 'pending-verification', 'processing', 'shipped', 'delivered', 'rejected'].includes(order.status),
  }"
  x-text="{
    pending: 'Pending',
    pending_verification: 'Pending Verification',
    'pending-verification': 'Pending Verification',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    rejected: 'Payment Rejected',
  }[order.status] || order.status"
></span>
      </div>

      <div
  class="mt-3 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3"
>
        <p class="text-xs font-semibold uppercase tracking-[0.12em] text-red-200">
          Admin note
        </p>
        <p
          class="mt-1 text-sm leading-6 text-red-100"
          x-text="'DEBUG NOTE: ' + (order.admin_note || 'NO ADMIN NOTE IN CUSTOMER DATA')"
        ></p>
      </div>

      <p
        class="mt-3 text-sm text-brand-cream"
        x-text="'Items: ' + formatMoney(order.subtotal)"
      ></p>

      <p
        x-show="Number(order.pointsAwarded || 0) > 0"
        class="mt-2 inline-flex rounded-full border border-brand-gold/35 bg-brand-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-brand-gold"
        x-text="'+' + Number(order.pointsAwarded || 0).toLocaleString('en-PH') + ' points earned'"
      ></p>

      <p
        x-show="order.delivery_details?.fulfillmentType === 'pickup'"
        class="mt-2 text-xs text-brand-muted"
      >
        Pickup at 1244 Gen. Jacinto St, Makati City, Metro Manila
      </p>

      <p
        x-show="order.delivery_details?.fulfillmentType !== 'pickup' && order.delivery_fee === null"
        class="mt-2 text-xs text-brand-muted"
      >
        Delivery handled manually
      </p>

      <p
        x-show="order.delivery_details?.fulfillmentType !== 'pickup' && order.delivery_fee !== null"
        class="mt-2 text-xs text-brand-muted"
        x-text="'Delivery fee: ' + formatMoney(order.delivery_fee)"
      ></p>

        </article>
        </template>
       </div>
        </section>
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

              <div class="mt-4 rounded-2xl border border-brand-border bg-brand-black/40 p-4">
  <label class="flex items-start justify-between gap-4">
    <span>
      <span class="block text-sm font-semibold text-brand-cream">
        Save a default address
      </span>
      <span class="mt-1 block text-xs leading-5 text-brand-muted">
        Optional. Keep this off if you prefer to fill delivery details during checkout.
      </span>
    </span>

    <input
      type="checkbox"
      x-model="defaultAddressEnabled"
      class="mt-1 size-5 rounded border-brand-border bg-brand-black text-brand-gold focus:ring-brand-gold/30"
    >
  </label>
</div>

<p
  x-show="!defaultAddressEnabled"
  class="mt-4 rounded-xl border border-brand-border bg-brand-black/30 px-4 py-3 text-sm leading-6 text-brand-muted"
>
  No default address saved. You can enter delivery details during checkout.
</p>

              <div
  x-show="defaultAddressEnabled"
  x-transition.opacity
  class="mt-6 grid gap-5 sm:grid-cols-2"
>
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
                    Saves your first name, last name, mobile number, and optional default address.
Email is not changed.
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
            class="mt-6 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4"
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
    <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
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
    <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
      Pending Verification
    </p>

    <strong
      class="mt-3 block font-display text-4xl text-brand-cream"
      x-text="ordersError ? '—' : orders.filter(order => ['pending', 'pending_verification', 'pending-verification'].includes(order.status)).length"
    ></strong>
  </article>

  <article
    class="rounded-[1.35rem] border border-brand-border bg-brand-panel p-5 shadow-panel"
  >
    <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
      Completed
    </p>

    <strong
      class="mt-3 block font-display text-4xl text-brand-cream"
      x-text="ordersError ? '—' : orders.filter(order => order.status === 'delivered').length"
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
              <article class="relative rounded-2xl border border-brand-border bg-brand-panel p-5">
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
                  x-show="Number(order.pointsAwarded || 0) > 0"
                  class="mt-2 inline-flex rounded-full border border-brand-gold/35 bg-brand-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-brand-gold"
                  x-text="'+' + Number(order.pointsAwarded || 0).toLocaleString('en-PH') + ' points earned'"
                ></p>

                <p
  x-show="order.delivery_details?.fulfillmentType === 'pickup'"
  class="mt-1 text-xs text-brand-muted"
>
  Pickup at 1244 Gen. Jacinto St, Makati City, Metro Manila
</p>

<p
  x-show="order.delivery_details?.fulfillmentType !== 'pickup' && order.delivery_fee === null"
  class="mt-1 text-xs text-brand-muted"
>
  Delivery handled manually
</p>

<p
  x-show="order.delivery_details?.fulfillmentType !== 'pickup' && order.delivery_fee !== null"
  class="mt-1 text-xs text-brand-muted"
  x-text="'Delivery fee: ' + formatMoney(order.delivery_fee)"
></p>

<div
  x-show="order.admin_note"
  class="mt-3 rounded-xl border border-red-400/25 bg-red-400/5 px-4 py-3 md:absolute md:right-5 md:top-5 md:mt-0 md:w-[240px] md:px-3 md:py-2.5"
>
  <div class="flex items-start gap-3">
    <span
      class="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-red-300/40 text-[0.65rem] font-bold text-red-200 md:size-4 md:text-[0.55rem]"
      aria-hidden="true"
    >
      !
    </span>

    <div>
      <p class="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-red-200">
        Payment note
      </p>
      <p
        class="mt-1 text-sm leading-6 text-brand-cream md:text-xs md:leading-5"
        x-text="order.admin_note"
      ></p>
    </div>
  </div>
</div>
              </article>
            </template>
          </div>

          <section
  x-show="!membershipPackagesError && membershipPackages.length > 0"
  x-transition.opacity
  class="mt-6 rounded-[1.5rem] border border-brand-gold/30 bg-brand-panel p-5 shadow-panel sm:p-6"
  aria-labelledby="membership-package-records-title"
>
  <div
    class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
  >
    <div>
      <p
        class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
      >
        Membership Packages
      </p>

      <h2
        id="membership-package-records-title"
        class="mt-1 font-display text-3xl text-brand-cream"
      >
        Package records
      </h2>
    </div>

    <span class="text-xs leading-5 text-brand-muted">
      Company-assorted package contents
    </span>
  </div>

  <div class="mt-6 space-y-3">
    <template
      x-for="membershipPackage in membershipPackages"
      :key="membershipPackage.id"
    >
      <article
        class="rounded-2xl border border-brand-border bg-brand-black/50 p-5"
      >
        <div
          class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
        >
          <div>
            <p
              class="font-semibold text-brand-cream"
              x-text="membershipPackage.packageName"
            ></p>

            <span
  class="mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
  :class="{
    'border-amber-300/40 bg-amber-400/10 text-amber-200':
      ['pending-review', 'approved'].includes(membershipPackage.status) &&
      !['ready-for-packing', 'shipped', 'completed'].includes(membershipPackage.fulfillment_status),
    'border-emerald-300/40 bg-emerald-400/10 text-emerald-200':
      ['ready-for-packing', 'completed'].includes(membershipPackage.fulfillment_status),
    'border-blue-300/40 bg-blue-400/10 text-blue-200':
      membershipPackage.fulfillment_status === 'shipped',
    'border-brand-border bg-brand-panel text-brand-muted':
      membershipPackage.status === 'awaiting-payment',
  }"
  x-text="
    membershipPackage.status === 'awaiting-payment'
      ? 'Awaiting Payment'
      : membershipPackage.status === 'pending-review'
        ? 'Pending Verification'
        : {
            'pending-allocation': 'Payment Approved',
            'not-ready': 'Payment Approved',
            'ready-for-packing': 'Ready for Packing',
            shipped: 'Shipped',
            completed: 'Delivered',
          }[membershipPackage.fulfillment_status] || 'Payment Approved'
  "
></span>
          </div>

          <p
            class="text-xs text-brand-muted"
            x-text="new Date(membershipPackage.submitted_at).toLocaleDateString('en-PH')"
          ></p>
        </div>

        <p
          class="mt-4 text-sm text-brand-cream"
          x-text="membershipPackage.packageQuantity.toLocaleString('en-PH') + ' assorted bottles included'"
        ></p>

        <div
          x-show="membershipPackage.packageInclusions.length > 0"
          class="mt-4 rounded-xl border border-brand-border bg-brand-panel p-4"
        >
          <p
            class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-gold"
          >
            Package inclusions
          </p>

          <ul class="mt-3 space-y-1 text-xs leading-5 text-brand-muted">
            <template
              x-for="inclusion in membershipPackage.packageInclusions"
              :key="inclusion"
            >
              <li x-text="'• ' + inclusion"></li>
            </template>
          </ul>
        </div>

        <div
          x-show="membershipPackage.packageAllocation.length > 0"
          class="mt-4 rounded-xl border border-brand-border bg-brand-panel p-4"
        >
          <p
            class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-gold"
          >
            Allocated assorted perfumes
          </p>

          <ul class="mt-3 space-y-2 text-sm text-brand-cream">
            <template
              x-for="item in membershipPackage.packageAllocation"
              :key="item.product_id || item.id || item.name"
            >
              <li
                class="flex items-center justify-between gap-4 border-b border-brand-border/60 pb-2 last:border-b-0 last:pb-0"
              >
                <span
                  class="min-w-0 truncate"
                  x-text="item.product_name || item.name || item.product_id || 'Perfume item'"
                ></span>

                <span
                  class="shrink-0 text-brand-gold"
                  x-text="'× ' + Number(item.quantity || 0).toLocaleString('en-PH')"
                ></span>
              </li>
            </template>
          </ul>
        </div>

        <p
  x-show="membershipPackage.packageAllocation.length === 0"
  class="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-xs leading-5 text-amber-100"
  x-text="
    membershipPackage.status === 'awaiting-payment'
      ? 'Please submit your payment proof to continue this package purchase.'
      : membershipPackage.status === 'pending-review'
        ? 'Your payment proof has been submitted. Please wait while admin reviews your package payment.'
        : 'Your payment has been approved. The company is preparing the assorted perfume allocation.'
  "
></p>
      </article>
    </template>
  </div>
</section>

<div
  x-show="membershipPackagesError"
  class="mt-6 rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-4 text-sm text-red-200"
>
  Unable to load membership package records. Please refresh this page.
</div>

        </section>
      </main>
    </div>

    <div
  x-show="membershipPaymentConfirmOpen"
  x-cloak
  x-transition.opacity
  class="fixed inset-0 z-[120] grid place-items-center bg-black/80 px-4 backdrop-blur-sm"
  @click.self="membershipPaymentConfirmOpen = false"
  @keydown.escape.window="membershipPaymentConfirmOpen = false"
>
  <div
    class="w-full max-w-md rounded-[1.5rem] border border-brand-gold/35 bg-brand-panel p-6 shadow-gold-soft"
    role="dialog"
    aria-modal="true"
    aria-labelledby="membership-payment-confirm-title"
  >
    <p
      class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
    >
      Confirm Submission
    </p>

    <h2
      id="membership-payment-confirm-title"
      class="mt-2 font-display text-3xl text-brand-cream"
    >
      Submit payment proof?
    </h2>

    <p class="mt-3 text-sm leading-6 text-brand-muted">
      Please confirm that the payment was already sent and the uploaded screenshot is correct.
    </p>

    <div
      class="mt-5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3"
    >
      <p class="text-xs leading-5 text-amber-100">
        After submission, cancellation requests may require admin review.
      </p>
    </div>

    <div class="mt-6 grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        class="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-border px-5 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
        @click="membershipPaymentConfirmOpen = false"
      >
        Go Back
      </button>

      <button
        type="button"
        class="premium-cta inline-flex min-h-11 items-center justify-center rounded-full bg-brand-gold px-5 text-sm font-semibold text-[#17130d]"
        @click="testMembershipPayment(true)"
      >
        Confirm Submission
      </button>
    </div>
  </div>
</div>

<div
  x-show="membershipCelebrationOpen"
  x-cloak
  x-transition.opacity
  class="fixed inset-0 z-[130] grid place-items-center bg-black/85 px-4 backdrop-blur-sm"
  @click.self="closeMembershipCelebration()"
  @keydown.escape.window="closeMembershipCelebration()"
>
  <div
    class="w-full max-w-md rounded-[1.75rem] border border-brand-gold/40 bg-brand-panel p-6 text-center shadow-gold-soft"
    role="dialog"
    aria-modal="true"
    aria-labelledby="membership-celebration-title"
  >
    <div
  class="mx-auto flex size-14 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-gold/10"
  aria-hidden="true"
>
  <svg
    class="size-7 text-brand-gold"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M12 3.75 14.45 8.7l5.47.79-3.96 3.86.94 5.45L12 16.23 7.1 18.8l.94-5.45-3.96-3.86 5.47-.79L12 3.75Z" />
    <path d="M19.5 4.5v3" />
    <path d="M21 6h-3" />
    <path d="M4.5 16.5v3" />
    <path d="M6 18H3" />
  </svg>
</div>

    <p
  class="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
  x-text="membershipCelebration?.eyebrow || 'Reward Unlocked'"
></p>

    <h2
      id="membership-celebration-title"
      class="mt-2 font-display text-3xl text-brand-cream"
      x-text="membershipCelebration?.title"
    ></h2>

    <p
      class="mt-3 text-sm font-semibold leading-6 text-brand-cream"
      x-text="membershipCelebration?.headline"
    ></p>

    <p
      class="mx-auto mt-4 inline-flex rounded-full border border-brand-gold/35 bg-brand-gold/10 px-4 py-2 text-sm font-semibold text-brand-gold"
      x-text="'+' + Number(membershipCelebration?.points || 0).toLocaleString('en-PH') + ' points earned'"
    ></p>

    <p
      class="mt-4 text-sm leading-6 text-brand-muted"
      x-text="membershipCelebration?.message"
    ></p>

    <div class="mt-6 grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        class="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-border px-5 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
        @click="closeMembershipCelebration()"
      >
        Close
      </button>

      <button
        type="button"
        class="premium-cta inline-flex min-h-11 items-center justify-center rounded-full bg-brand-gold px-5 text-sm font-semibold text-[#17130d]"
        @click="viewMembershipCelebrationHistory()"
      >
        View Order History
      </button>
    </div>
  </div>
</div>

    <div
      x-show="previewNotice"
      x-transition
      class="fixed bottom-5 left-1/2 z-[70] w-[min(26rem,90%)] -translate-x-1/2 rounded-xl border border-brand-gold/35 bg-brand-panel px-4 py-3 text-center text-sm font-medium text-brand-cream shadow-2xl"
      role="status"
      x-text="previewNotice"
    ></div>

    ${renderCartDrawer({
      requireAccountGate: false,
    })}

    ${renderProductDrawer()}

    ${renderCustomerSupportChat()}
  </div>
`
bindFadeLinks(
  [
    'a[href="/checkout/"]',
    'a[href="/university/?from=dashboard"]',
    'a[href="/videos/?from=dashboard"]',
    'a[href="/business-center/?from=dashboard"]',
  ].join(', '),
)
Alpine.start()
}

void startDashboard()
