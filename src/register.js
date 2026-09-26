import './style.css'

import Alpine from 'alpinejs'

import { supabase } from './lib/supabase.js'

import logoImage from './assets/logoyourproduct.png'

import { packages } from './config/packages-config.js'
import { siteConfig } from './config/site-config.js'

const pesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 0,
})

const registrationParams = new URLSearchParams(
  window.location.search,
)

const requestedPackageId =
  registrationParams.get('package')?.trim() || ''

const incomingReferralCode =
  registrationParams.get('ref')?.trim() || ''

const normalizedReferralCode =
  incomingReferralCode.toUpperCase()

// Frontend preview data only.
// Supabase will replace this during the backend phase.
const referralPreviewMembers = {
  'YP-A8K29': {
    code: 'YP-A8K29',
    fullName: 'Juan Dela Cruz',
  },

  'YP-M4R18': {
    code: 'YP-M4R18',
    fullName: 'Maria Santos',
  },
}

const referringMember =
  referralPreviewMembers[normalizedReferralCode] || null

const hasInvalidReferralCode =
  Boolean(incomingReferralCode) && !referringMember

const selectedPackage =
  packages.find(
    (packageItem) =>
      packageItem.id === requestedPackageId &&
      packageItem.isActive,
  ) || null

const dashboardPreviewUrl = selectedPackage
  ? `/dashboard/?package=${encodeURIComponent(
      selectedPackage.id,
    )}&membership=awaiting-payment`
  : '/dashboard/'

const registrationWithoutReferralUrl = selectedPackage
  ? `/register/?package=${encodeURIComponent(
      selectedPackage.id,
    )}`
  : '/register/'

const referralStatusMarkup = referringMember
  ? `
      <aside
        class="mt-6 rounded-2xl border border-brand-gold/40 bg-brand-gold/5 px-5 py-5"
        aria-label="Referring member"
      >
        <div class="flex items-start gap-3">
          <span
            class="mt-1 grid size-10 shrink-0 place-items-center rounded-full border border-brand-gold/40 bg-brand-black text-brand-gold"
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
                d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                stroke-linecap="round"
              />

              <circle
                cx="9"
                cy="7"
                r="4"
              />

              <path
                d="M19 8v6M22 11h-6"
                stroke-linecap="round"
              />
            </svg>
          </span>

          <div class="min-w-0">
            <p
              class="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-brand-gold"
            >
              Referred by
            </p>

            <p
              class="mt-1 font-display text-2xl text-brand-cream"
            >
              ${referringMember.fullName}
            </p>

            <p
              class="mt-1 text-xs leading-5 text-brand-muted"
            >
              This member will be recorded as your direct referrer
              after your account is successfully created.
            </p>
          </div>
        </div>

        <div class="mt-4">
          <label
            for="referral-code-preview"
            class="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-brand-muted"
          >
            Referral code
          </label>

          <input
            id="referral-code-preview"
            type="text"
            value="${referringMember.code}"
            class="mt-2 h-11 w-full cursor-not-allowed rounded-xl border border-brand-border bg-brand-black px-4 text-sm font-semibold text-brand-gold outline-none"
            readonly
            aria-readonly="true"
          >
        </div>
      </aside>
    `
  : hasInvalidReferralCode
    ? `
        <aside
          class="mt-6 rounded-2xl border border-red-400/40 bg-red-400/5 px-5 py-5"
          aria-label="Invalid referral link"
        >
          <p
            class="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-red-300"
          >
            Referral link not recognized
          </p>

          <p
            class="mt-2 text-sm leading-6 text-brand-muted"
          >
            This referral code is invalid or unavailable. It will not
            be attached to your registration.
          </p>

          <a
            href="${registrationWithoutReferralUrl}"
            class="mt-4 inline-flex text-xs font-semibold text-brand-gold transition hover:text-brand-gold-light"
          >
            Continue without a referral
          </a>
        </aside>
      `
    : ''

