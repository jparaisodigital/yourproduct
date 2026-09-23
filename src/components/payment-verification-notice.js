import {
    businessRules,
  } from '../config/business-rules-config.js'
  
  export function renderPaymentVerificationNotice() {
    const {
      minimumHours,
      maximumHours,
    } = businessRules.paymentVerification
  
    return `
      <aside
        class="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-4 sm:px-5"
        aria-label="Payment verification notice"
      >
        <div class="flex items-start gap-3">
          <span
            class="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300"
            aria-hidden="true"
          >
            <svg
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <circle cx="12" cy="12" r="8.5"></circle>
  
              <path
                d="M12 7.5v5l3 1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </span>
  
          <div>
            <p
              class="text-sm font-semibold text-amber-200"
            >
              Payment verification:
              ${minimumHours}–${maximumHours} hours
            </p>
  
            <p
              class="mt-1 text-xs leading-5 text-brand-muted"
            >
              Submitted payment details and proof of payment
              will be reviewed by the admin. Order or
              membership approval may take
              ${minimumHours} to ${maximumHours} hours.
            </p>
          </div>
        </div>
      </aside>
    `
  }