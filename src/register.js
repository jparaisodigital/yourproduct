import './style.css'

import Alpine from 'alpinejs'

import logoImage from './assets/logoyourproduct.png'

import {
  siteConfig,
} from './config/site-config.js'

window.Alpine = Alpine

Alpine.data('registerPage', () => ({
  account: {
    firstName: '',
    lastName: '',
    mobileNumber: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    acceptedTerms: false,
  },

  showPassword: false,
  registrationError: '',
  registrationTested: false,

  resetMessages() {
    this.registrationError = ''
    this.registrationTested = false
  },

  testRegistrationForm() {
    if (
      this.account.password !==
      this.account.confirmPassword
    ) {
      this.registrationError =
        'The password confirmation does not match.'

      this.registrationTested = false
      return
    }

    this.registrationError = ''
    this.registrationTested = true
  },
}))

document.title = `Create Account | ${siteConfig.brand.name}`

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
        class="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-brand-border bg-brand-panel shadow-panel lg:grid-cols-2"
      >
        <section
          class="relative hidden min-h-[720px] flex-col justify-between overflow-hidden bg-brand-black px-10 py-12 lg:flex xl:px-12"
        >
          <div
            class="absolute -right-20 -top-20 size-72 rounded-full bg-brand-gold/10 blur-3xl"
            aria-hidden="true"
          ></div>

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
                member journey.
              </span>
            </h1>

            <p
              class="mt-6 max-w-sm text-sm leading-7 text-brand-muted"
            >
              Register your personal account to prepare access to member
              benefits, order history, points, rewards, and referrals.
            </p>
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
              Member registration
            </h2>

            <p class="mt-3 text-sm leading-6 text-brand-muted">
              Enter your information to create a member account.
            </p>

            <form
              class="mt-8"
              @submit.prevent="testRegistrationForm"
              @input="resetMessages"
            >
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

              <div class="mt-5 grid gap-5 sm:grid-cols-2">
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
                  for="referral-code"
                  class="text-sm font-semibold text-brand-cream"
                >
                  Referral code
                  <span class="font-normal text-brand-muted">
                    (Optional)
                  </span>
                </label>

                <input
                  id="referral-code"
                  type="text"
                  x-model.trim="account.referralCode"
                  autocomplete="off"
                  placeholder="Enter the code of your direct referrer"
                  class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                >

                <p class="mt-2 text-xs leading-5 text-brand-muted">
                  Leave this blank if you were not referred by an
                  existing member.
                </p>
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

                <p class="mt-2 text-xs leading-5 text-brand-muted">
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

              <label
                class="mt-6 flex cursor-pointer items-start gap-3"
              >
                <input
                  type="checkbox"
                  x-model="account.acceptedTerms"
                  class="mt-1 size-4 shrink-0 accent-brand-gold"
                  required
                >

                <span class="text-xs leading-5 text-brand-muted">
                  I confirm that the information provided is correct and
                  I agree to the membership terms and privacy policy.
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
                class="mt-5 rounded-xl border border-[#2f6b59] bg-[#234f42] px-4 py-3 text-sm font-medium leading-6 text-[#fff8e9] shadow-sm"
                role="status"
              >
                Registration form validation is working. No account has
                been created yet.
              </div>

              <button
                type="submit"
                class="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-gold px-7 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-light"
              >
                Create account
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
              Account creation and secure authentication will be
              activated during the backend phase.
            </p>
          </div>
        </section>
      </div>
    </main>
  </div>
`

Alpine.start()