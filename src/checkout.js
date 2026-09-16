import './style.css'

import Alpine from 'alpinejs'

import logoImage from './assets/logoyourproduct.png'

import {
  products,
} from './config/products-config.js'

import {
  registerCartStore,
} from './stores/cart-store.js'

import {
  siteConfig,
} from './config/site-config.js'

const pesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 0,
})

window.Alpine = Alpine

registerCartStore(Alpine, products)

Alpine.data('checkoutPage', () => ({
  customer: {
    buyerType: 'non-member',
    fullName: '',
    mobileNumber: '',
    emailAddress: '',
    memberCode: '',
  },

  delivery: {
    province: '',
    city: '',
    barangay: '',
    completeAddress: '',
    postalCode: '',
    notes: '',
  },

  payment: {
    method: '',
    proofFile: null,
    proofFileName: '',
  },
  
  paymentError: '',
  paymentDetailsComplete: false,
  checkoutPreviewComplete: false,
  customerDetailsComplete: false,
  deliveryDetailsComplete: false,

  formatMoney(value) {
    return pesoFormatter.format(value)
  },

  saveCustomerDetails() {
    this.customerDetailsComplete = true

    requestAnimationFrame(() => {
      document
        .querySelector('#delivery-details')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
    })
  },

  saveDeliveryDetails() {
    this.deliveryDetailsComplete = true
  
    requestAnimationFrame(() => {
      document
        .querySelector('#payment-details')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
    })
  },

  handleProofFile(event) {
    const file = event.target.files?.[0]
  
    this.paymentError = ''
    this.payment.proofFile = null
    this.payment.proofFileName = ''
    this.paymentDetailsComplete = false
  
    if (!file) {
      return
    }
  
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ]
  
    const maximumFileSize = 5 * 1024 * 1024
  
    if (!allowedTypes.includes(file.type)) {
      this.paymentError =
        'Please select a JPG, PNG, WEBP, or PDF file.'
  
      event.target.value = ''
      return
    }
  
    if (file.size > maximumFileSize) {
      this.paymentError =
        'The selected file must not exceed 5 MB.'
  
      event.target.value = ''
      return
    }
  
    this.payment.proofFile = file
    this.payment.proofFileName = file.name
  },
  
  savePaymentDetails() {
    if (!this.payment.proofFile) {
      this.paymentError =
        'Please select your proof of payment.'
  
      return
    }
  
    this.paymentError = ''
    this.checkoutPreviewComplete = false
    this.paymentDetailsComplete = true
  
    requestAnimationFrame(() => {
      document
        .querySelector('#final-order-review')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
    })
  },
  
  paymentMethodLabel() {
    const labels = {
      'e-wallet': 'E-wallet transfer',
      'bank-transfer': 'Bank transfer',
      other: 'Other manual payment',
    }
  
    return labels[this.payment.method] ?? 'Not selected'
  },
  
  completeCheckoutPreview() {
    this.checkoutPreviewComplete = true
  },

}))

document.title = `Checkout | ${siteConfig.brand.name}`

