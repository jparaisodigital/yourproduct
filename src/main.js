import './style.css'
import Alpine from 'alpinejs'

import {
  products,
  productCategories,
} from './config/products-config.js'

import {
  registerCartStore,
} from './stores/cart-store.js'

import {
  renderProductsSection,
} from './components/products-section.js'

import { siteConfig } from './config/site-config.js'
import { homeConfig } from './config/home-config.js'

import { renderHeader } from './components/header.js'
import { renderHero } from './components/hero.js'
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

    <section
      id="membership"
      class="grid min-h-[60vh] place-items-center border-t border-brand-border bg-brand-black px-6 py-20"
    >
      <div class="text-center">
        <p class="text-xs uppercase tracking-[0.3em] text-brand-gold">
          Membership
        </p>

        <h2 class="mt-4 font-display text-5xl text-brand-cream">
          Choose Your Beginning
        </h2>
      </div>
    </section>

    <section
      id="rewards"
      class="grid min-h-[60vh] place-items-center border-t border-brand-border bg-brand-charcoal px-6 py-20"
    >
      <div class="text-center">
        <p class="text-xs uppercase tracking-[0.3em] text-brand-gold">
          Points and Rewards
        </p>

        <h2 class="mt-4 font-display text-5xl text-brand-cream">
          Qualified Purchases Move You Forward
        </h2>
      </div>
    </section>

    <section
      id="about"
      class="grid min-h-[60vh] place-items-center border-t border-brand-border bg-brand-black px-6 py-20"
    >
      <div class="text-center">
        <p class="text-xs uppercase tracking-[0.3em] text-brand-gold">
          Our Story
        </p>

        <h2 class="mt-4 font-display text-5xl text-brand-cream">
          More Than a Fragrance
        </h2>
      </div>
    </section>
  </main>

  ${renderFooter(siteConfig)}
`

Alpine.start()