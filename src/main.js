import './style.css'
import Alpine from 'alpinejs'
import { siteConfig } from './config/site-config.js'
import { renderHeader } from './components/header.js'
import { renderFooter } from './components/footer.js'

window.Alpine = Alpine

document.title = `${siteConfig.brand.name} | Premium Fragrances`

document.querySelector('#app').innerHTML = `
  ${renderHeader(siteConfig)}

  <main>
    <section
      id="home"
      class="grid min-h-[calc(100vh-5rem)] place-items-center bg-brand-black px-6 py-20"
    >
      <div class="mx-auto w-full max-w-5xl text-center">
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
          ${siteConfig.brand.name}
        </p>

        <h1 class="mx-auto mt-6 max-w-4xl font-display text-5xl font-semibold leading-[0.95] text-brand-cream sm:text-7xl lg:text-8xl">
          Find a scent that feels
          <span class="italic text-brand-gold">uniquely yours.</span>
        </h1>

        <p class="mx-auto mt-7 max-w-xl text-base leading-7 text-brand-muted">
          ${siteConfig.brand.shortDescription}
        </p>

        <div class="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#shop"
            class="w-full rounded-full bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-black transition duration-300 hover:-translate-y-1 hover:bg-brand-gold-light sm:w-auto"
          >
            Explore the Collection
          </a>

          <a
            href="#membership"
            class="w-full rounded-full border border-brand-border px-7 py-3.5 text-sm font-semibold text-brand-cream transition duration-300 hover:border-brand-gold hover:text-brand-gold sm:w-auto"
          >
            View Membership
          </a>
        </div>
      </div>
    </section>

    <section
      id="shop"
      class="grid min-h-[60vh] place-items-center border-t border-brand-border bg-brand-charcoal px-6 py-20"
    >
      <h2 class="font-display text-5xl text-brand-cream">
        Shop Collection
      </h2>
    </section>

    <section
      id="membership"
      class="grid min-h-[60vh] place-items-center border-t border-brand-border bg-brand-black px-6 py-20"
    >
      <h2 class="font-display text-5xl text-brand-cream">
        Membership
      </h2>
    </section>

    <section
      id="rewards"
      class="grid min-h-[60vh] place-items-center border-t border-brand-border bg-brand-charcoal px-6 py-20"
    >
      <h2 class="font-display text-5xl text-brand-cream">
        Rewards
      </h2>
    </section>

    <section
      id="about"
      class="grid min-h-[60vh] place-items-center border-t border-brand-border bg-brand-black px-6 py-20"
    >
      <h2 class="font-display text-5xl text-brand-cream">
        About
      </h2>
    </section>
    </main>

  ${renderFooter(siteConfig)}
`

Alpine.start()