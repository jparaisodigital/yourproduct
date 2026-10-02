import './style.css'

import Alpine from 'alpinejs'

import { supabase } from './lib/supabase.js'

import {
  renderStarterOffersSection,
} from './components/starter-offers-section.js'

import {
  renderSiteLoader,
  dismissSiteLoader,
} from './components/site-loader.js'

import {
  flyToCart,
} from './lib/fly-to-cart.js'

import {
  initScrollReveal,
} from './lib/scroll-reveal.js'

import {
  bindFadeLinks,
} from './lib/page-transition.js'

import {
  products,
  productCategories,
} from './config/products-config.js'

import {
  packages,
} from './config/packages-config.js'

import {
  registerCartStore,
} from './stores/cart-store.js'

import {
  registerProductViewStore,
} from './stores/product-view-store.js'

import {
  siteConfig,
} from './config/site-config.js'

import {
  homeConfig,
} from './config/home-config.js'

import {
  renderHeader,
} from './components/header.js'

import {
  renderHero,
} from './components/hero.js'

import {
  renderProductsSection,
} from './components/products-section.js'

import {
  renderPackagesSection,
} from './components/packages-section.js'

import {
  renderAccountCtaSection,
} from './components/account-cta-section.js'

import {
  renderWaysToEarnSection,
} from './components/ways-to-earn-section.js'

import {
  renderDiscoverSection,
} from './components/discover-section.js'

import {
  renderBossSection,
} from './components/boss-section.js'

import {
  renderVisionMissionSection,
} from './components/vision-mission-section.js'

import {
  renderCartDrawer,
} from './components/cart-drawer.js'

import {
  renderProductDrawer,
} from './components/product-drawer.js'

import {
  renderFooter,
} from './components/footer.js'

import {
  registerMembershipModal,
  renderMembershipModal,
} from './components/membership-modal.js'

import {
  registerCustomerSupportChat,
  renderCustomerSupportChat,
} from './components/customer-support-chat.js'

async function startStorefront() {
  let liveProducts = []
  let productsLoadError = false

  try {
    const { data, error } = await supabase
      .from('products')
      .select(
        'id, is_active, stock_quantity, regular_price, member_price',
      )

    if (error) throw error
    liveProducts = data ?? []
  } catch (error) {
    console.error('Unable to load storefront products:', error)
    productsLoadError = true
  }

  const liveProductsById = new Map(
    liveProducts.map((product) => [product.id, product]),
  )

  const storefrontProducts = products.map((product) => {
    const liveProduct = liveProductsById.get(product.id)
    const isActive = liveProduct?.is_active === true

    return {
      ...product,
      isActive,
      stockQuantity: isActive
        ? Math.max(0, Number(liveProduct.stock_quantity) || 0)
        : 0,
      regularPrice: liveProduct?.regular_price == null
        ? product.regularPrice
        : Number(liveProduct.regular_price),
      memberPrice: liveProduct?.member_price == null
        ? product.memberPrice
        : Number(liveProduct.member_price),
    }
  })

  window.Alpine = Alpine

  registerCartStore(Alpine, storefrontProducts)
  registerProductViewStore(Alpine, storefrontProducts)
  registerMembershipModal(Alpine)
  registerCustomerSupportChat(Alpine)

  Alpine.magic(
    'addToCartWithAnimation',
    () => {
      return (productId, sourceButton) => {
        const product = storefrontProducts.find(
          (item) => item.id === productId,
        )

        if (
          !product ||
          !product.isActive ||
          product.stockQuantity <= 0
        ) {
          return
        }

        const cart = Alpine.store('cart')
        const previousQuantity = cart.quantityFor(productId)

        cart.add(productId)

        if (cart.quantityFor(productId) > previousQuantity) {
          flyToCart(sourceButton, product.image)
        }
      }
    },
  )

  document.title =
  `${siteConfig.brand.name} | Premium Fragrances`

  const { data: sessionData } = await supabase.auth.getSession()
  const signedInUser = sessionData.session?.user ?? null
  const isLoggedIn = Boolean(signedInUser)
  let signedInRole = 'customer'

  if (signedInUser) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', signedInUser.id)
      .maybeSingle()

    if (profileError) {
      console.error('Unable to load storefront profile role:', profileError)
    }

    signedInRole = profile?.role || 'customer'
  }