document.querySelector('#checkout-app').innerHTML = `
  <div
    x-data="checkoutPage"
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

        <div
          class="inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-brand-muted"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            class="size-4 text-brand-gold"
            aria-hidden="true"
          >
            <rect
              x="5"
              y="10"
              width="14"
              height="10"
              rx="2"
              stroke="currentColor"
              stroke-width="1.6"
            />

            <path
              d="M8 10V7a4 4 0 0 1 8 0v3"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>

          Secure checkout
        </div>
      </div>
    </header>

    <main class="px-5 py-10 sm:py-14">
      <div class="mx-auto w-full max-w-5xl">
        <a
          href="/"
          class="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold transition hover:text-brand-gold-light"
        >
          <span aria-hidden="true">←</span>
          Continue shopping
        </a>

        <div class="mt-8">
          <p
            class="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold"
          >
            Your order
          </p>

          <h1
            class="mt-3 font-display text-4xl leading-tight text-brand-cream sm:text-5xl"
          >
            Review your cart.
          </h1>

          <p
            class="mt-3 max-w-2xl text-sm leading-6 text-brand-muted sm:text-base"
          >
            Confirm your selected fragrances and quantities before
            entering your checkout information.
          </p>
        </div>

        <section
          x-show="$store.cart.itemCount === 0"
          class="mt-8 rounded-[1.5rem] border border-brand-border bg-brand-panel px-6 py-14 text-center shadow-panel"
        >
          <div
            class="mx-auto grid size-16 place-items-center rounded-full border border-brand-border text-brand-gold"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              class="size-7"
              aria-hidden="true"
            >
              <path
                d="M3.5 4.5h2l1.65 9.1a2 2 0 0 0 1.97 1.65h7.96a2 2 0 0 0 1.95-1.55L20.5 7.5H6.05"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <circle
                cx="9.25"
                cy="19"
                r="1.25"
                fill="currentColor"
              />

              <circle
                cx="17.25"
                cy="19"
                r="1.25"
                fill="currentColor"
              />
            </svg>
          </div>

          <h2
            class="mt-5 font-display text-3xl text-brand-cream"
          >
            Your cart is empty
          </h2>

          <p
            class="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted"
          >
            Add a fragrance from the storefront before continuing to
            checkout.
          </p>

          <a
            href="/#shop"
            class="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-light"
          >
            Browse fragrances
          </a>
        </section>

        <div
          x-show="$store.cart.itemCount > 0"
          class="mt-8 grid gap-6 lg:grid-cols-[1fr_0.42fr] lg:items-start"
        >
          <section
            class="overflow-hidden rounded-[1.5rem] border border-brand-border bg-brand-panel shadow-panel"
          >
            <header
              class="flex items-center justify-between gap-4 border-b border-brand-border px-5 py-5 sm:px-6"
            >
              <div>
                <p
                  class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
                >
                  Selected fragrances
                </p>

                <h2
                  class="mt-1 font-display text-2xl text-brand-cream"
                >
                  Order items
                </h2>
              </div>

              <span
                class="text-sm font-semibold text-brand-muted"
                x-text="
                  $store.cart.itemCount === 1
                    ? '1 item'
                    : $store.cart.itemCount + ' items'
                "
              ></span>
            </header>

            <div class="divide-y divide-brand-border">
              <template
                x-for="item in $store.cart.detailedItems"
                :key="item.productId"
              >
                <article
                  class="grid grid-cols-[5rem_1fr] gap-4 p-5 sm:grid-cols-[6rem_1fr] sm:p-6"
                >
                  <div
                    class="size-20 overflow-hidden rounded-xl bg-brand-cream sm:size-24"
                  >
                    <img
                      :src="item.product.image"
                      :alt="item.product.name"
                      class="size-full object-contain p-2"
                    >
                  </div>

                  <div class="min-w-0">
                    <div
                      class="flex items-start justify-between gap-3"
                    >
                      <div class="min-w-0">
                        <p
                          class="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-brand-gold sm:text-[0.65rem]"
                          x-text="item.product.collectionLabel"
                        ></p>

                        <h3
                          class="mt-1 truncate font-display text-xl text-brand-cream sm:text-2xl"
                          x-text="item.product.name"
                        ></h3>
                      </div>

                      <strong
                        class="shrink-0 text-sm text-brand-cream sm:text-base"
                        x-text="formatMoney(item.lineTotal)"
                      ></strong>
                    </div>

                    <p
                      class="mt-1 text-xs text-brand-muted"
                      x-text="
                        formatMoney(item.product.regularPrice) +
                        ' each'
                      "
                    ></p>

                    <div
                      class="mt-4 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div
                        class="flex items-center rounded-full border border-brand-border"
                      >
                        <button
                          type="button"
                          class="grid size-9 place-items-center text-brand-cream transition hover:text-brand-gold"
                          aria-label="Decrease quantity"
                          @click="$store.cart.decrease(item.productId)"
                        >
                          −
                        </button>

                        <span
                          class="min-w-8 text-center text-sm font-semibold text-brand-cream"
                          x-text="item.quantity"
                        ></span>

                        <button
                          type="button"
                          class="grid size-9 place-items-center text-brand-cream transition hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Increase quantity"
                          :disabled="
                            item.quantity >=
                            item.product.stockQuantity
                          "
                          @click="$store.cart.increase(item.productId)"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        class="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-brand-muted transition hover:text-red-700"
                        @click="$store.cart.remove(item.productId)"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              </template>
            </div>
          </section>

          <aside
            class="rounded-[1.5rem] border border-brand-gold/30 bg-brand-panel p-5 shadow-gold-soft sm:p-6 lg:sticky lg:top-6"
          >
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
            >
              Order summary
            </p>

            <div
              class="mt-5 flex items-center justify-between gap-4"
            >
              <span class="text-sm text-brand-muted">
                Items
              </span>

              <span
                class="font-semibold text-brand-cream"
                x-text="$store.cart.itemCount"
              ></span>
            </div>

            <div
              class="mt-3 flex items-center justify-between gap-4"
            >
              <span class="text-sm text-brand-muted">
                Subtotal
              </span>

              <span
                class="font-semibold text-brand-cream"
                x-text="formatMoney($store.cart.subtotal)"
              ></span>
            </div>

            <div
              class="mt-3 flex items-center justify-between gap-4"
            >
              <span class="text-sm text-brand-muted">
                Delivery
              </span>

              <span
                class="text-xs font-semibold text-brand-muted"
              >
                Calculated next
              </span>
            </div>

            <div
              class="mt-5 flex items-end justify-between gap-4 border-t border-brand-border pt-5"
            >
              <span
                class="text-sm font-semibold uppercase tracking-[0.12em] text-brand-muted"
              >
                Estimated total
              </span>

              <strong
                class="font-display text-3xl text-brand-gold"
                x-text="formatMoney($store.cart.subtotal)"
              ></strong>
            </div>

            <p class="mt-4 text-xs leading-5 text-brand-muted">
              Delivery fees and final checkout rules remain subject to
              client confirmation.
            </p>

            <div
              class="mt-6 flex items-center justify-center gap-2 border-t border-brand-border pt-5 text-xs text-brand-muted"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                class="size-4 text-brand-gold"
                aria-hidden="true"
              >
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  stroke-width="1.6"
                />

                <path
                  d="M8 10V7a4 4 0 0 1 8 0v3"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>

              Secure checkout
            </div>
                    </aside>
        </div>

        <section
          x-show="$store.cart.itemCount > 0"
          class="mt-6 overflow-hidden rounded-[1.5rem] border border-brand-border bg-brand-panel shadow-panel"
        >
          <header
            class="border-b border-brand-border px-5 py-5 sm:px-6"
          >
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
            >
              Checkout information
            </p>

            <h2
              class="mt-1 font-display text-3xl text-brand-cream"
            >
              Customer details
            </h2>

            <p class="mt-2 text-sm leading-6 text-brand-muted">
              Enter the contact information that will be used for your
              order.
            </p>
          </header>

          <form
            class="p-5 sm:p-6"
            @submit.prevent="saveCustomerDetails"
            @input="customerDetailsComplete = false"
          >
            <div>
              <label
                for="buyer-type"
                class="text-sm font-semibold text-brand-cream"
              >
                Buyer type
              </label>

              <select
                id="buyer-type"
                x-model="customer.buyerType"
                class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
                required
              >
                <option value="non-member">
                  Non-member
                </option>

                <option value="member">
                  Existing member
                </option>
              </select>

              <p class="mt-2 text-xs leading-5 text-brand-muted">
                Member pricing will only be applied after membership
                verification.
              </p>
            </div>

            <div
              x-show="customer.buyerType === 'member'"
              x-transition
              class="mt-5"
            >
              <label
                for="member-code"
                class="text-sm font-semibold text-brand-cream"
              >
                Member ID or referral code
              </label>

              <input
                id="member-code"
                type="text"
                x-model.trim="customer.memberCode"
                :required="customer.buyerType === 'member'"
                autocomplete="off"
                placeholder="Enter your member ID"
                class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
              >
            </div>

            <div
              class="mt-5 grid gap-5 sm:grid-cols-2"
            >
              <div>
                <label
                  for="full-name"
                  class="text-sm font-semibold text-brand-cream"
                >
                  Full name
                </label>

                <input
                  id="full-name"
                  type="text"
                  x-model.trim="customer.fullName"
                  autocomplete="name"
                  placeholder="Juan Dela Cruz"
                  class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                  required
                >
              </div>

              <div>
                <label
                  for="mobile-number"
                  class="text-sm font-semibold text-brand-cream"
                >
                  Mobile number
                </label>

                <input
                  id="mobile-number"
                  type="tel"
                  x-model.trim="customer.mobileNumber"
                  inputmode="tel"
                  autocomplete="tel"
                  minlength="10"
                  maxlength="13"
                  placeholder="09XXXXXXXXX"
                  class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                  required
                >
              </div>
            </div>

            <div class="mt-5">
              <label
                for="email-address"
                class="text-sm font-semibold text-brand-cream"
              >
                Email address
              </label>

              <input
                id="email-address"
                type="email"
                x-model.trim="customer.emailAddress"
                autocomplete="email"
                placeholder="name@example.com"
                class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                required
              >

              <p class="mt-2 text-xs leading-5 text-brand-muted">
                Order updates and confirmation may be sent to this email.
              </p>
            </div>

            <div
              x-show="customerDetailsComplete"
              x-transition
              class="mt-4 rounded-xl border border-[#2f6b59] bg-[#234f42] px-4 py-3 text-sm font-medium leading-6 text-[#fff8e9] shadow-sm"
              role="status"
            >
              Customer information is complete. Your details have not
              been submitted yet.
            </div>

            <div
              class="mt-6 flex flex-col-reverse gap-3 border-t border-brand-border pt-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <p class="text-xs leading-5 text-brand-muted">
                Delivery details will be completed in the next step.
              </p>

              <button
                type="submit"
                class="inline-flex h-12 items-center justify-center rounded-full bg-brand-gold px-7 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-light"
              >
                Continue to delivery
              </button>
            </div>
          </form>
                </section>

        <section
          id="delivery-details"
          x-show="customerDetailsComplete"
          x-transition
          class="mt-6 scroll-mt-6 overflow-hidden rounded-[1.5rem] border border-brand-border bg-brand-panel shadow-panel"
        >
          <header
            class="border-b border-brand-border px-5 py-5 sm:px-6"
          >
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
            >
              Shipping information
            </p>

            <h2
              class="mt-1 font-display text-3xl text-brand-cream"
            >
              Delivery details
            </h2>

            <p class="mt-2 text-sm leading-6 text-brand-muted">
              Provide the complete address where the order should be
              delivered.
            </p>
          </header>

          <form
            class="p-5 sm:p-6"
            @submit.prevent="saveDeliveryDetails"
            @input="deliveryDetailsComplete = false"
          >
            <div class="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  for="province"
                  class="text-sm font-semibold text-brand-cream"
                >
                  Province
                </label>

                <input
                  id="province"
                  type="text"
                  x-model.trim="delivery.province"
                  autocomplete="address-level1"
                  placeholder="Example: Cavite"
                  class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                  required
                >
              </div>

              <div>
                <label
                  for="city"
                  class="text-sm font-semibold text-brand-cream"
                >
                  City or municipality
                </label>

                <input
                  id="city"
                  type="text"
                  x-model.trim="delivery.city"
                  autocomplete="address-level2"
                  placeholder="Example: Bacoor"
                  class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                  required
                >
              </div>
            </div>

            <div class="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  for="barangay"
                  class="text-sm font-semibold text-brand-cream"
                >
                  Barangay
                </label>

                <input
                  id="barangay"
                  type="text"
                  x-model.trim="delivery.barangay"
                  autocomplete="address-level3"
                  placeholder="Enter barangay"
                  class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                  required
                >
              </div>

              <div>
                <label
                  for="postal-code"
                  class="text-sm font-semibold text-brand-cream"
                >
                  Postal code
                </label>

                <input
                  id="postal-code"
                  type="text"
                  x-model.trim="delivery.postalCode"
                  inputmode="numeric"
                  autocomplete="postal-code"
                  maxlength="4"
                  placeholder="Enter postal code"
                  class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                  required
                >
              </div>
            </div>

            <div class="mt-5">
              <label
                for="complete-address"
                class="text-sm font-semibold text-brand-cream"
              >
                House number, street and subdivision
              </label>

              <textarea
                id="complete-address"
                x-model.trim="delivery.completeAddress"
                autocomplete="street-address"
                rows="3"
                placeholder="Enter the complete delivery address"
                class="mt-2 w-full resize-none rounded-xl border border-brand-border bg-brand-black px-4 py-3 text-sm leading-6 text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                required
              ></textarea>
            </div>

            <div class="mt-5">
              <label
                for="order-notes"
                class="text-sm font-semibold text-brand-cream"
              >
                Delivery notes
                <span class="font-normal text-brand-muted">
                  (Optional)
                </span>
              </label>

              <textarea
                id="order-notes"
                x-model.trim="delivery.notes"
                rows="3"
                maxlength="300"
                placeholder="Landmark or special delivery instructions"
                class="mt-2 w-full resize-none rounded-xl border border-brand-border bg-brand-black px-4 py-3 text-sm leading-6 text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
              ></textarea>
            </div>

            <div
              x-show="deliveryDetailsComplete"
              x-transition
              class="mt-4 rounded-xl border border-[#2f6b59] bg-[#234f42] px-4 py-3 text-sm font-medium leading-6 text-[#fff8e9] shadow-sm"
              role="status"
            >
              Delivery information is complete. Nothing has been
              submitted yet.
            </div>

            <div
              class="mt-6 flex flex-col-reverse gap-3 border-t border-brand-border pt-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <p class="text-xs leading-5 text-brand-muted">
                Payment selection will be added in the next step.
              </p>

              <button
                type="submit"
                class="inline-flex h-12 items-center justify-center rounded-full bg-brand-gold px-7 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-light"
              >
                Continue to payment
              </button>
            </div>
          </form>
                </section>

        <section
          id="payment-details"
          x-show="deliveryDetailsComplete"
          x-transition
          class="mt-6 scroll-mt-6 overflow-hidden rounded-[1.5rem] border border-brand-border bg-brand-panel shadow-panel"
        >
          <header
            class="border-b border-brand-border px-5 py-5 sm:px-6"
          >
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
            >
              Manual payment
            </p>

            <h2
              class="mt-1 font-display text-3xl text-brand-cream"
            >
              Payment details
            </h2>

            <p class="mt-2 text-sm leading-6 text-brand-muted">
              Select how you intend to pay and attach a clear copy of
              your payment receipt.
            </p>
          </header>

          <form
            class="p-5 sm:p-6"
            @submit.prevent="savePaymentDetails"
          >
            <div>
              <label
                for="payment-method"
                class="text-sm font-semibold text-brand-cream"
              >
                Payment method
              </label>

              <select
                id="payment-method"
                x-model="payment.method"
                @change="paymentDetailsComplete = false"
                class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
                required
              >
                <option value="" disabled>
                  Select payment method
                </option>

                <option value="e-wallet">
                  E-wallet transfer
                </option>

                <option value="bank-transfer">
                  Bank transfer
                </option>

                <option value="other">
                  Other manual payment
                </option>
              </select>
            </div>

            <div
              class="mt-5 rounded-xl border border-brand-gold/30 bg-brand-black p-4"
            >
              <p
                class="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold"
              >
                Payment instructions
              </p>

              <p class="mt-2 text-sm leading-6 text-brand-muted">
                The official payment account name, number, and final
                instructions will appear here after confirmation from
                the client.
              </p>

              <p
                class="mt-3 text-xs font-semibold text-brand-cream"
              >
                Do not send payment using unverified account details.
              </p>
            </div>

            <div class="mt-5">
              <label
                for="payment-proof"
                class="text-sm font-semibold text-brand-cream"
              >
                Proof of payment
              </label>

              <label
                for="payment-proof"
                class="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-brand-border bg-brand-black px-5 py-8 text-center transition hover:border-brand-gold"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  class="size-8 text-brand-gold"
                  aria-hidden="true"
                >
                  <path
                    d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <span
                  class="mt-3 text-sm font-semibold text-brand-cream"
                >
                  Select receipt or payment screenshot
                </span>

                <span
                  class="mt-1 text-xs leading-5 text-brand-muted"
                >
                  JPG, PNG, WEBP, or PDF — maximum 5 MB
                </span>

                <input
                  id="payment-proof"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  class="sr-only"
                  @change="handleProofFile"
                  required
                >
              </label>

              <div
                x-show="payment.proofFileName"
                x-transition
                class="mt-3 rounded-xl border border-brand-border bg-brand-black px-4 py-3"
              >
                <p
                  class="text-xs uppercase tracking-[0.12em] text-brand-muted"
                >
                  Selected file
                </p>

                <p
                  class="mt-1 break-all text-sm font-semibold text-brand-cream"
                  x-text="payment.proofFileName"
                ></p>
              </div>

              <p
                x-show="paymentError"
                x-text="paymentError"
                class="mt-3 text-sm text-red-400"
                role="alert"
              ></p>
            </div>

            <div
              x-show="paymentDetailsComplete"
              x-transition
              class="mt-4 rounded-xl border border-[#2f6b59] bg-[#234f42] px-4 py-3 text-sm font-medium leading-6 text-[#fff8e9] shadow-sm"
              role="status"
            >
              Payment information is complete. The file has not been
              uploaded or submitted yet.
            </div>

            <div
              class="mt-6 flex flex-col-reverse gap-3 border-t border-brand-border pt-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <p class="text-xs leading-5 text-brand-muted">
                Final order review will be added next.
              </p>

              <button
                type="submit"
                class="inline-flex h-12 items-center justify-center rounded-full bg-brand-gold px-7 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-light"
              >
                Review order
              </button>
            </div>
          </form>
                </section>

        <section
          id="final-order-review"
          x-show="paymentDetailsComplete"
          x-transition
          class="mt-6 scroll-mt-6 overflow-hidden rounded-[1.5rem] border border-brand-gold/30 bg-brand-panel shadow-gold-soft"
        >
          <header
            class="border-b border-brand-border px-5 py-5 sm:px-6"
          >
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
            >
              Final review
            </p>

            <h2
              class="mt-1 font-display text-3xl text-brand-cream"
            >
              Review your order
            </h2>

            <p class="mt-2 text-sm leading-6 text-brand-muted">
              Check the information below before the order is connected
              to the final submission system.
            </p>
          </header>

          <div class="p-5 sm:p-6">
            <div class="grid gap-5 md:grid-cols-2">
              <article
                class="rounded-xl border border-brand-border bg-brand-black p-5"
              >
                <p
                  class="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold"
                >
                  Customer
                </p>

                <dl class="mt-4 space-y-3">
                  <div>
                    <dt class="text-xs text-brand-muted">
                      Full name
                    </dt>

                    <dd
                      class="mt-1 break-words text-sm font-semibold text-brand-cream"
                      x-text="customer.fullName"
                    ></dd>
                  </div>

                  <div>
                    <dt class="text-xs text-brand-muted">
                      Mobile number
                    </dt>

                    <dd
                      class="mt-1 break-words text-sm font-semibold text-brand-cream"
                      x-text="customer.mobileNumber"
                    ></dd>
                  </div>

                  <div>
                    <dt class="text-xs text-brand-muted">
                      Email address
                    </dt>

                    <dd
                      class="mt-1 break-words text-sm font-semibold text-brand-cream"
                      x-text="customer.emailAddress"
                    ></dd>
                  </div>

                  <div>
                    <dt class="text-xs text-brand-muted">
                      Buyer type
                    </dt>

                    <dd
                      class="mt-1 text-sm font-semibold text-brand-cream"
                      x-text="
                        customer.buyerType === 'member'
                          ? 'Existing member'
                          : 'Non-member'
                      "
                    ></dd>
                  </div>

                  <div
                    x-show="customer.buyerType === 'member'"
                  >
                    <dt class="text-xs text-brand-muted">
                      Member ID or referral code
                    </dt>

                    <dd
                      class="mt-1 break-words text-sm font-semibold text-brand-cream"
                      x-text="customer.memberCode"
                    ></dd>
                  </div>
                </dl>
              </article>

              <article
                class="rounded-xl border border-brand-border bg-brand-black p-5"
              >
                <p
                  class="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold"
                >
                  Delivery
                </p>

                <dl class="mt-4 space-y-3">
                  <div>
                    <dt class="text-xs text-brand-muted">
                      Complete address
                    </dt>

                    <dd
                      class="mt-1 break-words text-sm font-semibold leading-6 text-brand-cream"
                      x-text="
                        delivery.completeAddress +
                        ', ' +
                        delivery.barangay +
                        ', ' +
                        delivery.city +
                        ', ' +
                        delivery.province +
                        ' ' +
                        delivery.postalCode
                      "
                    ></dd>
                  </div>

                  <div x-show="delivery.notes">
                    <dt class="text-xs text-brand-muted">
                      Delivery notes
                    </dt>

                    <dd
                      class="mt-1 break-words text-sm font-semibold leading-6 text-brand-cream"
                      x-text="delivery.notes"
                    ></dd>
                  </div>
                </dl>
              </article>
            </div>

            <article
              class="mt-5 rounded-xl border border-brand-border bg-brand-black p-5"
            >
              <div
                class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p
                    class="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold"
                  >
                    Payment
                  </p>

                  <p
                    class="mt-2 text-sm font-semibold text-brand-cream"
                    x-text="paymentMethodLabel()"
                  ></p>
                </div>

                <div class="sm:text-right">
                  <p class="text-xs text-brand-muted">
                    Selected proof
                  </p>

                  <p
                    class="mt-1 break-all text-sm font-semibold text-brand-cream"
                    x-text="payment.proofFileName"
                  ></p>
                </div>
              </div>
            </article>

            <article
              class="mt-5 overflow-hidden rounded-xl border border-brand-border bg-brand-black"
            >
              <div
                class="border-b border-brand-border px-5 py-4"
              >
                <p
                  class="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold"
                >
                  Order items
                </p>
              </div>

              <div class="divide-y divide-brand-border">
                <template
                  x-for="item in $store.cart.detailedItems"
                  :key="'review-' + item.productId"
                >
                  <div
                    class="flex items-center gap-4 px-5 py-4"
                  >
                    <div
                      class="size-16 shrink-0 overflow-hidden rounded-lg bg-brand-cream"
                    >
                      <img
                        :src="item.product.image"
                        :alt="item.product.name"
                        class="size-full object-contain p-1.5"
                      >
                    </div>

                    <div class="min-w-0 flex-1">
                      <p
                        class="truncate font-semibold text-brand-cream"
                        x-text="item.product.name"
                      ></p>

                      <p
                        class="mt-1 text-xs text-brand-muted"
                        x-text="
                          'Quantity: ' +
                          item.quantity +
                          ' × ' +
                          formatMoney(item.product.regularPrice)
                        "
                      ></p>
                    </div>

                    <strong
                      class="shrink-0 text-sm text-brand-cream"
                      x-text="formatMoney(item.lineTotal)"
                    ></strong>
                  </div>
                </template>
              </div>

              <div
                class="flex items-end justify-between gap-4 border-t border-brand-border bg-brand-panel px-5 py-5"
              >
                <div>
                  <p
                    class="text-xs uppercase tracking-[0.14em] text-brand-muted"
                  >
                    Estimated total
                  </p>

                  <p class="mt-1 text-xs text-brand-muted">
                    Delivery fee not yet included
                  </p>
                </div>

                <strong
                  class="font-display text-3xl text-brand-gold"
                  x-text="formatMoney($store.cart.subtotal)"
                ></strong>
              </div>
            </article>

            <div
              class="mt-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3"
              >
              <p class="text-sm font-semibold text-amber-950">
                Frontend preview only
              </p>

              <p class="mt-1 text-xs font-medium leading-5 text-amber-900">
                Clicking the button below will not send an order, upload
                the payment proof, or save any information.
              </p>
            </div>

            <div
              x-show="checkoutPreviewComplete"
              x-transition
              class="mt-4 rounded-xl border border-green-700/40 bg-green-900/20 px-4 py-3 text-sm leading-6 text-green-300"
              role="status"
            >
              Frontend checkout test completed successfully. The next
              development phase will connect this flow to the secure
              database and admin approval system.
            </div>

            <button
              type="button"
              class="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-gold px-7 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-light disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="checkoutPreviewComplete"
              @click="completeCheckoutPreview"
              x-text="
                checkoutPreviewComplete
                  ? 'Frontend test complete'
                  : 'Complete frontend test'
              "
            ></button>
          </div>
        </section>
      </div>
    </main>
  </div>
`

Alpine.start()