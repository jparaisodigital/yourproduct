import './style.css'
import logoImage from './assets/logoyourproduct.webp'
import { siteConfig } from './config/site-config.js'
import {
  renderSiteLoader,
  dismissSiteLoader,
} from './components/site-loader.js'
import { bindFadeLinks } from './lib/page-transition.js'

const businessCenterParams = new URLSearchParams(window.location.search)
const fromDashboard = businessCenterParams.get('from') === 'dashboard'
const backHref = fromDashboard ? '/dashboard/' : '/'
const backLabel = fromDashboard ? 'Back to Dashboard' : 'Back to store'

document.title = `Your Events | ${siteConfig.brand.name}`

document.querySelector('#business-center-app').innerHTML = `
  ${renderSiteLoader()}

  <div class="min-h-screen bg-brand-black text-brand-cream">
    <header class="border-b border-brand-border bg-brand-panel">
      <div class="mx-auto flex w-[min(1120px,90%)] items-center justify-between gap-4 py-4">
        <a
          href="/"
          data-fade-link
          class="flex min-w-0 items-center gap-3"
          aria-label="Return to ${siteConfig.brand.name}"
        >
          <img src="${logoImage}" alt="${siteConfig.brand.name} logo" class="size-12 shrink-0 object-contain sm:size-14">
          <span class="min-w-0">
            <span class="block truncate text-sm font-semibold uppercase tracking-[0.18em] text-brand-cream sm:text-base">
              ${siteConfig.brand.name}
            </span>
            <span class="mt-0.5 hidden text-[0.6rem] uppercase tracking-[0.12em] text-brand-muted sm:block">
              ${siteConfig.brand.tagline}
            </span>
          </span>
        </a>

        <a
          href="${backHref}"
          data-fade-link
          class="premium-outline inline-flex h-10 items-center justify-center rounded-full border border-brand-border px-5 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
        >
          ${backLabel}
        </a>
      </div>
    </header>

    <main class="mx-auto flex min-h-[calc(100vh-190px)] w-[min(1120px,90%)] items-center justify-center py-12 sm:py-16">
      <section class="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-brand-border bg-brand-panel p-7 text-center shadow-panel sm:p-10">
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
          YOUR EVENTS
        </p>

        <h1 class="mt-4 font-display text-4xl text-brand-cream sm:text-6xl">
          Your Events
        </h1>

        <div class="mx-auto mt-7 grid h-20 w-20 place-items-center rounded-full border border-brand-gold/40 bg-brand-black text-brand-gold shadow-lg shadow-black/30">
          <span class="text-3xl">✦</span>
        </div>

        <h2 class="mt-7 font-display text-3xl text-brand-cream sm:text-4xl">
          Coming Soon
        </h2>

        <p class="mx-auto mt-4 max-w-xl text-sm leading-7 text-brand-muted sm:text-base">
          We are preparing business tools, guides, training resources, and member support materials.
          Please check back soon.
        </p>

        <div class="mt-8 grid gap-3 sm:grid-cols-3">
          <div class="rounded-2xl border border-brand-border bg-brand-black p-5">
            <p class="text-sm font-semibold text-brand-cream">Business Guides</p>
            <p class="mt-2 text-xs leading-5 text-brand-muted">Coming soon</p>
          </div>

          <div class="rounded-2xl border border-brand-border bg-brand-black p-5">
            <p class="text-sm font-semibold text-brand-cream">Member Resources</p>
            <p class="mt-2 text-xs leading-5 text-brand-muted">Coming soon</p>
          </div>

          <div class="rounded-2xl border border-brand-border bg-brand-black p-5">
            <p class="text-sm font-semibold text-brand-cream">Sales Support Tools</p>
            <p class="mt-2 text-xs leading-5 text-brand-muted">Coming soon</p>
          </div>
        </div>
      </section>
    </main>

    <footer class="border-t border-brand-border bg-brand-panel">
      <div class="mx-auto flex w-[min(1120px,90%)] flex-col gap-3 py-6 text-xs text-brand-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© ${new Date().getFullYear()} ${siteConfig.brand.name}. All rights reserved.</p>
        <p>Business tools and member resources will be added soon.</p>
      </div>
    </footer>
  </div>
`

bindFadeLinks()

window.addEventListener('load', () => {
  dismissSiteLoader()
})

window.setTimeout(() => {
  dismissSiteLoader()
}, 900)