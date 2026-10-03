import testerKitImage from '../assets/products/tester-kit.png'
import starterPackageImage from '../assets/products/starter-package.jpg'

const pesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 0,
})

export function renderStarterOffersSection() {
  return `
  <section
  id="starter-offers"
  x-data="{ zoomImage: null, zoomAlt: '' }"
  class="border-t border-brand-border bg-brand-black py-14 sm:py-16"
>
      <div class="mx-auto w-[min(1240px,90%)]">
        <div class="max-w-3xl">
          <p class="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-brand-gold">
            Starter Offers
          </p>

          <h2 class="mt-3 font-display text-4xl leading-[1.05] text-brand-cream sm:text-5xl">
            Start with the kit that fits your plan.
          </h2>

          <p class="mt-4 text-sm leading-6 text-brand-muted sm:text-base">
            Choose a standalone tester kit for product discovery, or start your membership journey with the Starter Package.
          </p>
        </div>

        <div class="mt-8 grid gap-5 lg:grid-cols-2">
          <article
            class="group overflow-hidden rounded-[1.5rem] border border-brand-gold/45 bg-brand-panel shadow-gold-soft"
          >
            <div class="bg-brand-black p-4">
              <button
  type="button"
  class="block w-full cursor-zoom-in"
  aria-label="Zoom Premium Tester Kit image"
  @click="zoomImage = '${testerKitImage}'; zoomAlt = 'Premium Tester Kit'"
>
  <img
    src="${testerKitImage}"
    alt="Premium Tester Kit"
    class="aspect-[4/3] w-full rounded-[1.1rem] object-contain transition duration-300 group-hover:scale-[1.02]"
    loading="lazy"
  >
</button>
            </div>

            <div class="p-6 sm:p-7">
              <p class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold">
                Standalone Product
              </p>

              <div class="mt-3 flex flex-wrap items-end justify-between gap-3">
                <h3 class="font-display text-3xl leading-none text-brand-cream sm:text-4xl">
                  Premium Tester Kit
                </h3>

                <p class="font-display text-3xl leading-none text-brand-gold">
                  ${pesoFormatter.format(700)}
                </p>
              </div>

              <p class="mt-4 text-sm leading-6 text-brand-muted">
                A complete 20-piece 5ml tester kit for customers who want to explore the full scent lineup.
                Includes 20 pcs 5ml assorted testers, ideal for scent sampling before buying full bottles.
              </p>

              <div class="mt-5 rounded-xl border border-brand-gold/25 bg-brand-gold/10 px-4 py-3">
                <p class="text-xs font-semibold text-brand-gold">
                  Active members earn 10 points after order approval.
                </p>
              </div>

              <button
  type="button"
  class="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-brand-gold px-5 text-sm font-semibold text-[#17130d] transition hover:bg-brand-gold-light disabled:cursor-not-allowed disabled:opacity-50"
  data-action="add-to-cart"
  data-product-id="tester-kit"
  @click.prevent="$addToCartWithAnimation('tester-kit', $event.currentTarget)"
>
  Add Tester Kit to Cart
</button>
            </div>
          </article>

          <article
            class="group overflow-hidden rounded-[1.5rem] border border-brand-border bg-brand-panel shadow-panel transition hover:border-brand-gold/50"
          >
            <div class="bg-brand-black p-4">
              <button
  type="button"
  class="block w-full cursor-zoom-in"
  aria-label="Zoom Starter Package image"
  @click="zoomImage = '${starterPackageImage}'; zoomAlt = 'Starter Package'"
>
  <img
    src="${starterPackageImage}"
    alt="Starter Package"
    class="aspect-[4/3] w-full rounded-[1.1rem] object-contain transition duration-300 group-hover:scale-[1.02]"
    loading="lazy"
  >
</button>
            </div>

            <div class="p-6 sm:p-7">
              <p class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold">
                Membership Starter
              </p>

              <div class="mt-3 flex flex-wrap items-end justify-between gap-3">
                <h3 class="font-display text-3xl leading-none text-brand-cream sm:text-4xl">
                  Starter Package
                </h3>

                <p class="font-display text-3xl leading-none text-brand-gold">
                  ${pesoFormatter.format(1000)}
                </p>
              </div>

              <p class="mt-4 text-sm leading-6 text-brand-muted">
                Perfect for beginners who want to start small with a flexible starter option.
              </p>

              <div class="mt-5 grid gap-3 sm:grid-cols-2">
                <div class="rounded-xl border border-brand-gold/25 bg-brand-gold/10 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">
                    Option A
                  </p>

                  <p class="mt-1 font-semibold text-brand-cream">
                    4 Bottles
                  </p>

                  <p class="mt-1 text-xs leading-5 text-brand-muted">
                    Four assorted 60ml bottles.
                  </p>
                </div>

                <div class="rounded-xl border border-brand-gold/25 bg-brand-gold/10 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">
                    Option B
                  </p>

                  <p class="mt-1 font-semibold text-brand-cream">
                    Tester Kit + 2 Bottles
                  </p>

                  <p class="mt-1 text-xs leading-5 text-brand-muted">
                    One tester kit plus two assorted 60ml bottles.
                  </p>
                </div>
              </div>

              <a
                href="#packages"
                class="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-brand-border px-5 text-sm font-semibold text-brand-cream transition hover:border-brand-gold hover:text-brand-gold"
              >
                View Starter Package
              </a>
            </div>
          </article>
        </div>
      </div>

            <div
        x-show="zoomImage"
        x-transition.opacity.duration.150ms
        x-cloak
        class="fixed inset-0 z-[95] grid place-items-center bg-black/85 px-4 py-6 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        @click.self="zoomImage = null; zoomAlt = ''"
        @keydown.escape.window="zoomImage = null; zoomAlt = ''"
      >
        <button
          type="button"
          class="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-white/20 bg-black/70 text-2xl leading-none text-white transition hover:border-brand-gold hover:text-brand-gold"
          aria-label="Close image preview"
          @click="zoomImage = null; zoomAlt = ''"
        >
          <span aria-hidden="true">&times;</span>
        </button>

        <img
          :src="zoomImage"
          :alt="zoomAlt"
          class="max-h-[88vh] w-auto max-w-[94vw] rounded-[1.25rem] border border-brand-gold/30 bg-brand-black object-contain shadow-2xl"
        >
      </div>

    </section>
  `
}
