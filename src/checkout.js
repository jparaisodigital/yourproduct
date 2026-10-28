import './style.css'
import Alpine from 'alpinejs'
import { supabase } from './lib/supabase.js'
import logoImage from './assets/logoyourproduct.webp'
import maribankQrImage from './assets/maribank.jpg'
import { bindFadeLinks } from './lib/page-transition.js'
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
let checkoutPricingTier = 'regular'

const metroManilaCities = [
  'Caloocan',
  'Las Piñas',
  'Makati',
  'Malabon',
  'Mandaluyong',
  'Manila',
  'Marikina',
  'Muntinlupa',
  'Navotas',
  'Parañaque',
  'Pasay',
  'Pasig',
  'Pateros',
  'Quezon City',
  'San Juan',
  'Taguig',
  'Valenzuela',
]

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
    region:
      checkoutProfile?.default_address_enabled &&
      checkoutProfile?.default_province?.trim().toLowerCase() === 'metro manila'
        ? 'ncr'
        : '',
    deliveryMethod: 'spx',
    sameAsCustomer: false,
    recipientFirstName: checkoutProfile?.first_name ?? '',
    recipientLastName: checkoutProfile?.last_name ?? '',
    recipientMobile: checkoutProfile?.mobile_number ?? '',
    province:
      checkoutProfile?.default_address_enabled
        ? checkoutProfile?.default_province ?? ''
        : '',
    city:
      checkoutProfile?.default_address_enabled
        ? checkoutProfile?.default_city_municipality ?? ''
        : '',
    barangay:
      checkoutProfile?.default_address_enabled
        ? checkoutProfile?.default_barangay ?? ''
        : '',
    houseStreet:
      checkoutProfile?.default_address_enabled
        ? checkoutProfile?.default_house_street ?? ''
        : '',
    landmark:
      checkoutProfile?.default_address_enabled
        ? checkoutProfile?.default_landmark ?? ''
        : '',
    notes: '',
  },
  payment: {
    method: '',
    proofFile: null,
    proofFileName: '',
    proofPreviewUrl: '',
    proofModalOpen: false,
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
  isPrestigeMember() {
    return checkoutPricingTier === 'prestige'
  },
  isDropship() {
    return this.delivery.fulfillmentType === 'dropship'
  },
  isPickup() {
    return this.delivery.fulfillmentType === 'pickup'
  },
  isMetroManilaDelivery() {
    return this.isDropship() && this.delivery.region === 'ncr'
  },
  requiresShippingConfirmation() {
    return (
      this.isDropship() &&
      ['luzon', 'visayas', 'mindanao'].includes(this.delivery.region)
    )
  },
  deliveryFee() {
    if (this.isPickup()) return 0
    if (!this.isDropship()) return 0
    if (this.delivery.region !== 'ncr') return null
  
    if (this.delivery.deliveryMethod === 'same-day') return 150
    if (this.delivery.deliveryMethod === 'spx') return 120
  
    return null
  },
  deliveryFeeLabel() {
    const fee = this.deliveryFee()
  
    if (fee === null && !this.delivery.region) {
      return 'Select delivery area'
    }
  
    if (fee === null) {
      return 'Contact first'
    }
  
    return this.formatMoney(fee)
  },
  checkoutTotal() {
    const subtotal = Number(Alpine.store('cart')?.subtotal ?? 0)
    const fee = this.deliveryFee()

    return subtotal + (fee ?? 0)
  },
  metroManilaCities,
  handleDeliveryRegionChange() {
    this.checkoutPreviewComplete = false
    this.paymentError = ''
    this.orderCheckError = ''

    if (this.delivery.region === 'ncr') {
      this.delivery.province = 'Metro Manila'

      if (!this.metroManilaCities.includes(this.delivery.city)) {
        this.delivery.city = ''
      }

      if (!['spx', 'same-day'].includes(this.delivery.deliveryMethod)) {
        this.delivery.deliveryMethod = 'spx'
      }

      return
    }

    if (this.delivery.province === 'Metro Manila') {
      this.delivery.province = ''
    }

    this.delivery.city = ''
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
  async handleProofFile(event) {
    const file = event.target.files?.[0]
    this.paymentError = ''
    this.checkoutPreviewComplete = false

    if (this.payment.proofPreviewUrl) {
      URL.revokeObjectURL(this.payment.proofPreviewUrl)
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

    try {
      const image = await createImageBitmap(file)
      const maximumDimension = 1200
      const scale = Math.min(
        1,
        maximumDimension / Math.max(image.width, image.height),
      )

      const width = Math.max(1, Math.round(image.width * scale))
      const height = Math.max(1, Math.round(image.height * scale))

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const context = canvas.getContext('2d')
      if (!context) {
        throw new Error('Unable to prepare payment proof image.')
      }

      context.drawImage(image, 0, 0, width, height)
      image.close?.()

      const compressedBlob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
              return
            }

            reject(new Error('Unable to compress payment proof image.'))
          },
          'image/webp',
          0.82,
        )
      })

      const originalName = file.name.replace(/\.[^.]+$/, '')
      const compressedFile = new File(
        [compressedBlob],
        `${originalName}.webp`,
        { type: 'image/webp' },
      )

      this.payment.proofFile = compressedFile
      this.payment.proofFileName = compressedFile.name
      this.payment.proofPreviewUrl =
        URL.createObjectURL(compressedFile)
    } catch (error) {
      console.error('Unable to prepare payment proof:', error)
      this.paymentError =
        'Unable to prepare this image. Please try another screenshot.'
      event.target.value = ''
    }
  },
  async completeCheckoutPreview() {
    if (this.isCheckingCart) return
    this.orderCheckError = ''

    if (this.requiresShippingConfirmation()) {
      this.orderCheckError =
        'Shipping outside Metro Manila requires confirmation. Please message us before payment.'
      return
    }

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
    const totalCartQuantity = Number(cart?.itemCount || 0)
    const isMemberCheckout = checkoutPricingTier !== 'regular'
    const hasTesterKit = cart.detailedItems.some(
      (item) => item.productId === 'tester-kit',
    )

    if (
      isMemberCheckout &&
      !hasTesterKit &&
      totalCartQuantity < 5
    ) {
      this.orderCheckError =
        'Members must order at least 5 products, unless the order includes a Tester Kit.'
      return
    }

    this.isCheckingCart = true

    try {
      const { data: quote, error } = await supabase.rpc(
        'quote_order_cart',
        {
          cart_items: cart.detailedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            image: item.product.image,
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

      const cartItems = cart.detailedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        image: item.product.image,
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
            deliveryMethod: this.delivery.deliveryMethod,
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
        console.error('Unable to confirm order submission:', {
          submitError,
          orderId,
          fulfillmentType: this.delivery.fulfillmentType,
          deliveryDetails: {
            fulfillmentType: this.delivery.fulfillmentType,
            region: this.delivery.region.trim(),
            deliveryMethod: this.delivery.deliveryMethod,
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
        })

        this.orderSubmissionUncertain = true
        this.orderCheckError =
          submitError?.message ||
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
    .select('first_name, last_name, mobile_number, email, customer_type, membership_status, selected_package_id, default_address_enabled, default_province, default_city_municipality, default_barangay, default_house_street, default_landmark')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    console.error('Unable to load checkout profile:', profileError)
    document.querySelector('#checkout-app').textContent =
      'Unable to load your details. Please refresh.'
    return
  }

  checkoutProfile = profile

  checkoutPricingTier = 'regular'

  if (
    profile.customer_type === 'member' &&
    profile.membership_status === 'active' &&
    [
      'starter',
      'builder',
      'leader',
      'prestige',
    ].includes(profile.selected_package_id)
  ) {
    checkoutPricingTier = profile.selected_package_id
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
    const effectiveMemberPrice = product.fixedPrice
      ? regularPrice
      : memberPrice

    return {
      ...product,
      isActive:
        liveProduct?.is_active === true &&
        regularPrice > 0 &&
        effectiveMemberPrice > 0,
      stockQuantity: Number(liveProduct?.stock_quantity ?? 0),
      regularPrice,
      memberPrice: effectiveMemberPrice,
    }
  })

  registerCartStore(Alpine, checkoutProducts, {
    pricingType: checkoutPricingTier,
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
  href="/dashboard/?page=createOrder"
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
  href="/dashboard/?page=createOrder"
  class="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold transition hover:text-brand-gold-light"
>
  <span aria-hidden="true">←</span>
  Back to dashboard
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
          
        </div>
        <section
  id="checkout-order-status"
  x-show="submittedOrderId"
  class="mt-8 rounded-[1.5rem] border border-[#2f6b59] bg-[#234f42] px-6 py-8 text-[#fff8e9]"
  role="status"
>
  <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8eadf]">
    Order received
  </p>

  <h2 class="mt-2 font-display text-3xl">
    Thank you for your order.
  </h2>

  <p class="mt-3 max-w-2xl text-sm leading-6 text-[#e8f3ed]">
    Your payment proof has been submitted and is waiting for verification.
  </p>

  <div class="mt-5 rounded-xl border border-white/15 bg-black/10 px-4 py-3">
    <p class="text-xs uppercase tracking-[0.12em] text-[#c7ddd1]">
      Order ID
    </p>

    <p
      class="mt-1 break-all font-semibold"
      x-text="submittedOrderId"
    ></p>
  </div>

  <div class="mt-4 rounded-xl border border-white/15 bg-black/10 px-4 py-4">
    <p class="text-sm font-semibold">
      Member Points
    </p>

    <p class="mt-1 text-sm leading-6 text-[#e8f3ed]">
      Eligible product-order points will be added after admin payment approval.
    </p>
  </div>

  <div class="mt-6 flex flex-col gap-3 sm:flex-row">
    <a
      href="/dashboard/?page=orderHistory"
      class="inline-flex min-h-11 items-center justify-center rounded-full bg-[#fff8e9] px-6 text-sm font-semibold text-[#234f42] transition hover:bg-white"
    >
      View Order History
    </a>

    <a
      href="/dashboard/?page=createOrder"
      class="inline-flex min-h-11 items-center justify-center rounded-full border border-white/30 px-6 text-sm font-semibold text-[#fff8e9] transition hover:border-white/60"
    >
      Continue Shopping
    </a>
  </div>
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
  href="/dashboard/?page=createOrder"
  class="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-light"
>
  Back to products
</a>
        </section>
        <div
  x-show="$store.cart.itemCount > 0"
  class="mt-8 grid min-w-0 gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start"
>
  <aside
  class="min-w-0 lg:sticky lg:top-6"
  aria-label="Order summary"
>
  <section
    class="overflow-hidden rounded-[1.5rem] border border-brand-gold/30 bg-brand-panel shadow-gold-soft"
  >
    <div class="p-5 sm:p-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Order summary
          </p>
          <h2 class="mt-1 font-display text-2xl text-brand-cream">
            Your order
          </h2>
        </div>

        <span
          class="rounded-full border border-brand-border px-3 py-1 text-xs font-semibold text-brand-muted"
          x-text="
            $store.cart.itemCount === 1
              ? '1 item'
              : $store.cart.itemCount + ' items'
          "
        ></span>
      </div>

      <div class="mt-5 rounded-2xl border border-brand-border bg-brand-black">
  <div class="border-b border-brand-border px-4 py-3">
    <p class="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-gold">
      Selected fragrances
    </p>
  </div>

  <div class="divide-y divide-brand-border">
    <template
      x-for="item in $store.cart.detailedItems"
      :key="item.productId"
    >
      <article class="grid grid-cols-[4.5rem_1fr] gap-4 p-4 sm:grid-cols-[5.5rem_1fr]">
        <div class="h-24 w-full overflow-hidden rounded-xl border border-brand-border bg-brand-panel sm:h-28">
          <img
            :src="item.product.image"
            :alt="item.product.name"
            class="size-full object-cover object-center"
          >
        </div>

        <div class="min-w-0">
          <div class="flex items-start justify-between gap-3">
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

            <span
              class="shrink-0 text-xs font-semibold text-brand-muted"
              x-text="formatMoney(item.unitPrice) + ' each'"
            ></span>
          </div>

          <p
            class="mt-1 text-xs text-brand-muted"
            x-text="$store.cart.priceLabel"
          ></p>

          <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center rounded-full border border-brand-border">
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
                :disabled="item.quantity >= item.product.stockQuantity"
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
              class="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-brand-muted transition hover:text-red-400"
              @click="
                $store.cart.remove(item.productId)
                checkoutPreviewComplete = false
              "
            >
              Remove
            </button>
          </div>

          <p
            class="mt-3 text-right text-sm font-semibold text-brand-cream"
            x-text="formatMoney(item.lineTotal)"
          ></p>
        </div>
      </article>
    </template>
  </div>
</div>

      <div class="mt-5 space-y-2 border-t border-brand-border pt-5">
        <div class="flex items-center justify-between text-sm text-brand-muted">
          <span>Subtotal</span>
          <span
            class="font-semibold text-brand-cream"
            x-text="formatMoney($store.cart.subtotal)"
          ></span>
        </div>
        <div class="flex items-center justify-between text-sm text-brand-muted">
          <span>Delivery</span>
          <span
            class="font-semibold"
            :class="deliveryFee() === 0 ? 'text-emerald-200' : 'text-brand-cream'"
            x-text="deliveryFee() === 0 ? 'Free' : deliveryFeeLabel()"
          ></span>
        </div>
        <div class="flex items-end justify-between gap-4 border-t border-brand-border pt-4">
          <span class="text-sm font-semibold uppercase tracking-[0.12em] text-brand-muted">
            Total
          </span>
          <strong
            class="font-display text-3xl text-brand-gold"
            x-text="formatMoney(checkoutTotal())"
          ></strong>
        </div>
      </div>
    </div>
  </section>
</aside>

          <form
            class="min-w-0 space-y-6"
            @submit.prevent="completeCheckoutPreview()"
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
                  Your details
                </h2>
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
                      required
                      class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
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
                      required
                      class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
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
                      required
                      class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
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
                      required
                      class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
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
                  Delivery
                </p>
                <h2
                  class="mt-1 font-display text-3xl text-brand-cream"
                >
                  Fulfillment details
                </h2>
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
                      class="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition"
                      :class="
                        delivery.fulfillmentType === 'pickup'
                          ? 'border-brand-gold bg-brand-gold/10'
                          : 'border-brand-border bg-brand-black'
                      "
                    >
                      <input
                        type="radio"
                        name="fulfillment-method"
                        value="pickup"
                        x-model="delivery.fulfillmentType"
                        class="mt-0.5 size-4 accent-[#b78a32]"
                      >

                      <span>
                        <span class="block text-sm font-semibold text-brand-cream">
                          Pickup
                        </span>

                        <span class="mt-1 block text-xs leading-5 text-brand-muted">
                          Pickup at 1244 Gen. Jacinto St, Makati City, Metro Manila.
                        </span>

                        <span class="mt-2 block text-xs font-semibold text-brand-gold">
                          No delivery fee for pickup orders.
                        </span>
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
                      @change="handleDeliveryRegionChange()"
                      class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
                      :required="delivery.fulfillmentType === 'dropship'"
                      :disabled="delivery.fulfillmentType !== 'dropship'"
                    >
                      <option value="" disabled>
                        Select delivery region
                      </option>
                      <option value="ncr">
                        Metro Manila
                      </option>
                      <option value="luzon">
                        Luzon outside Metro Manila
                      </option>
                      <option value="visayas">
                        Visayas
                      </option>
                      <option value="mindanao">
                        Mindanao
                      </option>
                    </select>
                  </div>

                  <div
                    x-show="isMetroManilaDelivery()"
                    x-transition
                    class="mt-5"
                  >
                    <p class="text-sm font-semibold text-brand-cream">
                      Delivery method
                    </p>

                    <div class="mt-3 grid gap-3 sm:grid-cols-2">
                      <label
                        class="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition"
                        :class="
                          delivery.deliveryMethod === 'spx'
                            ? 'border-brand-gold bg-brand-gold/10'
                            : 'border-brand-border bg-brand-black'
                        "
                      >
                        <input
                          type="radio"
                          name="delivery-method"
                          value="spx"
                          x-model="delivery.deliveryMethod"
                          class="mt-0.5 size-4 accent-[#b78a32]"
                          :required="isMetroManilaDelivery() && !isPrestigeMember()"
                          :disabled="!isMetroManilaDelivery()"
                        >
                        <span>
                          <span class="block text-sm font-semibold text-brand-cream">
                            SPX 1 to 3 days
                          </span>
                          <span class="mt-1 block text-xs leading-5 text-brand-muted">
                            Standard Metro Manila delivery.
                          </span>
                          <span class="mt-2 block text-xs font-semibold text-brand-gold">
                            ₱120
                          </span>
                        </span>
                      </label>

                      <label
                        class="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition"
                        :class="
                          delivery.deliveryMethod === 'same-day'
                            ? 'border-brand-gold bg-brand-gold/10'
                            : 'border-brand-border bg-brand-black'
                        "
                      >
                        <input
                          type="radio"
                          name="delivery-method"
                          value="same-day"
                          x-model="delivery.deliveryMethod"
                          class="mt-0.5 size-4 accent-[#b78a32]"
                          :required="isMetroManilaDelivery() && !isPrestigeMember()"
                          :disabled="!isMetroManilaDelivery()"
                        >
                        <span>
                          <span class="block text-sm font-semibold text-brand-cream">
                            Same-day delivery
                          </span>
                          <span class="mt-1 block text-xs leading-5 text-brand-muted">
                            For Metro Manila addresses only.
                          </span>
                          <span class="mt-2 block text-xs font-semibold text-brand-gold">
                            ₱150
                          </span>
                        </span>
                      </label>
                    </div>
                  </div>

                  <div
                    x-show="requiresShippingConfirmation()"
                    x-transition
                    class="mt-5 rounded-xl border border-amber-400/35 bg-amber-400/10 px-4 py-4"
                  >
                    <p class="text-sm font-semibold text-amber-100">
                      Shipping confirmation required
                    </p>
                    <p class="mt-2 text-xs leading-5 text-amber-100/80">
                      Delivery outside Metro Manila requires manual shipping confirmation.
                      Please message us first before payment so we can confirm the delivery fee and schedule.
                    </p>

                    <a
                      href="https://www.facebook.com/YourProduct2026"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand-gold px-5 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-light sm:w-auto"
                    >
                      Confirm Shipping on Messenger
                    </a>
                  </div>

                  <div
                    x-show="!requiresShippingConfirmation()"
                    x-transition
                  >
                    <div class="mt-5 grid gap-5 sm:grid-cols-2">
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
                          :required="delivery.fulfillmentType === 'dropship'"
                          :disabled="delivery.fulfillmentType !== 'dropship'"
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
                          :required="delivery.fulfillmentType === 'dropship'"
                          :disabled="delivery.fulfillmentType !== 'dropship'"
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
                          :required="delivery.fulfillmentType === 'dropship'"
                          :disabled="delivery.fulfillmentType !== 'dropship'"
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
                          :placeholder="delivery.region === 'ncr' ? 'Metro Manila' : 'Example: Cavite'"
                          class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted disabled:cursor-not-allowed disabled:opacity-70 focus:border-brand-gold"
                          :required="delivery.fulfillmentType === 'dropship' && delivery.region !== 'ncr'"
                          :disabled="delivery.fulfillmentType !== 'dropship' || delivery.region === 'ncr'"
                        >
                        <p
                          x-show="delivery.region === 'ncr'"
                          class="mt-2 text-xs leading-5 text-brand-muted"
                        >
                          Province is automatically set to Metro Manila.
                        </p>
                      </div>
                      <div>
                        <label
                          for="city"
                          class="text-sm font-semibold text-brand-cream"
                        >
                          City or municipality
                        </label>

                        <select
                          id="city"
                          x-show="delivery.region === 'ncr'"
                          x-model="delivery.city"
                          autocomplete="shipping address-level2"
                          class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition focus:border-brand-gold"
                          :required="delivery.fulfillmentType === 'dropship' && delivery.region === 'ncr'"
                          :disabled="delivery.fulfillmentType !== 'dropship' || delivery.region !== 'ncr'"
                        >
                          <option value="" disabled>
                            Select Metro Manila city
                          </option>
                          <template x-for="cityName in metroManilaCities" :key="cityName">
                            <option :value="cityName" x-text="cityName"></option>
                          </template>
                        </select>

                        <input
                          x-show="delivery.region !== 'ncr'"
                          type="text"
                          x-model.trim="delivery.city"
                          autocomplete="shipping address-level2"
                          placeholder="Example: Bacoor"
                          class="mt-2 h-12 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-sm text-brand-cream outline-none transition placeholder:text-brand-muted focus:border-brand-gold"
                          :required="delivery.fulfillmentType === 'dropship' && delivery.region !== 'ncr'"
                          :disabled="delivery.fulfillmentType !== 'dropship' || delivery.region === 'ncr'"
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
                          :disabled="delivery.fulfillmentType !== 'dropship'"
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
                          :disabled="delivery.fulfillmentType !== 'dropship'"
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
              </div>
            </section>

            <section
              x-show="!requiresShippingConfirmation()"
              x-transition
              class="overflow-hidden rounded-[1.5rem] border border-brand-border bg-brand-panel shadow-panel"
            >
              <header
                class="border-b border-brand-border px-5 py-5 sm:px-6"
              >
                <p
                  class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
                >
                  Payment
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
                <fieldset>
                  <legend class="text-sm font-semibold text-brand-cream">
                    Payment method
                  </legend>

                  <div class="mt-3 grid gap-3 sm:grid-cols-2">
  <label
    class="group flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition duration-200"
    :class="
      payment.method === 'e-wallet'
        ? 'border-brand-gold bg-brand-gold/10 shadow-[0_0_0_1px_rgba(212,181,114,0.12)]'
        : 'border-brand-border bg-brand-black hover:border-brand-gold/60 hover:bg-brand-gold/[0.03]'
    "
  >
    <input
      type="radio"
      name="payment-method"
      value="e-wallet"
      x-model="payment.method"
      class="sr-only"
      required
    >

    <span
      class="grid size-12 shrink-0 place-items-center rounded-xl border transition"
      :class="
        payment.method === 'e-wallet'
          ? 'border-brand-gold/40 bg-brand-gold/15 text-brand-gold'
          : 'border-brand-border bg-brand-panel text-brand-muted group-hover:text-brand-gold'
      "
    >
      <svg
        class="size-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        aria-hidden="true"
      >
        <path d="M4 7.5h13.5A2.5 2.5 0 0 1 20 10v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17V7.5Z" stroke-linejoin="round" />
        <path d="M4 8V6.5A2.5 2.5 0 0 1 6.5 4H17" stroke-linecap="round" />
        <path d="M15 12h5v4h-5a2 2 0 1 1 0-4Z" stroke-linejoin="round" />
      </svg>
    </span>

    <span class="min-w-0 flex-1">
      <span class="block text-base font-semibold text-brand-cream">
        GCash
      </span>
      <span class="mt-1 block text-xs leading-5 text-brand-muted">
        Pay using GCash.
      </span>
    </span>

    <span
      class="grid size-9 shrink-0 place-items-center rounded-full border transition"
      :class="
        payment.method === 'e-wallet'
          ? 'border-brand-gold bg-brand-gold text-brand-black'
          : 'border-brand-border text-transparent group-hover:border-brand-gold/60'
      "
      aria-hidden="true"
    >
      <svg
        class="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
      >
        <path d="m6 12 4 4 8-9" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>

    <svg
      class="size-4 shrink-0 text-brand-muted transition group-hover:translate-x-0.5 group-hover:text-brand-gold"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      aria-hidden="true"
    >
      <path d="m9 5 7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </label>

  <label
    class="group flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition duration-200"
    :class="
      payment.method === 'bank-transfer'
        ? 'border-brand-gold bg-brand-gold/10 shadow-[0_0_0_1px_rgba(212,181,114,0.12)]'
        : 'border-brand-border bg-brand-black hover:border-brand-gold/60 hover:bg-brand-gold/[0.03]'
    "
  >
    <input
      type="radio"
      name="payment-method"
      value="bank-transfer"
      x-model="payment.method"
      class="sr-only"
      required
    >

    <span
      class="grid size-12 shrink-0 place-items-center rounded-xl border transition"
      :class="
        payment.method === 'bank-transfer'
          ? 'border-brand-gold/40 bg-brand-gold/15 text-brand-gold'
          : 'border-brand-border bg-brand-panel text-brand-muted group-hover:text-brand-gold'
      "
    >
      <svg
        class="size-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        aria-hidden="true"
      >
        <path d="M3 9h18" stroke-linecap="round" />
        <path d="M5 9V6l7-3 7 3v3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M6 9v8M10 9v8M14 9v8M18 9v8" stroke-linecap="round" />
        <path d="M4 17h16M3 21h18" stroke-linecap="round" />
      </svg>
    </span>

    <span class="min-w-0 flex-1">
      <span class="block text-base font-semibold text-brand-cream">
        MariBank
      </span>
      <span class="mt-1 block text-xs leading-5 text-brand-muted">
        Pay through MariBank transfer.
      </span>
    </span>

    <span
      class="grid size-9 shrink-0 place-items-center rounded-full border transition"
      :class="
        payment.method === 'bank-transfer'
          ? 'border-brand-gold bg-brand-gold text-brand-black'
          : 'border-brand-border text-transparent group-hover:border-brand-gold/60'
      "
      aria-hidden="true"
    >
      <svg
        class="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
      >
        <path d="m6 12 4 4 8-9" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>

    <svg
      class="size-4 shrink-0 text-brand-muted transition group-hover:translate-x-0.5 group-hover:text-brand-gold"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      aria-hidden="true"
    >
      <path d="m9 5 7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </label>
</div>
                </fieldset>

                <div
                  x-show="payment.method === 'e-wallet'"
                  x-transition
                  class="mt-4 rounded-2xl border border-brand-gold/30 bg-brand-black p-4"
                >
                  <p
                    class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand-gold"
                  >
                    E-wallet Details Pending
                  </p>

                  <p class="mt-2 text-sm leading-6 text-brand-muted">
                    Official e-wallet account details will be added after client confirmation.
                  </p>
                </div>

                <div
                  x-show="payment.method === 'bank-transfer'"
                  x-transition
                  class="mt-4 overflow-hidden rounded-2xl border border-brand-gold/30 bg-brand-panel p-4 sm:p-5"
                >
                  <p
                    class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand-gold"
                  >
                    Official MariBank Account
                  </p>

                  <div class="mt-4 grid gap-5 sm:grid-cols-[minmax(0,1fr)_11rem] sm:items-center">
                    <div>
                      <p class="text-xs uppercase tracking-[0.12em] text-brand-muted">
                        Account Name
                      </p>

                      <p class="mt-1 text-sm font-semibold text-brand-cream">
                        Ian Tiangco
                      </p>

                      <p class="mt-4 text-xs uppercase tracking-[0.12em] text-brand-muted">
                        Account Number
                      </p>

                      <p class="mt-1 break-all text-base font-semibold tracking-[0.04em] text-brand-cream">
                        5294162952422063
                      </p>

                      <p class="mt-4 text-xs leading-5 text-brand-muted">
                        Scan the QR code or transfer directly to the account above, then upload your payment screenshot below.
                      </p>
                    </div>

                    <div class="overflow-hidden rounded-xl border border-brand-border bg-white p-2">
                      <img
                        src="${maribankQrImage}"
                        alt="Official MariBank payment QR code"
                        class="mx-auto aspect-square w-full object-contain"
                      >
                    </div>
                  </div>
                </div>

                <div class="mt-5 rounded-xl border border-brand-border bg-brand-black p-4">
                  <p class="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-gold">
                    Amount to pay
                  </p>

                  <div class="mt-3 space-y-2 text-sm">
                    <div class="flex items-center justify-between gap-4 text-brand-muted">
                      <span>Subtotal</span>
                      <span
                        class="font-semibold text-brand-cream"
                        x-text="formatMoney($store.cart.subtotal)"
                      ></span>
                    </div>

                    <div class="flex items-center justify-between gap-4 text-brand-muted">
                      <span>Delivery</span>
                      <span
                        class="font-semibold"
                        :class="deliveryFee() === 0 ? 'text-emerald-200' : 'text-brand-cream'"
                        x-text="deliveryFee() === 0 ? 'Free' : deliveryFeeLabel()"
                      ></span>
                    </div>
                  </div>

                  <div class="mt-4 flex items-end justify-between gap-4 border-t border-brand-border pt-4">
                    <span class="text-sm font-semibold uppercase tracking-[0.12em] text-brand-muted">
                      Total payable
                    </span>
                    <strong
                      class="font-display text-3xl text-brand-gold"
                      x-text="formatMoney(checkoutTotal())"
                    ></strong>
                  </div>
                </div>
              
                <div class="mt-5">
                  <label
                    for="payment-proof"
                    class="text-sm font-semibold text-brand-cream"
                  >
                    Proof of payment
                  </label>
                  
                  <div
                    class="mt-2 rounded-xl border border-dashed border-brand-border bg-brand-black px-5 py-7 text-center transition hover:border-brand-gold"
                  >
                    <button
                      type="button"
                      x-show="payment.proofPreviewUrl"
                      x-transition
                      class="mx-auto block w-full overflow-hidden rounded-xl border border-brand-border bg-brand-panel"
                      @click="
                        payment.proofModalOpen = true
                        document.body.classList.add('overflow-hidden')
                      "
                      aria-label="View payment screenshot"
                    >
                      <img
                        :src="payment.proofPreviewUrl"
                        alt="Selected payment proof preview"
                        class="mx-auto max-h-64 w-full object-contain"
                      >
                    </button>

                    <div
  x-show="!payment.proofPreviewUrl"
  x-transition
  class="mx-auto grid size-14 place-items-center rounded-full border border-brand-gold/30 bg-brand-gold/5 text-brand-gold"
>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    class="size-7"
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
</div>

<div x-show="!payment.proofPreviewUrl" x-transition>
  <span class="mt-4 block font-display text-2xl text-brand-cream">
    Upload screenshot here
  </span>

  <span class="mt-2 block text-sm leading-6 text-brand-muted">
    Upload a clear payment receipt or screenshot.
  </span>

  <span class="mt-1 block text-xs leading-5 text-brand-muted">
    JPG, PNG, or WebP (max 5 MB)
  </span>
</div>

<p
  x-show="payment.proofFileName"
  x-transition
  class="mx-auto mt-3 max-w-full break-all text-xs font-semibold text-brand-cream"
  x-text="payment.proofFileName"
></p>

<label
  for="payment-proof"
  x-show="!payment.proofPreviewUrl"
  x-transition
  class="mx-auto mt-5 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-brand-gold bg-brand-gold px-6 text-sm font-bold text-brand-black transition hover:-translate-y-0.5 hover:bg-brand-gold-light"
>
  <svg
    class="size-5 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    aria-hidden="true"
  >
    <path
      d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <span>Choose file</span>
</label>

<input
  id="payment-proof"
  type="file"
  accept="image/jpeg,image/png,image/webp"
  class="sr-only"
  @change="handleProofFile($event)"
  required
>

                    <button
                      type="button"
                      x-show="payment.proofPreviewUrl"
                      x-transition
                      class="mx-auto mt-4 inline-flex h-9 items-center justify-center rounded-full border border-brand-border px-4 text-xs font-semibold text-brand-muted transition hover:border-red-500 hover:text-red-400"
                      @click="
                        if (payment.proofPreviewUrl) URL.revokeObjectURL(payment.proofPreviewUrl)
                        payment.proofFile = null
                        payment.proofFileName = ''
                        payment.proofPreviewUrl = ''
                        payment.proofModalOpen = false
                        paymentError = ''
                        checkoutPreviewComplete = false
                        document.body.classList.remove('overflow-hidden')
                        const proofInput = document.querySelector('#payment-proof')
                        if (proofInput) proofInput.value = ''
                      "
                    >
                      Remove screenshot
                    </button>
                  </div>

                  <div
                    x-show="payment.proofModalOpen"
                    x-transition.opacity
                    class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Payment screenshot preview"
                    @keydown.escape.window="
                      payment.proofModalOpen = false
                      document.body.classList.remove('overflow-hidden')
                    "
                  >
                    <div class="relative max-h-full w-full max-w-4xl">
                      <button
                        type="button"
                        class="absolute right-2 top-2 z-10 grid size-10 place-items-center rounded-full bg-brand-black text-xl font-bold text-brand-cream shadow-lg transition hover:bg-brand-gold hover:text-brand-black"
                        @click="
                          payment.proofModalOpen = false
                          document.body.classList.remove('overflow-hidden')
                        "
                        aria-label="Close payment screenshot preview"
                      >
                        ×
                      </button>

                      <img
                        :src="payment.proofPreviewUrl"
                        alt="Enlarged payment proof preview"
                        class="mx-auto max-h-[85vh] w-full rounded-2xl border border-brand-border bg-brand-black object-contain"
                      >
                    </div>
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
              x-show="!requiresShippingConfirmation()"
              x-transition
              class="overflow-hidden rounded-[1.5rem] border border-brand-gold/30 bg-brand-panel p-5 shadow-gold-soft sm:p-6"
            >

              <div

              <button
                type="submit"
                x-show="!checkoutPreviewComplete"
                class="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-gold px-7 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-light disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="!checkoutPaymentsReady || isCheckingCart"
                x-text="
                  !checkoutPaymentsReady
                    ? 'Ordering not open yet'
                    : isCheckingCart
                      ? 'Reviewing order details...'
                      : 'Review Order Details'
                "
              ></button>

              <button
                type="button"
                x-show="checkoutPreviewComplete && !submittedOrderId"
                @click="submitOrder()"
                :disabled="!checkoutPaymentsReady || isSubmittingOrder || orderSubmissionUncertain"
                class="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-gold px-7 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-light disabled:cursor-not-allowed disabled:opacity-50"
                x-text="isSubmittingOrder ? 'Submitting order...' : 'Submit Order'"
              ></button>

              <button
                type="button"
                x-show="checkoutPreviewComplete && !submittedOrderId"
                @click="checkoutPreviewComplete = false"
                class="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full border border-brand-border px-7 text-sm font-semibold text-brand-muted transition hover:border-brand-gold hover:text-brand-gold"
              >
                Edit Details
              </button>

              <p
                x-show="orderCheckError"
                x-text="orderCheckError"
                class="mt-3 text-center text-sm text-red-400"
                role="alert"
              ></p>

              <p class="mt-3 text-center text-xs leading-5 text-brand-muted">
                Orders remain pending until the company verifies the payment screenshot.
              </p>
            </section>

          </form>
        </div>
      </div>
    </main>
  </div>
`

  bindFadeLinks('a[href^="/dashboard/"]')
  Alpine.start()
}
startCheckout()
