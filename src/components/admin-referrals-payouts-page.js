import { supabase } from '../lib/supabase.js'

import {
  registerAdminReferralCard,
  renderAdminReferralCard,
} from './admin-referral-card.js'

  const previewPayoutRequests = [
    {
      id: 'PAYOUT-0001',
      memberId: 'member-003',
      memberName: 'Ana Cruz',
      memberEmail: 'ana@example.com',
      amount: 500,
      paymentMethod: 'GCash',
      accountName: 'Ana Cruz',
      accountNumber: '09190000000',
      status: 'pending',
      requestedAt: '2026-09-24T08:30:00.000Z',
      reviewedAt: null,
      paidAt: null,
      referenceNumber: '',
      proofUrl: '',
      proofFileName: '',
      adminNote: '',
    },
  ]



  const previewReferralRecords = [
    {
      id: 'REF-0001',
      referrerName: 'Maria Santos',
      referralCode: 'YP-MARIA01',
      referredName: 'Ana Cruz',
      source: 'Member Link',
      status: 'Qualified',
      createdAt: 'Sep 21, 2026',
    },
    {
      id: 'REF-0002',
      referrerName: 'YOUR PRODUCT',
      referralCode: 'YOURPRODUCT',
      referredName: 'Carlo Reyes',
      source: 'Company Link',
      status: 'Registered',
      createdAt: 'Sep 22, 2026',
    },
  ]

  export function registerAdminReferralsPayoutsPage(
    Alpine,
  ) {
    registerAdminReferralCard(Alpine)

    Alpine.data('adminReferralsPayoutsPage', () => ({
      payoutRequests: previewPayoutRequests.map(
        (request) => ({ ...request }),
      ),

      payoutsLoading: true,
      payoutsError: '',

      referralsLoading: true,
      referralsError: '',
      referralRecords: previewReferralRecords.map(
        (record) => ({ ...record }),
      ),

      selectedPayoutId: null,
      payoutAction: '',
      selectedProofUrl: '',
      selectedProofName: '',
      actionError: '',
      actionSuccess: '',

      actionForm: {
        referenceNumber: '',
        proofFileName: '',
        proofPreviewUrl: '',
        proofFile: null,
        adminNote: '',
      },

      async init() {
        await Promise.all([
          this.loadReferralRecords(),
          this.loadPayoutRequests(),
        ])
      },

      async loadReferralRecords() {
        this.referralsLoading = true
        this.referralsError = ''

        try {
          const { data, error } = await supabase
            .from('referral_commissions')
            .select(`
              id, referral_code, package_id, package_amount,
              commission_amount, status, created_at,
              referrer:profiles!referral_commissions_referrer_customer_id_fkey(
                first_name, last_name, email
              ),
              referred:profiles!referral_commissions_referred_customer_id_fkey(
                first_name, last_name, email
              )
            `)
            .order('created_at', { ascending: false })

          if (error) throw error

          this.referralRecords = (data ?? []).map((record) => ({
            id: record.id,
            referrerName: [
              record.referrer?.first_name,
              record.referrer?.last_name,
            ].filter(Boolean).join(' ') || 'Member',
            referrerEmail: record.referrer?.email || '',
            referralCode: record.referral_code || '—',
            referredName: [
              record.referred?.first_name,
              record.referred?.last_name,
            ].filter(Boolean).join(' ') || 'Referred member',
            referredEmail: record.referred?.email || '',
            source:
              `${this.packageLabel(record.package_id)} · ` +
              `${this.formatMoney(record.commission_amount)}`,
            status: this.referralStatusLabel(record.status),
            createdAt: this.formatDate(record.created_at),
          }))
        } catch (error) {
          console.error('Unable to load referral records:', error)
          this.referralsError =
            'Unable to load referral records. Please refresh.'
          this.referralRecords = []
        } finally {
          this.referralsLoading = false
        }
      },

      async loadPayoutRequests() {
        this.payoutsLoading = true
        this.payoutsError = ''

        try {
          const { data, error } = await supabase
            .from('payout_requests')
            .select(`
              id, customer_id, amount, payment_method,
              account_name, account_number, note, status,
              admin_note, reference_number, proof_file_name,
              proof_url, qr_code_path, qr_code_file_name,
              requested_at, reviewed_at, paid_at,
              customer:profiles!payout_requests_customer_id_fkey(
                first_name, last_name, email
              )
            `)
            .order('requested_at', { ascending: false })

          if (error) throw error

          const payoutRows = await Promise.all(
            (data ?? []).map(async (request) => {
              let proofUrl = ''
              let qrCodeUrl = ''
              if (request.proof_url) {
                const { data: signedProof, error: signedProofError } =
                  await supabase.storage
                    .from('payout-proofs')
                    .createSignedUrl(
                      request.proof_url,
                      60 * 10,
                    )

                if (signedProofError) {
                  console.error(
                    'Unable to create payout proof signed URL:',
                    signedProofError,
                  )
                }

                proofUrl = signedProof?.signedUrl || ''
              }

              if (request.qr_code_path) {
                const { data: signedQrCode, error: signedQrCodeError } =
                  await supabase.storage
                    .from('payout-qr-codes')
                    .createSignedUrl(
                      request.qr_code_path,
                      60 * 10,
                    )
              
                if (signedQrCodeError) {
                  console.error(
                    'Unable to create payout QR signed URL:',
                    signedQrCodeError,
                  )
                }
              
                qrCodeUrl = signedQrCode?.signedUrl || ''
              }

              return {
                id: request.id,
                memberId: request.customer_id,
                memberName: [
                  request.customer?.first_name,
                  request.customer?.last_name,
                ].filter(Boolean).join(' ') || 'Member',
                memberEmail: request.customer?.email || 'No email',
                amount: Number(request.amount || 0),
                paymentMethod: request.payment_method,
                accountName: request.account_name,
                accountNumber: request.account_number,
                status: request.status || 'pending',
                requestedAt: request.requested_at,
                reviewedAt: request.reviewed_at,
                paidAt: request.paid_at,
                referenceNumber: request.reference_number || '',
                proofUrl,
                proofFileName: request.proof_file_name || '',
                qrCodeUrl,
                qrCodeFileName: request.qr_code_file_name || '',
                adminNote: request.admin_note || '',
              }
            }),
          )

          this.payoutRequests = payoutRows

        } catch (error) {
          console.error('Unable to load payout requests:', error)
          this.payoutsError =
            'Unable to load payout requests. Please refresh.'
          this.payoutRequests = []
        } finally {
          this.payoutsLoading = false
        }
      },

      packageLabel(packageId) {
        const labels = {
          starter: 'Starter',
          builder: 'Builder',
          leader: 'Leader',
          prestige: 'Prestige',
        }

        return labels[packageId] || 'Membership'
      },

      referralStatusLabel(status) {
        const labels = {
          earned: 'Earned',
          requested: 'Requested',
          approved: 'Approved',
          paid: 'Paid',
          cancelled: 'Cancelled',
        }

        return labels[status] || status || 'Recorded'
      },

      formatMoney(value) {
        return new Intl.NumberFormat('en-PH', {
          style: 'currency',
          currency: 'PHP',
          minimumFractionDigits: 0,
        }).format(Number(value || 0))
      },

      formatDate(value) {
        if (!value) {
          return 'Unavailable'
        }

        const date = new Date(value)

        if (Number.isNaN(date.getTime())) {
          return value
        }

        return new Intl.DateTimeFormat('en-PH', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(date)
      },

      get selectedPayout() {
        return (
          this.payoutRequests.find(
            (request) =>
              request.id === this.selectedPayoutId,
          ) || null
        )
      },

      get pendingPayoutCount() {
        return this.payoutRequests.filter(
          (request) => request.status === 'pending',
        ).length
      },

      get approvedPayoutCount() {
        return this.payoutRequests.filter(
          (request) => request.status === 'approved',
        ).length
      },

      get paidPayoutCount() {
        return this.payoutRequests.filter(
          (request) => request.status === 'paid',
        ).length
      },

      get paidPayoutTotal() {
        return this.payoutRequests
          .filter(
            (request) => request.status === 'paid',
          )
          .reduce(
            (total, request) =>
              total + Number(request.amount || 0),
            0,
          )
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

      resetActionForm() {
        if (this.actionForm.proofPreviewUrl) {
          URL.revokeObjectURL(
            this.actionForm.proofPreviewUrl,
          )
        }

        this.actionForm = {
          referenceNumber: '',
          proofFileName: '',
          proofPreviewUrl: '',
          proofFile: null,
          adminNote: '',
        }
      },

      openPayoutAction(requestId, action) {
        const request = this.payoutRequests.find(
          (requestItem) =>
            requestItem.id === requestId,
        )

        const allowedActions = {
          pending: ['approve', 'reject'],
          approved: ['mark-paid'],
        }

        if (
          !request ||
          !(
            allowedActions[request.status] || []
          ).includes(action)
        ) {
          return
        }

        this.resetActionForm()
        this.selectedPayoutId = requestId
        this.payoutAction = action
        this.actionError = ''
        this.actionSuccess = ''
      },

      closePayoutAction() {
        this.resetActionForm()
        this.selectedPayoutId = null
        this.payoutAction = ''
        this.actionError = ''
      },

      openPayoutProof(request, type = 'payment-proof') {
        if (type === 'payout-qr') {
          if (!request?.qrCodeUrl) return
      
          this.selectedProofUrl = request.qrCodeUrl
          this.selectedProofName = request.qrCodeFileName || 'Payout QR screenshot'
          document.body.classList.add('overflow-hidden')
          return
        }
      
        if (!request?.proofUrl) return
      
        this.selectedProofUrl = request.proofUrl
        this.selectedProofName = request.proofFileName || 'Payout payment proof'
        document.body.classList.add('overflow-hidden')
      },

      closePayoutProof() {
        this.selectedProofUrl = ''
        this.selectedProofName = ''
        document.body.classList.remove('overflow-hidden')
      },

      handlePayoutProof(event) {
        const file = event.target.files?.[0]

        if (this.actionForm.proofPreviewUrl) {
          URL.revokeObjectURL(
            this.actionForm.proofPreviewUrl,
          )
        }

        this.actionForm.proofFileName = ''
        this.actionForm.proofPreviewUrl = ''
        this.actionForm.proofFile = null
        this.actionError = ''

        if (!file) {
          return
        }

        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
        ]

        if (!allowedTypes.includes(file.type)) {
          this.actionError =
            'Upload a JPG, PNG, or WEBP payout proof.'
          event.target.value = ''
          return
        }

        if (file.size > 5 * 1024 * 1024) {
          this.actionError =
            'The payout proof must be 5 MB or smaller.'
          event.target.value = ''
          return
        }

        this.actionForm.proofFileName = file.name
        this.actionForm.proofFile = file
        this.actionForm.proofPreviewUrl =
        URL.createObjectURL(file)
      },

      async confirmPayoutAction() {
        const request = this.selectedPayout

        if (!request || !this.payoutAction) {
          this.actionError =
            'The payout request is unavailable.'
          return
        }

        if (
          this.payoutAction === 'reject' &&
          !this.actionForm.adminNote.trim()
        ) {
          this.actionError =
            'Add an admin note explaining the rejection.'
          return
        }

        if (this.payoutAction === 'mark-paid') {
          if (!this.actionForm.referenceNumber.trim()) {
            this.actionError =
              'Enter the payout payment reference number.'
            return
          }

          if (!this.actionForm.proofFileName) {
            this.actionError =
              'Upload payout payment proof.'
            return
          }
        }

        this.actionError = ''
        this.actionSuccess = ''

        try {
          let payoutProofPath = null

          if (this.payoutAction === 'mark-paid') {
            const fileExtension =
              this.actionForm.proofFileName
                .split('.')
                .pop()
                ?.toLowerCase() || 'png'

            payoutProofPath =
              `${request.id}/${Date.now()}.${fileExtension}`

            const { error: uploadError } =
              await supabase.storage
                .from('payout-proofs')
                .upload(
                  payoutProofPath,
                  this.actionForm.proofFile,
                  {
                    cacheControl: '3600',
                    upsert: false,
                  },
                )

            if (uploadError) throw uploadError
          }

          const { data: nextStatus, error } = await supabase.rpc(
            'admin_update_payout_request',
            {
              p_payout_request_id: request.id,
              p_action: this.payoutAction,
              p_admin_note:
                this.actionForm.adminNote.trim() || null,
              p_reference_number:
                this.actionForm.referenceNumber.trim() || null,
                p_proof_file_name:
                this.actionForm.proofFileName || null,
              p_proof_url:
                payoutProofPath,
            },
          )

          if (error) throw error

          this.actionSuccess =
            nextStatus === 'approved'
              ? 'Payout request approved.'
              : nextStatus === 'rejected'
                ? 'Payout request rejected.'
                : 'Payout marked as paid.'

          this.selectedPayoutId = null
          this.payoutAction = ''
          this.resetActionForm()

          await Promise.all([
            this.loadPayoutRequests(),
            this.loadReferralRecords(),
          ])
        } catch (error) {
          console.error('Unable to update payout request:', error)
          this.actionError =
            error?.message ||
            'Could not update payout request. Please refresh and try again.'
        }
      },

      destroy() {
        if (this.actionForm.proofPreviewUrl) {
          URL.revokeObjectURL(
            this.actionForm.proofPreviewUrl,
          )
        }
      },
    }))
  }

  export function renderAdminReferralsPayoutsPage() {
    return `
      <section
        x-data="adminReferralsPayoutsPage"
        x-show="activePage === 'referrals-payouts'"
        x-transition.opacity
        aria-labelledby="admin-referrals-payouts-title"
      >
        <div
          class="rounded-[1.75rem] border border-brand-gold/30 bg-brand-panel p-6 shadow-gold-soft sm:p-8"
        >
          <p
            class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold"
          >
            Referral Operations
          </p>

          <h1
            id="admin-referrals-payouts-title"
            class="mt-2 font-display text-4xl text-brand-cream sm:text-5xl"
          >
            Referrals & Payouts
          </h1>

          <p
            class="mt-3 max-w-2xl text-sm leading-7 text-brand-muted"
          >
            Monitor direct referral attribution and manually review,
            approve, reject, and record completed member payouts.
          </p>
        </div>

        <div
          class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <article
            class="rounded-[1.35rem] border border-amber-400/30 bg-brand-panel p-5 shadow-panel"
          >
            <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
              Pending Requests
            </p>
            <strong
              class="mt-3 block font-display text-4xl text-amber-300"
              x-text="pendingPayoutCount"
            ></strong>
          </article>

          <article
            class="rounded-[1.35rem] border border-blue-400/30 bg-brand-panel p-5 shadow-panel"
          >
            <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
              Approved
            </p>
            <strong
              class="mt-3 block font-display text-4xl text-blue-300"
              x-text="approvedPayoutCount"
            ></strong>
          </article>

          <article
            class="rounded-[1.35rem] border border-emerald-400/30 bg-brand-panel p-5 shadow-panel"
          >
            <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
              Paid Requests
            </p>
            <strong
              class="mt-3 block font-display text-4xl text-emerald-300"
              x-text="paidPayoutCount"
            ></strong>
          </article>

          <article
            class="rounded-[1.35rem] border border-brand-gold/35 bg-brand-charcoal p-5 shadow-panel"
          >
            <p class="text-xs uppercase tracking-[0.13em] text-brand-muted">
              Total Paid
            </p>
            <strong
              class="mt-3 block font-display text-4xl text-brand-gold"
              x-text="formatMoney(paidPayoutTotal)"
            ></strong>
          </article>
        </div>

        <div class="mt-6">
          ${renderAdminReferralCard()}
        </div>

        <section
          class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
          aria-labelledby="admin-payout-list-title"
        >
          <div class="border-b border-brand-border pb-5">
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
            >
              Manual Review
            </p>
            <h2
              id="admin-payout-list-title"
              class="mt-1 font-display text-3xl text-brand-cream"
            >
              Payout Requests
            </h2>
          </div>

          <p
            x-show="actionSuccess"
            x-text="actionSuccess"
            class="mt-4 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-xs text-emerald-200"
            role="status"
          ></p>

          <div class="mt-5 grid gap-3">
            <template
              x-for="request in payoutRequests"
              :key="request.id"
            >
              <article
                class="rounded-2xl border border-brand-border bg-brand-black p-4 sm:p-5"
              >
                <div
                  class="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_0.8fr_0.8fr_auto] xl:items-center"
                >
                  <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                      <h3
                        class="font-display text-2xl text-brand-cream"
                        x-text="request.memberName"
                      ></h3>
                      <span
                        class="rounded-full border px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.1em]"
                        :class="statusClass(request.status)"
                        x-text="statusLabel(request.status)"
                      ></span>
                    </div>
                    <p
                      class="mt-1 text-xs text-brand-muted"
                      x-text="request.memberEmail"
                    ></p>
                    <p
                      class="mt-1 text-xs text-brand-muted"
                      x-text="'Requested ' + formatDate(request.requestedAt)"
                    ></p>
                  </div>

                  <div>
                    <p class="text-[0.6rem] uppercase tracking-[0.12em] text-brand-muted">
                      Amount
                    </p>
                    <strong
                      class="mt-1 block font-display text-2xl text-brand-gold"
                      x-text="formatMoney(request.amount)"
                    ></strong>
                  </div>

                  <div>
                    <p class="text-[0.6rem] uppercase tracking-[0.12em] text-brand-muted">
                      Destination
                    </p>
                    <p
                      class="mt-1 text-sm font-semibold text-brand-cream"
                      x-text="request.paymentMethod"
                    ></p>
                    <p
                      class="mt-1 text-xs text-brand-muted"
                      x-text="request.accountNumber"
                    ></p>
                    <p
                      x-show="request.status === 'paid'"
                      class="mt-2 text-xs text-emerald-300"
                      x-text="'Reference: ' + (request.referenceNumber || '—')"
                    ></p>
                    <p
                      x-show="request.status === 'paid'"
                      class="mt-1 text-xs text-brand-muted"
                      x-text="'Paid ' + formatDate(request.paidAt)"
                    ></p>
                  </div>

                  <div 
  class="mt-4 grid gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap lg:justify-end" 
> 
  <button 
    x-show="request.qrCodeUrl" 
    type="button" 
    class="inline-flex min-h-10 items-center justify-center rounded-full border border-brand-gold/40 px-4 text-xs font-semibold text-brand-gold transition hover:border-brand-gold hover:bg-brand-gold/10" 
    @click="openPayoutProof(request, 'payout-qr')" 
  > 
    View Payout QR 
  </button>

  <button 
    x-show="request.status === 'pending'" 
    type="button" 
    class="inline-flex min-h-10 items-center justify-center rounded-full bg-brand-gold px-4 text-xs font-semibold text-[#17130d]"    
    @click="openPayoutAction(request.id, 'approve')" 
  > 
    Approve 
  </button>

                    <button
                      x-show="request.status === 'pending'"
                      type="button"
                      class="inline-flex min-h-10 items-center justify-center rounded-full border border-red-400/40 px-4 text-xs font-semibold text-red-300"
                      @click="openPayoutAction(request.id, 'reject')"
                    >
                      Reject
                    </button>

                    <button
                      x-show="request.status === 'approved'"
                      type="button"
                      class="inline-flex min-h-10 items-center justify-center rounded-full bg-emerald-600 px-4 text-xs font-semibold text-white"
                      @click="openPayoutAction(request.id, 'mark-paid')"
                    >
                      Mark as Paid
                    </button>

                    <button
                      x-show="request.status === 'paid' && request.proofUrl"
                      type="button"
                      class="inline-flex min-h-10 items-center justify-center rounded-full border border-brand-gold/40 px-4 text-xs font-semibold text-brand-gold transition hover:border-brand-gold hover:bg-brand-gold/10"
                      @click="openPayoutProof(request)"
                    >
                      View Proof
                    </button>
                  </div>
                </div>

                <div
                  x-show="selectedPayoutId === request.id"
                  x-transition
                  class="mt-5 border-t border-brand-border pt-5"
                >
                  <h4
                    class="font-display text-2xl text-brand-cream"
                    x-text="
                      payoutAction === 'approve'
                        ? 'Approve payout request'
                        : payoutAction === 'reject'
                          ? 'Reject payout request'
                          : 'Record completed payout'
                    "
                  ></h4>

                  <div
                    x-show="payoutAction === 'mark-paid'"
                    class="mt-4 grid gap-4 sm:grid-cols-2"
                  >
                    <label class="grid gap-2">
                      <span class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
                        Payment Reference
                      </span>
                      <input
                        type="text"
                        maxlength="100"
                        x-model.trim="actionForm.referenceNumber"
                        class="min-h-12 rounded-xl border border-brand-border bg-brand-panel px-4 text-sm text-brand-cream outline-none focus:border-brand-gold"
                      >
                    </label>

                    <label class="grid gap-2">
                      <span class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
                        Payout Proof
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        class="min-h-12 rounded-xl border border-brand-border bg-brand-panel px-3 py-2 text-xs text-brand-muted file:mr-3 file:rounded-full file:border-0 file:bg-brand-gold file:px-3 file:py-2 file:font-semibold file:text-[#17130d]"
                        @change="handlePayoutProof($event)"
                      >
                    </label>
                  </div>

                  <label class="mt-4 grid gap-2">
                    <span class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
                      Admin Note
                    </span>
                    <textarea
                      rows="3"
                      maxlength="300"
                      x-model.trim="actionForm.adminNote"
                      class="w-full resize-none rounded-xl border border-brand-border bg-brand-panel px-4 py-3 text-sm text-brand-cream outline-none focus:border-brand-gold"
                    ></textarea>
                  </label>

                  <p
                    x-show="actionError"
                    x-text="actionError"
                    class="mt-3 text-xs text-red-300"
                    role="alert"
                  ></p>

                  <div class="mt-4 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      class="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-border px-4 text-sm font-semibold text-brand-cream"
                      @click="closePayoutAction()"
                    >
                      Keep Current Status
                    </button>
                    <button
                      type="button"
                      class="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold"
                      :class="
                        payoutAction === 'reject'
                          ? 'bg-red-700 text-white'
                          : payoutAction === 'mark-paid'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-brand-gold text-[#17130d]'
                      "
                      @click="confirmPayoutAction()"
                      x-text="
                        payoutAction === 'approve'
                          ? 'Confirm Approval'
                          : payoutAction === 'reject'
                            ? 'Confirm Rejection'
                            : 'Confirm Paid Payout'
                      "
                    ></button>
                  </div>
                </div>
              </article>
            </template>
          </div>
        </section>

        <!-- ✅ Modal correctly placed BEFORE Referral Records section -->
        <div
          x-show="selectedProofUrl"
          x-transition.opacity
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Payout proof preview"
          @keydown.escape.window="closePayoutProof()"
        >
          <div class="relative max-h-full w-full max-w-4xl">
            <button
              type="button"
              class="absolute right-2 top-2 z-10 grid size-10 place-items-center rounded-full bg-brand-black text-xl font-bold text-brand-cream shadow-lg transition hover:bg-brand-gold hover:text-brand-black"
              @click="closePayoutProof()"
              aria-label="Close payout proof preview"
            >
              ×
            </button>

            <img
              :src="selectedProofUrl"
              :alt="selectedProofName"
              class="mx-auto max-h-[85vh] w-full rounded-2xl border border-brand-border bg-brand-black object-contain"
            >

            <p
              x-show="selectedProofName"
              class="mt-3 break-all text-center text-xs font-semibold text-brand-cream"
              x-text="selectedProofName"
            ></p>
          </div>
        </div>

        <section
          class="mt-6 rounded-[1.5rem] border border-brand-border bg-brand-panel p-5 shadow-panel sm:p-6"
          aria-labelledby="admin-referral-records-title"
        >
          <p
            class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
          >
            Referral Records
          </p>
          <h2
            id="admin-referral-records-title"
            class="sr-only"
          >
            Referral Records
          </h2>

          <p class="mt-2 text-sm leading-6 text-brand-muted">
            Track which member invited each new member through a referral link.
          </p>

          <div class="mt-5 grid gap-3">
            <template
              x-for="record in referralRecords"
              :key="record.id"
            >
              <article
                class="grid gap-4 rounded-2xl border border-brand-border bg-brand-black p-4 md:grid-cols-[1.1fr_1.1fr_0.8fr_auto] md:items-center"
              >
                <div>
                  <p class="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-brand-gold">
                    New member
                  </p>
                  <p
                    class="mt-1 font-semibold text-brand-cream"
                    x-text="record.referredName"
                  ></p>
                  <p
                    class="mt-1 text-xs text-brand-muted"
                    x-text="record.referredEmail || record.id"
                  ></p>
                </div>

                <div>
                  <p class="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-brand-gold">
                    Invited by
                  </p>
                  <p
                    class="mt-1 font-semibold text-brand-cream"
                    x-text="record.referrerName"
                  ></p>
                  <p
                    class="mt-1 text-xs text-brand-muted"
                  >
                    Referral code:
                    <span
                      class="font-semibold text-brand-gold"
                      x-text="record.referralCode"
                    ></span>
                  </p>
                </div>

                <div>
                  <p class="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-brand-gold">
                    Reward
                  </p>
                  <p
                    class="mt-1 text-sm font-semibold text-brand-cream"
                    x-text="record.source"
                  ></p>
                  <p
                    class="mt-1 text-xs text-brand-muted"
                    x-text="record.createdAt"
                  ></p>
                </div>

                <span
                  class="w-fit rounded-full border border-brand-border px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-brand-muted"
                  x-text="record.status"
                ></span>
              </article>
            </template>
          </div>
        </section>
      </section>
    `
  }