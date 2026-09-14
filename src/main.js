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
  renderDiscoverSection,
} from './components/discover-section.js'

import {
  renderBossSection,
} from './components/boss-section.js'

import {
  renderVisionMissionSection,
} from './components/vision-mission-section.js'

import {
  renderPackagesSection,
} from './components/packages-section.js'

import {
  renderProductsSection,
} from './components/products-section.js'

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

    ${renderDiscoverSection()}

    ${renderBossSection()}

    ${renderVisionMissionSection()}

    ${renderPackagesSection(packages)}

    ${renderProductsSection(
      products,
      productCategories,
    )}

    <section
      id="community"
      class="grid min-h-[60vh] place-items-center border-t border-brand-border bg-brand-charcoal px-6 py-20"
    >
      <div class="text-center">
        <p
          class="text-xs uppercase tracking-[0.3em] text-brand-gold"
        >
          Our Community
        </p>

        <h2
          class="mt-4 font-display text-5xl text-brand-cream"
        >
          Grow Together
        </h2>
      </div>
    </section>

    <section
      id="ways-to-earn"
      class="grid min-h-[60vh] place-items-center border-t border-brand-border bg-brand-black px-6 py-20"
    >
      <div class="text-center">
        <p
          class="text-xs uppercase tracking-[0.3em] text-brand-gold"
        >
          Ways to Earn
        </p>

        <h2
          class="mt-4 font-display text-5xl text-brand-cream"
        >
          Explore New Possibilities
        </h2>
      </div>
    </section>
  </main>

  ${renderFooter(siteConfig)}
  ${renderCartDrawer()}
`

Alpine.start()