const packageSelectionMarkup = selectedPackage
  ? `
      <aside
        class="mt-6 overflow-hidden rounded-2xl border border-brand-gold/40 bg-brand-black"
        aria-label="Selected membership package"
      >
        <div
          class="flex flex-col gap-4 border-b border-brand-border px-5 py-5 sm:flex-row sm:items-start sm:justify-between"
        >
          <div>
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
            >
              Selected package
            </p>

            <h3
              class="mt-2 font-display text-2xl leading-tight text-brand-cream"
            >
              ${selectedPackage.name}
            </h3>

            <p
              class="mt-2 text-xs leading-5 text-brand-muted"
            >
              ${selectedPackage.description}
            </p>
          </div>

          <div class="sm:text-right">
            <p
              class="text-[0.6rem] font-medium uppercase tracking-[0.14em] text-brand-muted"
            >
              Package price
            </p>

            <p
              class="mt-1 font-display text-2xl text-brand-gold"
            >
              ${pesoFormatter.format(
                selectedPackage.price,
              )}
            </p>
          </div>
        </div>

        <div class="px-5 py-5">
          <p
            class="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-gold"
          >
            Package inclusions
          </p>

          <ul
            class="mt-3 grid gap-x-5 gap-y-2 sm:grid-cols-2"
          >
            ${selectedPackage.inclusions
              .map(
                (inclusion) => `
                  <li
                    class="flex items-start gap-2 text-xs leading-5 text-brand-muted"
                  >
                    <span
                      class="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-gold"
                      aria-hidden="true"
                    ></span>

                    <span>${inclusion}</span>
                  </li>
                `,
              )
              .join('')}
          </ul>

          <div
            class="mt-4 rounded-xl border border-brand-border bg-brand-panel px-4 py-3"
          >
            <p
              class="text-xs leading-5 text-brand-muted"
            >
              Creating an account does not automatically activate your
              membership. Payment verification and admin approval are
              still required.
            </p>
          </div>

          <a
            href="/#packages"
            class="mt-4 inline-flex text-xs font-semibold text-brand-gold transition hover:text-brand-gold-light"
          >
            Change selected package
          </a>
        </div>
      </aside>
    `
  : `
      <aside
        class="mt-6 rounded-2xl border border-brand-border bg-brand-black px-5 py-5"
        aria-label="Free customer account"
      >
        <p
          class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
        >
          Free customer account
        </p>

        <h3
          class="mt-2 font-display text-2xl text-brand-cream"
        >
          Start as a customer.
        </h3>

        <p
          class="mt-2 text-xs leading-5 text-brand-muted"
        >
          Create your free account to access products, submit orders,
          and view your order history. You may apply for a membership
          package later.
        </p>

        <a
          href="/#packages"
          class="mt-4 inline-flex text-xs font-semibold text-brand-gold transition hover:text-brand-gold-light"
        >
          View membership packages
        </a>
      </aside>
    `

window.Alpine = Alpine

