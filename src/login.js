import './style.css'

import Alpine from 'alpinejs'

import logoImage from './assets/logoyourproduct.png'

import { siteConfig } from './config/site-config.js'
import { supabase } from './lib/supabase.js'

window.Alpine = Alpine

Alpine.data('loginPage', () => ({
  emailAddress: '',
  password: '',
  showPassword: false,
  isSubmitting: false,
  loginError: '',

  resetMessage() {
    this.loginError = ''
  },

  async signIn() {
    this.isSubmitting = true
    this.loginError = ''

    try {
      const { error } =
        await supabase.auth.signInWithPassword({
          email: this.emailAddress.trim().toLowerCase(),
          password: this.password,
        })

      if (error) {
        throw error
      }

      window.location.assign('/dashboard/')
    } catch (error) {
      console.error('Unable to sign in:', error)
      this.loginError =
        error?.message ||
        'Unable to sign in. Check your email and password.'
    } finally {
      this.isSubmitting = false
    }
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
              Enter your account details to continue.
            </p>

            <form
              class="mt-8"
              @submit.prevent="signIn"
              @input="resetMessage"
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

              <p
                x-show="loginError"
                x-text="loginError"
                class="mt-5 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm font-medium leading-6 text-red-200"
                role="alert"
              ></p>

              <button
                type="submit"
                class="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-gold px-7 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-light disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="isSubmitting"
                x-text="isSubmitting ? 'Signing in...' : 'Sign in'"
              ></button>
            </form>

            <div
              class="mt-7 border-t border-brand-border pt-6 text-center"
            >
              <p class="text-sm text-brand-muted">
                Do not have an account yet?
              </p>

              <a
                href="/register/"
                class="mt-2 inline-flex text-sm font-semibold text-brand-gold transition hover:text-brand-gold-light"
              >
                Create a free customer account
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
