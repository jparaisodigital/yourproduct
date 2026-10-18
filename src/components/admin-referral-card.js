import { supabase } from '../lib/supabase.js'
export function registerAdminReferralCard(
    Alpine,
    {
      referralCode = '',
      referrerName = '',
    } = {},
  ) {
    Alpine.data('adminReferralCard', () => ({
      referralCode,
      referrerName,
      referralLink: '',
      isLoadingReferral: true,
    
      async init() {
        try {
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser()
    
          if (userError || !user) {
            throw userError || new Error('Admin session not found.')
          }
    
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username, first_name, last_name, role, account_status')
            .eq('id', user.id)
            .single()
    
            if (
              profileError ||
              !profile ||
              !['admin', 'staff'].includes(profile.role) ||
              profile.account_status !== 'active'
            ) {
              throw (
                profileError ||
                new Error('Active admin or staff profile not found.')
              )
            }
    
          this.referralCode = profile.username
    
          const fullName = [
            profile.first_name,
            profile.last_name,
          ]
            .filter(Boolean)
            .join(' ')
            .trim()
    
          this.referrerName = fullName || profile.username
    
          this.referralLink =
            `${window.location.origin}/register/?ref=${encodeURIComponent(
              profile.username,
            )}`
        } catch (error) {
          console.error('Unable to load personal referral link:', error)
    
          this.referralLink = ''
          this.showFeedback(
            'Unable to load your referral link. Please refresh.',
            'error',
          )
        } finally {
          this.isLoadingReferral = false
        }
      },
  
      feedbackMessage: '',
      feedbackTone: 'success',
      feedbackTimer: null,
  
      showFeedback(message, tone = 'success') {
        window.clearTimeout(this.feedbackTimer)
  
        this.feedbackMessage = message
        this.feedbackTone = tone
  
        this.feedbackTimer = window.setTimeout(() => {
          this.feedbackMessage = ''
        }, 3000)
      },
  
      copyWithFallback() {
        const temporaryInput =
          document.createElement('textarea')
  
        temporaryInput.value = this.referralLink
        temporaryInput.setAttribute('readonly', '')
        temporaryInput.style.position = 'fixed'
        temporaryInput.style.left = '-9999px'
        temporaryInput.style.opacity = '0'
  
        document.body.appendChild(temporaryInput)
        temporaryInput.focus()
        temporaryInput.select()
  
        const copySuccessful =
          document.execCommand('copy')
  
        temporaryInput.remove()
  
        if (!copySuccessful) {
          throw new Error(
            'Unable to copy your referral link.',
          )
        }
      },
  
      async copyReferralLink() {
        try {
          if (
            navigator.clipboard &&
            window.isSecureContext
          ) {
            await navigator.clipboard.writeText(
              this.referralLink,
            )
          } else {
            this.copyWithFallback()
          }
  
          this.showFeedback(
            'Referral link copied successfully.',
          )
        } catch {
          this.showFeedback(
            'Unable to copy the link. Please copy it manually.',
            'error',
          )
        }
      },
  
      async shareReferralLink() {
        if (!navigator.share) {
          await this.copyReferralLink()
          return
        }
  
        try {
          await navigator.share({
            title: 'YOUR PRODUCT Membership',
            text:
              `Join YOUR PRODUCT through ` +
              `${this.referrerName}.`,
            url: this.referralLink,
          })
  
          this.showFeedback(
            'Referral link shared successfully.',
          )
        } catch (error) {
          if (error?.name === 'AbortError') {
            return
          }
  
          this.showFeedback(
            'Unable to open the share options.',
            'error',
          )
        }
      },
  
      destroy() {
        window.clearTimeout(this.feedbackTimer)
      },
    }))
  }
  
  export function renderAdminReferralCard() {
    return `
      <section
        x-data="adminReferralCard"
        class="relative overflow-hidden rounded-[1.5rem] border border-brand-gold/35 bg-brand-panel p-5 shadow-gold-soft sm:p-6"
        aria-labelledby="admin-referral-link-title"
      >
        <div
          class="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-brand-gold/10 blur-3xl"
          aria-hidden="true"
        ></div>
  
        <div class="relative grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
            >
              Personal Referral
            </p>
  
            <h2
              id="admin-referral-link-title"
              class="mt-2 font-display text-3xl text-brand-cream"
            >
              Your referral link
            </h2>
  
            <p class="mt-3 text-sm leading-6 text-brand-muted">
  Share this link to invite new members. You earn a 10%
  referral commission when a qualifying membership is approved.
</p>
  
            <div
              class="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-black px-4 py-2"
            >
              <span
                class="size-2 rounded-full bg-emerald-400"
                aria-hidden="true"
              ></span>
  
              <span
                class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted"
              >
                Code
              </span>
  
              <strong
                class="text-sm text-brand-gold"
                x-text="referralCode"
              ></strong>
            </div>
          </div>
  
          <div
            class="rounded-2xl border border-brand-border bg-brand-black p-4 sm:p-5"
          >
            <label
  for="admin-referral-link"
  class="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-muted"
>
  Your referral link
</label>
  
            <div class="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                id="admin-referral-link"
                type="text"
                :value="referralLink"
                class="h-12 min-w-0 flex-1 rounded-xl border border-brand-border bg-brand-panel px-4 text-sm text-brand-cream outline-none focus:border-brand-gold"
                readonly
                aria-readonly="true"
                @focus="$event.currentTarget.select()"
              >
  
              <button
                type="button"
                class="inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-brand-gold px-5 text-sm font-semibold text-[#17130d] transition hover:bg-brand-gold-light active:scale-[0.98]"
                @click="copyReferralLink()"
              >
                Copy Link
              </button>
            </div>
  
            <div
              class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <p class="text-xs leading-5 text-brand-muted">
  10% commission on approved qualifying memberships
</p>
  
              <button
                type="button"
                class="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-brand-border px-4 text-xs font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
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
    `
  }
  