import './style.css'

import Alpine from 'alpinejs'

import logoImage from './assets/logoyourproduct.png'
import { siteConfig } from './config/site-config.js'
import { supabase } from './lib/supabase.js'

window.Alpine = Alpine

Alpine.data('resetPasswordPage', () => ({
  password: '',
  confirmPassword: '',
  showPassword: false,
  isCheckingSession: true,
  hasRecoverySession: false,
  isSubmitting: false,
  errorMessage: '',
  successMessage: '',

  async init() {
    const { data } = await supabase.auth.getSession()
    this.hasRecoverySession = Boolean(data.session)
    this.isCheckingSession = false
  },

  resetMessage() {
    this.errorMessage = ''
  },

  async updatePassword() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'The password confirmation does not match.'
      return
    }

    this.isSubmitting = true
    this.errorMessage = ''

    try {
      const { error } = await supabase.auth.updateUser({
        password: this.password,
      })

      if (error) throw error

      this.successMessage =
        'Your password has been updated. You can now sign in using your new password.'
      this.password = ''
      this.confirmPassword = ''
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Unable to update password:', error)
      this.errorMessage =
        error?.message || 'Unable to update your password.'
    } finally {
      this.isSubmitting = false
    }
  },
}))

document.title = `Reset Password | ${siteConfig.brand.name}`

document.querySelector('#reset-password-app').innerHTML = `
  <div x-data="resetPasswordPage" x-cloak class="min-h-screen bg-brand-black px-5 py-10 text-brand-cream">
    <main class="mx-auto w-full max-w-lg rounded-[2rem] border border-brand-border bg-brand-panel p-6 shadow-panel sm:p-10">
      <a href="/" class="mx-auto flex w-fit items-center gap-3">
        <img src="${logoImage}" alt="${siteConfig.brand.name} logo" class="size-14 object-contain">
        <span class="font-semibold uppercase tracking-[0.18em]">${siteConfig.brand.name}</span>
      </a>

      <p class="mt-10 text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">Account security</p>
      <h1 class="mt-2 font-display text-4xl text-brand-cream">Create a new password</h1>

      <p x-show="isCheckingSession" class="mt-6 text-sm text-brand-muted">Checking your reset link...</p>

      <div x-show="!isCheckingSession && !hasRecoverySession" class="mt-6 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-4 text-sm leading-6 text-red-200">
        This reset link is invalid or expired.
        <a href="/forgot-password/" class="mt-3 block font-semibold text-brand-gold">Request a new reset link</a>
      </div>

      <form x-show="!isCheckingSession && hasRecoverySession && !successMessage" class="mt-8" @submit.prevent="updatePassword" @input="resetMessage">
        <label for="new-password" class="text-sm font-semibold">New password</label>
        <div class="relative mt-2">
          <input id="new-password" :type="showPassword ? 'text' : 'password'" x-model="password" autocomplete="new-password" minlength="8" pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}" class="h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 pr-20 text-sm outline-none focus:border-brand-gold" required>
          <button type="button" @click="showPassword = !showPassword" x-text="showPassword ? 'Hide' : 'Show'" class="absolute inset-y-0 right-0 px-4 text-xs font-semibold text-brand-muted hover:text-brand-gold"></button>
        </div>

        <label for="confirm-new-password" class="mt-5 block text-sm font-semibold">Confirm new password</label>
        <input id="confirm-new-password" :type="showPassword ? 'text' : 'password'" x-model="confirmPassword" autocomplete="new-password" minlength="8" class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm outline-none focus:border-brand-gold" required>

        <p x-show="errorMessage" x-text="errorMessage" class="mt-5 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200" role="alert"></p>
        <button type="submit" :disabled="isSubmitting" x-text="isSubmitting ? 'Updating password...' : 'Update password'" class="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-black hover:bg-brand-gold-light disabled:opacity-60"></button>
      </form>

      <div x-show="successMessage" class="mt-6 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-4 text-sm leading-6 text-emerald-200" role="status">
        <p x-text="successMessage"></p>
        <a href="/login/" class="mt-4 inline-flex font-semibold text-brand-gold">Continue to sign in</a>
      </div>
    </main>
  </div>
`

Alpine.start()
