export function registerMemberPayoutPage(
    Alpine,
    {
      availableIncome = 0,
      payoutRequests = [],
    } = {},
  ) {
    Alpine.data('memberPayoutPage', () => ({
      availableIncome:
        Number(availableIncome || 0),
  
      payoutRequests: Array.isArray(payoutRequests)
        ? [...payoutRequests]
        : [],
  
      form: {
        amount: '',
        paymentMethod: '',
        accountName: '',
        accountNumber: '',
        note: '',
      },
  
      errorMessage: '',
      successMessage: '',
  
      formatMoney(value) {
        return new Intl.NumberFormat('en-PH', {
          style: 'currency',
          currency: 'PHP',
          minimumFractionDigits: 0,
        }).format(Number(value || 0))
      },
  
      statusLabel(status) {
        const labels = {
          pending: 'Pending Review',
          approved: 'Approved',
          paid: 'Paid',
          rejected: 'Rejected',
        }
  
        return labels[status] || status
      },
  
      statusClass(status) {
        const classes = {
          pending:
            'border-amber-400/40 bg-amber-400/10 text-amber-200',
          approved:
            'border-blue-400/40 bg-blue-400/10 text-blue-200',
          paid:
            'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
          rejected:
            'border-red-400/40 bg-red-400/10 text-red-200',
        }
  
        return (
          classes[status] ||
          'border-brand-border bg-brand-black text-brand-muted'
        )
      },
  
      resetForm() {
        this.form = {
          amount: '',
          paymentMethod: '',
          accountName: '',
          accountNumber: '',
          note: '',
        }
      },
  
      submitPayoutRequest() {
        this.errorMessage = ''
        this.successMessage = ''
  
        const requestedAmount =
          Number(this.form.amount)
  
        if (
          !Number.isFinite(requestedAmount) ||
          requestedAmount <= 0
        ) {
          this.errorMessage =
            'Enter a valid payout amount.'
          return
        }
  
        if (requestedAmount > this.availableIncome) {
          this.errorMessage =
            'The requested amount is greater than your available balance.'
          return
        }
  
        if (!this.form.paymentMethod) {
          this.errorMessage =
            'Select a payout method.'
          return
        }
  
        if (!this.form.accountName.trim()) {
          this.errorMessage =
            'Enter the payout account name.'
          return
        }
  
        if (!this.form.accountNumber.trim()) {
          this.errorMessage =
            'Enter the payout account number.'
          return
        }
  
        const requestTime = new Date()
  
        this.payoutRequests.unshift({
          id: `PAYOUT-${Date.now()}`,
          amount: requestedAmount,
          paymentMethod: this.form.paymentMethod,
          accountName: this.form.accountName.trim(),
          accountNumber: this.form.accountNumber.trim(),
          note: this.form.note.trim(),
          status: 'pending',
          requestedAt:
            requestTime.toLocaleString('en-PH'),
          referenceNumber: '',
          proofUrl: '',
          paidAt: '',
        })
  
        this.availableIncome -= requestedAmount
        this.successMessage =
          'Payout request added to the frontend preview.'
        this.resetForm()
      },
    }))
  }
  
  export function renderMemberPayoutPage() {
    return `
      <section
        x-data="memberPayoutPage"
        x-show="activePage === 'payoutRequest' && isMember"
        x-transition.opacity
        aria-labelledby="member-payout-title"
      >
        <div
          class="relative isolate overflow-hidden rounded-[1.75rem] border border-brand-gold/30 bg-brand-panel p-6 shadow-gold-soft sm:p-8"
        >
          <div
            class="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-brand-gold/10 blur-3xl"
            aria-hidden="true"
          ></div>
  
          <div
            class="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <p
                class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold"
              >
                Manual Payout
              </p>
  
              <h1
                id="member-payout-title"
                class="mt-2 font-display text-4xl text-brand-cream sm:text-5xl"
              >
                Payout Request
              </h1>
  
              <p
                class="mt-3 max-w-2xl text-sm leading-7 text-brand-muted"
              >
                Submit payout details for manual admin review and
                monitor previous payout requests.
              </p>
            </div>
  
            <button
              type="button"
              class="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-border px-5 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
              @click="openPage('earnings')"
            >
              View Earnings
            </button>
          </div>
        </div>
  
        <div
          class="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]"
        >
          <aside
            class="rounded-[1.5rem] border border-emerald-400/30 bg-brand-panel p-5 shadow-panel sm:p-6"
          >
            <p
              class="text-xs font-semibold uppercase tracking-[0.16em] text-brand-muted"
            >
              Available Balance
            </p>
  
            <strong
              class="mt-3 block font-display text-5xl text-emerald-300"
              x-text="formatMoney(availableIncome)"
            ></strong>
  
            <p class="mt-4 text-xs leading-5 text-brand-muted">
              Only available income can be requested. Minimum payout,
              processing schedule, and final commission rules remain
              subject to client confirmation.
            </p>
          </aside>
  
          <form
            class="rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
            @submit.prevent="submitPayoutRequest()"
            novalidate
          >
            <div>
              <p
                class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
              >
                Request Details
              </p>
  
              <h2
                class="mt-1 font-display text-3xl text-brand-cream"
              >
                Where should we send it?
              </h2>
            </div>
  
            <div class="mt-5 grid gap-4 sm:grid-cols-2">
              <label class="grid gap-2">
                <span
                  class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted"
                >
                  Amount
                </span>
  
                <input
                  type="number"
                  min="1"
                  step="1"
                  inputmode="decimal"
                  x-model="form.amount"
                  placeholder="0"
                  class="min-h-12 rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                >
              </label>
  
              <label class="grid gap-2">
                <span
                  class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted"
                >
                  Payout Method
                </span>
  
                <select
                  x-model="form.paymentMethod"
                  class="min-h-12 rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
                >
                  <option value="">
                    Select method
                  </option>
  
                  <option value="GCash">GCash</option>
                  <option value="Maya">Maya</option>
                  <option value="Bank Transfer">
                    Bank Transfer
                  </option>
                </select>
              </label>
  
              <label class="grid gap-2">
                <span
                  class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted"
                >
                  Account Name
                </span>
  
                <input
                  type="text"
                  maxlength="100"
                  x-model.trim="form.accountName"
                  placeholder="Name on payout account"
                  class="min-h-12 rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                >
              </label>
  
              <label class="grid gap-2">
                <span
                  class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted"
                >
                  Account Number
                </span>
  
                <input
                  type="text"
                  maxlength="40"
                  inputmode="numeric"
                  x-model.trim="form.accountNumber"
                  placeholder="Mobile or bank account number"
                  class="min-h-12 rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                >
              </label>
            </div>
  
            <label class="mt-4 grid gap-2">
              <span
                class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted"
              >
                Note (Optional)
              </span>
  
              <textarea
                rows="3"
                maxlength="250"
                x-model.trim="form.note"
                placeholder="Additional payout information"
                class="w-full resize-none rounded-xl border border-brand-border bg-brand-black px-4 py-3 text-sm leading-6 text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
              ></textarea>
            </label>
  
            <p
              x-show="errorMessage"
              x-text="errorMessage"
              class="mt-4 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-xs leading-5 text-red-200"
              role="alert"
            ></p>
  
            <p
              x-show="successMessage"
              x-text="successMessage"
              class="mt-4 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-xs leading-5 text-emerald-200"
              role="status"
            ></p>
  
            <button
              type="submit"
              class="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 text-sm font-semibold transition"
              :class="
                availableIncome > 0
                  ? 'bg-brand-gold text-[#17130d] hover:bg-brand-gold-light'
                  : 'cursor-not-allowed border border-brand-border bg-brand-black text-brand-muted'
              "
              :disabled="availableIncome <= 0"
            >
              Submit Payout Request
            </button>
          </form>
        </div>
  
        <section
          class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
          aria-labelledby="payout-history-title"
        >
          <div
            class="flex flex-col gap-3 border-b border-brand-border pb-5 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p
                class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
              >
                Request Records
              </p>
  
              <h2
                id="payout-history-title"
                class="mt-1 font-display text-3xl text-brand-cream"
              >
                Payout History
              </h2>
            </div>
  
            <p class="text-xs leading-5 text-brand-muted">
              Frontend preview
            </p>
          </div>
  
          <div
            x-show="payoutRequests.length === 0"
            class="px-6 py-12 text-center"
          >
            <h3 class="font-display text-2xl text-brand-cream">
              No payout requests yet
            </h3>
  
            <p
              class="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted"
            >
              Submitted requests and admin payment proof will appear
              here after the backend is connected.
            </p>
          </div>
  
          <div
            x-show="payoutRequests.length > 0"
            class="mt-5 grid gap-3"
          >
            <template
              x-for="request in payoutRequests"
              :key="request.id"
            >
              <article
                class="rounded-2xl border border-brand-border bg-brand-black p-4 sm:p-5"
              >
                <div
                  class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
                >
                  <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                      <strong
                        class="font-display text-2xl text-brand-cream"
                        x-text="formatMoney(request.amount)"
                      ></strong>
  
                      <span
                        class="rounded-full border px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.1em]"
                        :class="statusClass(request.status)"
                        x-text="statusLabel(request.status)"
                      ></span>
                    </div>
  
                    <p
                      class="mt-2 text-xs leading-5 text-brand-muted"
                      x-text="
                        request.paymentMethod +
                        ' · ' +
                        request.accountName +
                        ' · ' +
                        request.accountNumber
                      "
                    ></p>
  
                    <p
                      class="mt-1 text-xs text-brand-muted"
                      x-text="'Requested ' + request.requestedAt"
                    ></p>
                  </div>
  
                  <div
                    x-show="request.status === 'paid'"
                    class="lg:text-right"
                  >
                    <p
                      class="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-brand-muted"
                    >
                      Payment Reference
                    </p>
  
                    <p
                      class="mt-1 text-sm font-semibold text-brand-gold"
                      x-text="request.referenceNumber || 'Unavailable'"
                    ></p>
  
                    <a
                      x-show="request.proofUrl"
                      :href="request.proofUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="mt-2 inline-flex text-xs font-semibold text-brand-gold hover:text-brand-gold-light"
                    >
                      View Payment Proof
                    </a>
                  </div>
                </div>
              </article>
            </template>
          </div>
        </section>
      </section>
    `
  }
  