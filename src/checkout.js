import './style.css'
import Alpine from 'alpinejs'
import { supabase } from './lib/supabase.js'
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
let checkoutProfile = null
// Keep final submission closed until the client confirms payment details.
const checkoutPaymentsReady = true
Alpine.data('checkoutPage', () => ({
  customer: {
    firstName: checkoutProfile?.first_name ?? '',
    lastName: checkoutProfile?.last_name ?? '',
    mobileNumber: checkoutProfile?.mobile_number ?? '',
    emailAddress: checkoutProfile?.email ?? '',
  },
  delivery: {
    fulfillmentType: 'dropship',
    region: '',
    sameAsCustomer: true,
    recipientFirstName: '',
    recipientLastName: '',
    recipientMobile: '',
    province: '',
    city: '',
    barangay: '',
    houseStreet: '',
    landmark: '',
    notes: '',
  },
  payment: {
    method: '',
    proofFile: null,
    proofFileName: '',
    proofPreviewUrl: '',
  },
  paymentError: '',
  orderCheckError: '',
  isCheckingCart: false,
  checkoutPreviewComplete: false,
  checkoutPaymentsReady,
  isSubmittingOrder: false,
  submittedOrderId: '',
  orderSubmissionUncertain: false,
  formatMoney(value) {
    return pesoFormatter.format(value)
  },
  recipientName() {
    if (
      this.delivery.fulfillmentType === 'dropship' &&
      this.delivery.sameAsCustomer
    ) {
      return [
        this.customer.firstName,
        this.customer.lastName,
      ]
      .filter(Boolean)
      .join(' ')
    }
    return [
      this.delivery.recipientFirstName,
      this.delivery.recipientLastName,
    ]
    .filter(Boolean)
    .join(' ')
  },
  handleProofFile(event) {
    const file = event.target.files?.[0]
    this.paymentError = ''
    this.checkoutPreviewComplete = false
    if (this.payment.proofPreviewUrl) {
      URL.revokeObjectURL(
        this.payment.proofPreviewUrl,
      )
      this.payment.proofPreviewUrl = ''
    }
    this.payment.proofFile = null
    this.payment.proofFileName = ''
    if (!file) {
      return
    }
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]
    const maximumFileSize = 5 * 1024 * 1024
    if (!allowedTypes.includes(file.type)) {
      this.paymentError =
      'Please select a JPG, PNG, or WEBP image.'
      event.target.value = ''
      return
    }
    if (file.size > maximumFileSize) {
      this.paymentError =
      'The selected image must not exceed 5 MB.'
      event.target.value = ''
      return
    }
    this.payment.proofFile = file
    this.payment.proofFileName = file.name
    this.payment.proofPreviewUrl =
    URL.createObjectURL(file)
  },
  async completeCheckoutPreview() {
    if (this.isCheckingCart) return
    this.orderCheckError = ''
    if (this.checkoutPaymentsReady && !this.payment.proofFile) {
      this.paymentError =
      'Please select your proof of payment.'
      document.querySelector('#payment-proof')?.focus()
      return
    }
    if (this.delivery.sameAsCustomer) {
      this.delivery.recipientFirstName =
      this.customer.firstName
      this.delivery.recipientLastName =
      this.customer.lastName
      this.delivery.recipientMobile =
      this.customer.mobileNumber
    }
    const cart = Alpine.store('cart')
    this.isCheckingCart = true
    try {
      const { data: quote, error } = await supabase.rpc(
        'quote_order_cart',
        {
          cart_items: cart.items.map(({ productId, quantity }) => ({
            productId,
            quantity,
          })),
        },
      )
      if (error) {
        if (error.message?.includes('A product is unavailable.')) {
          this.orderCheckError =
            'Products are not available for checkout yet.'
        } else {
          console.error('Unable to check cart:', error)
          this.orderCheckError =
            'Unable to check the cart. Please try again.'
        }
        return
      }
      if (
        !quote ||
        quote.pricingType !== cart.pricingType ||
        Number(quote.subtotal) !== cart.subtotal
      ) {
        this.orderCheckError =
          'Cart pricing has changed. Please refresh and review your cart.'
        return
      }
    } catch (error) {
      console.error('Unable to check cart:', error)
      this.orderCheckError =
        'Unable to check the cart. Please try again.'
      return
    } finally {
      this.isCheckingCart = false
    }
    this.paymentError = ''
    this.checkoutPreviewComplete = true
    requestAnimationFrame(() => {
      document
      .querySelector('#checkout-preview-status')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    })
  },
  async submitOrder() {
    if (
      !this.checkoutPaymentsReady ||
      !this.checkoutPreviewComplete ||
      this.isSubmittingOrder ||
      this.submittedOrderId ||
      this.orderSubmissionUncertain
    ) return

    const cart = Alpine.store('cart')
    const proofFile = this.payment.proofFile
    this.orderCheckError = ''
    this.paymentError = ''
    if (!proofFile || cart.items.length === 0) {
      this.orderCheckError = 'Please review your cart and payment proof.'
      return
    }

    this.isSubmittingOrder = true
    try {
      const { data: { user }, error: userError } =
        await supabase.auth.getUser()
      if (userError || !user) {
        this.orderCheckError = 'Please sign in again before submitting.'
        return
      }

      const cartItems = cart.items.map(({ productId, quantity }) => ({
        productId,
        quantity,
      }))
      const { data: quote, error: quoteError } = await supabase.rpc(
        'quote_order_cart',
        { cart_items: cartItems },
      )
      if (
        quoteError ||
        !quote ||
        quote.pricingType !== cart.pricingType ||
        Number(quote.subtotal) !== cart.subtotal
      ) {
        if (quoteError) console.error('Unable to confirm order:', quoteError)
        this.checkoutPreviewComplete = false
        this.orderCheckError =
          'Product availability or price changed. Refresh and review your cart.'
        return
      }

      const extension = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
      }[proofFile.type]
      if (!extension || proofFile.size > 5 * 1024 * 1024) {
        this.paymentError = 'Please select a JPG, PNG, or WebP under 5 MB.'
        return
      }

      const proofPath = user.id + '/' + crypto.randomUUID() + '.' + extension
      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(proofPath, proofFile, {
          contentType: proofFile.type,
          upsert: false,
        })
      if (uploadError) {
        console.error('Unable to upload payment proof:', uploadError)
        this.paymentError = 'Unable to upload proof. Please try again.'
        return
      }

      // A timeout can happen after the database has already created the order.
      const { data: orderId, error: submitError } = await supabase.rpc(
        'submit_order',
        {
          cart_items: cartItems,
          delivery_details: {
            fulfillmentType: this.delivery.fulfillmentType,
            region: this.delivery.region.trim(),
            recipientFirstName: this.delivery.recipientFirstName.trim(),
            recipientLastName: this.delivery.recipientLastName.trim(),
            recipientMobile: this.delivery.recipientMobile.trim(),
            province: this.delivery.province.trim(),
            city: this.delivery.city.trim(),
            barangay: this.delivery.barangay.trim(),
            houseStreet: this.delivery.houseStreet.trim(),
            landmark: this.delivery.landmark.trim(),
            notes: this.delivery.notes.trim(),
          },
          payment_method: this.payment.method,
          payment_proof_path: proofPath,
        },
      )
      if (submitError || !orderId) {
        console.error('Unable to confirm order submission:', submitError)
        this.orderSubmissionUncertain = true
        this.orderCheckError =
          'Could not confirm your order. Check Order History before retrying.'
        return
      }

      this.submittedOrderId = orderId
      cart.clear()
      requestAnimationFrame(() => {
        document.querySelector('#checkout-order-status')?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      })
    } catch (error) {
      console.error('Unable to submit order:', error)
      this.orderSubmissionUncertain = true
      this.orderCheckError =
        'Could not confirm your order. Check Order History before retrying.'
    } finally {
      this.isSubmittingOrder = false
    }
  },
  destroy() {
    if (this.payment.proofPreviewUrl) {
      URL.revokeObjectURL(
        this.payment.proofPreviewUrl,
      )
      this.payment.proofPreviewUrl = ''
    }
  },
}))
async function startCheckout() {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    window.location.replace('/login/')
    return
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('first_name, last_name, mobile_number, email, customer_type, membership_status')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    console.error('Unable to load checkout profile:', profileError)
    document.querySelector('#checkout-app').textContent =
      'Unable to load your details. Please refresh.'
    return
  }

  checkoutProfile = profile

  let checkoutPricingType = 'regular'

  if (
    profile.customer_type === 'member' &&
    profile.membership_status === 'active'
  ) {
    const { data: approvedApplication, error: tierError } =
      await supabase
        .from('membership_applications')
        .select('package_id')
        .eq('customer_id', user.id)
        .eq('status', 'approved')
        .not('membership_activated_at', 'is', null)
        .order('membership_activated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

    if (tierError) {
      console.error('Unable to load member pricing tier:', tierError)
    }

    if (
      [
        'starter',
        'builder',
        'leader',
        'prestige',
      ].includes(approvedApplication?.package_id)
    ) {
      checkoutPricingType = approvedApplication.package_id
    }
  }

  const { data: liveProducts, error: productsError } = await supabase
    .from('products')
    .select('id, is_active, stock_quantity, regular_price, member_price')
    .eq('is_active', true)

  if (productsError) {
    console.error('Unable to load checkout products:', productsError)
    document.querySelector('#checkout-app').textContent =
      'Unable to load product availability. Please refresh.'
    return
  }

  const liveProductById = new Map(
    (liveProducts ?? []).map((product) => [product.id, product]),
  )

  const checkoutProducts = products.map((product) => {
    const liveProduct = liveProductById.get(product.id)
    const regularPrice = Number(liveProduct?.regular_price ?? 0)
    const memberPrice = Number(liveProduct?.member_price ?? 0)

    return {
      ...product,
      isActive:
        liveProduct?.is_active === true &&
        regularPrice > 0 &&
        memberPrice > 0,
      stockQuantity: Number(liveProduct?.stock_quantity ?? 0),
      regularPrice,
      memberPrice,
    }
  })

  registerCartStore(Alpine, checkoutProducts, {
    pricingType: checkoutPricingType,
  })

  const isMember =
  profile.customer_type === 'member' &&
  profile.membership_status === 'active'

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
          Manual payment
        </div>
      </div>
    </header>
    <main class="px-5 py-10 sm:py-14">
      <div class="mx-auto w-full max-w-6xl">
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
          id="checkout-order-status"
          x-show="submittedOrderId"
          class="mt-8 rounded-[1.5rem] border border-[#2f6b59] bg-[#234f42] px-6 py-8 text-[#fff8e9]"
          role="status"
        >
          <h2 class="font-display text-3xl">Order submitted</h2>
          <p class="mt-2">Waiting for payment verification.</p>
          <p class="mt-2 font-semibold" x-text="'Order ID: ' + submittedOrderId"></p>
          <a href="/dashboard/" class="mt-4 inline-block underline">View Order History</a>
        </section>
        <section
          x-show="!submittedOrderId && $store.cart.itemCount === 0"
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
  class="mt-8 grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start"
>
  <aside
    class="space-y-6 lg:sticky lg:top-6"
    aria-label="Order items and summary"
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
                    class="h-28 w-full overflow-hidden rounded-xl border border-brand-border bg-brand-black sm:h-32"
                  >
                    <img
                      :src="item.product.image"
                      :alt="item.product.name"
                      class="size-full object-cover object-center"
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
    $store.cart.priceLabel +
    ' · ' +
    formatMoney(item.unitPrice) +
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
      @click="
        $store.cart.decrease(item.productId)
        checkoutPreviewComplete = false
      "
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
                          @click="
  $store.cart.increase(item.productId)
  checkoutPreviewComplete = false
"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        class="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-brand-muted transition hover:text-red-700"
                        @click="
  $store.cart.remove(item.productId)
  checkoutPreviewComplete = false
"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              </template>
            </div>
          </section>
          <section
  class="rounded-[1.5rem] border border-brand-gold/30 bg-brand-panel p-5 shadow-gold-soft sm:p-6"
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
                To be confirmed
              </span>
            </div>
            <div
              class="mt-5 flex items-end justify-between gap-4 border-t border-brand-border pt-5"
            >
              <span
                class="text-sm font-semibold uppercase tracking-[0.12em] text-brand-muted"
              >
                Products subtotal
              </span>
              <strong
                class="font-display text-3xl text-brand-gold"
                x-text="formatMoney($store.cart.subtotal)"
              ></strong>
            </div>
            <p class="mt-4 text-xs leading-5 text-brand-muted">
              Metro Manila standard delivery is ₱120 via J&amp;T.
For addresses outside Metro Manila or same-day delivery,
contact our Facebook page to arrange the fee and schedule.
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
              Manual payment verification
                        </div>
          </section>
        </aside>
        <form
          class="space-y-6"
          @submit.prevent="completeCheckoutPreview"
          @input="checkoutPreviewComplete = false"
          @change="checkoutPreviewComplete = false"
        >
          <section
            class="overflow-hidden rounded-[1.5rem] border border-brand-border bg-brand-panel shadow-panel"
          >
            <header
              class="border-b border-brand-border px-5 py-5 sm:px-6"
            >
              <p
                class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
              >
                Customer
              </p>
              <h2
                class="mt-1 font-display text-3xl text-brand-cream"
              >
                Account information
              </h2>
              <p class="mt-2 text-sm leading-6 text-brand-muted">
                These details will come from the signed-in customer
                account once authentication is connected.
              </p>
            </header>
            <div class="p-5 sm:p-6">
              <div class="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    for="first-name"
                    class="text-sm font-semibold text-brand-cream"
                  >
                    First name
                  </label>
                  <input
                    id="first-name"
                    type="text"
                    x-model.trim="customer.firstName"
                    autocomplete="given-name"
                    placeholder="Juan"
                    class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                    required
                  >
                </div>
                <div>
                  <label
                    for="last-name"
                    class="text-sm font-semibold text-brand-cream"
                  >
                    Last name
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    x-model.trim="customer.lastName"
                    autocomplete="family-name"
                    placeholder="Dela Cruz"
                    class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                    required
                  >
                </div>
              </div>
              <div class="mt-5 grid gap-5 sm:grid-cols-2">
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
                <div>
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
                </div>
              </div>
            </div>
          </section>
          <section
            class="overflow-hidden rounded-[1.5rem] border border-brand-border bg-brand-panel shadow-panel"
          >
            <header
              class="border-b border-brand-border px-5 py-5 sm:px-6"
            >
              <p
                class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
              >
                Order fulfillment
              </p>
              <h2
  class="mt-1 font-display text-3xl text-brand-cream"
>
  Delivery details
</h2>
<p class="mt-2 text-sm leading-6 text-brand-muted">
  Confirm the recipient and address where the order should
  be delivered.
</p>
            </header>
            <div class="p-5 sm:p-6">
              <fieldset>
                <legend class="text-sm font-semibold text-brand-cream">
                  Fulfillment method
                </legend>
                <div class="mt-3 grid gap-3 sm:grid-cols-2">
                  <label
                    class="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition"
                    :class="
                      delivery.fulfillmentType === 'dropship'
                        ? 'border-brand-gold bg-brand-gold/10'
                        : 'border-brand-border bg-brand-black'
                    "
                  >
                    <input
                      type="radio"
                      name="fulfillment-method"
                      value="dropship"
                      x-model="delivery.fulfillmentType"
                      class="mt-0.5 size-4 accent-[#b78a32]"
                    >
                    <span>
                      <span class="block text-sm font-semibold text-brand-cream">
                        Dropship
                      </span>
                      <span class="mt-1 block text-xs leading-5 text-brand-muted">
                        Send the order to the recipient's address.
                      </span>
                    </span>
                  </label>
                  <label
  class="flex cursor-not-allowed items-start justify-between gap-3 rounded-xl border border-brand-border bg-brand-black p-4 opacity-60"
  aria-disabled="true"
>
  <span class="flex items-start gap-3">
    <input
      type="radio"
      name="fulfillment-method"
      value="pickup"
      class="mt-0.5 size-4 accent-[#b78a32]"
      disabled
    >
    <span>
      <span
        class="block text-sm font-semibold text-brand-cream"
      >
        Pickup
      </span>
      <span
        class="mt-1 block text-xs leading-5 text-brand-muted"
      >
        Pickup locations and schedules are not yet available.
      </span>
    </span>
  </span>
  <span
    class="shrink-0 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-brand-gold"
  >
    Coming Soon
  </span>
</label>
                </div>
              </fieldset>
              <div
                x-show="delivery.fulfillmentType === 'dropship'"
                x-transition
              >
              <div class="mt-5">
  <label
    for="delivery-region"
    class="text-sm font-semibold text-brand-cream"
  >
    Delivery region
  </label>
  <select
    id="delivery-region"
    x-model="delivery.region"
    class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
    required
  >
    <option value="" disabled>
      Select delivery region
    </option>
    <option value="ncr">
      NCR
    </option>
    <option value="luzon">
      Luzon
    </option>
    <option value="visayas">
      Visayas
    </option>
    <option value="mindanao">
      Mindanao
    </option>
  </select>
  <p class="mt-2 text-xs leading-5 text-brand-muted">
    Metro Manila standard delivery is ₱150 via J&amp;T.
For addresses outside Metro Manila or same-day delivery,
contact our Facebook page to arrange the fee and schedule.
  </p>
</div>
              <label
                class="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-brand-border bg-brand-black p-4"
              >
                <input
                  type="checkbox"
                  x-model="delivery.sameAsCustomer"
                  class="mt-0.5 size-4 accent-[#b78a32]"
                >
                <span>
                  <span
                    class="block text-sm font-semibold text-brand-cream"
                  >
                    Use my customer details
                  </span>
                  <span
                    class="mt-1 block text-xs leading-5 text-brand-muted"
                  >
                    Recipient name and mobile number will match the
                    account information above.
                  </span>
                </span>
              </label>
              <div
                x-show="delivery.sameAsCustomer"
                x-transition
                class="mt-4 rounded-xl border border-brand-gold/25 bg-brand-black px-4 py-3"
              >
                <p class="text-xs uppercase tracking-[0.12em] text-brand-muted">
                  Recipient
                </p>
                <p
                  class="mt-1 text-sm font-semibold text-brand-cream"
                  x-text="recipientName() || 'Complete your name above'"
                ></p>
                <p
                  class="mt-1 text-xs text-brand-muted"
                  x-text="customer.mobileNumber || 'Complete your mobile number above'"
                ></p>
              </div>
              <div
                x-show="!delivery.sameAsCustomer"
                x-transition
                class="mt-5 grid gap-5 sm:grid-cols-2"
              >
                <div>
                  <label
                    for="recipient-first-name"
                    class="text-sm font-semibold text-brand-cream"
                  >
                    Recipient first name
                  </label>
                  <input
                    id="recipient-first-name"
                    type="text"
                    x-model.trim="delivery.recipientFirstName"
                    autocomplete="shipping given-name"
                    placeholder="Recipient first name"
                    :required="
                      delivery.fulfillmentType === 'dropship' &&
                      !delivery.sameAsCustomer
                    "
                    class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                  >
                </div>
                <div>
                  <label
                    for="recipient-last-name"
                    class="text-sm font-semibold text-brand-cream"
                  >
                    Recipient last name
                  </label>
                  <input
                    id="recipient-last-name"
                    type="text"
                    x-model.trim="delivery.recipientLastName"
                    autocomplete="shipping family-name"
                    placeholder="Recipient last name"
                    :required="
                      delivery.fulfillmentType === 'dropship' &&
                      !delivery.sameAsCustomer
                    "
                    class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                  >
                </div>
                <div class="sm:col-span-2">
                  <label
                    for="recipient-mobile"
                    class="text-sm font-semibold text-brand-cream"
                  >
                    Recipient mobile number
                  </label>
                  <input
                    id="recipient-mobile"
                    type="tel"
                    x-model.trim="delivery.recipientMobile"
                    inputmode="tel"
                    autocomplete="shipping tel"
                    minlength="10"
                    maxlength="13"
                    placeholder="09XXXXXXXXX"
                    :required="
                      delivery.fulfillmentType === 'dropship' &&
                      !delivery.sameAsCustomer
                    "
                    class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                  >
                </div>
              </div>
              <div class="mt-5 grid gap-5 sm:grid-cols-2">
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
                    autocomplete="shipping address-level1"
                    placeholder="Example: Cavite"
                    class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                    :required="delivery.fulfillmentType === 'dropship'"
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
                    autocomplete="shipping address-level2"
                    placeholder="Example: Bacoor"
                    class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                    :required="delivery.fulfillmentType === 'dropship'"
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
                    autocomplete="shipping address-level3"
                    placeholder="Enter barangay"
                    class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                    :required="delivery.fulfillmentType === 'dropship'"
                  >
                </div>
                <div>
                  <label
                    for="house-street"
                    class="text-sm font-semibold text-brand-cream"
                  >
                    House number and street
                  </label>
                  <input
                    id="house-street"
                    type="text"
                    x-model.trim="delivery.houseStreet"
                    autocomplete="shipping street-address"
                    placeholder="House no., street, subdivision"
                    class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                    :required="delivery.fulfillmentType === 'dropship'"
                  >
                </div>
              </div>
              <div class="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    for="landmark"
                    class="text-sm font-semibold text-brand-cream"
                  >
                    Landmark
                    <span class="font-normal text-brand-muted">
                      (Optional)
                    </span>
                  </label>
                  <input
                    id="landmark"
                    type="text"
                    x-model.trim="delivery.landmark"
                    placeholder="Nearby landmark"
                    class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                  >
                </div>
                <div>
                  <label
                    for="order-notes"
                    class="text-sm font-semibold text-brand-cream"
                  >
                    Special instructions
                    <span class="font-normal text-brand-muted">
                      (Optional)
                    </span>
                  </label>
                  <input
                    id="order-notes"
                    type="text"
                    x-model.trim="delivery.notes"
                    maxlength="300"
                    placeholder="Optional delivery instructions"
                    class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                  >
                </div>
              </div>
              </div>
            </div>
          </section>
          <section
            class="overflow-hidden rounded-[1.5rem] border border-brand-border bg-brand-panel shadow-panel"
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
                Select a payment method and attach a clear receipt or
                payment screenshot.
              </p>
            </header>
            <div class="p-5 sm:p-6">
              <label
                for="payment-method"
                class="text-sm font-semibold text-brand-cream"
              >
                Payment method
              </label>
              <select
  id="payment-method"
  x-model="payment.method"
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
</select>
              <div
                class="mt-5 rounded-xl border border-brand-gold/30 bg-brand-black p-4"
              >
                <p
                  class="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold"
                >
                  Payment instructions
                </p>
                <p class="mt-2 text-sm leading-6 text-brand-muted">
                  Official account details and final instructions will
                  appear here after confirmation from the client.
                </p>
                <p class="mt-3 text-xs font-semibold text-brand-cream">
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
  class="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-brand-border bg-brand-black px-5 py-7 text-center transition hover:border-brand-gold"
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
    Select payment screenshot
  </span>
  <span
    class="mt-1 text-xs leading-5 text-brand-muted"
  >
    JPG, PNG, or WebP — maximum 5 MB
  </span>
  <input
  id="payment-proof"
  type="file"
  accept="image/jpeg,image/png,image/webp"
  class="mt-4 block w-full cursor-pointer rounded-lg border border-brand-border bg-brand-panel px-3 py-2 text-sm text-brand-cream file:mr-4 file:rounded-full file:border-0 file:bg-brand-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#17130d]"
  @change="handleProofFile($event)"
  required
>
</label>
<div
  x-show="payment.proofPreviewUrl"
  x-transition
  class="mt-3 overflow-hidden rounded-xl border border-brand-border bg-brand-black p-3"
>
  <img
    :src="payment.proofPreviewUrl"
    alt="Selected payment proof preview"
    class="mx-auto max-h-64 w-full rounded-lg object-contain"
  >
  <p
    class="mt-3 break-all text-center text-xs font-semibold text-brand-cream"
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
            </div>
          </section>
          <section
            class="overflow-hidden rounded-[1.5rem] border border-brand-gold/30 bg-brand-panel p-5 shadow-gold-soft sm:p-6"
          >
            <div
              class="flex flex-col gap-4 border-b border-brand-border pb-5 sm:flex-row sm:items-end sm:justify-between"
            >
              <div>
                <p
                  class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
                >
                  Final confirmation
                </p>
                <h2
  class="mt-1 font-display text-3xl text-brand-cream"
  x-text="checkoutPaymentsReady ? 'Submit for verification' : 'Review checkout details'"
></h2>
                <p class="mt-2 text-sm leading-6 text-brand-muted">
  Review the customer, delivery, and payment information
  before submitting the order.
</p>
              </div>
              <div class="shrink-0 sm:text-right">
                <p class="text-xs uppercase tracking-[0.12em] text-brand-muted">
                  Products subtotal
                </p>
                <strong
                  class="mt-1 block font-display text-3xl text-brand-gold"
                  x-text="formatMoney($store.cart.subtotal)"
                ></strong>
              </div>
            </div>

            <div
  x-show="${isMember} && $store.cart.totalQuantity < 10"
  class="mt-5 rounded-2xl border border-red-400/40 bg-red-500/10 p-4"
>
  <p class="text-sm font-semibold text-red-200">
    This order is not eligible for points.
  </p>

  <p class="mt-2 text-xs leading-5 text-red-100/80">
    Members earn points only on delivered product orders with at least
    10 perfume bottles. This order has
    <strong x-text="$store.cart.totalQuantity"></strong>
    bottle(s). Minimum qualified order: 10 bottles = 50 points.
  </p>
</div>

<div
  x-show="${isMember} && $store.cart.totalQuantity >= 10"
  class="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4"
>
  <p class="text-sm font-semibold text-emerald-200">
    This order can earn points after delivery.
  </p>

  <p class="mt-2 text-xs leading-5 text-emerald-100/80">
    Qualified member orders earn 5 points per perfume bottle after the
    order is delivered and confirmed by admin.
  </p>
</div>

            <label
              class="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-brand-border bg-brand-black p-4"
            >
              <input
                type="checkbox"
                class="mt-0.5 size-4 accent-[#b78a32]"
                required
              >
              <span class="text-sm leading-6 text-brand-muted">
                I confirm that the order, fulfillment, recipient (when
                applicable), and payment information provided above is
                correct.
              </span>
            </label>
            <div
  class="mt-5 rounded-xl border border-brand-border bg-brand-black px-4 py-3"
>
  <p class="text-sm font-semibold text-brand-cream">
    Manual payment verification
  </p>
  <p class="mt-1 text-xs leading-5 text-brand-muted">
    Submit your order with payment proof. Admin will review the payment before processing.
  </p>
</div>
            <div
              id="checkout-preview-status"
              x-show="checkoutPreviewComplete"
              x-transition
              class="mt-4 rounded-xl border border-[#2f6b59] bg-[#234f42] px-4 py-3 text-sm font-medium leading-6 text-[#fff8e9] shadow-sm"
              role="status"
            >
              Details checked. No order or payment proof has been submitted yet.
            </div>
            <button
  type="submit"
  class="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-gold px-7 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-light disabled:cursor-not-allowed disabled:opacity-60"
  :disabled="!checkoutPaymentsReady || checkoutPreviewComplete || isCheckingCart"
  x-text="
    !checkoutPaymentsReady
      ? 'Ordering not open yet'
      : isCheckingCart
        ? 'Checking stock and price...'
        : checkoutPreviewComplete
          ? 'Checkout details checked'
          : 'Check checkout details'
  "
></button>
            <button
              type="button"
              x-show="checkoutPreviewComplete && !submittedOrderId"
              @click="submitOrder()"
              :disabled="!checkoutPaymentsReady || isSubmittingOrder || orderSubmissionUncertain"
              class="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full border border-brand-gold px-7 text-sm font-semibold text-brand-gold disabled:cursor-not-allowed disabled:opacity-50"
              x-text="isSubmittingOrder ? 'Submitting order...' : 'Submit order for verification'"
            ></button>
            <p
              x-show="orderCheckError"
              x-text="orderCheckError"
              class="mt-3 text-center text-sm text-red-400"
              role="alert"
            ></p>
            <p class="mt-3 text-center text-xs leading-5 text-brand-muted">
              Once ordering opens, submitted orders remain pending until the company verifies
              the payment and order details.
            </p>
          </section>
          </form>
        </div>
      </div>
    </main>
  </div>
`
Alpine.start()
}
startCheckout()