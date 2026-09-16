import './style.css'

import Alpine from 'alpinejs'

import logoImage from './assets/logoyourproduct.png'

import {
  siteConfig,
} from './config/site-config.js'

window.Alpine = Alpine

Alpine.data('loginPage', () => ({
  emailAddress: '',
  password: '',
  rememberMe: false,
  showPassword: false,
  formTested: false,

  testLoginForm() {
    this.formTested = true
  },
}))

document.title = `Member Login | ${siteConfig.brand.name}`

document.querySelector('#login-app').innerHTML = `
  <div
    x-data="loginPage"
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
          aria-label="Return to ${siteConfig.brand.name}"
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
          class="relative hidden min-h-[640px] flex-col justify-between overflow-hidden bg-brand-black px-10 py-12 lg:flex xl:px-12"
        >
          <div
            class="absolute -right-20 -top-20 size-72 rounded-full bg-brand-gold/10 blur-3xl"
            aria-hidden="true"
          ></div>

          <div class="relative">
            <p
              class="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold"
            >
              Member access
            </p>

            <h1
              class="mt-5 font-display text-5xl leading-[0.95] text-brand-cream"
            >
              Welcome back to
              <span class="italic text-brand-gold">
                Your Product.
              </span>
            </h1>

            <p
              class="mt-6 max-w-sm text-sm leading-7 text-brand-muted"
            >
              Access your orders, points, rewards, and direct referral
              records from your member account.
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
          <div class="mx-auto max-w-md">
            <div class="lg:hidden">
              <p
                class="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold"
              >
                Member access
              </p>
            </div>

            <h2
              class="mt-3 font-display text-4xl text-brand-cream sm:text-5xl lg:mt-0"
            >
              Sign in
            </h2>

            <p class="mt-3 text-sm leading-6 text-brand-muted">
              Enter your member account details to continue.
            </p>

            <form
              class="mt-8"
              @submit.prevent="testLoginForm"
              @input="formTested = false"
            >
              <div>
                <label
                  for="login-email"
                  class="text-sm font-semibold text-brand-cream"
                >
                  Email address
                </label>

                <input
                  id="login-email"
                  type="email"
                  x-model.trim="emailAddress"
                  autocomplete="email"
                  placeholder="name@example.com"
                  class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                  required
                >
              </div>

              <div class="mt-5">
                <label
                  for="login-password"
                  class="text-sm font-semibold text-brand-cream"
                >
                  Password
                </label>

                <div class="relative mt-2">
                  <input
                    id="login-password"
                    :type="showPassword ? 'text' : 'password'"
                    x-model="password"
                    autocomplete="current-password"
                    minlength="8"
                    placeholder="Enter your password"
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
              </div>

              <label
                class="mt-5 flex cursor-pointer items-center gap-3 text-sm text-brand-muted"
              >
                <input
                  type="checkbox"
                  x-model="rememberMe"
                  class="size-4 accent-brand-gold"
                >

                <span>Keep me signed in on this device</span>
              </label>

              <div
                x-show="formTested"
                x-transition
                class="mt-6 rounded-xl border border-[#2f6b59] bg-[#234f42] px-4 py-3 text-sm font-medium leading-6 text-[#fff8e9] shadow-sm"
                role="status"
              >
                Login form validation is working. Account authentication
                will be connected during the backend phase.
              </div>

              <button
                type="submit"
                class="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-gold px-7 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-light"
              >
                Sign in
              </button>
            </form>

            <div
              class="mt-7 border-t border-brand-border pt-6 text-center"
            >
              <p class="text-sm text-brand-muted">
                Not a member yet?
              </p>

              <a
               href="/register/"
                class="mt-2 inline-flex text-sm font-semibold text-brand-gold transition hover:text-brand-gold-light"
               >
               Create a member account
            </a>
            </div>

            <p
              class="mt-8 text-center text-xs leading-5 text-brand-muted"
            >
              Secure authentication is not yet active during this
              frontend development stage.
            </p>
          </div>
        </section>
      </div>
    </main>
  </div>
`

Alpine.start()