document.querySelector('#app').innerHTML = `
  ${renderSiteLoader()}

  ${renderHeader(siteConfig, {
    isLoggedIn,
    role: signedInRole,
  })}

    <main>
      ${renderHero(homeConfig, siteConfig)}

      ${renderStarterOffersSection()}
      ${renderProductsSection(
        storefrontProducts.filter(
          (product) => !product.isStandaloneOffer,
        ),
        productCategories,
        productsLoadError,
      )}

      ${renderPackagesSection(packages)}

      ${renderAccountCtaSection()}

      ${renderWaysToEarnSection()}

      ${renderVisionMissionSection()}

      ${renderBossSection()}
    </main>

    ${renderFooter(siteConfig)}

    ${renderCartDrawer()}

    ${renderProductDrawer()}

    ${renderMembershipModal()}

    ${renderCustomerSupportChat()}
  `

  let selectedPackageHref = ''

  const packageConfirmationModal = document.createElement('div')
  packageConfirmationModal.className =
    'fixed inset-0 z-[80] hidden items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm'
  packageConfirmationModal.innerHTML = `
    <div class="w-full max-w-lg rounded-[1.5rem] border border-brand-gold/30 bg-brand-panel p-6 shadow-gold-soft">
      <p class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold">
        Confirm Membership Package
      </p>

      <h2
        class="mt-3 font-display text-3xl text-brand-cream"
        data-package-confirm-name
      ></h2>

      <p
        class="mt-2 font-display text-2xl text-brand-gold"
        data-package-confirm-price
      ></p>

      <p
        class="mt-3 text-sm leading-6 text-brand-muted"
        data-package-confirm-description
      ></p>

      <ul
        class="mt-4 space-y-2 text-sm leading-6 text-brand-muted"
        data-package-confirm-inclusions
      ></ul>

      <p class="mt-5 rounded-xl border border-brand-border bg-brand-black px-4 py-3 text-xs leading-5 text-brand-muted">
        Your account stays free until payment proof is submitted and approved by admin.
      </p>

      <div class="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          class="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-border px-5 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
          data-package-confirm-cancel
        >
          Cancel
        </button>

        <button
          type="button"
          class="premium-cta inline-flex min-h-11 items-center justify-center rounded-full bg-brand-gold px-5 text-sm font-semibold text-[#17130d]"
          data-package-confirm-continue
        >
          Continue
        </button>
      </div>
    </div>
  `
  document.body.appendChild(packageConfirmationModal)

  const closePackageConfirmation = () => {
    selectedPackageHref = ''
    packageConfirmationModal.classList.add('hidden')
    packageConfirmationModal.classList.remove('flex')
    document.body.classList.remove('overflow-hidden')
  }

  packageConfirmationModal
    .querySelector('[data-package-confirm-cancel]')
    .addEventListener('click', closePackageConfirmation)

  packageConfirmationModal.addEventListener('click', (event) => {
    if (event.target === packageConfirmationModal) {
      closePackageConfirmation()
    }
  })

  packageConfirmationModal
    .querySelector('[data-package-confirm-continue]')
    .addEventListener('click', () => {
      if (selectedPackageHref) {
        window.location.assign(selectedPackageHref)
      }
    })

  document
    .querySelectorAll('[data-package-cta]')
    .forEach((link) => {
      const packageId = link.dataset.packageCta

      if (!packageId) return

      link.href = isLoggedIn
        ? `/dashboard/?package=${encodeURIComponent(
            packageId,
          )}&membership=awaiting-payment`
        : `/login/?package=${encodeURIComponent(packageId)}`

      link.addEventListener('click', (event) => {
        event.preventDefault()

        selectedPackageHref = link.href

        packageConfirmationModal.querySelector(
          '[data-package-confirm-name]',
        ).textContent = link.dataset.packageName || 'Membership Package'

        packageConfirmationModal.querySelector(
          '[data-package-confirm-price]',
        ).textContent = link.dataset.packagePrice || ''

        packageConfirmationModal.querySelector(
          '[data-package-confirm-description]',
        ).textContent = link.dataset.packageDescription || ''

        const inclusionsList = packageConfirmationModal.querySelector(
          '[data-package-confirm-inclusions]',
        )

        inclusionsList.innerHTML = (
          link.dataset.packageInclusions || ''
        )
          .split(' | ')
          .filter(Boolean)
          .map(
            (inclusion) => `
              <li class="flex gap-2">
                <span class="mt-2 size-1.5 shrink-0 rounded-full bg-brand-gold"></span>
                <span>${inclusion}</span>
              </li>
            `,
          )
          .join('')

          packageConfirmationModal.classList.remove('hidden')
          packageConfirmationModal.classList.add('flex')
          document.body.classList.add('overflow-hidden')
      })
    })

  Alpine.start()
  initScrollReveal()
  bindFadeLinks()

  requestAnimationFrame(() => {
    dismissSiteLoader()
  })
}

startStorefront()
