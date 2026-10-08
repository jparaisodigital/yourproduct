import './style.css'

import Alpine from 'alpinejs'

import logoImage from './assets/logoyourproduct.webp'
import { siteConfig } from './config/site-config.js'
import { supabase } from './lib/supabase.js'

window.Alpine = Alpine

Alpine.data('forgotPasswordPage', () => ({
  emailAddress: '',
  isSubmitting: false,
  errorMessage: '',
  successMessage: '',

  resetMessages() {
    this.errorMessage = ''
    this.successMessage = ''
  },

  async sendResetLink() {
    this.isSubmitting = true
    this.resetMessages()

    try {
      const redirectTo =
        `${window.location.origin}/reset-password/`

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          this.emailAddress.trim().toLowerCase(),
          { redirectTo },
        )

      if (error) throw error

      this.successMessage =
        'If an account uses that email, a password reset link has been sent. Please check your inbox and spam folder.'
    } catch (error) {
      console.error('Unable to send reset link:', error)
      this.errorMessage =
        'Unable to send a reset link right now. Please try again.'
    } finally {
      this.isSubmitting = false
    }
  },
}))

document.title = `Forgot Password | ${siteConfig.brand.name}`

document.querySelector('#forgot-password-app').innerHTML = `
  <div x-data="forgotPasswordPage" x-cloak class="min-h-screen bg-brand-black px-5 py-10 text-brand-cream">
    <main class="mx-auto w-full max-w-lg rounded-[2rem] border border-brand-border bg-brand-panel p-6 shadow-panel sm:p-10">
      <a href="/" class="mx-auto flex w-fit items-center gap-3">
        <img src="${logoImage}" alt="${siteConfig.brand.name} logo" class="size-14 object-contain">
        <span class="font-semibold uppercase tracking-[0.18em]">${siteConfig.brand.name}</span>
      </a>

      <p class="mt-10 text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">Account recovery</p>
      <h1 class="mt-2 font-display text-4xl text-brand-cream">Forgot your password?</h1>
      <p class="mt-3 text-sm leading-6 text-brand-muted">Enter the email address connected to your account. We will send you a secure password reset link.</p>

      <form class="mt-8" @submit.prevent="sendResetLink" @input="resetMessages">
        <label for="recovery-email" class="text-sm font-semibold text-brand-cream">Email address</label>
        <input id="recovery-email" type="email" x-model.trim="emailAddress" autocomplete="email" placeholder="name@example.com" class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none placeholder:text-brand-muted focus:border-brand-gold" required>

        <p x-show="errorMessage" x-text="errorMessage" class="mt-5 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200" role="alert"></p>
        <p x-show="successMessage" x-text="successMessage" class="mt-5 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm leading-6 text-emerald-200" role="status"></p>

        <button type="submit" :disabled="isSubmitting" x-text="isSubmitting ? 'Sending link...' : 'Send reset link'" class="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-light disabled:cursor-not-allowed disabled:opacity-60"></button>
      </form>

      <a href="/login/" class="mt-7 flex justify-center text-sm font-semibold text-brand-gold transition hover:text-brand-gold-light">Back to sign in</a>
    </main>
  </div>
`

Alpine.start()
