export function registerMemberReferralCard(
    Alpine,
    {
      referralCode,
      memberName,
    },
  ) {
    Alpine.data('memberReferralCard', () => ({
      currentReferralCode: referralCode || '',
      currentMemberName: memberName || 'YOUR PRODUCT Member',

      init() {
        this.currentReferralCode =
          window.customerReferralCode ||
          this.currentReferralCode

        this.currentMemberName =
          window.customerReferralName ||
          this.currentMemberName
      },

      get referralCode() {
        return this.currentReferralCode
      },

      get memberName() {
        return this.currentMemberName
      },

      get referralLink() {
        return `${window.location.origin}/register/?ref=${encodeURIComponent(
          this.currentReferralCode,
        )}`
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
          throw new Error('Unable to copy referral link.')
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
              `${this.memberName}'s referral link.`,
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
  
  export function renderMemberReferralCard() {
    return `
      <section
  x-data="memberReferralCard"
  x-init="
    currentReferralCode = profile?.username || currentReferralCode;
    currentMemberName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || currentMemberName;
  "
  x-show="isMember"
        x-transition.opacity
        class="relative mt-6 overflow-hidden rounded-[1.5rem] border border-brand-gold/35 bg-brand-panel p-5 shadow-gold-soft sm:p-6"
        aria-labelledby="member-referral-title"
      >
        <div
          class="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-brand-gold/10 blur-3xl"
          aria-hidden="true"
        ></div>
  
        <div
          class="relative grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"
        >
          <div>
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
            >
              Direct Referral
            </p>
  
            <h2
              id="member-referral-title"
              class="mt-2 font-display text-3xl text-brand-cream sm:text-4xl"
            >
              Invite through your personal link.
            </h2>
  
            <p
              class="mt-3 max-w-xl text-sm leading-6 text-brand-muted"
            >
              Share this link with a new customer. If they register
              through your link, your account will be recorded as their
              direct referrer.
            </p>
  
            <div
              class="mt-5 inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-black px-4 py-2"
            >
              <span
                class="size-2 rounded-full bg-emerald-500"
                aria-hidden="true"
              ></span>
  
              <span
                class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted"
              >
                Referral code
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
              for="member-referral-link"
              class="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-muted"
            >
              Your personal referral link
            </label>
  
            <div
              class="mt-3 flex flex-col gap-3 sm:flex-row"
            >
              <input
                id="member-referral-link"
                type="text"
                :value="referralLink"
                class="h-12 min-w-0 flex-1 rounded-xl border border-brand-border bg-brand-panel px-4 text-sm text-brand-cream outline-none focus:border-brand-gold"
                readonly
                aria-readonly="true"
                @focus="$event.currentTarget.select()"
              >
  
              <button
                type="button"
                class="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-gold px-5 text-sm font-semibold text-[#17130d] transition hover:bg-brand-gold-light active:scale-[0.98]"
                @click="copyReferralLink()"
              >
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  aria-hidden="true"
                >
                  <rect
                    x="8"
                    y="8"
                    width="11"
                    height="11"
                    rx="2"
                  ></rect>
  
                  <path
                    d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
                    stroke-linecap="round"
                  ></path>
                </svg>
  
                Copy Link
              </button>
            </div>
  
            <div
              class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <p
                class="text-xs leading-5 text-brand-muted"
              >
                Earn 10% from direct referred membership packages after admin approval.
              </p>
  
              <button
                type="button"
                class="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-brand-border px-4 text-xs font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
                @click="shareReferralLink()"
              >
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  aria-hidden="true"
                >
                  <circle cx="18" cy="5" r="2.5"></circle>
                  <circle cx="6" cy="12" r="2.5"></circle>
                  <circle cx="18" cy="19" r="2.5"></circle>
  
                  <path
                    d="m8.25 10.85 7.5-4.4M8.25 13.15l7.5 4.4"
                  ></path>
                </svg>
  
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