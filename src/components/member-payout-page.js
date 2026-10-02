import { supabase } from '../lib/supabase.js'

export function registerMemberPayoutPage(Alpine) {
  Alpine.data('memberPayoutPage', () => ({
    availableIncome: 0,
    payoutRequests: [],
    loading: true,
    submitting: false,

    form: {
      amount: '',
      paymentMethod: '',
      paymentProvider: '',
      accountName: '',
      accountNumber: '',
      qrCodeFile: null,
      qrCodeFileName: '',
      qrCodePreviewUrl: '',
      note: '',
    },

    errorMessage: '',
    successMessage: '',

    async init() {
      await this.loadPayoutData()
    },

    async loadPayoutData() {
      this.loading = true
      this.errorMessage = ''

      try {
        const [commissionsResult, payoutsResult] =
          await Promise.all([
            supabase
              .from('referral_commissions')
              .select('commission_amount')
              .eq('status', 'earned'),
            supabase
              .from('payout_requests')
              .select(`
                id, amount, payment_method, payment_provider,
account_name, account_number, qr_code_path,
qr_code_file_name, note, status, reference_number,
proof_url, requested_at, reviewed_at, paid_at
              `)
              .order('requested_at', { ascending: false }),
          ])

        if (commissionsResult.error) {
          throw commissionsResult.error
        }

        if (payoutsResult.error) {
          throw payoutsResult.error
        }

        this.availableIncome = (commissionsResult.data ?? [])
          .reduce(
            (total, commission) =>
              total +
              Number(commission.commission_amount || 0),
            0,
          )

        this.payoutRequests = (payoutsResult.data ?? [])
          .map((request) => ({
            id: request.id,
            amount: Number(request.amount || 0),
            paymentMethod: request.payment_method,
            paymentProvider: request.payment_provider || '',
            qrCodePath: request.qr_code_path || '',
            qrCodeFileName: request.qr_code_file_name || '',
            accountName: request.account_name,
            accountNumber: request.account_number,
            note: request.note || '',
            status: request.status || 'pending',
            requestedAt: request.requested_at,
            referenceNumber: request.reference_number || '',
            proofUrl: request.proof_url || '',
            paidAt: request.paid_at || '',
          }))
      } catch (error) {
        console.error('Unable to load payout data:', error)
        this.errorMessage =
          'Unable to load payout details. Please refresh.'
        this.availableIncome = 0
        this.payoutRequests = []
      } finally {
        this.loading = false
      }
    },

    formatMoney(value) {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
      }).format(Number(value || 0))
    },

    formatDate(value) {
      if (!value) return 'Not available'

      return new Intl.DateTimeFormat('en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(value))
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

    handleQrCodeUpload(event) {
      const file = event.target.files?.[0]

      if (this.form.qrCodePreviewUrl) {
        URL.revokeObjectURL(
          this.form.qrCodePreviewUrl,
        )
      }

      this.form.qrCodeFile = null
      this.form.qrCodeFileName = ''
      this.form.qrCodePreviewUrl = ''
      this.errorMessage = ''

      if (!file) return

      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
      ]

      if (!allowedTypes.includes(file.type)) {
        this.errorMessage =
          'Upload a JPG, PNG, or WEBP QR code.'
        event.target.value = ''
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage =
          'The QR code image must be 5 MB or smaller.'
        event.target.value = ''
        return
      }

      this.form.qrCodeFile = file
      this.form.qrCodeFileName = file.name
      this.form.qrCodePreviewUrl =
        URL.createObjectURL(file)
    },

    resetForm() {
      if (this.form.qrCodePreviewUrl) {
        URL.revokeObjectURL(
          this.form.qrCodePreviewUrl,
        )
      }

      this.form = {
        amount: '',
        paymentMethod: '',
        paymentProvider: '',
        accountName: '',
        accountNumber: '',
        qrCodeFile: null,
        qrCodeFileName: '',
        qrCodePreviewUrl: '',
        note: '',
      }
    },

    async submitPayoutRequest() {
      if (this.submitting) return

      this.errorMessage = ''
      this.successMessage = ''

      const requestedAmount = Number(this.form.amount)

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
        this.errorMessage = 'Select a payout method.'
        return
      }

      if (!this.form.paymentProvider.trim()) {
        this.errorMessage =
          'Select or enter the payout provider.'
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

      if (!this.form.qrCodeFile) {
        this.errorMessage =
          'Upload the QR code for your payout account.'
        return
      }

      this.submitting = true

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          throw userError || new Error('Sign in required.')
        }

        const fileExtension =
          this.form.qrCodeFileName
            .split('.')
            .pop()
            ?.toLowerCase() || 'png'

        const qrCodePath =
          `${user.id}/${Date.now()}.${fileExtension}`

        const { error: uploadError } =
          await supabase.storage
            .from('payout-qr-codes')
            .upload(
              qrCodePath,
              this.form.qrCodeFile,
              {
                cacheControl: '3600',
                upsert: false,
              },
            )

        if (uploadError) throw uploadError

        const { error } = await supabase.rpc(
          'customer_create_payout_request',
          {
            p_amount: requestedAmount,
            p_payment_method: this.form.paymentMethod,
            p_payment_provider:
              this.form.paymentProvider.trim(),
            p_account_name:
              this.form.accountName.trim(),
            p_account_number:
              this.form.accountNumber.trim(),
            p_qr_code_path: qrCodePath,
            p_qr_code_file_name:
              this.form.qrCodeFileName || null,
            p_note: this.form.note.trim() || null,
          }
        )

        if (error) throw error

        this.successMessage =
          'Payout request submitted for admin review.'
        this.resetForm()
        await this.loadPayoutData()
      } catch (error) {
        console.error('Unable to submit payout request:', error)
        this.errorMessage =
          error?.message ||
          'Could not submit payout request. Please refresh and try again.'
      } finally {
        this.submitting = false
      }
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
            <p class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold">
              Manual Payout
            </p>

            <h1
              id="member-payout-title"
              class="mt-2 font-display text-4xl text-brand-cream sm:text-5xl"
            >
              Payout Request
            </h1>

            <p class="mt-3 max-w-2xl text-sm leading-7 text-brand-muted">
              Submit payout details for manual admin review and monitor previous payout requests.
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

      <p
        x-show="loading"
        class="mt-6 rounded-xl border border-brand-border bg-brand-panel p-5 text-sm text-brand-muted"
      >
        Loading payout details...
      </p>

      <div x-show="!loading">
        <div class="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <aside class="rounded-[1.5rem] border border-emerald-400/30 bg-brand-panel p-5 shadow-panel sm:p-6">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-brand-muted">
              Available Balance
            </p>

            <strong
              class="mt-3 block font-display text-5xl text-emerald-300"
              x-text="formatMoney(availableIncome)"
            ></strong>

            <p class="mt-4 text-xs leading-5 text-brand-muted">
              Only earned direct-referral commissions can be requested.
              For MVP, request the exact available commission amount.
            </p>
          </aside>

          <form
            class="rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
            @submit.prevent="submitPayoutRequest()"
            novalidate
          >
            <div>
              <p class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold">
                Request Details
              </p>

              <h2 class="mt-1 font-display text-3xl text-brand-cream">
                Where should we send it?
              </h2>
            </div>

            <div class="mt-5 grid gap-4 sm:grid-cols-2">
              <label class="grid gap-2">
                <span class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
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
                <span class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
                  Payout Method
                </span>

                <select
                  x-model="form.paymentMethod"
                  class="min-h-12 rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
                >
                  <option value="">Select method</option>
                  <option value="gcash">GCash</option>
                  <option value="maya">Maya</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </label>

              <label class="grid gap-2">
  <span class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
    Provider / Bank
  </span>

  <select
    x-model="form.paymentProvider"
    class="min-h-12 rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
  >
<option value="">Select provider</option>
<option value="GCash">GCash</option>
<option value="Maya">Maya</option>
<option value="GoTyme">GoTyme</option>
<option value="Maya Bank">Maya Bank</option>
<option value="Maribank">Maribank</option>
<option value="CIMB">CIMB</option>
<option value="UnionBank">UnionBank</option>
<option value="BDO">BDO</option>
<option value="PSBank">PSBank</option>
<option value="BPI">BPI</option>
<option value="Metrobank">Metrobank</option>
<option value="RCBC">RCBC</option>
<option value="EastWest Bank">EastWest Bank</option>
<option value="Security Bank">Security Bank</option>
<option value="China Bank">China Bank</option>
  </select>
</label>

              <label class="grid gap-2">
                <span class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
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
                <span class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
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

              <label class="mt-4 grid gap-2">
  <span class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
    QR Code Screenshot
  </span>

  <input
    type="file"
    accept="image/jpeg,image/png,image/webp"
    class="min-h-12 rounded-xl border border-brand-border bg-brand-black px-3 py-2 text-xs text-brand-muted file:mr-3 file:rounded-full file:border-0 file:bg-brand-gold file:px-3 file:py-2 file:font-semibold file:text-[#17130d]"
    @change="handleQrCodeUpload($event)"
  >

  <span
    x-show="form.qrCodeFileName"
    x-text="'Selected: ' + form.qrCodeFileName"
    class="text-xs text-brand-gold"
  ></span>
</label>
            </div>

            <label class="mt-4 grid gap-2">
              <span class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
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
                availableIncome > 0 && !submitting
                  ? 'bg-brand-gold text-[#17130d] hover:bg-brand-gold-light'
                  : 'cursor-not-allowed border border-brand-border bg-brand-black text-brand-muted'
              "
              :disabled="availableIncome <= 0 || submitting"
              x-text="submitting ? 'Submitting request...' : 'Submit Payout Request'"
            ></button>
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
              <p class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold">
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
              Real payout requests
            </p>
          </div>

          <div
            x-show="payoutRequests.length === 0"
            class="px-6 py-12 text-center"
          >
            <h3 class="font-display text-2xl text-brand-cream">
              No payout requests yet
            </h3>

            <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted">
              Submitted requests and admin payment proof will appear here.
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
              <article class="rounded-2xl border border-brand-border bg-brand-black p-4 sm:p-5">
                <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
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
                      (request.paymentProvider || 'No provider') +
                      ' · ' +
                      request.accountName +
                      ' · ' +
                      request.accountNumber
                      "
                    ></p>

                    <p
                      class="mt-1 text-xs text-brand-muted"
                      x-text="'Requested ' + formatDate(request.requestedAt)"
                    ></p>
                  </div>

                  <div
                    x-show="request.status === 'paid'"
                    class="lg:text-right"
                  >
                    <p class="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-brand-muted">
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
      </div>
    </section>
  `
}
