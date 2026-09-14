import './style.css'
import Alpine from 'alpinejs'

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

import { siteConfig } from './config/site-config.js'
import { homeConfig } from './config/home-config.js'

import { renderHeader } from './components/header.js'
import { renderHero } from './components/hero.js'

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
  renderCommunitySection,
} from './components/community-section.js'

import {
  renderBossSection,
} from './components/boss-section.js'

import {
  renderVisionMissionSection,
} from './components/vision-mission-section.js'

import {
  renderCartDrawer,
} from './components/cart-drawer.js'

import { renderFooter } from './components/footer.js'

window.Alpine = Alpine

registerCartStore(Alpine, products)

document.title =
  `${siteConfig.brand.name} | Premium Fragrances`

document.querySelector('#app').innerHTML = `
  ${renderHeader(siteConfig)}

  <main>
    ${renderHero(homeConfig, siteConfig)}

    ${renderProductsSection(
      products,
      productCategories,
    )}

    ${renderAccountCtaSection()}

    ${renderPackagesSection(packages)}

    ${renderWaysToEarnSection()}

    ${renderDiscoverSection()}

    ${renderCommunitySection()}

    ${renderBossSection()}

    ${renderVisionMissionSection()}
  </main>

  ${renderFooter(siteConfig)}
  ${renderCartDrawer()}
`

Alpine.start()