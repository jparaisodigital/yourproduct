import './style.css'

import Alpine from 'alpinejs'

import logoImage from './assets/logoyourproduct.png'

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

registerCartStore(Alpine, products)

Alpine.data('checkoutPage', () => ({
  formatMoney(value) {
    return pesoFormatter.format(value)
  },
}))

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
          href="/"
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

          Secure checkout
        </div>
      </div>
    </header>

    <main class="px-5 py-10 sm:py-14">
      <div class="mx-auto w-full max-w-5xl">
        <a
          href="/"
          class="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold transition hover:text-brand-gold-light"
        >
          <span aria-hidden="true">←</span>
          Continue shopping
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

          <p
            class="mt-3 max-w-2xl text-sm leading-6 text-brand-muted sm:text-base"
          >
            Confirm your selected fragrances and quantities before
            entering your checkout information.
          </p>
        </div>

        <section
          x-show="$store.cart.itemCount === 0"
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
            href="/#shop"
            class="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-light"
          >
            Browse fragrances
          </a>
        </section>

        <div
          x-show="$store.cart.itemCount > 0"
          class="mt-8 grid gap-6 lg:grid-cols-[1fr_0.42fr] lg:items-start"
        >
          <section
            class="overflow-hidden rounded-[1.5rem] border border-brand-border bg-brand-panel shadow-panel"
          >
            <header
              class="flex items-center justify-between gap-4 border-b border-brand-border px-5 py-5 sm:px-6"
            >
              <div>
                <p
                  class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
                >
                  Selected fragrances
                </p>

                <h2
                  class="mt-1 font-display text-2xl text-brand-cream"
                >
                  Order items
                </h2>
              </div>

              <span
                class="text-sm font-semibold text-brand-muted"
                x-text="
                  $store.cart.itemCount === 1
                    ? '1 item'
                    : $store.cart.itemCount + ' items'
                "
              ></span>
            </header>

            <div class="divide-y divide-brand-border">
              <template
                x-for="item in $store.cart.detailedItems"
                :key="item.productId"
              >
                <article
                  class="grid grid-cols-[5rem_1fr] gap-4 p-5 sm:grid-cols-[6rem_1fr] sm:p-6"
                >
                  <div
                    class="size-20 overflow-hidden rounded-xl bg-brand-cream sm:size-24"
                  >
                    <img
                      :src="item.product.image"
                      :alt="item.product.name"
                      class="size-full object-contain p-2"
                    >
                  </div>

                  <div class="min-w-0">
                    <div
                      class="flex items-start justify-between gap-3"
                    >
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

                      <strong
                        class="shrink-0 text-sm text-brand-cream sm:text-base"
                        x-text="formatMoney(item.lineTotal)"
                      ></strong>
                    </div>

                    <p
                      class="mt-1 text-xs text-brand-muted"
                      x-text="
                        formatMoney(item.product.regularPrice) +
                        ' each'
                      "
                    ></p>

                    <div
                      class="mt-4 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div
                        class="flex items-center rounded-full border border-brand-border"
                      >
                        <button
                          type="button"
                          class="grid size-9 place-items-center text-brand-cream transition hover:text-brand-gold"
                          aria-label="Decrease quantity"
                          @click="$store.cart.decrease(item.productId)"
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
                          :disabled="
                            item.quantity >=
                            item.product.stockQuantity
                          "
                          @click="$store.cart.increase(item.productId)"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        class="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-brand-muted transition hover:text-red-700"
                        @click="$store.cart.remove(item.productId)"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              </template>
            </div>
          </section>

          <aside
            class="rounded-[1.5rem] border border-brand-gold/30 bg-brand-panel p-5 shadow-gold-soft sm:p-6 lg:sticky lg:top-6"
          >
            <p
              class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-gold"
            >
              Order summary
            </p>

            <div
              class="mt-5 flex items-center justify-between gap-4"
            >
              <span class="text-sm text-brand-muted">
                Items
              </span>

              <span
                class="font-semibold text-brand-cream"
                x-text="$store.cart.itemCount"
              ></span>
            </div>

            <div
              class="mt-3 flex items-center justify-between gap-4"
            >
              <span class="text-sm text-brand-muted">
                Subtotal
              </span>

              <span
                class="font-semibold text-brand-cream"
                x-text="formatMoney($store.cart.subtotal)"
              ></span>
            </div>

            <div
              class="mt-3 flex items-center justify-between gap-4"
            >
              <span class="text-sm text-brand-muted">
                Delivery
              </span>

              <span
                class="text-xs font-semibold text-brand-muted"
              >
                Calculated next
              </span>
            </div>

            <div
              class="mt-5 flex items-end justify-between gap-4 border-t border-brand-border pt-5"
            >
              <span
                class="text-sm font-semibold uppercase tracking-[0.12em] text-brand-muted"
              >
                Estimated total
              </span>

              <strong
                class="font-display text-3xl text-brand-gold"
                x-text="formatMoney($store.cart.subtotal)"
              ></strong>
            </div>

            <p class="mt-4 text-xs leading-5 text-brand-muted">
              Delivery fees and final checkout rules remain subject to
              client confirmation.
            </p>

            <div
              class="mt-6 flex items-center justify-center gap-2 border-t border-brand-border pt-5 text-xs text-brand-muted"
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

              Secure checkout
            </div>
          </aside>
        </div>
      </div>
    </main>
  </div>
`

Alpine.start()