Alpine.data('registerPage', () => ({
  account: {
    username: '',
    firstName: '',
    lastName: '',
    mobileNumber: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
    referralCode: referringMember?.code || '',
    acceptedTerms: false,
  },

  selectedPackageId: selectedPackage?.id || '',
  showPassword: false,
  isSubmitting: false,
  registrationError: '',
  registrationSuccess: '',
  registrationTested: false,

  resetMessages() {
    this.registrationError = ''
    this.registrationSuccess = ''
    this.registrationTested = false
  },

  async registerAccount() {
    if (hasInvalidReferralCode) {
      this.registrationError =
        'Please use a valid referral link or continue without a referral.'

      this.registrationTested = false
      return
    }

    if (
      this.account.password !==
      this.account.confirmPassword
    ) {
      this.registrationError =
        'The password confirmation does not match.'

      this.registrationTested = false
      return
    }

    const normalizedUsername =
      this.account.username.trim().toLowerCase()

    if (!/^[a-z0-9_]{3,30}$/.test(normalizedUsername)) {
      this.registrationError =
        'Username must use 3 to 30 lowercase letters, numbers, or underscores.'
      return
    }

    this.isSubmitting = true
    this.registrationError = ''
    this.registrationSuccess = ''
    this.registrationTested = false

    try {
      const {
        data: usernameAvailable,
        error: usernameCheckError,
      } = await supabase.rpc('is_username_available', {
        candidate_username: normalizedUsername,
      })

      if (usernameCheckError) {
        throw usernameCheckError
      }

      if (!usernameAvailable) {
        this.registrationError =
          'That username is already taken. Please choose another one.'
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email: this.account.emailAddress.trim().toLowerCase(),
        password: this.account.password,
        options: {
          data: {
            username: normalizedUsername,
            first_name: this.account.firstName.trim(),
            last_name: this.account.lastName.trim(),
            mobile_number: this.account.mobileNumber.trim(),
            account_type: 'free_customer',
            selected_package_id: this.selectedPackageId || null,
            referral_code: this.account.referralCode || null,
          },
        },
      })

      if (error) {
        throw error
      }

      this.registrationTested = true

      if (!data.session) {
        this.registrationSuccess =
          'Account submitted. Check your email and open the confirmation link before signing in.'
        return
      }

      window.location.assign(dashboardPreviewUrl)
    } catch (error) {
      console.error('Unable to create account:', error)
      this.registrationError =
        error?.message ||
        'Unable to create your account. Please try again.'
    } finally {
      this.isSubmitting = false
    }
  },
}))

document.title =
  `Create Account | ${siteConfig.brand.name}`

