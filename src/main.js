import './style.css'

import Alpine from 'alpinejs'

import { supabase } from './lib/supabase.js'

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

  document.querySelector('#app').innerHTML = `
    ${renderSiteLoader()}

    ${renderHeader(siteConfig)}

    <main>
      ${renderHero(homeConfig, siteConfig)}

      ${renderProductsSection(
        storefrontProducts,
        productCategories,
        productsLoadError,
      )}

      ${renderPackagesSection(packages)}

      ${renderAccountCtaSection()}

      ${renderWaysToEarnSection()}

      ${renderDiscoverSection()}

      ${renderVisionMissionSection()}

      ${renderBossSection()}
    </main>

    ${renderFooter(siteConfig)}

    ${renderCartDrawer()}

    ${renderProductDrawer()}

    ${renderMembershipModal()}

    ${renderCustomerSupportChat()}
  `

  Alpine.start()
  initScrollReveal()

  requestAnimationFrame(() => {
    dismissSiteLoader()
  })
}

startStorefront()