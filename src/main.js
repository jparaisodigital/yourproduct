import './style.css'
import Alpine from 'alpinejs'

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

window.Alpine = Alpine

registerCartStore(Alpine, products)
registerProductViewStore(Alpine, products)
registerMembershipModal(Alpine)

Alpine.magic('addToCartWithAnimation', () => {
  return (productId, sourceButton) => {
    const product = products.find(
      (item) => item.id === productId,
    )

    if (!product) {
      return
    }

    const cart = Alpine.store('cart')
    const previousQuantity = cart.quantityFor(productId)

    cart.add(productId)

    // Animate only when an item was actually added.
    if (cart.quantityFor(productId) > previousQuantity) {
      flyToCart(sourceButton, product.image)
    }
  }
})

document.title =
  `${siteConfig.brand.name} | Premium Fragrances`

  document.querySelector('#app').innerHTML = `
  ${renderSiteLoader()}
  ${renderHeader(siteConfig)}

  <main>
  ${renderHero(homeConfig, siteConfig)}

  ${renderProductsSection(
    products,
    productCategories,
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
`

Alpine.start()
initScrollReveal()

requestAnimationFrame(() => {
  dismissSiteLoader()
})