document.querySelector('#register-app').innerHTML = `
  <div
    x-data="registerPage"
    x-cloak
    class="min-h-screen bg-brand-black text-brand-cream"
  >
    <header
      class="border-b border-brand-border bg-brand-panel"
    >
      <div
        class="mx-auto flex w-[min(1120px,90%)] items-center justify-between gap-4 py-4"
      >
        <a
          href="/"
          class="flex min-w-0 items-center gap-3"
        >
          <img
            src="${logoImage}"
            alt="${siteConfig.brand.name} logo"
            class="size-12 shrink-0 object-contain sm:size-14"
          >

          <span class="min-w-0">
            <span
              class="block truncate text-sm font-semibold uppercase tracking-[0.18em] text-brand-cream sm:text-base"
            >
              ${siteConfig.brand.name}
            </span>

            <span
              class="mt-0.5 hidden text-[0.6rem] uppercase tracking-[0.12em] text-brand-muted sm:block"
            >
              ${siteConfig.brand.tagline}
            </span>
          </span>
        </a>

        <a
          href="/"
          class="text-sm font-semibold text-brand-gold transition hover:text-brand-gold-light"
        >
          Back to store
        </a>
      </div>
    </header>

    <main class="px-5 py-10 sm:py-16">
      <div
        class="mx-auto grid w-full max-w-6xl overflow-clip rounded-[2rem] border border-brand-border bg-brand-panel shadow-panel lg:grid-cols-2"
      >
        <section
          class="relative hidden min-h-[720px] overflow-clip bg-brand-black lg:block"
        >
          <div
            class="absolute -right-20 -top-20 size-72 rounded-full bg-brand-gold/10 blur-3xl"
            aria-hidden="true"
          ></div>

          <div
            class="sticky top-0 flex min-h-screen flex-col justify-between px-10 py-12 xl:px-12"
          >
            <div class="relative">
              <p
                class="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold"
              >
                Create your account
              </p>

              <h1
                class="mt-5 font-display text-5xl leading-[0.95] text-brand-cream"
              >
                Begin your

                <span class="italic text-brand-gold">
                  customer journey.
                </span>
              </h1>

              <p
                class="mt-6 max-w-sm text-sm leading-7 text-brand-muted"
              >
                Create your account to access products, orders, order
                history, and available membership opportunities.
              </p>

              ${
                selectedPackage
                  ? `
                      <div
                        class="mt-8 rounded-2xl border border-brand-gold/30 bg-brand-panel/70 p-5"
                      >
                        <p
                          class="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-gold"
                        >
                          Your selected package
                        </p>

                        <p
                          class="mt-2 font-display text-2xl text-brand-cream"
                        >
                          ${selectedPackage.name}
                        </p>

                        <p
                          class="mt-1 text-sm text-brand-gold"
                        >
                          ${pesoFormatter.format(
                            selectedPackage.price,
                          )}
                        </p>
                      </div>
                    `
                  : `
                      <div
                        class="mt-8 rounded-2xl border border-brand-border bg-brand-panel/70 p-5"
                      >
                        <p
                          class="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-gold"
                        >
                          Customer access
                        </p>

                        <p
                          class="mt-2 text-sm leading-6 text-brand-muted"
                        >
                          Registration is free. Membership remains
                          optional until you choose and complete a
                          package.
                        </p>
                      </div>
                    `
              }
            </div>

            <div class="relative mt-12">
              <div
                class="h-px w-16 bg-brand-gold"
                aria-hidden="true"
              ></div>

              <p
                class="mt-4 text-xs uppercase tracking-[0.18em] text-brand-muted"
              >
                ${siteConfig.brand.tagline}
              </p>
            </div>
          </div>
        </section>

        <section class="px-5 py-9 sm:px-10 sm:py-12">
          <div class="mx-auto max-w-xl">
            <p
              class="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold lg:hidden"
            >
              Create your account
            </p>

            <h2
              class="mt-3 font-display text-4xl text-brand-cream sm:text-5xl lg:mt-0"
            >
              ${
                selectedPackage
                  ? 'Complete your registration'
                  : 'Customer registration'
              }
            </h2>

            <p
              class="mt-3 text-sm leading-6 text-brand-muted"
            >
              ${
                selectedPackage
                  ? 'Create your free account to continue your selected package application.'
                  : 'Enter your information to create a free customer account.'
              }
            </p>

            ${packageSelectionMarkup}

            <form
              class="mt-8"
              @submit.prevent="registerAccount"
              @input="resetMessages"
            >
              <div class="mb-5">
                <label
                  for="register-username"
                  class="text-sm font-semibold text-brand-cream"
                >
                  Username
                </label>

                <input
                  id="register-username"
                  type="text"
                  x-model.trim="account.username"
                  @input="account.username = account.username.toLowerCase().replace(/[^a-z0-9_]/g, '')"
                  autocomplete="username"
                  minlength="3"
                  maxlength="30"
                  pattern="[a-z0-9_]{3,30}"
                  title="Use 3 to 30 lowercase letters, numbers, or underscores."
                  placeholder="juan_delacruz"
                  class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                  required
                >

                <p class="mt-2 text-xs leading-5 text-brand-muted">
                  Use 3–30 lowercase letters, numbers, or underscores.
                </p>
              </div>

              <div class="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    for="first-name"
                    class="text-sm font-semibold text-brand-cream"
                  >
                    First name
                  </label>

                  <input
                    id="first-name"
                    type="text"
                    x-model.trim="account.firstName"
                    autocomplete="given-name"
                    placeholder="Juan"
                    class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                    required
                  >
                </div>

                <div>
                  <label
                    for="last-name"
                    class="text-sm font-semibold text-brand-cream"
                  >
                    Last name
                  </label>

                  <input
                    id="last-name"
                    type="text"
                    x-model.trim="account.lastName"
                    autocomplete="family-name"
                    placeholder="Dela Cruz"
                    class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                    required
                  >
                </div>
              </div>

              <div
                class="mt-5 grid gap-5 sm:grid-cols-2"
              >
                <div>
                  <label
                    for="register-mobile"
                    class="text-sm font-semibold text-brand-cream"
                  >
                    Mobile number
                  </label>

                  <input
                    id="register-mobile"
                    type="tel"
                    x-model.trim="account.mobileNumber"
                    inputmode="tel"
                    autocomplete="tel"
                    minlength="10"
                    maxlength="13"
                    placeholder="09XXXXXXXXX"
                    class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                    required
                  >
                </div>

                <div>
                  <label
                    for="register-email"
                    class="text-sm font-semibold text-brand-cream"
                  >
                    Email address
                  </label>

                  <input
                    id="register-email"
                    type="email"
                    x-model.trim="account.emailAddress"
                    autocomplete="email"
                    placeholder="name@example.com"
                    class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                    required
                  >
                </div>
              </div>

              <div class="mt-5">
                <label
                  for="register-password"
                  class="text-sm font-semibold text-brand-cream"
                >
                  Password
                </label>

                <div class="relative mt-2">
                  <input
                    id="register-password"
                    :type="showPassword ? 'text' : 'password'"
                    x-model="account.password"
                    autocomplete="new-password"
                    minlength="8"
                    pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}"
                    title="Use at least 8 characters with an uppercase letter, lowercase letter, and number."
                    placeholder="Create a secure password"
                    class="h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 pr-20 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                    required
                  >

                  <button
                    type="button"
                    class="absolute inset-y-0 right-0 px-4 text-xs font-semibold text-brand-muted transition hover:text-brand-gold"
                    @click="showPassword = !showPassword"
                    x-text="showPassword ? 'Hide' : 'Show'"
                  ></button>
                </div>

                <p
                  class="mt-2 text-xs leading-5 text-brand-muted"
                >
                  Minimum 8 characters with uppercase, lowercase, and
                  one number.
                </p>
              </div>

              <div class="mt-5">
                <label
                  for="confirm-password"
                  class="text-sm font-semibold text-brand-cream"
                >
                  Confirm password
                </label>

                <input
                  id="confirm-password"
                  :type="showPassword ? 'text' : 'password'"
                  x-model="account.confirmPassword"
                  autocomplete="new-password"
                  minlength="8"
                  placeholder="Enter your password again"
                  class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                  required
                >
              </div>

              ${referralStatusMarkup}

              <label
                class="mt-6 flex cursor-pointer items-start gap-3"
              >
                <input
                  type="checkbox"
                  x-model="account.acceptedTerms"
                  class="mt-1 size-4 shrink-0 accent-brand-gold"
                  required
                >

                <span
                  class="text-xs leading-5 text-brand-muted"
                >
                  I confirm that the information provided is correct and
                  I agree to the account, purchase, privacy, and
                  applicable membership terms.
                </span>
              </label>

              <p
                x-show="registrationError"
                x-text="registrationError"
                class="mt-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-900"
                role="alert"
              ></p>

              <div
                x-show="registrationTested"
                x-transition
                class="mt-5 rounded-xl border border-[#2f6b59] bg-[#234f42] px-4 py-4 text-sm font-medium leading-6 text-[#fff8e9] shadow-sm"
                role="status"
              >
                <p x-text="registrationSuccess"></p>

                <a
                  x-show="registrationSuccess"
                  href="/login/"
                  class="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-[#17130d] transition hover:bg-brand-gold-light"
                >
                  Go to sign in
                </a>
              </div>

              <button
                x-show="!registrationSuccess"
                x-transition
                type="submit"
                class="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-gold px-7 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-light disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="isSubmitting"
                x-text="isSubmitting ? 'Creating account...' : '${
                  selectedPackage
                    ? 'Create account and continue'
                    : 'Create free account'
                }'"
              >
              </button>
            </form>

            <div
              class="mt-7 border-t border-brand-border pt-6 text-center"
            >
              <p class="text-sm text-brand-muted">
                Already have an account?
              </p>

              <a
                href="/login/"
                class="mt-2 inline-flex text-sm font-semibold text-brand-gold transition hover:text-brand-gold-light"
              >
                Sign in to your account
              </a>
            </div>

            <p
              class="mt-8 text-center text-xs leading-5 text-brand-muted"
            >
              Account credentials are securely handled by Supabase
              Authentication.
            </p>
          </div>
        </section>
      </div>
    </main>
  </div>
`

Alpine.start()
